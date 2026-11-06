"use client";

import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, LoaderCircle, CheckCircle, AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const isGoodRating = (ratingStr) => {
  if (!ratingStr) return false;
  const str = String(ratingStr).toLowerCase().trim();

  // If fraction e.g. "8/10", "4/5"
  const fractionMatch = str.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1]);
    const den = parseFloat(fractionMatch[2]);
    if (den > 0) return num / den >= 0.6;
  }

  // If plain number e.g. "4", "7", "8"
  const numMatch = str.match(/\d+(?:\.\d+)?/);
  if (numMatch) {
    const val = parseFloat(numMatch[0]);
    if (val <= 5) return val >= 3;
    if (val <= 10) return val >= 6;
    if (val <= 100) return val >= 60;
  }

  const positiveWords = ["good", "great", "excellent", "nice", "acceptable", "strong", "well", "pass"];
  return positiveWords.some((w) => str.includes(w));
};

const Feedback = ({ params }) => {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getFeedbackData = async () => {
    try {
      setLoading(true);
      const [userAnswers, interview] = await Promise.all([
        db
          .select()
          .from(UserAnswer)
          .where(eq(UserAnswer.mockIdRef, params?.interviewId))
          .orderBy(UserAnswer.id),
        db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, params?.interviewId)),
      ]);

      setFeedbackList(userAnswers || []);
      if (interview && interview.length > 0) {
        setInterviewData(interview[0]);
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.interviewId) {
      getFeedbackData();
    }
  }, [params?.interviewId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
        <p className="text-muted-foreground">Compiling your interview feedback...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      {feedbackList.length > 0 ? (
        <div>
          <div className="border-b pb-6">
            <h2 className="text-3xl font-extrabold text-primary">
              Interview Evaluation Report 🎉
            </h2>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              {interviewData?.jobPosition ? `Role: ${interviewData.jobPosition} • ` : ""}
              Detailed breakdown of your answers, ratings, and AI recommendations.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 items-center bg-secondary/50 p-4 rounded-xl border">
              <span className="font-semibold text-sm">Rating Summary:</span>
              {feedbackList.map((item, index) => {
                const good = isGoodRating(item.rating);
                return (
                  <span
                    key={item.id}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      good
                        ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    Q{index + 1}: {item.rating}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="my-6">
            <h3 className="text-sm text-muted-foreground mb-4">
              Click on each interview question below to review your answer, the ideal answer, and constructive feedback.
            </h3>

            <div className="space-y-4">
              {feedbackList.map((item, index) => {
                const good = isGoodRating(item.rating);
                return (
                  <Collapsible key={item.id || index} defaultOpen={index === 0} className="border rounded-xl bg-card shadow-sm overflow-hidden">
                    <CollapsibleTrigger className="p-4 flex items-center justify-between w-full hover:bg-secondary/40 transition-colors text-left gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs">
                          {index + 1}
                        </span>
                        <span className="font-medium text-sm md:text-base text-foreground">
                          {item.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            good
                              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                          }`}
                        >
                          Rating: {item.rating}
                        </span>
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="p-5 border-t bg-muted/20 space-y-3 text-sm">
                        <div className="p-3.5 rounded-lg border bg-background">
                          <span className="font-semibold text-xs uppercase tracking-wider text-primary block mb-1">
                            Your Answer:
                          </span>
                          <p className="text-foreground leading-relaxed">
                            {item.userAns || "(No answer recorded)"}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900">
                          <span className="font-semibold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                            Expected / Model Answer:
                          </span>
                          <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed">
                            {item.correctAns}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
                          <span className="font-semibold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                            Feedback & Areas to Improve:
                          </span>
                          <p className="text-amber-950 dark:text-amber-200 leading-relaxed">
                            {item.feedback}
                          </p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/interview/${params?.interviewId}/start`)}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Retake Interview
            </Button>
            <Button onClick={() => router.push("/dashboard")} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <div className="my-12 text-center flex flex-col items-center gap-4">
          <AlertCircle className="h-16 w-16 text-muted-foreground opacity-60" />
          <h2 className="text-2xl font-bold text-foreground">
            No Answers Recorded Yet
          </h2>
          <p className="text-muted-foreground max-w-md">
            You haven&apos;t recorded or saved any answers for this interview session. Click below to start answering questions.
          </p>
          <div className="flex gap-4 mt-2">
            <Link href={`/dashboard/interview/${params?.interviewId}/start`}>
              <Button>Start Interview Now</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
