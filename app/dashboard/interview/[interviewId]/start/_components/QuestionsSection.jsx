"use client";

import { Button } from "@/components/ui/button";
import { Lightbulb, Volume2, VolumeX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const QuestionsSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  setActiveQuestionIndex,
}) => {
  const [speaking, setSpeaking] = useState(false);

  // Stop speech synthesis if question changes or component unmounts
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [activeQuestionIndex]);

  const textToSpeech = (text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Sorry, your browser does not support text to speech");
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.onend = () => setSpeaking(false);
    speech.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(speech);
  };

  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return null;
  }

  const currentQuestion = mockInterviewQuestion[activeQuestionIndex];

  return (
    <div className="p-6 border rounded-xl my-6 bg-card shadow-sm flex flex-col justify-between">
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {mockInterviewQuestion.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveQuestionIndex && setActiveQuestionIndex(index)}
              className={`p-2 rounded-full text-xs md:text-sm text-center font-medium transition-all ${
                activeQuestionIndex === index
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Question #{index + 1}
            </button>
          ))}
        </div>

        <div className="my-6">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Question {activeQuestionIndex + 1} of {mockInterviewQuestion.length}
          </span>
          <h2 className="mt-2 text-base md:text-lg font-medium leading-relaxed text-foreground">
            {currentQuestion?.question}
          </h2>
        </div>

        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => textToSpeech(currentQuestion?.question)}
            className="flex items-center gap-2 rounded-full"
          >
            {speaking ? (
              <>
                <VolumeX className="h-4 w-4 text-destructive" /> Stop Audio
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-primary" /> Listen Question
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="border rounded-xl p-5 bg-blue-50 dark:bg-blue-950/20 mt-10 border-blue-200 dark:border-blue-800">
        <h3 className="flex gap-2 items-center text-primary font-semibold text-sm">
          <Lightbulb className="h-4 w-4" />
          <span>Instructions & Note</span>
        </h3>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE ||
            "Click on 'Record Answer' when you are ready to answer the question, or type your answer directly. At the end of the interview, you will receive an in-depth score and feedback comparison."}
        </p>
      </div>
    </div>
  );
};

export default QuestionsSection;
