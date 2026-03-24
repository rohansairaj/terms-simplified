import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import TermsInput from "@/components/TermsInput";
import ResultsDisplay, { type AnalysisResult } from "@/components/ResultsDisplay";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (text: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("simplify-terms", {
        body: { text },
      });

      if (error) {
        throw new Error(error.message || "Failed to analyze terms");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult(data as AnalysisResult);
    } catch (e: any) {
      console.error("Analysis error:", e);
      toast.error(e.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-4xl items-center gap-2.5 px-6 py-4">
          <BookOpen className="h-6 w-6 text-accent" />
          <span className="font-display text-xl tracking-tight text-foreground">
            Literate Terms
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
            Terms & Conditions,{" "}
            <span className="text-accent">simplified.</span>
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground font-body max-w-xl mx-auto">
            Paste any legal text and we'll rewrite it so a 12‑year‑old can
            understand it — in under a minute.
          </p>
        </motion.div>

        <TermsInput onSubmit={handleSubmit} isLoading={isLoading} />

        {result && <ResultsDisplay result={result} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground font-body">
        Literate Terms — Making legal text human‑readable.
      </footer>
    </div>
  );
};

export default Index;
