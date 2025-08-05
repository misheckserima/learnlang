import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Video, 
  MessageCircle, 
  UserPlus, 
  Phone,
  PhoneCall,
  UserCheck,
  UserX,
  Globe,
  Clock,
  Wifi,
  WifiOff
} from "lucide-react";

interface UserConnection {
  id: string;
  userId: string;
  friendId: string;
  status: string;
  isOnline: boolean;
  lastSeen: string;
  friend: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    location?: string;
    nativeLanguage?: string;
    targetLanguages?: string[];
  };
}

interface VideoCallSession {
  id: string;
  initiatorId: string;
  receiverId: string;
  sessionId: string;
  status: string;
  createdAt: string;
}

export default function OnlineFriends() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCall, setCurrentCall] = useState<VideoCallSession | null>(null);

  // Fetch friends
  const { data: friends, isLoading: friendsLoading } = useQuery({
    queryKey: ["/api/friends"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch online friends
  const { data: onlineFriends, isLoading: onlineLoading } = useQuery({
    queryKey: ["/api/friends/online"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch active calls
  const { data: activeCalls } = useQuery({
    queryKey: ["/api/video-calls/active"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Start video call mutation
  const startVideoCall = useMutation({
    mutationFn: (receiverId: string) => 
      apiRequest("/api/video-calls", {
        method: "POST",
        body: JSON.stringify({ receiverId }),
      }),
    onSuccess: (data) => {
      setCurrentCall(data);
      queryClient.invalidateQueries({ queryKey: ["/api/video-calls/active"] });
      toast({
        title: "Video Call Started",
        description: "Connecting to your friend...",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Call Failed",
        description: error.message || "Failed to start video call",
        variant: "destructive",
      });
    },
  });

  // Update call status mutation
  const updateCallStatus = useMutation({
    mutationFn: ({ callId, status }: { callId: string; status: string }) => 
      apiRequest(`/api/video-calls/${callId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/video-calls/active"] });
      if (currentCall) {
        setCurrentCall(null);
      }
    },
  });

  // Add friend mutation
  const addFriend = useMutation({
    mutationFn: (friendId: string) => 
      apiRequest("/api/friends/connect", {
        method: "POST",
        body: JSON.stringify({ friendId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      toast({
        title: "Friend Request Sent",
        description: "Your friend request has been sent successfully!",
      });
    },
  });

  // Update online status on mount/unmount
  useEffect(() => {
    const updateOnlineStatus = (isOnline: boolean) => {
      apiRequest("/api/users/online-status", {
        method: "PUT",
        body: JSON.stringify({ isOnline }),
      }).catch(console.error);
    };

    updateOnlineStatus(true);

    const handleBeforeUnload = () => updateOnlineStatus(false);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      updateOnlineStatus(false);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const renderFriendCard = (connection: UserConnection, isOnline = false) => {
    const friend = connection.friend;
    
    return (
      <Card 
        key={connection.id} 
        className={`transition-all duration-200 hover:shadow-md ${
          isOnline ? "border-green-200 bg-green-50" : ""
        }`}
        data-testid={`friend-card-${friend.username}`}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={friend.profileImage} />
                <AvatarFallback>
                  {friend.firstName?.[0]}{friend.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              {connection.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">
                  {friend.firstName} {friend.lastName} (@{friend.username})
                </h3>
                {connection.isOnline ? (
                  <Badge variant="default" className="bg-green-500">
                    <Wifi className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <WifiOff className="w-3 h-3 mr-1" />
                    {formatLastSeen(connection.lastSeen)}
                  </Badge>
                )}
              </div>
              
              {friend.location && (
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <Globe className="w-3 h-3" />
                  {friend.location}
                </p>
              )}
              
              {friend.targetLanguages && friend.targetLanguages.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {friend.targetLanguages.map((lang, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                data-testid={`message-${friend.username}`}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              
              {connection.isOnline && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startVideoCall.mutate(friend.id)}
                  disabled={startVideoCall.isPending}
                  data-testid={`call-${friend.username}`}
                >
                  <Video className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderActiveCall = (call: VideoCallSession) => (
    <Card className="border-blue-200 bg-blue-50" data-testid="active-call">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-blue-500" />
          Active Video Call
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Call in progress...</p>
            <p className="text-sm text-gray-600">Status: {call.status}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => updateCallStatus.mutate({ callId: call.id, status: "ended" })}
              data-testid="end-call-button"
            >
              <Phone className="w-4 h-4 mr-1" />
              End Call
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-500" />
              Online Friends
            </CardTitle>
            <CardDescription className="text-lg">
              Connect with language learning partners around the world
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Active Calls */}
        {activeCalls && activeCalls.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Active Calls</h2>
            {activeCalls.map((call: VideoCallSession) => renderActiveCall(call))}
          </div>
        )}

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Input
                placeholder="Search friends by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                data-testid="friend-search-input"
              />
              <Button variant="outline" data-testid="add-friend-button">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Friend
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Friends Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="friends" data-testid="all-friends-tab">
              All Friends ({friends?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="online" data-testid="online-friends-tab">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Online ({onlineFriends?.length || 0})
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="mt-6">
            <div className="space-y-4">
              {friendsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p>Loading friends...</p>
                </div>
              ) : friends && friends.length > 0 ? (
                <ScrollArea className="h-96">
                  <div className="space-y-3" data-testid="friends-list">
                    {friends
                      .filter((friend: UserConnection) => 
                        !searchQuery || 
                        friend.friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        friend.friend.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        friend.friend.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((friend: UserConnection) => renderFriendCard(friend))
                    }
                  </div>
                </ScrollArea>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No friends yet. Start connecting with other learners!</p>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Find Friends
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="online" className="mt-6">
            <div className="space-y-4">
              {onlineLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p>Loading online friends...</p>
                </div>
              ) : onlineFriends && onlineFriends.length > 0 ? (
                <div className="space-y-3" data-testid="online-friends-list">
                  {onlineFriends.map((friend: UserConnection) => renderFriendCard(friend, true))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <WifiOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No friends are currently online.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Check back later or invite more friends to join!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}