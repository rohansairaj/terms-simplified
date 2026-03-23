import { motion } from "framer-motion";
import { Clock, Shield, AlertTriangle, CheckCircle, XCircle, Info, TrendingUp } from "lucide-react";

export interface AnalysisResult {
  readingTime: string;
  summary: string[];
  agreements: string[];
  risks: string[];
  verdict: "Safe" | "Caution" | "Risky";
  riskScore: number;
}

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const verdictConfig = {
  Safe: {
    color: "bg-safe text-safe-foreground",
    border: "border-safe/30",
    bg: "bg-safe/10",
    icon: CheckCircle,
    label: "Looks Safe",
  },
  Caution: {
    color: "bg-caution text-caution-foreground",
    border: "border-caution/30",
    bg: "bg-caution/10",
    icon: AlertTriangle,
    label: "Use Caution",
  },
  Risky: {
    color: "bg-risky text-risky-foreground",
    border: "border-risky/30",
    bg: "bg-risky/10",
    icon: XCircle,
    label: "Risky — Be Careful",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  const vc = verdictConfig[result.verdict];
  const VerdictIcon = vc.icon;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-3xl mx-auto space-y-5 mt-8"
    >
      {/* Top bar: reading time + risk score */}
      <motion.div variants={item} className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-body font-medium text-secondary-foreground">
          <Clock className="h-4 w-4" />
          {result.readingTime} read
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-body font-medium text-secondary-foreground">
          <TrendingUp className="h-4 w-4" />
          Risk Score: <span className="font-bold">{result.riskScore}/10</span>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-body font-bold ${vc.color}`}>
          <VerdictIcon className="h-4 w-4" />
          {vc.label}
        </div>
      </motion.div>

      {/* Quick Summary */}
      <Section variants={item} title="Quick Summary" icon={<Info className="h-5 w-5 text-accent" />}>
        <ul className="space-y-2">
          {result.summary.map((point, i) => (
            <li key={i} className="flex gap-2 text-sm font-body leading-relaxed text-foreground/85">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {point}
            </li>
          ))}
        </ul>
      </Section>

      {/* What you're agreeing to */}
      <Section variants={item} title="What You're Agreeing To" icon={<Shield className="h-5 w-5 text-primary/60" />}>
        <ul className="space-y-2">
          {result.agreements.map((a, i) => (
            <li key={i} className="flex gap-2 text-sm font-body leading-relaxed text-foreground/85">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-safe" />
              {a}
            </li>
          ))}
        </ul>
      </Section>

      {/* Risks */}
      <Section
        variants={item}
        title="Risks to Watch Out For"
        icon={<AlertTriangle className="h-5 w-5 text-caution" />}
        highlight
      >
        <ul className="space-y-2">
          {result.risks.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm font-body leading-relaxed text-foreground/85">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-risky" />
              {r}
            </li>
          ))}
        </ul>
      </Section>
    </motion.div>
  );
};

function Section({
  title,
  icon,
  children,
  variants,
  highlight,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variants: any;
  highlight?: boolean;
}) {
  return (
    <motion.div
      variants={variants}
      className={`rounded-2xl border p-5 ${
        highlight ? "border-caution/20 bg-caution/5" : "border-border bg-card"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h2 className="font-display text-lg text-foreground">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

export default ResultsDisplay;
