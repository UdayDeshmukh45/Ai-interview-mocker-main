"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateInterviewQuestions } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user } = useUser();

  const resetForm = () => {
    setJobPosition("");
    setJobDesc("");
    setJobExperience("");
    setLoading(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const questionCount =
        parseInt(process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT, 10) || 5;

      const questions = await generateInterviewQuestions({
        jobPosition,
        jobDesc,
        jobExperience,
        count: questionCount,
      });

      if (!questions || questions.length === 0) {
        throw new Error("Could not generate interview questions. Please try again.");
      }

      const mockId = uuidv4();
      const userEmail =
        user?.primaryEmailAddress?.emailAddress || "anonymous@user.com";

      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: mockId,
          jsonMockResp: JSON.stringify(questions),
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: userEmail,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });

      if (resp && resp[0]?.mockId) {
        toast.success("Interview created successfully!");
        setOpenDialog(false);
        resetForm();
        router.push(`/dashboard/interview/${resp[0].mockId}`);
      } else {
        throw new Error("Failed to save interview session to database.");
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error(error.message || "An error occurred while creating the interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        onClick={() => setOpenDialog(true)}
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>
      <Dialog
        open={openDialog}
        onOpenChange={(isOpen) => {
          if (!loading) {
            setOpenDialog(isOpen);
            if (!isOpen) resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
              Add details about your job position/role, job description, and years of experience to generate tailor-made interview questions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="mt-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm text-foreground">
                  Job Role/Position
                </label>
                <Input
                  placeholder="Ex. Full Stack Developer"
                  value={jobPosition}
                  required
                  onChange={(e) => setJobPosition(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm text-foreground">
                  Job Description / Tech Stack (In Short)
                </label>
                <Textarea
                  placeholder="Ex. NextJS, React, PostgreSQL, Node.js"
                  value={jobDesc}
                  required
                  rows={3}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm text-foreground">
                  Years of Experience
                </label>
                <Input
                  placeholder="Ex. 3"
                  type="number"
                  min="0"
                  max="50"
                  value={jobExperience}
                  required
                  onChange={(e) => setJobExperience(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-6">
              <Button
                onClick={() => {
                  setOpenDialog(false);
                  resetForm();
                }}
                variant="ghost"
                type="button"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2 h-4 w-4" /> Generating Questions...
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
