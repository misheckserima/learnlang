import { useState } from "react";
import Navigation from "@/components/navigation";
import Flashcard from "@/components/flashcard";
import GrammarQuiz from "@/components/grammar-quiz";
import PronunciationPractice from "@/components/pronunciation-practice";
import SentenceBuilder from "@/components/sentence-builder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Lessons() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Interactive Learning Experience</h1>
            <p className="text-lg text-slate-600">Engage with dynamic exercises designed to accelerate your learning</p>
          </div>

          <Tabs defaultValue="vocabulary" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
              <TabsTrigger value="grammar">Grammar</TabsTrigger>
              <TabsTrigger value="pronunciation">Pronunciation</TabsTrigger>
              <TabsTrigger value="sentence">Sentence Building</TabsTrigger>
            </TabsList>

            <TabsContent value="vocabulary" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vocabulary Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <Flashcard />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grammar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grammar Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <GrammarQuiz />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pronunciation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pronunciation Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <PronunciationPractice />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sentence" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sentence Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <SentenceBuilder />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
