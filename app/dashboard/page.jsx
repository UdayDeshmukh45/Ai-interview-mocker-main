import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

const Dashboard = () => {
  return (
    <div className="p-6 md:p-10">
      <h2 className="font-bold text-2xl md:text-3xl text-primary">Dashboard</h2>
      <p className="text-muted-foreground mt-1">
        Create and Start your AI Mockup Interview
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 my-6">
        <AddNewInterview />
      </div>

      {/* Previous interviews list */}
      <InterviewList />
    </div>
  );
};

export default Dashboard;
