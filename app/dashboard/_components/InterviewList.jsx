"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
import { LoaderCircle, History } from "lucide-react";

const InterviewList = () => {
  const { user, isLoaded } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getInterviewList = async () => {
    try {
      setLoading(true);
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, email))
        .orderBy(desc(MockInterview.id));

      setInterviewList(result || []);
    } catch (err) {
      console.error("Error fetching interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      getInterviewList();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-xl text-foreground">
          Previous Mock Interviews
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
          <span>Loading previous sessions...</span>
        </div>
      ) : interviewList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
          {interviewList.map((interview) => (
            <InterviewItemCard key={interview.id} interview={interview} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-xl p-8 text-center text-muted-foreground bg-muted/20">
          <p className="text-sm">No previous interview sessions found.</p>
          <p className="text-xs mt-1">
            Click &quot;+ Add New&quot; above to create and start your first AI interview session!
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewList;
