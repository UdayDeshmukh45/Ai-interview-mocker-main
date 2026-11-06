"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();

  return (
    <div className="border shadow-sm rounded-lg p-4 bg-card flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <h2 className="font-bold text-primary text-lg">{interview?.jobPosition}</h2>
        <h2 className="text-sm text-gray-600 mt-1">
          {interview?.jobExperience} {interview?.jobExperience === "1" ? "Year" : "Years"} of Experience
        </h2>
        <h2 className="text-xs text-muted-foreground mt-2">
          Created at: {interview?.createdAt}
        </h2>
      </div>

      <div className="flex justify-between mt-4 gap-3">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() =>
            router.push(`/dashboard/interview/${interview?.mockId}/feedback`)
          }
        >
          Feedback
        </Button>
        <Button
          size="sm"
          className="w-full"
          onClick={() =>
            router.push(`/dashboard/interview/${interview?.mockId}/start`)
          }
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;
