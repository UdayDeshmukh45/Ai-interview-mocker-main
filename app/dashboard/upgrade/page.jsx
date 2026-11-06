"use client";

import { Button } from "@/components/ui/button";
import { planData } from "@/utils/planData";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

const UpgradePage = () => {
  return (
    <div className="py-10 px-4 max-w-5xl mx-auto flex flex-col items-center">
      <div className="text-center max-w-xl">
        <h2 className="text-3xl font-extrabold text-foreground">
          Upgrade Your Plan
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Unlock unlimited mock interviews, in-depth speech analysis, and advanced AI evaluation to supercharge your career.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 w-full max-w-3xl">
        {/* Free Plan */}
        <div className="border rounded-2xl shadow-sm p-8 flex flex-col justify-between bg-card">
          <div>
            <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
              {planData[0].name}
            </span>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold tracking-tight">$0</span>
              <span className="ml-1 text-sm text-muted-foreground font-medium">/month</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Great for trying out your first few mock interviews.
            </p>

            <div className="space-y-3 mt-6 border-t pt-6 text-sm">
              {planData[0].offering.map((item) => (
                <div key={item.id} className="text-muted-foreground flex items-center gap-2">
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full font-semibold">
                Current Plan
              </Button>
            </Link>
          </div>
        </div>

        {/* Pro Monthly Plan */}
        <div className="border-2 border-primary rounded-2xl shadow-lg p-8 flex flex-col justify-between bg-card relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Popular
          </div>

          <div>
            <span className="text-xs uppercase font-bold text-primary tracking-wider">
              {planData[1].name}
            </span>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold tracking-tight">${planData[1].cost}</span>
              <span className="ml-1 text-sm text-muted-foreground font-medium">/month</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Everything you need to master every technical interview.
            </p>

            <div className="space-y-3 mt-6 border-t pt-6 text-sm">
              {planData[1].offering.map((item) => (
                <div key={item.id} className="text-foreground font-medium flex items-center gap-2">
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Link href={planData[1].paymentLink} target="_blank">
              <Button className="w-full font-semibold shadow-md">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
