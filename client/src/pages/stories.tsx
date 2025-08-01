import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Book, ChevronRight, Utensils, Handshake, Calendar } from "lucide-react";
import type { CulturalStory } from "@shared/schema";

export default function Stories() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  
  const { data: stories, isLoading } = useQuery<CulturalStory[]>({
    queryKey: ["/api/languages/spanish-id/stories"],
    enabled: false, // Disabled for demo - would use actual language ID
  });

  // Mock data for demonstration
  const mockStories = [
    {
      id: "1",
      title: "Una Cena Familiar",
      description: "Experience a traditional Spanish family dinner and learn cultural dining etiquette",
      level: "intermediate",
      category: "culture",
      readingTimeMinutes: 15,
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: "2", 
      title: "El Mercado Local",
      description: "Learn shopping vocabulary at a traditional Spanish market",
      level: "beginner",
      category: "culture",
      readingTimeMinutes: 10,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: "3",
      title: "La Fiesta del Pueblo", 
      description: "Experience a traditional village celebration and local customs",
      level: "intermediate",
      category: "tradition",
      readingTimeMinutes: 12,
      imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: "4",
      title: "Viaje a la Costa",
      description: "Plan a trip to Spain's beautiful coastal regions",
      level: "advanced", 
      category: "travel",
      readingTimeMinutes: 18,
      imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-blue-100 text-blue-600";
      case "intermediate": return "bg-amber-100 text-amber-600";
      case "advanced": return "bg-emerald-100 text-emerald-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const filteredStories = selectedLevel === "all" 
    ? mockStories 
    : mockStories.filter(story => story.level === selectedLevel);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Cultural Stories & Immersion</h1>
            <p className="text-lg text-slate-600">Learn language through authentic cultural experiences and stories</p>
          </div>

          {/* Level Filter */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm">
              {["all", "beginner", "intermediate", "advanced"].map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className="mx-1"
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Featured Story */}
            <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 p-8 col-span-1 lg:col-span-2">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className="bg-emerald-500">Featured Story</Badge>
                    <span className="text-sm text-slate-600">Intermediate Level</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Una Cena Familiar</h2>
                  <p className="text-slate-600">Experience a traditional Spanish family dinner and learn cultural dining etiquette</p>
                </div>
                
                <div className="rounded-xl overflow-hidden mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                    alt="Spanish family dinner"
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-600">15 min read</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Book className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-600">Interactive dialogue</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                    Start Reading
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Story Collection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredStories.slice(1).map((story) => (
              <Card key={story.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={story.imageUrl} 
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getLevelColor(story.level)}>
                        {story.level}
                      </Badge>
                      <span className="text-xs text-slate-500 capitalize">{story.category}</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">{story.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{story.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-600">{story.readingTimeMinutes} min</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cultural Tips Section */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 p-8">
            <CardContent className="p-0">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Cultural Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Utensils className="w-8 h-8 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Dining Etiquette</h4>
                  <p className="text-sm text-slate-600">Learn proper table manners and conversation topics for Spanish meals</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Handshake className="w-8 h-8 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Greetings & Gestures</h4>
                  <p className="text-sm text-slate-600">Master formal and informal greetings used across Spanish-speaking countries</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Holidays & Traditions</h4>
                  <p className="text-sm text-slate-600">Discover important cultural celebrations and their significance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
