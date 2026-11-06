"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import { safeExtractJson } from "@/utils/GeminiAIModal";
import Link from "next/link";
import { LoaderCircle, ChevronLeft, ChevronRight, Award } from "lucide-react";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const getInterviewDetails = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params?.interviewId));

      if (result && result.length > 0) {
        setInterviewData(result[0]);
        let questions = safeExtractJson(result[0].jsonMockResp);

        if (!Array.isArray(questions) && questions && typeof questions === "object") {
          const arr = Object.values(questions).find((v) => Array.isArray(v));
          if (arr) questions = arr;
        }

        if (Array.isArray(questions)) {
          setMockInterviewQuestion(questions);
        }
      }
    } catch (err) {
      console.error("Failed to load interview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.interviewId) {
      getInterviewDetails();
    }
  }, [params?.interviewId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
        <p className="text-muted-foreground">Preparing interview questions...</p>
      </div>
    );
  }

  if (!interviewData || mockInterviewQuestion.length === 0) {
    return (
      <div className="my-10 text-center flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold text-destructive">
          Interview questions not found.
        </h2>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isLastQuestion = activeQuestionIndex === mockInterviewQuestion.length - 1;

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Questions Display and Audio */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />

        {/* Video / Speech-to-Text / Manual Input Section */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-4 border-t">
        <div>
          {activeQuestionIndex > 0 && (
            <Button
              variant="outline"
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Previous Question
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isLastQuestion ? (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              className="gap-2"
            >
              Next Question <ChevronRight className="h-4 w-4" />
            </Button>
          ) : null}

          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
            <Button
              variant={isLastQuestion ? "default" : "outline"}
              className={`gap-2 ${isLastQuestion ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
            >
              <Award className="h-4 w-4" /> End & View Feedback
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
