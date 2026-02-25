import type { RefObject } from "react";
import { RiUpload2Line } from "react-icons/ri";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";

const INPUT_CLS = "input-field";

interface JobDescriptionStepProps {
  jobDescription: string;
  isUploading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onJobDescriptionChange: (value: string) => void;
  onFileUpload: (file: File) => void;
}

export function JobDescriptionStep({
  jobDescription,
  isUploading,
  fileInputRef,
  onJobDescriptionChange,
  onFileUpload,
}: JobDescriptionStepProps) {
  return (
    <Card padding="p-0" className="p-8">
      <h3 className="text-[17px] font-bold text-ink mb-1.5">
        Job Description
      </h3>
      <p className="text-[13px] text-ink3 mb-6">
        {jobDescription
          ? "Edit the description below, or clear it to upload a new file."
          : "Upload a file or paste the JD. We'll extract evaluation criteria from it."}
      </p>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileUpload(file);
          e.target.value = "";
        }}
      />

      {/* Upload zone -- only show when no text yet */}
      {!jobDescription && (
        <>
          <div
            className={`text-center cursor-pointer transition-all border-2 border-dashed border-edge2 rounded-2xl p-9 bg-canvas2 mb-5 hover:border-brand ${isUploading ? "opacity-60" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "var(--color-brand)";
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-edge2)";
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "var(--color-edge2)";
              const file = e.dataTransfer.files[0];
              if (file) onFileUpload(file);
            }}
          >
            <RiUpload2Line
              size={20}
              className="text-brand opacity-80 mb-2.5 mx-auto"
            />
            <div className="text-sm font-semibold text-ink">
              {isUploading ? "Extracting text..." : "Drop file here or click to upload"}
            </div>
            <div className="text-xs text-ink3 mt-1">
              PDF, DOCX, or TXT
            </div>
          </div>

          <div className="flex items-center gap-3.5 mb-4">
            <div className="flex-1 h-px bg-edge" />
            <span className="text-[11px] text-ink3 font-medium">
              or paste text
            </span>
            <div className="flex-1 h-px bg-edge" />
          </div>
        </>
      )}

      <textarea
        className={`${INPUT_CLS} resize-y ${jobDescription ? "min-h-[240px]" : "min-h-[140px]"}`}
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => onJobDescriptionChange(e.target.value)}
      />

      {jobDescription && (
        <div className="flex items-center justify-between mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onJobDescriptionChange("")}
          >
            Clear &amp; Re-upload
          </Button>
          <span className="text-xs text-ink3">
            {jobDescription.length.toLocaleString()} characters
          </span>
        </div>
      )}
    </Card>
  );
}
