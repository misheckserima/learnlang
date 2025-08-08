import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  MessageCircle, 
  Video, 
  Globe, 
  Search,
  Clock,
  Award,
  Star,
  Phone,
  PhoneCall
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  country: string;
  nativeLanguageId: string;
  targetLanguageId: string;
  isOnline: boolean;
  lastActiveAt: string;
  totalPoints: number;
  currentStreak: number;
}

interface Language {
  id: string;
  name: string;
  flagEmoji: string;
}

interface PotentialMatch {
  user: User;
  nativeLanguage: Language;
  targetLanguage: Language;
  compatibilityScore: number;
  isAvailableForCall: boolean;
}

export default function Community() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isTeachingMode, setIsTeachingMode] = useState(true);

  // Fetch user data
  const { data: userResponse } = useQuery({
    queryKey: ["/api/auth/me"],
    staleTime: 5 * 60 * 1000,
  });

  // Fetch potential language exchange matches
  const { data: potentialMatches = [], isLoading: matchesLoading } = useQuery<PotentialMatch[]>({
    queryKey: ["/api/community/matches"],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch active video call sessions
  const { data: activeCalls } = useQuery({
    queryKey: ["/api/video-calls/active"],
    staleTime: 30 * 1000, // 30 seconds
  });

  const user = userResponse?.user as any;

  // Initiate video call mutation
  const initiateCallMutation = useMutation({
    mutationFn: (partnerId: string) => 
      apiRequest("/api/video-calls/initiate", {
        method: "POST",
        body: JSON.stringify({ partnerId }),
      }),
    onSuccess: (callData) => {
      setActiveCallId(callData.id);
      setCallDuration(0);
      setIsTeachingMode(true);
      
      toast({
        title: "Video Call Started!",
        description: "You are now in Teaching Mode for the first 15 minutes.",
      });
      
      // Start call timer
      const timer = setInterval(() => {
        setCallDuration(prev => {
          if (prev === 900) { // 15 minutes
            setIsTeachingMode(false);
            toast({
              title: "Mode Switch!",
              description: "You are now in Learning Mode. Roles have switched!",
            });
          }
          return prev + 1;
        });
      }, 1000);
      
      // Auto-end call after 30 minutes
      setTimeout(() => {
        clearInterval(timer);
        endCallMutation.mutate(callData.id);
      }, 1800000); // 30 minutes
    },
  });

  // End video call mutation
  const endCallMutation = useMutation({
    mutationFn: (callId: string) => 
      apiRequest(`/api/video-calls/${callId}/end`, {
        method: "PUT",
      }),
    onSuccess: () => {
      setActiveCallId(null);
      setCallDuration(0);
      queryClient.invalidateQueries({ queryKey: ["/api/community/matches"] });
      
      toast({
        title: "Video Call Ended",
        description: "Thanks for the language exchange session!",
      });
    },
  });

  // Generate AI questions mutation
  const generateQuestionsMutation = useMutation({
    mutationFn: (interests: string[]) => 
      apiRequest("/api/ai/generate-questions", {
        method: "POST",
        body: JSON.stringify({ interests }),
      }),
  });

  const filteredMatches = potentialMatches.filter((match: PotentialMatch) =>
    match.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.user.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAvailabilityStatus = (match: PotentialMatch) => {
    if (!match.user.isOnline) return { text: "Offline", color: "bg-gray-400" };
    if (!match.isAvailableForCall) return { text: "In Call", color: "bg-red-400" };
    return { text: "Available", color: "bg-green-400" };
  };

  if (activeCallId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          
          {/* Active Call Interface */}
          <Card className="border-2 border-green-500">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-green-600">
                    Language Exchange Session Active
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Duration: {formatDuration(callDuration)} / 30:00
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Badge 
                  className={`text-white ${isTeachingMode ? 'bg-blue-500' : 'bg-purple-500'}`}
                  variant="secondary"
                >
                  {isTeachingMode ? "Teaching Mode" : "Learning Mode"}
                </Badge>
                <Badge variant="outline">
                  Switch in: {formatDuration(900 - (callDuration % 900))}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Video Call Placeholder */}
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Video className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl">Video Call Interface</p>
                  <p className="text-sm opacity-75">
                    {isTeachingMode ? "You are teaching" : "You are learning"}
                  </p>
                </div>
              </div>
              
              {/* Teaching Mode Tools */}
              {isTeachingMode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Teaching Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => generateQuestionsMutation.mutate(user?.interests || [])}
                        disabled={generateQuestionsMutation.isPending}
                        className="w-full"
                      >
                        Generate AI Questions
                      </Button>
                      
                      {generateQuestionsMutation.data && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-semibold mb-2">Suggested Questions:</h4>
                          <ul className="space-y-1">
                            {generateQuestionsMutation.data.questions?.map((question: string, index: number) => (
                              <li key={index} className="text-sm">{index + 1}. {question}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Call Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="destructive"
                  onClick={() => activeCallId && endCallMutation.mutate(activeCallId)}
                  disabled={endCallMutation.isPending}
                >
                  <PhoneCall className="w-4 h-4 mr-2" />
                  End Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Language Exchange Community
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with native speakers who want to learn your language. Practice through 30-minute video calls with structured teaching sessions.
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Language Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by username or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Exchange Matches */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Available Language Partners</h2>
          
          {matchesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Finding compatible language partners...</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Partners Available</h3>
                <p className="text-gray-600">
                  {user?.nativeLanguageId && user?.targetLanguageId 
                    ? "Complete your profile setup to find language exchange partners."
                    : "No users are currently online who match your language preferences."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match: PotentialMatch) => (
                <Card key={match.user.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={match.user.profileImageUrl} />
                          <AvatarFallback>
                            {match.user.firstName?.[0]}{match.user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getAvailabilityStatus(match).color}`}></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{match.user.username}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {match.user.country}
                        </p>
                      </div>
                      <Badge className={`text-xs ${getAvailabilityStatus(match).color} text-white`}>
                        {getAvailabilityStatus(match).text}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Language Exchange Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Native:</span>
                        <div className="flex items-center gap-1">
                          <span>{match.nativeLanguage.flagEmoji}</span>
                          <span>{match.nativeLanguage.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Learning:</span>
                        <div className="flex items-center gap-1">
                          <span>{match.targetLanguage.flagEmoji}</span>
                          <span>{match.targetLanguage.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* User Stats */}
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{match.user.totalPoints} pts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-blue-500" />
                        <span>{match.user.currentStreak} day streak</span>
                      </div>
                    </div>

                    {/* Compatibility Score */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Compatibility</span>
                        <span>{Math.round(match.compatibilityScore)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${match.compatibilityScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        disabled={!match.user.isOnline || !match.isAvailableForCall || initiateCallMutation.isPending}
                        onClick={() => initiateCallMutation.mutate(match.user.id)}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        {initiateCallMutation.isPending ? "Connecting..." : "Start Video Call"}
                      </Button>
                      
                      {!match.user.isOnline && (
                        <p className="text-xs text-gray-500 text-center">
                          Last seen: {new Date(match.user.lastActiveAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}