import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";
import {
  LockKeyhole, Mail, Eye, EyeOff, ShieldCheck, ArrowRight,
  User, Zap, Lock, Image as ImageIcon, Volume2, Check
} from "lucide-react";
import CursorEffect from "../components/CursorEffect";

const FEATURES = [
  { icon: Lock,      title: "Zero-Knowledge",      desc: "Encryption keys are generated and retained locally." },
  { icon: Zap,       title: "Real-Time at Scale",   desc: "Low-latency delivery through a resilient relay mesh." },
  { icon: ImageIcon, title: "Private Media",         desc: "Secure image sharing with encrypted transport." },
  { icon: Volume2,   title: "Keyboard Sounds",       desc: "Optional tactile feedback tuned for speed." },
];

const STEPS = ["Create profile", "Verify email", "Start secure chat"];

/* Typewriter + counter shared from LoginPage */
function TypeWriter({ words, speed = 80, pause = 2000 }) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    const word = words[wordIdx];
    if (typing) {
      if (display.length < word.length) {
        const t = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), speed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), pause);
        return () => clearTimeout(t);
      }
    } else {
      if (display.length > 0) {
        const t = setTimeout(() => setDisplay(display.slice(0, -1)), speed / 2);
        return () => clearTimeout(t);
      } else {
        setWordIdx((i) => (i + 1) % words.length);
        setTyping(true);
      }
    }
  }, [display, typing, wordIdx, words, speed, pause]);
  return (
    <span className="text-gradient-animate">
      {display}<span className="animate-blink text-amber-500">|</span>
    </span>
  );
}

/* Loopable Terminal Component */
function TerminalLoop() {
  const lines = [
    { t: "cipher-relay // secure session init", c: "text-zinc-500" },
    { t: "$ cipher register --user=you@domain.com", c: "text-amber-500/60" },
    { t: "", c: "text-zinc-600" },
    { t: "[+] Identity provisioned", c: "text-zinc-500" },
    { t: "[+] Keypair generated locally", c: "text-zinc-500" },
    { t: "[+] Syncing to relay node...", c: "text-zinc-500" },
    { t: "", c: "text-zinc-600" },
    { t: "[✓] Account provisioned. Secure channel active.", c: "text-green-400/70" },
  ];

  const [visibleLines, setVisibleLines] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (lineIdx >= lines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines([]);
        setLineIdx(0);
        setCharIdx(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const currentLine = lines[lineIdx];
    
    if (currentLine.t === "") {
        setVisibleLines(prev => [...prev, { ...currentLine, t: "" }]);
        setLineIdx(prev => prev + 1);
        return;
    }

    if (charIdx < currentLine.t.length) {
      const timeout = setTimeout(() => {
        setCharIdx(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setVisibleLines(prev => [...prev, { ...currentLine, t: currentLine.t }]);
        setLineIdx(prev => prev + 1);
        setCharIdx(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [lineIdx, charIdx]);

  return (
    <div className="space-y-1">
      {visibleLines.map((l, i) => (
        <p key={i} className={`${l.c} h-4`}>{l.t}</p>
      ))}
      {lineIdx < lines.length && lines[lineIdx].t !== "" && (
        <p className={`${lines[lineIdx].c} h-4`}>
          {lines[lineIdx].t.slice(0, charIdx)}
          <span className="animate-blink">█</span>
        </p>
      )}
      {lineIdx >= lines.length && <p className="text-white/30 animate-blink">█</p>}
    </div>
  );
}

/* Password strength bar */
function StrengthBar({ password }) {
  const score = password.length === 0 ? 0 : password.length < 4 ? 1 : password.length < 6 ? 2 : password.length < 9 ? 3 : 4;
  const labels = ["", "WEAK", "FAIR", "GOOD", "STRONG"];
  const colors = ["", "bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-green-400"];
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 flex-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= score ? colors[score] : "bg-white/[0.06]"}`} />
        ))}
      </div>
      {score > 0 && <span className={`text-[9px] font-mono-cipher ${score >= 3 ? "text-green-400" : "text-amber-500"}`}>{labels[score]}</span>}
    </div>
  );
}

/* Data stream — columns of characters flowing down */
function DataStream({ x, duration, chars = 20, delay }) {
  const alphabet = "01ABCDEFcipherXY★◆░▒";
  const col = Array.from({ length: chars }, () => alphabet[Math.floor(Math.random() * alphabet.length)]);
  return (
    <div
      className="data-col absolute font-mono-cipher text-[9px] text-amber-400/[0.16] leading-4 select-none"
      style={{ left: x, top: 0, animationDuration: duration, animationDelay: delay }}
    >
      {col.map((c, i) => <div key={i}>{c}</div>)}
    </div>
  );
}

/* Floating Message Packets with cipher effect */
function MsgParticle({ x, y, delay, duration }) {
  const chars = Array.from({ length: 8 }, () => Math.random() > 0.5 ? '0' : '1').join('');
  return (
    <div 
      className="absolute msg-drift"
      style={{ 
        left: x, top: y, 
        animationDelay: delay, 
        animationDuration: duration,
        animationIterationCount: "infinite",
        animationTimingFunction: "linear"
      }}
    >
      <div className="relative auth-packet">
        <div className="px-2.5 py-1.5 rounded-lg border border-amber-400/[0.3] bg-black/25 text-[7px] font-mono-cipher text-amber-300/[0.72] whitespace-nowrap flex items-center gap-1.5">
          <span className="tracking-[0.12em]">PKT</span>
          <span className="text-amber-300/[0.65]">{chars}</span>
        </div>
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-[1px] bg-amber-300/[0.55]" />
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [active, setActive] = useState(null);
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => { e.preventDefault(); signup(form); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  // Data streams
  const streams = useRef(
    [3, 6, 9, 12, 15, 18, 21, 79, 82, 85, 88, 91, 94, 97].map((pos) => ({
      x: `${pos}%`,
      duration: `${11 + Math.random() * 6}s`,
      delay: `${-Math.random() * 12}s`,
      chars: 14 + Math.floor(Math.random() * 8),
    }))
  );

  // Background message particles
  const particles = useRef(
    Array.from({ length: 48 }, (_, i) => ({
      x: `${i % 2 === 0 ? 3 + Math.random() * 20 : 77 + Math.random() * 20}%`,
      y: `${8 + Math.random() * 84}%`,
      delay: `${-Math.random() * 12}s`,
      duration: `${6 + Math.random() * 4}s`,
    }))
  );

  return (
    <div className="auth-brightness min-h-screen bg-[#050507] text-white relative overflow-hidden" style={{ cursor: "none" }}>
      <CursorEffect />

      {/* ── Dynamic Background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden auth-bg-lanes">
        {streams.current.map((s, i) => <DataStream key={i} {...s} />)}
        {particles.current.map((p, i) => <MsgParticle key={i} {...p} />)}
      </div>

      {/* readability veil to keep core content clear */}
      <div className="absolute inset-0 pointer-events-none auth-bg-clarity" />

      {/* ── Ambience ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-60 left-1/3 w-[700px] h-[600px] rounded-full bg-amber-500/5 blur-[160px] animate-orb" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[400px] rounded-full bg-amber-600/4 blur-[120px] animate-orb-slow" />
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
      </div>

      {/* ── Nav ── */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.04] backdrop-blur-[2px] bg-black/10">
        <button type="button" onClick={() => window.location.reload()} className="appear flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-md">
          <div className="size-8 rounded-lg bg-amber-500 flex items-center justify-center animate-glow">
            <ShieldCheck className="size-4 text-black animate-spin-slow" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-base tracking-tight">Cipher<span className="text-amber-500">Chat</span></span>
        </button>
        <p className="appear text-zinc-500 text-sm hidden sm:block">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
            Sign in →
          </Link>
        </p>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-6 lg:py-8 backdrop-blur-[1px]">
        <div className="absolute inset-0 pointer-events-none auth-content-shield-signup" />

        {/* ── Centered hero header ── */}
        <div className="text-center space-y-5 mb-8 max-w-3xl mx-auto relative z-10">
          <div className="appear inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5">
            <div className="size-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono-cipher text-amber-500/80 uppercase tracking-widest">Network Online · Accepting Connections</span>
          </div>

          <h1 className="appear-1 text-4xl sm:text-5xl xl:text-5xl font-black leading-[0.92] tracking-tighter">
            Join a secure<br />
            <TypeWriter words={["communication workspace.", "private messaging network.", "encrypted collaboration channel.", "trusted relay grid."]} speed={65} pause={2000} />
          </h1>
          <p className="appear-2 text-zinc-400 text-lg leading-relaxed font-medium max-w-xl mx-auto">
            Get started in minutes. No card required. Built for private communication.
          </p>

          {/* Animated step indicators */}
          <div className="appear-3 flex items-center justify-center gap-2 pt-1">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`size-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-500 ${
                      i === 0
                        ? "bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                        : "bg-white/5 text-zinc-600 border border-white/10"
                    }`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {i === 0 ? <Check className="size-3" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${i === 0 ? "text-amber-400" : "text-zinc-600"}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-8 h-px bg-gradient-to-r from-amber-500/30 to-white/[0.04]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Main 2-col layout ── */}
        <div className="grid lg:grid-cols-[460px_1fr] gap-10 xl:gap-12 items-start">

          {/* LEFT — Form card with Border Beam */}
          <div className="space-y-7">
            <div className="appear-1">
              <h2 className="text-2xl font-black tracking-tight">Create Your Account</h2>
              <p className="text-zinc-500 text-sm mt-1 font-medium">Set up your secure profile and start private messaging in minutes.</p>
            </div>

            <div className="border-beam-container rounded-2xl appear-2">
              <div className="border-beam" />
              <div className="glass-card rounded-2xl p-7 space-y-6 relative overflow-hidden">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full name */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">Full Name</label>
                    <div className="relative group/f">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within/f:text-amber-500 transition-colors duration-200" />
                      <input type="text" required value={form.fullName} onChange={set("fullName")}
                        className="auth-field" placeholder="John Doe"
                        onFocus={() => setActive("name")} onBlur={() => setActive(null)} />
                      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-amber-500 rounded-full transition-all duration-500 ${active === "name" ? "w-full" : "w-0"}`} />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">Email Address</label>
                    <div className="relative group/f">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within/f:text-amber-500 transition-colors duration-200" />
                      <input type="email" required value={form.email} onChange={set("email")}
                        className="auth-field" placeholder="name@domain.com"
                        onFocus={() => setActive("email")} onBlur={() => setActive(null)} />
                      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-amber-500 rounded-full transition-all duration-500 ${active === "email" ? "w-full" : "w-0"}`} />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">Password</label>
                    <div className="relative group/f">
                      <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within/f:text-amber-500 transition-colors duration-200" />
                      <input type={showPw ? "text" : "password"} required value={form.password} onChange={set("password")}
                        className="auth-field pr-11" placeholder="Use at least 6 characters"
                        onFocus={() => setActive("pw")} onBlur={() => setActive(null)} />
                      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-amber-500 rounded-full transition-all duration-500 ${active === "pw" ? "w-full" : "w-0"}`} />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-amber-400 transition-colors">
                        {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <StrengthBar password={form.password} />
                  </div>

                  <button type="submit" disabled={isSigningUp}
                    className="relative w-full h-[50px] mt-2 rounded-xl bg-amber-500 text-black font-bold text-sm tracking-wide overflow-hidden hover:bg-amber-400 active:scale-[0.99] transition-all duration-150 shadow-[0_4px_24px_rgba(245,158,11,0.3)] btn-shimmer disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSigningUp
                      ? <><div className="size-4 rounded-full border-2 border-black/30 border-t-black spin" /><span>Creating secure account...</span></>
                      : <><span>Create Secure Account</span><ArrowRight className="size-4" /></>}
                  </button>

                  <p className="text-center text-[10px] text-zinc-700">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 opacity-60">
              <ShieldCheck className="size-3 text-amber-500" />
              <span className="text-[9px] font-mono-cipher text-zinc-500 tracking-widest uppercase">End-to-End Encryption Enabled</span>
            </div>
          </div>


          {/* RIGHT — Features + Visual */}
          <div className="space-y-5 lg:pt-8 max-w-[620px] self-stretch flex flex-col">

            <div className="appear-3">
              <p className="font-mono-cipher text-[10px] text-zinc-600 uppercase tracking-[0.25em] mb-2">// platform_highlights</p>
              <h3 className="text-xl font-black tracking-tight">Enterprise-grade privacy.<br />
                <span className="text-zinc-500 font-normal text-base">Built for real-time collaboration.</span>
              </h3>
            </div>

            {/* Animated terminal */}
            <div className="appear-4 font-mono-cipher text-xs bg-black/60 border border-white/[0.05] rounded-xl p-4 relative overflow-hidden h-[230px]">
              <div className="scanline" />
              <div className="flex gap-1.5 mb-3">
                <div className="size-2 rounded-full bg-red-500/50" />
                <div className="size-2 rounded-full bg-amber-500/50" />
                <div className="size-2 rounded-full bg-green-500/50" />
                <span className="ml-2 text-zinc-700 text-[10px]">relay-console // secure session</span>
              </div>
              
              <TerminalLoop />
            </div>

            <div className="lg:mt-auto space-y-3">
              {/* Animated feature cards */}
              <div className="grid sm:grid-cols-2 gap-2">
                {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                  <div
                    key={title}
                    className={`appear-pop-${i + 1} flex gap-2.5 p-3 rounded-xl bg-white/[0.025] border border-white/[0.05] hover:bg-amber-500/[0.04] hover:border-amber-500/20 hover:-translate-y-1 transition-all duration-300 group h-full`}
                  >
                    <div className="size-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/25 group-hover:shadow-[0_0_16px_rgba(245,158,11,0.2)] transition-all duration-300">
                      <Icon className="size-4 text-amber-500" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white mb-0.5">{title}</p>
                      <p className="text-[10px] text-zinc-600 leading-snug">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="appear-5 grid grid-cols-3 gap-2">
                {[["2.4M+", "Messages delivered"], ["<20ms", "Avg. latency"], ["100%", "No vendor lock-in"]].map(([v, l]) => (
                  <div key={l} className="group rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-center">
                    <div className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">{v}</div>
                    <div className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
