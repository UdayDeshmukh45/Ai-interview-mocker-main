"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, MicOff, Save, LoaderCircle, CheckCircle2, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { generateAnswerFeedback } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { and, eq } from "drizzle-orm";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const {
    error: speechError,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useUser();

  const currentQuestion = mockInterviewQuestion?.[activeQuestionIndex];

  // Fetch any existing answer for the active question
  useEffect(() => {
    const fetchExistingAnswer = async () => {
      if (!interviewData?.mockId || !currentQuestion?.question) return;
      try {
        const existing = await db
          .select()
          .from(UserAnswer)
          .where(
            and(
              eq(UserAnswer.mockIdRef, interviewData.mockId),
              eq(UserAnswer.question, currentQuestion.question)
            )
          );

        if (existing && existing.length > 0) {
          setUserAnswer(existing[0].userAns || "");
          setIsSaved(true);
        } else {
          setUserAnswer("");
          setIsSaved(false);
        }
      } catch (e) {
        console.error("Error fetching existing answer:", e);
      }
    };

    if (isRecording) {
      stopSpeechToText();
    }
    setResults([]);
    fetchExistingAnswer();
  }, [activeQuestionIndex, interviewData?.mockId]);

  // Aggregate transcripts from speech-to-text without duplicating
  useEffect(() => {
    if (results && results.length > 0) {
      const fullTranscript = results
        .map((result) => (typeof result === "string" ? result : result?.transcript))
        .filter(Boolean)
        .join(" ");

      if (fullTranscript) {
        setUserAnswer(fullTranscript);
        setIsSaved(false);
      }
    }
  }, [results]);

  useEffect(() => {
    if (speechError) {
      toast.error("Microphone / Speech recognition error: " + speechError);
    }
  }, [speechError]);

  const toggleRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      toast.info("Recording stopped. Review your answer and click 'Save Answer'.");
    } else {
      setResults([]);
      startSpeechToText();
      toast.info("Recording started. Speak clearly into your microphone.");
    }
  };

  const handleSaveAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
    }

    const trimmedAnswer = userAnswer.trim();
    if (trimmedAnswer.length < 5) {
      toast.error("Please provide an answer before saving (at least 5 characters).");
      return;
    }

    setLoading(true);

    try {
      const feedbackResult = await generateAnswerFeedback({
        question: currentQuestion?.question,
        expectedAnswer: currentQuestion?.answer,
        userAnswer: trimmedAnswer,
      });

      const userEmail =
        user?.primaryEmailAddress?.emailAddress || "candidate@test.com";

      // Check if this question was already answered to update or insert
      const existing = await db
        .select()
        .from(UserAnswer)
        .where(
          and(
            eq(UserAnswer.mockIdRef, interviewData?.mockId),
            eq(UserAnswer.question, currentQuestion?.question)
          )
        );

      if (existing && existing.length > 0) {
        await db
          .update(UserAnswer)
          .set({
            userAns: trimmedAnswer,
            feedback: feedbackResult.feedback,
            rating: feedbackResult.rating,
            createdAt: moment().format("DD-MM-YYYY"),
          })
          .where(eq(UserAnswer.id, existing[0].id));
      } else {
        await db.insert(UserAnswer).values({
          mockIdRef: interviewData?.mockId,
          question: currentQuestion?.question,
          correctAns: currentQuestion?.answer,
          userAns: trimmedAnswer,
          feedback: feedbackResult.feedback,
          rating: feedbackResult.rating,
          userEmail: userEmail,
          createdAt: moment().format("DD-MM-YYYY"),
        });
      }

      setIsSaved(true);
      toast.success("Answer and AI feedback saved successfully!");
    } catch (err) {
      console.error("Error saving user answer:", err);
      toast.error(err.message || "Failed to save answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center my-6 w-full">
      {/* Video preview container */}
      <div className="relative w-full max-w-lg min-h-[300px] flex flex-col justify-center items-center bg-slate-900 rounded-2xl p-4 shadow-md overflow-hidden border">
        {webcamEnabled ? (
          <div className="w-full h-full flex flex-col items-center">
            <Webcam
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              mirrored={true}
              className="rounded-xl w-full h-[260px] object-cover"
            />
            <Button
              size="sm"
              variant="destructive"
              className="mt-3 gap-2 text-xs"
              onClick={() => setWebcamEnabled(false)}
            >
              <VideoOff className="h-3.5 w-3.5" /> Turn Off Camera
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-white text-center gap-3">
            <Image
              src="/webcam.png"
              width={160}
              height={160}
              alt="webcam placeholder"
              className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
              onClick={() => setWebcamEnabled(true)}
            />
            <Button
              variant="secondary"
              size="sm"
              className="gap-2 text-xs font-semibold"
              onClick={() => setWebcamEnabled(true)}
            >
              <Video className="h-4 w-4" /> Enable Camera
            </Button>
          </div>
        )}
      </div>

      {/* Answer input & speech transcription */}
      <div className="w-full max-w-lg mt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            Your Answer:
            {isSaved && (
              <span className="text-xs text-green-600 dark:text-green-400 font-normal flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved
              </span>
            )}
          </label>
          {isRecording && (
            <span className="flex items-center gap-1.5 text-xs text-red-600 animate-pulse font-medium">
              <span className="h-2 w-2 rounded-full bg-red-600"></span> Recording audio...
            </span>
          )}
        </div>

        <Textarea
          rows={4}
          placeholder="Speak using the button below or type your answer here..."
          value={userAnswer}
          onChange={(e) => {
            setUserAnswer(e.target.value);
            setIsSaved(false);
          }}
          className="resize-none"
        />

        <div className="flex flex-wrap gap-3 items-center justify-between mt-2">
          <Button
            type="button"
            variant={isRecording ? "destructive" : "outline"}
            onClick={toggleRecording}
            disabled={loading}
            className="gap-2"
          >
            {isRecording ? (
              <>
                <MicOff className="h-4 w-4" /> Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 text-primary" /> Record Answer
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={handleSaveAnswer}
            disabled={loading || !userAnswer.trim()}
            className="gap-2 font-semibold"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" /> Saving & Analyzing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Answer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordAnswerSection;
