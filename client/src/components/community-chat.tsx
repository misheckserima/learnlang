import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ChatMessage, User } from "@shared/schema";

interface ChatMessageWithUser extends ChatMessage {
  user: User;
}

export default function CommunityChat() {
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(247);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  // Mock current user - in real app would come from auth context
  const currentUser = {
    id: "current-user-id",
    username: "You",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face"
  };

  // Fetch chat messages
  const { data: messages = [], isLoading } = useQuery<ChatMessageWithUser[]>({
    queryKey: ["/api/chat/messages"],
    refetchInterval: 5000, // Refetch every 5 seconds as fallback
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { content: string; translation?: string }) => {
      // Send via WebSocket if connected, otherwise use API
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'chat',
          userId: currentUser.id,
          languageId: 'spanish-id', // Would be dynamic in real app
          content: messageData.content,
          translation: messageData.translation,
        }));
        return;
      }
      
      // Fallback to HTTP API
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          languageId: 'spanish-id',
          content: messageData.content,
          translation: messageData.translation,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
    },
  });

  // WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?userId=${currentUser.id}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'chat') {
            // Add new message to cache
            queryClient.setQueryData<ChatMessageWithUser[]>(["/api/chat/messages"], (old = []) => {
              const newMessage: ChatMessageWithUser = {
                ...data.message,
                user: data.user,
              };
              return [newMessage, ...old].slice(0, 50); // Keep only last 50 messages
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [currentUser.id, queryClient]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({ 
        content: message.trim(),
      });
      setMessage("");
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Mock messages for demonstration if API not available
  const mockMessages: ChatMessageWithUser[] = [
    {
      id: "1",
      userId: "user1",
      languageId: "spanish",
      content: "¿Alguien me puede ayudar con el pretérito imperfecto? 🤔",
      translation: "Can someone help me with the imperfect tense?",
      isModerated: false,
      createdAt: new Date(Date.now() - 2 * 60 * 1000),
      user: {
        id: "user1",
        username: "Elena_Madrid",
        email: "elena@example.com",
        firstName: "Elena",
        lastName: "García",
        profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        currentStreak: 5,
        totalPoints: 1200,
        dailyGoalMinutes: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    {
      id: "2",
      userId: "user2", 
      languageId: "spanish",
      content: "¡Claro! El pretérito imperfecto se usa para acciones habituales en el pasado...",
      translation: "Of course! The imperfect tense is used for habitual actions in the past...",
      isModerated: false,
      createdAt: new Date(Date.now() - 1 * 60 * 1000),
      user: {
        id: "user2",
        username: "David_Teacher",
        email: "david@example.com",
        firstName: "David",
        lastName: "López",
        profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        currentStreak: 15,
        totalPoints: 5000,
        dailyGoalMinutes: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
  ];

  const displayMessages = messages.length > 0 ? messages : mockMessages;

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Community Chat</span>
            {isConnected && (
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600">{onlineCount} online</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : displayMessages.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              displayMessages.map((msg) => (
                <div key={msg.id} className="flex space-x-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={msg.user.profileImageUrl || ""} alt={msg.user.username} />
                    <AvatarFallback>{msg.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-slate-800 text-sm truncate">
                        {msg.user.username}
                      </span>
                      {msg.user.username.includes("Teacher") && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
                          Native
                        </Badge>
                      )}
                      <span className="text-xs text-slate-500">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-slate-700">{msg.content}</p>
                      {msg.translation && (
                        <p className="text-xs text-slate-500 italic">{msg.translation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              type="submit"
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          
          {!isConnected && (
            <p className="text-xs text-amber-600 mt-2">
              Connection lost. Messages will be sent when reconnected.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
