import type { AnalysisResult } from "@/components/ResultsDisplay";

export function mockAnalyze(): AnalysisResult {
  return {
    readingTime: "~45 sec",
    riskScore: 6,
    verdict: "Caution",
    summary: [
      "This service collects your personal data and shares it with advertising partners.",
      "You agree to automatic renewals that charge your card unless you cancel 30 days early.",
      "The company can change these terms at any time without notifying you.",
      "You give up the right to sue — disputes go through private arbitration.",
      "Your content may be used by the company for marketing purposes.",
    ],
    agreements: [
      "You let them store your name, email, and browsing activity.",
      "They can send you promotional emails (you can opt out later).",
      "Your subscription renews automatically every year.",
      "You promise not to share your account with others.",
      "They can delete your account if you break the rules.",
    ],
    risks: [
      "Auto-renewal charges your card without a reminder email.",
      "Your data is shared with third-party advertisers you can't control.",
      "They can change prices at any time with no advance warning.",
      "Arbitration clause means you can't join a class-action lawsuit.",
    ],
  };
}
