import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TermsInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const TermsInput = ({ onSubmit, isLoading }: TermsInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim().length > 20) {
      onSubmit(text.trim());
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative rounded-2xl border border-border bg-card p-1 shadow-lg shadow-foreground/5">
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-body text-muted-foreground">
            Paste your Terms & Conditions below
          </span>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Copy and paste the full Terms & Conditions text here... We'll break it down into plain English that anyone can understand."
          className="min-h-[200px] resize-none border-0 bg-transparent px-4 py-3 text-base font-body placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          <span className="text-xs text-muted-foreground font-body">
            {wordCount} words
          </span>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || text.trim().length <= 20}
            className="gap-2 rounded-xl bg-primary px-6 font-body font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Simplifying…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Simplify Terms
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsInput;
