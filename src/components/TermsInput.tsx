import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, Sparkles, Upload, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { extractTextFromFile } from "@/lib/fileExtractor";

interface TermsInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const TermsInput = ({ onSubmit, isLoading }: TermsInputProps) => {
  const [text, setText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (text.trim().length > 20) {
      onSubmit(text.trim());
    }
  };

  const processFile = useCallback(async (file: File) => {
    setFileError(null);
    setExtracting(true);
    try {
      const extracted = await extractTextFromFile(file);
      setText(extracted);
      setFileName(file.name);
    } catch (e: any) {
      setFileError(e.message);
      setFileName(null);
    } finally {
      setExtracting(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile]
  );

  const clearFile = () => {
    setFileName(null);
    setText("");
    setFileError(null);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative rounded-2xl border bg-card p-1 shadow-lg shadow-foreground/5 transition-colors ${
          dragOver ? "border-accent border-2" : "border-border"
        }`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-body text-muted-foreground">
              Paste text or upload a file
            </span>
          </div>
          <div className="flex items-center gap-2">
            {fileName && (
              <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-body font-medium text-secondary-foreground">
                <FileText className="h-3 w-3" />
                {fileName}
                <button onClick={clearFile} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={onFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={extracting || isLoading}
              onClick={() => fileRef.current?.click()}
              className="gap-1.5 rounded-xl text-xs font-body"
            >
              {extracting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              {extracting ? "Reading…" : "Upload File"}
            </Button>
          </div>
        </div>

        {/* Error banner */}
        {fileError && (
          <div className="mx-4 mt-2 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm font-body text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {fileError}
          </div>
        )}

        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-accent/10 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-accent">
              <Upload className="h-8 w-8" />
              <span className="font-body font-semibold">Drop your file here</span>
              <span className="text-xs text-muted-foreground">PDF or Word documents only</span>
            </div>
          </div>
        )}

        <Textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (fileName) setFileName(null);
          }}
          placeholder="Copy and paste the full Terms & Conditions text here, or drag & drop a PDF / Word file above."
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
