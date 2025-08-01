import Navigation from "@/components/navigation";
import CommunityChat from "@/components/community-chat";
import LanguageExchange from "@/components/language-exchange";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Community() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Connect & Practice Together</h1>
            <p className="text-lg text-slate-600">Join our global community of language learners and native speakers</p>
          </div>

          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="chat">Community Chat</TabsTrigger>
              <TabsTrigger value="exchange">Language Exchange</TabsTrigger>
              <TabsTrigger value="groups">Study Groups</TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <CommunityChat />
            </TabsContent>

            <TabsContent value="exchange">
              <LanguageExchange />
            </TabsContent>

            <TabsContent value="groups">
              <Card>
                <CardHeader>
                  <CardTitle>Study Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Study groups feature coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
