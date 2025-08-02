import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Globe, BookOpen, Target, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const profileSetupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  location: z.string().optional(),
  fieldOfLearning: z.string().optional(),
  interests: z.array(z.string()).optional(),
  dailyGoalMinutes: z.number().min(5).max(240).default(20),
  cefr_level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).default("A1"),
  profileImageUrl: z.string().optional(),
});

type ProfileSetupForm = z.infer<typeof profileSetupSchema>;

const FIELD_OPTIONS = [
  "Technology",
  "Business",
  "Healthcare", 
  "Education",
  "Engineering",
  "Arts & Design",
  "Science",
  "Law",
  "Marketing",
  "Finance",
  "Other"
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

export default function ProfileSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileSetupForm>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      dailyGoalMinutes: 20,
      cefr_level: "A1",
      interests: [],
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileSetupForm) => {
      return apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Profile Setup Complete!",
        description: "Your learning journey is ready to begin.",
      });
      setLocation("/");
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
    if (file.size > 1024 * 1024) { // 1MB limit
      toast({
        title: "File too large",
        description: "Profile image must be less than 1MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create a base64 data URL for preview and storage
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

  const onSubmit = (data: ProfileSetupForm) => {
    const submitData = {
      ...data,
      interests: selectedInterests,
      profileCompleted: true,
    };
    updateProfileMutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center">
              <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
            <CardDescription>
              Help us personalize your language learning experience
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="text-center">
                <Label className="text-sm font-medium">Profile Picture (Optional, max 1MB)</Label>
                <div className="mt-2 flex flex-col items-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                      />
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
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-blue-400 transition-colors">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
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

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    className="mt-1"
                    placeholder="Your first name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    className="mt-1"
                    placeholder="Your last name"
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
                  className="mt-1"
                  placeholder="e.g., New York, USA"
                />
              </div>

              {/* Field of Learning */}
              <div>
                <Label>Field of Learning/Work</Label>
                <Select onValueChange={(value) => setValue("fieldOfLearning", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your field" />
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

              {/* Interests */}
              <div>
                <Label>Interests (Select up to 5)</Label>
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

              {/* Current Language Level */}
              <div>
                <Label>Current Language Level</Label>
                <Select onValueChange={(value) => setValue("cefr_level", value as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your current level" />
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

              {/* Daily Goal */}
              <div>
                <Label htmlFor="dailyGoalMinutes">Daily Study Goal (minutes)</Label>
                <Input
                  id="dailyGoalMinutes"
                  type="number"
                  min="5"
                  max="240"
                  {...register("dailyGoalMinutes", { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.dailyGoalMinutes && (
                  <p className="text-sm text-red-500 mt-1">{errors.dailyGoalMinutes.message}</p>
                )}
              </div>

              {/* Learning Features Preview */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Your Personalized Learning Features
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>AI-powered adaptive learning based on your pace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span>Customizable study goals and intelligent reminders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>Progress dashboards and CEFR level benchmarks (A1–C2)</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={updateProfileMutation.isPending || isUploading}
              >
                {updateProfileMutation.isPending ? "Setting up..." : "Complete Profile Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}