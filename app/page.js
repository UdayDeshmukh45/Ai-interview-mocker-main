"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./dashboard/_components/Header";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Video, Brain, Award, ShieldCheck } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "Tailored AI Questions",
      description:
        "Generates realistic, customized technical and situational questions based on your specific role, experience, and tech stack.",
    },
    {
      icon: <Video className="h-6 w-6 text-primary" />,
      title: "Simulated Interview Room",
      description:
        "Practice in a live webcam interview setting with integrated real-time speech-to-text transcription.",
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Detailed Scoring & Feedback",
      description:
        "Get instant ratings, ideal answers, and constructive critique powered by Google Gemini to elevate your interview skills.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center gap-12">
          {/* Hero Text */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-primary/10 text-primary text-xs font-semibold mb-6">
              <Sparkles className="h-3.5 w-3.5" /> Powered by Google Gemini AI
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Master Your Next Job Interview with{" "}
              <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                AI Precision
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Don&apos;t fear the interview! Practice real-time questions tailored to your tech stack. Simulate realistic video and audio interviews, get instant grading, and refine your answers to land your dream job.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                onClick={() => router.push("/dashboard")}
                className="gap-2 px-8 font-semibold shadow-md"
              >
                Practice Now <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/dashboard/upgrade")}
                className="px-8 font-semibold"
              >
                View Plans
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> No webcam recording stored
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" /> Instant AI evaluation
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 flex justify-center w-full max-w-md md:max-w-none">
            <div className="relative w-full aspect-square max-w-md rounded-3xl overflow-hidden border shadow-xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
              <Image
                src="/robot.webp"
                alt="AI Interviewer"
                width={420}
                height={420}
                priority
                className="object-contain drop-shadow-lg rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-muted/30 border-t">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Everything You Need to Ace Your Interview
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Accelerate your preparation with realistic simulations and intelligent feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 w-fit rounded-xl bg-primary/10 mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t bg-card text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} AI Interview Mocker. All rights reserved.</p>
      </footer>
    </div>
  );
}

function CheckCircle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
