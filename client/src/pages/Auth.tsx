import { useState } from "react";
import { RiArrowRightLine, RiLoader4Line, RiEyeLine, RiEyeOffLine, RiCodeSSlashLine, RiMicLine, RiLightbulbLine } from "react-icons/ri";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { Logo, GoogleIcon, MicrosoftIcon } from "../components/shared/AuthIcons";

const fieldClasses = "input-field";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, register, loginPending, registerPending, loginError, registerError } = useAuth();

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setEmail("");
    setPassword("");
    setName("");
    setOrgName("");
    setShowPassword(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login({ email, password });
    } else {
      register({ email, password, name, org_name: orgName });
    }
  };

  const isPending = loginPending || registerPending;
  const error = loginError || registerError;

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-[0_0_50%] bg-canvas2 flex-col justify-between p-12 xl:p-14 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full bg-brand/[0.04]" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-brand/[0.03]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(124,111,255,0.04),transparent_70%)]" />

        {/* Logo */}
        <div className="relative z-[1]">
          <div className="flex items-center gap-2.5 animate-fade-in">
            <Logo />
            <span className="text-xl font-extrabold tracking-[-0.03em] text-ink">RoleSignal</span>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-[1] -mt-8">
          <h1 className="animate-fade-in text-[42px] xl:text-[48px] font-extrabold leading-[1.08] tracking-[-0.04em] max-w-[480px] text-ink">
            Practice DSA with{" "}
            <span className="bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand2))] bg-clip-text text-transparent">
              real-time AI
            </span>{" "}
            guidance
          </h1>
          <p className="animate-fade-in text-[15px] text-ink2 mt-5 max-w-[420px] leading-[1.7]">
            Solve coding challenges, get Socratic hints, and master algorithms
            with an AI tutor that talks you through the hard parts.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2.5 mt-8 animate-fade-in">
            {[
              { icon: <RiCodeSSlashLine size={14} />, text: "6 Languages" },
              { icon: <RiMicLine size={14} />, text: "Voice Tutoring" },
              { icon: <RiLightbulbLine size={14} />, text: "Socratic Hints" },
            ].map((pill) => (
              <div
                key={pill.text}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-layer border border-edge text-xs font-medium text-ink2"
              >
                <span className="text-brand">{pill.icon}</span>
                {pill.text}
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative z-[1] animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {[
                { bg: "bg-brand", text: "S" },
                { bg: "bg-success", text: "M" },
                { bg: "bg-warn", text: "P" },
              ].map((a) => (
                <div
                  key={a.text}
                  className={`w-7 h-7 rounded-full ${a.bg} text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-canvas2`}
                >
                  {a.text}
                </div>
              ))}
            </div>
            <span className="text-xs text-ink3 font-medium">Join 1,200+ developers leveling up</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 bg-canvas">
        <form onSubmit={handleSubmit} className="w-full max-w-[380px] animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <Logo />
            <span className="text-xl font-extrabold tracking-[-0.03em] text-ink">RoleSignal</span>
          </div>

          <h2 className="text-[28px] font-extrabold tracking-[-0.03em] mb-1.5 text-ink">
            {mode === "login" ? "Welcome back" : "Get started"}
          </h2>
          <p className="text-sm text-ink3 mb-8">
            {mode === "login" ? "Sign in to continue practicing" : "Create your account to begin"}
          </p>

          <div className="flex gap-2.5 mb-6">
            {[{ label: "Google", icon: <GoogleIcon /> }, { label: "Microsoft", icon: <MicrosoftIcon /> }].map(({ label, icon }) => (
              <Button key={label} variant="ghost" className="flex-1 justify-center py-[11px] gap-2" type="button">
                {icon}<span>{label}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-edge" />
            <span className="text-[11px] text-ink3 font-medium">or with email</span>
            <div className="flex-1 h-px bg-edge" />
          </div>

          {mode === "signup" && (
            <>
              <div className="mb-3.5">
                <label className="text-xs font-semibold text-ink2 block mb-1.5">Full Name</label>
                <input className={fieldClasses} placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="mb-3.5">
                <label className="text-xs font-semibold text-ink2 block mb-1.5">Organization</label>
                <input className={fieldClasses} placeholder="Acme Inc." value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
              </div>
            </>
          )}
          <div className="mb-3.5">
            <label className="text-xs font-semibold text-ink2 block mb-1.5">Email</label>
            <input type="email" className={fieldClasses} placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <div className="mb-7">
            <label className="text-xs font-semibold text-ink2 block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`${fieldClasses} pr-10`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-ink3 hover:text-ink2 transition-colors p-1 flex"
              >
                {showPassword ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-danger mb-3.5">
              {(error as Error & { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Something went wrong"}
            </p>
          )}

          <Button full size="lg" type="submit" disabled={isPending}>
            {isPending ? (
              <RiLoader4Line size={16} className="animate-spin" />
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"}
                <RiArrowRightLine size={14} />
              </>
            )}
          </Button>

          <p className="text-center mt-5 text-[13px] text-ink3">
            {mode === "login" ? "No account? " : "Have an account? "}
            <span
              className="text-brand cursor-pointer font-semibold hover:underline"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
