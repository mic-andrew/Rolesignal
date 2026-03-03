import Editor from "@monaco-editor/react";
import type { Language } from "../../types";

interface CodeEditorProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const MONACO_LANG: Record<Language, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
  cpp: "cpp",
  go: "go",
};

export function CodeEditor({ language, value, onChange, readOnly = false }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      language={MONACO_LANG[language] ?? "plaintext"}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      theme="vs"
      options={{
        readOnly,
        fontSize: 14,
        fontFamily: "'JetBrains Mono', monospace",
        minimap: { enabled: false },
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 12, bottom: 12 },
        tabSize: language === "python" ? 4 : 2,
        wordWrap: "on",
        renderLineHighlight: "gutter",
        bracketPairColorization: { enabled: true },
      }}
    />
  );
}
