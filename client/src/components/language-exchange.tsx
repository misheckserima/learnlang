import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Video, Clock, Globe, Users } from "lucide-react";

interface LanguagePartner {
  id: string;
  name: string;
  avatar: string;
  nativeLanguage: string;
  learningLanguage: string;
  location: string;
  isOnline: boolean;
  lastActive: string;
  interests: string[];
  experience: string;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  language: string;
  level: string;
  memberCount: number;
  isLive: boolean;
  startTime?: string;
  participants: { avatar: string }[];
}

export default function LanguageExchange() {
  const [selectedTab, setSelectedTab] = useState("partners");

  // Mock language partners
  const mockPartners: LanguagePartner[] = [
    {
      id: "1",
      name: "María García",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      nativeLanguage: "Spanish",
      learningLanguage: "English",
      location: "Madrid, Spain",
      isOnline: true,
      lastActive: "now",
      interests: ["Travel", "Movies", "Cooking"],
      experience: "Teaching Spanish for 3 years"
    },
    {
      id: "2",
      name: "Carlos López", 
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      nativeLanguage: "Spanish",
      learningLanguage: "French",
      location: "Barcelona, Spain",
      isOnline: false,
      lastActive: "2 hours ago",
      interests: ["Art", "Music", "Sports"],
      experience: "Intermediate French learner"
    },
    {
      id: "3",
      name: "Ana Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", 
      nativeLanguage: "Spanish",
      learningLanguage: "German",
      location: "Valencia, Spain",
      isOnline: true,
      lastActive: "now",
      interests: ["Books", "Technology", "Languages"],
      experience: "Native Spanish speaker, B2 German"
    }
  ];

  // Mock study groups
  const mockGroups: StudyGroup[] = [
    {
      id: "1",
      name: "Spanish Conversation Circle",
      description: "Practice everyday conversations with intermediate learners",
      language: "Spanish",
      level: "Intermediate",
      memberCount: 12,
      isLive: true,
      participants: [
        { avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" },
        { avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" },
        { avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face" }
      ]
    },
    {
      id: "2", 
      name: "Grammar Bootcamp",
      description: "Intensive grammar practice session for advanced learners",
      language: "Spanish",
      level: "Advanced",
      memberCount: 8,
      isLive: false,
      startTime: "6:00 PM",
      participants: [
        { avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" },
        { avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=50&h=50&fit=crop&crop=face" }
      ]
    }
  ];

  const { data: partners = mockPartners, isLoading: partnersLoading } = useQuery<LanguagePartner[]>({
    queryKey: ["/api/language-exchange/partners"],
    enabled: false, // Disabled for demo
  });

  const { data: groups = mockGroups, isLoading: groupsLoading } = useQuery<StudyGroup[]>({
    queryKey: ["/api/study-groups"],
    enabled: false, // Disabled for demo
  });

  const handleConnect = (partnerId: string) => {
    console.log("Connecting with partner:", partnerId);
    // In real app, would initiate connection/conversation
  };

  const handleJoinGroup = (groupId: string) => {
    console.log("Joining group:", groupId);
    // In real app, would join the study group
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner": return "bg-blue-100 text-blue-600";
      case "intermediate": return "bg-amber-100 text-amber-600";
      case "advanced": return "bg-emerald-100 text-emerald-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="partners">Language Partners</TabsTrigger>
          <TabsTrigger value="groups">Study Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Language Exchange Partners</CardTitle>
                <Badge className="bg-emerald-100 text-emerald-600 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Online Now</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {partnersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {partners.map((partner) => (
                    <Card key={partner.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={partner.avatar} alt={partner.name} />
                              <AvatarFallback>{partner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              partner.isOnline ? "bg-emerald-500" : "bg-slate-400"
                            }`}></div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-800 truncate">{partner.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-slate-600 mb-1">
                              <Globe className="w-3 h-3" />
                              <span>{partner.location}</span>
                            </div>
                            <div className="text-sm text-slate-600 mb-2">
                              <span>Native {partner.nativeLanguage} • Learning {partner.learningLanguage}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              <span>{partner.isOnline ? "Available now" : `Last active ${partner.lastActive}`}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              onClick={() => handleConnect(partner.id)}
                              className={`${
                                partner.isOnline 
                                  ? "bg-emerald-500 hover:bg-emerald-600" 
                                  : "bg-blue-500 hover:bg-blue-600"
                              }`}
                            >
                              {partner.isOnline ? (
                                <>
                                  <Video className="w-4 h-4 mr-1" />
                                  Connect
                                </>
                              ) : (
                                <>
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Message
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        {/* Interests */}
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-slate-600">Interests:</span>
                            <div className="flex flex-wrap gap-1">
                              {partner.interests.map((interest, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Groups</CardTitle>
            </CardHeader>
            <CardContent>
              {groupsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {groups.map((group) => (
                    <Card key={group.id} className="border hover:border-emerald-300 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-800">{group.name}</h4>
                          <Badge className={`${
                            group.isLive 
                              ? "bg-emerald-100 text-emerald-600" 
                              : "bg-amber-100 text-amber-600"
                          }`}>
                            {group.isLive ? "Live Now" : `Starts ${group.startTime}`}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-3">{group.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex -space-x-2">
                                {group.participants.slice(0, 3).map((participant, index) => (
                                  <Avatar key={index} className="w-6 h-6 border-2 border-white">
                                    <AvatarImage src={participant.avatar} alt="Participant" />
                                    <AvatarFallback>U</AvatarFallback>
                                  </Avatar>
                                ))}
                                {group.memberCount > 3 && (
                                  <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-slate-600">+{group.memberCount - 3}</span>
                                  </div>
                                )}
                              </div>
                              <span className="text-sm text-slate-600">{group.memberCount} members</span>
                            </div>
                            
                            <Badge className={getLevelColor(group.level)}>
                              {group.level}
                            </Badge>
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => handleJoinGroup(group.id)}
                            className={`${
                              group.isLive 
                                ? "bg-emerald-500 hover:bg-emerald-600" 
                                : "bg-blue-500 hover:bg-blue-600"
                            }`}
                          >
                            <Users className="w-4 h-4 mr-1" />
                            {group.isLive ? "Join Now" : "Reserve"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Conversation Partner */}
          <Card className="bg-gradient-to-br from-blue-50 to-emerald-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">AI Conversation Partner</h3>
              <p className="text-slate-600 mb-6">Practice speaking with our AI tutor available 24/7</p>
              
              <div className="space-y-4 mb-6">
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm text-slate-700 mb-2">¡Hola! Soy tu tutor virtual. ¿De qué te gustaría hablar hoy?</p>
                        <p className="text-xs text-slate-500">Hi! I'm your virtual tutor. What would you like to talk about today?</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-left">
                    Daily Activities
                  </Button>
                  <Button variant="outline" size="sm" className="text-left">
                    Travel Plans
                  </Button>
                  <Button variant="outline" size="sm" className="text-left">
                    Food & Cooking
                  </Button>
                  <Button variant="outline" size="sm" className="text-left">
                    Work & Career
                  </Button>
                </div>
              </div>
              
              <Button className="bg-blue-500 hover:bg-blue-600">
                Start Conversation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
