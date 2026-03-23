import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// Use CDN worker for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const SUPPORTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const SUPPORTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

function getExtension(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = getExtension(file.name);

  // Validate type
  if (!SUPPORTED_TYPES.includes(file.type) && !SUPPORTED_EXTENSIONS.includes(ext)) {
    throw new Error("Only PDF and Word documents are supported");
  }

  // Validate size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large, please upload a smaller document");
  }

  // Validate empty
  if (file.size === 0) {
    throw new Error("File is empty or unreadable");
  }

  const buffer = await file.arrayBuffer();

  try {
    if (file.type === "application/pdf" || ext === ".pdf") {
      return await extractPdf(buffer);
    }
    return await extractDocx(buffer);
  } catch (e: any) {
    if (e.message.startsWith("Only ") || e.message.startsWith("File ")) throw e;
    throw new Error("Could not read this file");
  }
}

async function extractPdf(buffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item: any) => item.str).join(" "));
  }
  const text = pages.join("\n").trim();
  if (!text) throw new Error("File is empty or unreadable");
  return text;
}

async function extractDocx(buffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  const text = result.value.trim();
  if (!text) throw new Error("File is empty or unreadable");
  return text;
}
