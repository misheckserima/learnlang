import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Users,
  Clock,
  Lightbulb,
  RotateCcw,
  ArrowUpDown
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VideoCallProps {
  callId: string;
  isInitiator: boolean;
  receiverName: string;
  receiverImage?: string;
  onEndCall: () => void;
}

interface AIQuestion {
  question: string;
  context: string;
  difficulty: string;
}

export default function VideoCall({ 
  callId, 
  isInitiator, 
  receiverName, 
  receiverImage, 
  onEndCall 
}: VideoCallProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // WebRTC state
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Call state
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isTeachingMode, setIsTeachingMode] = useState(isInitiator);
  const [sessionSwitched, setSessionSwitched] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  
  // AI Teaching Questions
  const [currentQuestion, setCurrentQuestion] = useState<AIQuestion | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isConnected) return;
    
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isConnected]);

  // Auto-switch teaching mode after 15 minutes
  useEffect(() => {
    if (callDuration === 15 * 60 && !sessionSwitched) {
      switchTeachingMode();
      setSessionSwitched(true);
    }
  }, [callDuration, sessionSwitched]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize WebRTC
  const initializeWebRTC = useCallback(async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Add local stream tracks
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Handle remote stream
      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      // Handle connection state
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setIsConnected(true);
          toast({
            title: "Call Connected",
            description: "Video call is now active"
          });
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          setIsConnected(false);
          onEndCall();
        }
      };

      setPeerConnection(pc);

      // Start the signaling process (simplified - in real app would use WebSocket)
      if (isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        // In real implementation, send offer through signaling server
      }

    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      toast({
        title: "Camera Access Failed",
        description: "Please allow camera and microphone access",
        variant: "destructive"
      });
    }
  }, [isInitiator, onEndCall, toast]);

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // Switch teaching mode
  const switchTeachingMode = () => {
    setIsTeachingMode(!isTeachingMode);
    setCurrentQuestion(null);
    toast({
      title: "Teaching Mode Switched",
      description: `${isTeachingMode ? receiverName : "You"} are now the teacher`
    });
  };

  // Generate AI teaching question
  const generateTeachingQuestion = useMutation({
    mutationFn: () => apiRequest("/api/ai/teaching-questions", {
      method: "POST",
      body: JSON.stringify({
        usedQuestions,
        difficulty: "intermediate"
      })
    }),
    onSuccess: (data: AIQuestion) => {
      setCurrentQuestion(data);
      setUsedQuestions(prev => [...prev, data.question]);
    },
    onError: () => {
      toast({
        title: "Question Generation Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  // End call
  const endCall = useMutation({
    mutationFn: () => apiRequest(`/api/video-calls/${callId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: "ended" })
    }),
    onSuccess: () => {
      // Cleanup WebRTC
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }
      queryClient.invalidateQueries({ queryKey: ["/api/video-calls/active"] });
      onEndCall();
    }
  });

  // Initialize on mount
  useEffect(() => {
    initializeWebRTC();
    
    return () => {
      // Cleanup on unmount
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [initializeWebRTC]);

  const canExtend = callDuration >= 30 * 60; // 30 minutes

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        
        {/* Video Area */}
        <div className="lg:col-span-2 relative">
          <Card className="h-full bg-gray-900 border-gray-700">
            <CardContent className="p-4 h-full">
              {/* Remote Video */}
              <div className="relative h-full bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  data-testid="remote-video"
                />
                
                {/* Local Video (Picture-in-Picture) */}
                <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    data-testid="local-video"
                  />
                </div>

                {/* Call Status */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <Badge variant={isConnected ? "default" : "destructive"} className="bg-green-600">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(callDuration)}
                  </Badge>
                  {isTeachingMode && (
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      <Users className="w-3 h-3 mr-1" />
                      Teaching Mode
                    </Badge>
                  )}
                </div>

                {/* Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                  <Button
                    variant={isVideoEnabled ? "secondary" : "destructive"}
                    size="lg"
                    onClick={toggleVideo}
                    className="rounded-full w-12 h-12"
                    data-testid="toggle-video"
                  >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant={isAudioEnabled ? "secondary" : "destructive"}
                    size="lg"
                    onClick={toggleAudio}
                    className="rounded-full w-12 h-12"
                    data-testid="toggle-audio"
                  >
                    {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>

                  {callDuration < 15 * 60 && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={switchTeachingMode}
                      className="rounded-full"
                      data-testid="switch-mode"
                    >
                      <ArrowUpDown className="w-5 h-5" />
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => endCall.mutate()}
                    className="rounded-full w-12 h-12"
                    data-testid="end-call"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teaching Panel */}
        <div className="space-y-4">
          <Card className="bg-gray-900 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="w-5 h-5 mr-2" />
                {isTeachingMode ? "Teaching Mode" : "Learning Mode"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-300">
                <p><strong>Partner:</strong> {receiverName}</p>
                <p><strong>Duration:</strong> {formatTime(callDuration)} / 30:00</p>
                <p><strong>Mode Switch:</strong> {callDuration < 15 * 60 ? `${formatTime(15 * 60 - callDuration)} remaining` : "Switched"}</p>
              </div>

              <Separator className="bg-gray-700" />

              {isTeachingMode ? (
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-400">You are Teaching</h4>
                  <p className="text-sm text-gray-300">
                    Ask questions in your native language and help your partner learn.
                  </p>
                  
                  {currentQuestion && (
                    <Card className="bg-gray-800 border-gray-600">
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-white">{currentQuestion.question}</p>
                            <p className="text-xs text-gray-400 mt-1">{currentQuestion.context}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {currentQuestion.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => generateTeachingQuestion.mutate()}
                      disabled={generateTeachingQuestion.isPending}
                      className="flex-1"
                      data-testid="generate-question"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {currentQuestion ? "New Question" : "Get Question"}
                    </Button>
                    
                    {currentQuestion && (
                      <Button
                        variant="outline"
                        onClick={() => generateTeachingQuestion.mutate()}
                        disabled={generateTeachingQuestion.isPending}
                        data-testid="regenerate-question"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-400">You are Learning</h4>
                  <p className="text-sm text-gray-300">
                    Listen to your partner and practice speaking in your target language.
                  </p>
                </div>
              )}

              {canExtend && (
                <div className="pt-3 border-t border-gray-700">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Call Extended",
                        description: "Call extended by 15 minutes"
                      });
                    }}
                    data-testid="extend-call"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Extend Call (+15 min)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}