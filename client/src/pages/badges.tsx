import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Flame, 
  Users, 
  Clock, 
  BookOpen, 
  MessageCircle,
  Video,
  Crown,
  Zap,
  Globe,
  Lock
} from "lucide-react";
import Navigation from "@/components/navigation";

interface UserBadge {
  id: string;
  badgeId: string;
  earnedAt: Date;
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    requirements: any;
    isPremium: boolean;
  };
}

interface AvailableBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: any;
  isPremium: boolean;
  progress?: number;
  isUnlocked: boolean;
}

const BADGE_ICONS: Record<string, any> = {
  'first_steps': BookOpen,
  'streak_keeper': Flame,
  'social_butterfly': Users,
  'conversation_master': MessageCircle,
  'video_pioneer': Video,
  'speed_learner': Zap,
  'global_citizen': Globe,
  'premium_scholar': Crown,
  'assessment_ace': Target,
  'learning_champion': Trophy
};

const RARITY_COLORS = {
  common: 'border-gray-300 bg-gray-50',
  uncommon: 'border-green-300 bg-green-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50'
};

const RARITY_TEXT_COLORS = {
  common: 'text-gray-600',
  uncommon: 'text-green-600',
  rare: 'text-blue-600',
  epic: 'text-purple-600',
  legendary: 'text-yellow-600'
};

export default function Badges() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch user's earned badges
  const { data: userBadges = [] } = useQuery<UserBadge[]>({
    queryKey: ["/api/badges/earned"],
    staleTime: 5 * 60 * 1000,
  });

  // Fetch available badges with progress
  const { data: availableBadges = [] } = useQuery<AvailableBadge[]>({
    queryKey: ["/api/badges/available"],
    staleTime: 2 * 60 * 1000,
  });

  const categories = ["all", "learning", "social", "achievement", "premium"];
  
  const filteredBadges = availableBadges.filter(badge => 
    selectedCategory === "all" || badge.category === selectedCategory
  );

  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));

  const getProgressText = (badge: AvailableBadge) => {
    if (badge.isUnlocked) return "Earned";
    if (badge.isPremium && !badge.isUnlocked) return "Premium Required";
    if (badge.progress !== undefined) {
      return `${Math.round(badge.progress)}% Complete`;
    }
    return "Not Started";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Achievements & Badges
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Earn badges by completing challenges, reaching milestones, and mastering your target language.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userBadges.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Badges Earned</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{availableBadges.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Available</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Crown className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {availableBadges.filter(b => b.rarity === 'legendary' && earnedBadgeIds.has(b.id)).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Legendary Badges</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {Math.round((userBadges.length / availableBadges.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Collection Complete</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Different Views */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Badges</TabsTrigger>
            <TabsTrigger value="earned">Earned Badges</TabsTrigger>
          </TabsList>

          {/* All Badges Tab */}
          <TabsContent value="all" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                  data-testid={`filter-${category}`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBadges.map(badge => {
                const IconComponent = BADGE_ICONS[badge.icon] || Award;
                const isEarned = earnedBadgeIds.has(badge.id);
                const isLocked = badge.isPremium && !badge.isUnlocked;
                
                return (
                  <Card 
                    key={badge.id} 
                    className={`relative transition-all duration-200 hover:shadow-lg ${
                      isEarned 
                        ? RARITY_COLORS[badge.rarity] 
                        : isLocked 
                          ? 'border-gray-200 bg-gray-100 opacity-75' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    data-testid={`badge-${badge.id}`}
                  >
                    <CardHeader className="text-center pb-2">
                      {/* Badge Icon */}
                      <div className={`mx-auto p-3 rounded-full ${
                        isEarned 
                          ? `bg-gradient-to-br from-${badge.rarity === 'legendary' ? 'yellow' : 'blue'}-400 to-${badge.rarity === 'legendary' ? 'orange' : 'purple'}-500`
                          : isLocked
                            ? 'bg-gray-300'
                            : 'bg-gray-200'
                      } w-16 h-16 flex items-center justify-center`}>
                        {isLocked ? (
                          <Lock className="w-8 h-8 text-gray-500" />
                        ) : (
                          <IconComponent className={`w-8 h-8 ${
                            isEarned ? 'text-white' : 'text-gray-600'
                          }`} />
                        )}
                      </div>

                      {/* Badge Rarity */}
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${RARITY_TEXT_COLORS[badge.rarity]} capitalize`}
                      >
                        {badge.rarity}
                      </Badge>

                      <CardTitle className="text-lg font-semibold">{badge.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {badge.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Progress or Status */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Progress</span>
                          <span className={`font-medium ${
                            isEarned 
                              ? 'text-green-600' 
                              : isLocked 
                                ? 'text-gray-500' 
                                : 'text-blue-600'
                          }`}>
                            {getProgressText(badge)}
                          </span>
                        </div>
                        
                        {badge.progress !== undefined && !isEarned && !isLocked && (
                          <Progress value={badge.progress} className="h-2" />
                        )}
                      </div>

                      {/* Requirements */}
                      {badge.requirements && (
                        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                          <strong>Requirements:</strong>
                          <ul className="mt-1 space-y-1">
                            {Object.entries(badge.requirements).map(([key, value]) => (
                              <li key={key} className="flex justify-between">
                                <span>{key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                <span>{String(value)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Premium Badge Indicator */}
                      {badge.isPremium && (
                        <div className="mt-2 flex items-center justify-center text-xs text-purple-600">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium Badge
                        </div>
                      )}
                    </CardContent>

                    {/* Earned Indicator */}
                    {isEarned && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-green-500 text-white rounded-full p-1">
                          <Trophy className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Earned Badges Tab */}
          <TabsContent value="earned" className="space-y-6">
            {userBadges.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Badges Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start learning and participating to earn your first badge!
                  </p>
                  <Button onClick={() => window.location.href = '/dashboard'}>
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userBadges.map(userBadge => {
                  const IconComponent = BADGE_ICONS[userBadge.badge.icon] || Award;
                  
                  return (
                    <Card 
                      key={userBadge.id}
                      className={`${RARITY_COLORS[userBadge.badge.rarity]} transition-all duration-200 hover:shadow-lg`}
                      data-testid={`earned-badge-${userBadge.badge.id}`}
                    >
                      <CardHeader className="text-center pb-2">
                        <div className={`mx-auto p-3 rounded-full bg-gradient-to-br from-${
                          userBadge.badge.rarity === 'legendary' ? 'yellow' : 'blue'
                        }-400 to-${
                          userBadge.badge.rarity === 'legendary' ? 'orange' : 'purple'
                        }-500 w-16 h-16 flex items-center justify-center`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>

                        <Badge 
                          variant="outline" 
                          className={`text-xs ${RARITY_TEXT_COLORS[userBadge.badge.rarity]} capitalize`}
                        >
                          {userBadge.badge.rarity}
                        </Badge>

                        <CardTitle className="text-lg font-semibold">
                          {userBadge.badge.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {userBadge.badge.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="text-center">
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            Earned on {new Date(userBadge.earnedAt).toLocaleDateString()}
                          </div>
                          
                          {userBadge.badge.isPremium && (
                            <div className="mt-2 flex items-center justify-center text-xs text-purple-600">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium Badge
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}