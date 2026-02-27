import { useState } from "react";
import { RiArrowRightLine, RiLoader4Line, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
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
