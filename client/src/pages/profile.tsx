import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Upload, X, User, Settings, BarChart3, Trophy, Edit2, Save, Clock, Target, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  location: z.string().optional(),
  fieldOfLearning: z.string().optional(),
  interests: z.array(z.string()).optional(),
  dailyGoalMinutes: z.number().min(5).max(240),
  cefr_level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  profileImageUrl: z.string().optional(),
});

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

const FIELD_OPTIONS = [
  "Technology", "Business", "Healthcare", "Education", "Engineering",
  "Arts & Design", "Science", "Law", "Marketing", "Finance", "Other"
];

const INTEREST_OPTIONS = [
  "Travel", "Culture", "Business", "Technology", "Science", "Art", "Music",
  "Sports", "Food", "History", "Literature", "Movies", "Gaming", "Photography"
];

const CEFR_LEVELS = [
  { value: "A1", label: "A1 - Beginner", description: "Can understand basic phrases" },
  { value: "A2", label: "A2 - Elementary", description: "Can handle simple conversations" },
  { value: "B1", label: "B1 - Intermediate", description: "Can discuss familiar topics" },
  { value: "B2", label: "B2 - Upper Intermediate", description: "Can engage in complex discussions" },
  { value: "C1", label: "C1 - Advanced", description: "Can use language flexibly" },
  { value: "C2", label: "C2 - Proficient", description: "Near-native level" }
];

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Fetch current user data
  const { data: userResponse, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => apiRequest("/api/auth/me"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const user = userResponse?.user;

  // Fetch study sessions for progress tracking
  const { data: studySessions } = useQuery({
    queryKey: ["/api/study-sessions"],
    queryFn: () => apiRequest("/api/study-sessions?limit=10"),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch progress benchmarks
  const { data: progressBenchmarks } = useQuery({
    queryKey: ["/api/progress-benchmarks"],
    queryFn: () => apiRequest("/api/progress-benchmarks"),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
  });

  // Initialize form with user data
  useState(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        location: user.location || "",
        fieldOfLearning: user.fieldOfLearning || "",
        interests: user.interests || [],
        dailyGoalMinutes: user.dailyGoalMinutes || 20,
        cefr_level: user.cefr_level || "A1",
        profileImageUrl: user.profileImageUrl || "",
      });
      setSelectedInterests(user.interests || []);
      setImagePreview(user.profileImageUrl || "");
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileForm) => {
      return apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (file: File) => {
    if (file.size > 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Profile image must be less than 1MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImagePreview(dataUrl);
        setValue("profileImageUrl", dataUrl);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    
    setSelectedInterests(newInterests);
    setValue("interests", newInterests);
  };

  const onSubmit = (data: UpdateProfileForm) => {
    const submitData = {
      ...data,
      interests: selectedInterests,
    };
    updateProfileMutation.mutate(submitData);
  };

  const calculateProgress = () => {
    if (!studySessions || studySessions.length === 0) return 0;
    const totalMinutes = studySessions.reduce((acc: number, session: any) => acc + session.durationMinutes, 0);
    const dailyGoal = user?.dailyGoalMinutes || 20;
    const daysActive = 7; // Last 7 days
    return Math.min(100, (totalMinutes / (dailyGoal * daysActive)) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-1">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={user.profileImageUrl} alt={user.firstName} />
                    <AvatarFallback className="text-2xl">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                  <CardDescription>
                    {user.location && <div className="flex items-center justify-center gap-1 mt-1">📍 {user.location}</div>}
                    {user.fieldOfLearning && <div className="mt-1">💼 {user.fieldOfLearning}</div>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{user.totalPoints || 0}</div>
                      <div className="text-sm text-gray-500">Total Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{user.currentStreak || 0}</div>
                      <div className="text-sm text-gray-500">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs">
                        {user.cefr_level || "A1"} Level
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Stats */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Learning Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{user.dailyGoalMinutes || 20}</div>
                      <div className="text-sm text-gray-500">Daily Goal (min)</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{studySessions?.length || 0}</div>
                      <div className="text-sm text-gray-500">Study Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{progressBenchmarks?.length || 0}</div>
                      <div className="text-sm text-gray-500">Achievements</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Weekly Progress</span>
                      <span className="text-sm text-gray-500">{Math.round(calculateProgress())}%</span>
                    </div>
                    <Progress value={calculateProgress()} className="h-2" />
                  </div>

                  {user.interests && user.interests.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.interests.map((interest: string) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Track your language learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Personalized Learning Features */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      Your Personalized Learning Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium mb-1">AI-Powered Adaptive Learning</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Adjusts to your pace and performance automatically
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium mb-1">Smart Goals & Reminders</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Customizable study goals with intelligent notifications
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-medium mb-1">CEFR Benchmarks</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Progress tracking with A1–C2 proficiency levels
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Study Sessions */}
                  {studySessions && studySessions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Recent Study Sessions</h3>
                      <div className="space-y-2">
                        {studySessions.slice(0, 5).map((session: any) => (
                          <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium">{session.sessionType}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(session.startedAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{session.durationMinutes} min</div>
                              {session.correctAnswers && session.totalQuestions && (
                                <div className="text-sm text-gray-500">
                                  {Math.round((session.correctAnswers / session.totalQuestions) * 100)}% accuracy
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your profile information</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>Cancel</>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Profile Image */}
                  <div className="text-center">
                    <Label className="text-sm font-medium">Profile Picture</Label>
                    <div className="mt-2 flex flex-col items-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Profile preview"
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                          />
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview("");
                                setValue("profileImageUrl", "");
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <Avatar className="w-24 h-24">
                          <AvatarFallback className="text-2xl">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      {isEditing && (
                        <label className="cursor-pointer mt-2">
                          <Button type="button" variant="outline" size="sm" disabled={isUploading}>
                            <Upload className="w-4 h-4 mr-2" />
                            {isUploading ? "Uploading..." : "Change Photo"}
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...register("location")}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="e.g., New York, USA"
                    />
                  </div>

                  <div>
                    <Label>Field of Learning/Work</Label>
                    <Select
                      onValueChange={(value) => setValue("fieldOfLearning", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={user.fieldOfLearning || "Select your field"} />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_OPTIONS.map((field) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isEditing && (
                    <div>
                      <Label>Interests</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {INTEREST_OPTIONS.map((interest) => (
                          <Badge
                            key={interest}
                            variant={selectedInterests.includes(interest) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                            onClick={() => toggleInterest(interest)}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Current Language Level</Label>
                    <Select
                      onValueChange={(value) => setValue("cefr_level", value as any)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={user.cefr_level || "Select your level"} />
                      </SelectTrigger>
                      <SelectContent>
                        {CEFR_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div>
                              <div className="font-medium">{level.label}</div>
                              <div className="text-xs text-gray-500">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dailyGoalMinutes">Daily Study Goal (minutes)</Label>
                    <Input
                      id="dailyGoalMinutes"
                      type="number"
                      min="5"
                      max="240"
                      {...register("dailyGoalMinutes", { valueAsNumber: true })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  {isEditing && (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}