"use client";

import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Video, MessageSquare, CheckCircle } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const path = usePathname();
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const steps = [
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "1. Create Interview",
      desc: "Specify your desired role, tech stack, and experience level. AI generates tailored questions.",
    },
    {
      icon: <Video className="h-6 w-6 text-primary" />,
      title: "2. Practice with Cam & Mic",
      desc: "Simulate a live interview environment with your camera and speech-to-text recording.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "3. Instant AI Feedback",
      desc: "Receive actionable scoring, ideal model answers, and tips to ace your next real interview.",
    },
  ];

  return (
    <>
      <header className="flex p-4 px-6 md:px-12 items-center justify-between bg-card border-b shadow-sm sticky top-0 z-50">
        <div
          className="flex gap-2.5 items-center cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <Image src="/logo.svg" width={34} height={34} alt="AIIM Logo" priority />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            AI Interview Mocker
          </span>
        </div>

        <ul className="hidden md:flex gap-8 text-sm font-medium items-center">
          <li
            className={`hover:text-primary transition-colors cursor-pointer ${
              path === "/dashboard" ? "text-primary font-bold" : "text-muted-foreground"
            }`}
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </li>
          <li
            className={`hover:text-primary transition-colors cursor-pointer ${
              path === "/dashboard/upgrade" ? "text-primary font-bold" : "text-muted-foreground"
            }`}
            onClick={() => router.push("/dashboard/upgrade")}
          >
            Upgrade
          </li>
          <li
            className="hover:text-primary transition-colors cursor-pointer text-muted-foreground"
            onClick={() => setHowItWorksOpen(true)}
          >
            How it Works?
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </header>

      {/* How It Works Dialog */}
      <Dialog open={howItWorksOpen} onOpenChange={setHowItWorksOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              How AI Interview Mocker Works
            </DialogTitle>
            <DialogDescription>
              Master your technical & behavioral interviews in three simple steps.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3.5 rounded-xl border bg-muted/30">
                <div className="p-2.5 rounded-lg bg-primary/10 flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button onClick={() => setHowItWorksOpen(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
