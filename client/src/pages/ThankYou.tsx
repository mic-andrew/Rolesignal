import { RiCheckboxCircleLine } from "react-icons/ri";

export default function ThankYou() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-canvas)]">
      <div className="text-center max-w-md px-6">
        <div className="flex justify-center mb-4">
          <RiCheckboxCircleLine
            size={48}
            className="text-[var(--color-success)]"
          />
        </div>
        <h2 className="text-2xl font-extrabold text-[var(--color-ink)]">
          Thank You!
        </h2>
        <p className="text-sm text-[var(--color-ink3)] mt-3 leading-relaxed">
          Your interview has been completed successfully. The hiring team
          will review your responses and get back to you soon.
        </p>
        <p className="text-xs text-[var(--color-ink3)] mt-6 opacity-60">
          You can safely close this window.
        </p>
      </div>
    </div>
  );
}
