import { useState } from "react";
import { RiArrowRightLine, RiLoader4Line, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { useAuth } from "../hooks/useAuth";

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="auth-lg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#7C6FFF" /><stop offset="1" stopColor="#5046E5" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#auth-lg)" />
      <path d="M8 16L16 8L24 16L16 24Z" fill="white" opacity="0.85" />
      <path d="M12 16L16 12L20 16L16 20Z" fill="url(#auth-lg)" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <rect x="1" y="1"   width="10" height="10" fill="#F25022"/>
      <rect x="13" y="1"  width="10" height="10" fill="#7FBA00"/>
      <rect x="1" y="13"  width="10" height="10" fill="#00A4EF"/>
      <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
    </svg>
  );
}

const fieldClasses = "w-full px-3.5 py-[11px] bg-[var(--color-layer)] border border-[var(--color-edge)] rounded-lg text-[var(--color-ink)] text-[13px] outline-none";

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
    <div className="flex min-h-screen bg-[var(--color-canvas)]">
      {/* Brand panel */}
      <div
        className="flex-[0_0_50%] bg-[linear-gradient(160deg,var(--color-canvas)_0%,#0E0E22_40%,#12123A_100%)] flex flex-col justify-between p-[48px_56px] relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-[35%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(124,111,255,0.06),transparent_70%)] -translate-x-1/2 -translate-y-1/2" />
        {[0,1,2,3,4].map((i) => (
          <div
            key={i}
            className="absolute rounded-full animate-breathe top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 160 + i * 120, height: 160 + i * 120,
              border: `1px solid rgba(124,111,255,${0.04 - i * 0.005})`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
        <div className="relative z-[1]">
          <div className="flex items-center animate-fade-in gap-2.5 mb-[72px]">
            <Logo />
            <span className="text-xl font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">RoleSignal</span>
          </div>
          <h1 className="animate-fade-in delay-2 text-[46px] font-extrabold leading-[1.1] tracking-[-0.04em] max-w-[440px]">
            Autonomous AI{" "}
            <span className="bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand2))] bg-clip-text text-transparent">
              Interviewer
            </span>
          </h1>
          <p className="animate-fade-in delay-3 text-base text-[var(--color-ink2)] mt-5 max-w-[400px] leading-[1.7] font-normal">
            Replace manual screening calls with structured, real-time AI interviews that produce explainable hiring intelligence.
          </p>
        </div>
        <div className="flex items-center animate-fade-in delay-5 relative z-[1] gap-3">
          {[{ i: "SC", c: "#7C6FFF" }, { i: "MJ", c: "#22C997" }, { i: "PP", c: "#FFAD33" }].map((a) => (
            <Avatar key={a.i} initials={a.i} size={28} color={a.c} />
          ))}
          <span className="text-xs text-[var(--color-ink3)] font-medium">2,400+ interviews conducted</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-12 bg-[var(--color-canvas)]">
        <form onSubmit={handleSubmit} className="w-full max-w-[380px] animate-fade-in delay-3">
          <h2 className="text-[28px] font-extrabold tracking-[-0.03em] mb-1.5 text-[var(--color-ink)]">
            {mode === "login" ? "Welcome back" : "Get started"}
          </h2>
          <p className="text-sm text-[var(--color-ink3)] mb-8 font-normal">
            {mode === "login" ? "Sign in to your workspace" : "Create your account to begin"}
          </p>

          <div className="flex gap-2.5 mb-6">
            {[{ label: "Google", icon: <GoogleIcon /> }, { label: "Microsoft", icon: <MicrosoftIcon /> }].map(({ label, icon }) => (
              <Button key={label} variant="ghost" className="flex-1 justify-center py-[11px] gap-2" type="button">
                {icon}<span>{label}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--color-edge)]" />
            <span className="text-[11px] text-[var(--color-ink3)] font-medium">or with email</span>
            <div className="flex-1 h-px bg-[var(--color-edge)]" />
          </div>

          {mode === "signup" && (
            <>
              <div className="mb-3.5">
                <label className="text-xs font-semibold text-[var(--color-ink2)] block mb-1.5">Full Name</label>
                <input className={fieldClasses} placeholder="Jane Smith" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="mb-3.5">
                <label className="text-xs font-semibold text-[var(--color-ink2)] block mb-1.5">Organization</label>
                <input className={fieldClasses} placeholder="Acme Inc." value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
              </div>
            </>
          )}
          <div className="mb-3.5">
            <label className="text-xs font-semibold text-[var(--color-ink2)] block mb-1.5">Email</label>
            <input type="email" className={fieldClasses} placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <div className="mb-7">
            <label className="text-xs font-semibold text-[var(--color-ink2)] block mb-1.5">Password</label>
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[var(--color-ink3)] p-1 flex"
              >
                {showPassword ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#EF4444] mb-3.5">
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

          <p className="text-center mt-5 text-[13px] text-[var(--color-ink3)]">
            {mode === "login" ? "No account? " : "Have an account? "}
            <span
              className="text-[var(--color-brand)] cursor-pointer font-semibold"
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
