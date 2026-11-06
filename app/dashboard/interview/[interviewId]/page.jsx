"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon, LoaderCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  const getInterviewDetails = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params?.interviewId));

      if (result && result.length > 0) {
        setInterviewData(result[0]);
      }
    } catch (err) {
      console.error("Failed to load interview details:", err);
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
        <p className="text-muted-foreground">Loading interview details...</p>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="my-10 text-center flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold text-destructive">
          Interview session not found.
        </h2>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="my-10 flex justify-center flex-col">
      <h2 className="font-bold text-2xl md:text-3xl text-primary">Let&apos;s Get Started</h2>
      <p className="text-muted-foreground mt-1 mb-6">
        Review the interview information and enable your camera and microphone when ready.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col items-center justify-center bg-secondary/50 rounded-lg p-5 border min-h-[350px]">
          {webCamEnabled ? (
            <div className="flex flex-col items-center w-full gap-4">
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                className="rounded-lg max-h-[300px] w-full object-cover border"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWebCamEnabled(false)}
              >
                Disable Web Cam
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full gap-4">
              <WebcamIcon className="h-48 w-48 p-10 bg-secondary rounded-xl border text-muted-foreground" />
              <Button
                className="w-full max-w-xs"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Cam and Microphone
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="p-5 rounded-lg border bg-card shadow-sm flex flex-col gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Job Role / Position
              </span>
              <p className="text-lg font-semibold text-foreground">
                {interviewData?.jobPosition}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Job Description / Tech Stack
              </span>
              <p className="text-sm text-foreground mt-1 whitespace-pre-line">
                {interviewData?.jobDesc}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Experience Required
              </span>
              <p className="text-sm font-medium text-foreground">
                {interviewData?.jobExperience} {interviewData?.jobExperience === "1" ? "Year" : "Years"}
              </p>
            </div>
          </div>

          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20">
            <h2 className="flex gap-2 items-center text-yellow-700 dark:text-yellow-400 font-semibold">
              <Lightbulb className="h-5 w-5" /> Information
            </h2>
            <p className="mt-2 text-sm text-yellow-900 dark:text-yellow-200 leading-relaxed">
              {process.env.NEXT_PUBLIC_INFORMATION ||
                "Enable your webcam and microphone to start your AI-generated mock interview. At the end, you will receive an in-depth evaluation and feedback report."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center mt-8">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button size="lg" className="px-8 font-semibold">
            Start Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Interview;
