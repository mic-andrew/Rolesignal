import { RiCheckboxCircleLine } from "react-icons/ri";
import { Card } from "../components/ui/Card";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col items-center justify-center p-7">
      {/* Radial glow background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(34,201,151,0.05), transparent 60%)",
        }}
      />

      <div className="animate-fade-in relative z-10 max-w-[440px] w-full">
        <Card padding="p-0" className="p-8 text-center">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-[var(--grg)] flex items-center justify-center">
              <RiCheckboxCircleLine
                size={36}
                className="text-[var(--color-success)]"
              />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)]">
            Thank You!
          </h2>
          <p className="text-sm text-[var(--color-ink2)] mt-3 leading-relaxed">
            Your interview has been completed successfully. The hiring team will
            review your responses and get back to you soon.
          </p>
          <p className="text-xs text-[var(--color-ink3)] mt-6 opacity-60">
            You can safely close this window.
          </p>
        </Card>
      </div>

      {/* Powered by footer */}
      <div className="relative z-10 mt-8">
        <span className="text-[11px] font-medium text-[var(--color-ink3)] opacity-60">
          Powered by RoleSignal
        </span>
      </div>
    </div>
  );
}
