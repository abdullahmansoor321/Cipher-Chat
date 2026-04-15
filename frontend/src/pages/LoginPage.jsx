import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";
import { LockKeyhole, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, User } from "lucide-react";
import CursorEffect from "../components/CursorEffect";

/* ── Animated floating chat preview ── */
const MESSAGES = [
  { side: "left",  text: "Hey, did you get my last message?",      delay: 0 },
  { side: "right", text: "Yes! Everything's encrypted ✓",           delay: 1200 },
  { side: "left",  text: "Can't believe how fast this is 🔥",       delay: 2400 },
  { side: "right", text: "AES-256. Nobody's reading this but us.",  delay: 3600 },
];

function MessageConsole() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let timeouts = [];
    const showNext = (index) => {
      if (index < MESSAGES.length) {
        const t = setTimeout(() => {
          setVisibleCount(index + 1);
          showNext(index + 1);
        }, index === 0 ? 500 : 1500);
        timeouts.push(t);
      } else {
        const t = setTimeout(() => {
          setVisibleCount(0);
          setKey(prev => prev + 1);
        }, 4000);
        timeouts.push(t);
      }
    };

    showNext(0);
    return () => timeouts.forEach(t => clearTimeout(t));
  }, [key]);

  return (
    <div className="space-y-5 pt-4 border-x border-white/[0.03] px-3 pb-10 overflow-hidden relative">
      {/* Vertical scanline effect for the console box */}
      <div className="absolute inset-x-0 h-10 bg-amber-500/5 blur-xl animate-scanline-console pointer-events-none z-0" />
      
      {MESSAGES.map((m, i) => (
        <div
          key={`${key}-${i}`}
          className={`flex flex-col ${m.side === "right" ? "items-end" : "items-start"} transition-all duration-700 relative z-10 ${
            i < visibleCount 
              ? "opacity-100 translate-y-0 scale-100 rotate-0" 
              : "opacity-0 translate-y-8 scale-95 rotate-1 pointer-events-none"
          }`}
          style={{ transitionDelay: i < visibleCount ? '0ms' : '0ms' }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`size-1 rounded-full ${m.side === "right" ? "bg-amber-400" : "bg-blue-400"} animate-pulse`} />
            <span className="text-[8px] font-mono-cipher text-zinc-600 uppercase tracking-widest">
              {m.side === "right" ? "Local_Peer" : "Relay_Node"} • 00:0{i+1}:{Math.floor(Math.random()*60).toString().padStart(2, '0')}
            </span>
          </div>
          
          <div className={`max-w-[88%] px-4 py-3 rounded-2xl text-[13px] font-medium shadow-2xl relative group overflow-hidden ${
            m.side === "right"
              ? "bg-amber-500 text-black rounded-tr-none border-b-2 border-amber-600 animate-in-right"
              : "bg-white/[0.03] border border-white/[0.1] text-zinc-300 rounded-tl-none backdrop-blur-md animate-in-left"
          }`}>
            {/* Glitch overlay on entrance */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none" />
            
            <p className="relative z-10">{m.text}</p>
            
            {m.side === "right" && (
              <div className="absolute top-2 right-2 flex gap-0.5">
                <span className="text-[9px] text-black/30 font-mono-cipher animate-bounce" style={{ animationDelay: '0.1s' }}>✓</span>
                <span className="text-[9px] text-black/30 font-mono-cipher animate-bounce" style={{ animationDelay: '0.2s' }}>✓</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Cycling hero words ── */
const WORDS = ["Private.", "Encrypted.", "Instant.", "Yours."];

/* ── Typewriter word ── */
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

/* ── Data stream column ── */
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

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [active, setActive] = useState(null);
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => { e.preventDefault(); login(form); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  // Data stream columns
  const streams = useRef(
    [3, 6, 9, 12, 15, 18, 82, 85, 88, 91, 94, 97].map((pos) => ({
      x: `${pos}%`,
      duration: `${11 + Math.random() * 6}s`,
      delay: `${-Math.random() * 12}s`,
      chars: 14 + Math.floor(Math.random() * 8),
    }))
  );

  // Background message particles
  const particles = useRef(
    Array.from({ length: 48 }, (_, i) => ({
      x: `${i % 2 === 0 ? 4 + Math.random() * 18 : 78 + Math.random() * 18}%`,
      y: `${10 + Math.random() * 80}%`,
      delay: `${-Math.random() * 12}s`,
      duration: `${6 + Math.random() * 4}s`,
    }))
  );

  return (
    <div className="auth-brightness min-h-screen bg-[#050507] text-white relative overflow-hidden" style={{ cursor: "none" }}>
      <CursorEffect />

      {/* ── Data stream background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden auth-bg-lanes">
        {streams.current.map((s, i) => <DataStream key={i} {...s} />)}
        {particles.current.map((p, i) => <MsgParticle key={i} {...p} />)}
      </div>

      {/* readability veil to keep core content clear */}
      <div className="absolute inset-0 pointer-events-none auth-bg-clarity" />

      {/* ── Ambient orbs ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-amber-500/6 blur-[160px] animate-orb" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-amber-600/4 blur-[120px] animate-orb-slow" />
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
      </div>

      {/* ── Nav ── */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 sm:py-5 border-b border-white/[0.04] backdrop-blur-[2px] bg-black/10">
        <button type="button" onClick={() => window.location.reload()} className="appear flex items-center gap-1.5 sm:gap-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-md shrink-0">
          <div className="size-7 sm:size-8 rounded-lg bg-amber-500 flex items-center justify-center animate-glow">
            <ShieldCheck className="size-3 sm:size-4 text-black animate-spin-slow" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-sm sm:text-base tracking-tight">Cipher<span className="text-amber-500">Chat</span></span>
        </button>
        <div className="appear flex items-center gap-2 sm:gap-4 ml-auto">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="size-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono-cipher text-green-400/80 uppercase tracking-widest">Secure Relay Live</span>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm whitespace-nowrap">
            <span className="hidden sm:inline">New to CipherChat? </span>
            <Link to="/signup" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
              <span className="hidden sm:inline">Start free</span>
              <span className="sm:hidden">Sign up</span>
              {" "}→
            </Link>
          </p>
        </div>
      </header>

      <main className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10 xl:gap-16 lg:min-h-[calc(100vh-73px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-0">
        <div className="absolute inset-0 pointer-events-none auth-content-shield-login" />

        {/* ══ Hero Section (Top on mobile, left on desktop) ══ */}
        <div className="flex flex-col justify-center px-0 lg:px-4 py-4 sm:py-6 lg:py-0 lg:w-[540px] shrink-0 space-y-6 sm:space-y-8 lg:space-y-10 relative w-full lg:w-auto order-1 lg:order-1">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
          
          {/* Hero Text */}
          <div className="space-y-4 max-w-xl">
            <p className="appear-left-1 font-mono-cipher text-xs text-zinc-600 tracking-[0.25em] uppercase">Conversations that stay</p>
            <h1 className="appear-left-2 text-4xl sm:text-5xl lg:text-6xl font-black leading-[0.9] tracking-tighter min-h-[1.1em]">
              <TypeWriter words={WORDS} speed={75} pause={2200} />
            </h1>
            <p className="appear-left-3 text-zinc-400 text-base sm:text-lg leading-relaxed max-w-md font-medium">
              End-to-end encrypted messaging with instant delivery and live sync. Private by design, reliable by default.
            </p>
          </div>

          {/* Floating chat preview (hidden on mobile, shown on desktop) */}
          <div className="hidden lg:block appear-3 relative min-h-[260px] w-full max-w-xl">
            {/* Console Header */}
            <div className="absolute -top-6 left-0 right-0 flex items-center justify-between px-2 py-1 bg-white/[0.03] border-x border-t border-white/[0.08] rounded-t-lg">
               <div className="flex items-center gap-1.5 ">
                 <div className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                 <span className="text-[9px] font-mono-cipher text-zinc-500 uppercase tracking-widest">Console // Relay_Monitor</span>
               </div>
               <div className="text-[8px] font-mono-cipher text-zinc-700">NODE: DX-Cipher-09</div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent z-10 pointer-events-none" />
            
            <MessageConsole />
          </div>
        </div>

        {/* ══ Form (Middle on mobile, right on desktop) ══ */}
        <div className="flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 lg:py-0 lg:flex-1 w-full lg:w-auto order-2 lg:order-2">
          <div className="w-full max-w-[400px] space-y-7">

            <div className="appear-1">
              <h2 className="text-2xl font-black tracking-tight">Welcome Back</h2>
              <p className="text-zinc-500 text-sm mt-1 font-medium">Enter your credentials to continue to your encrypted conversations.</p>
            </div>

            {/* ── Login Card with Border Beam ── */}
            <div className="border-beam-container rounded-2xl appear-2">
              <div className="border-beam" />
              <div className="glass-card rounded-2xl p-7 space-y-6 relative overflow-hidden">

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">Email Address</label>
                    <div className="relative group/f">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within/f:text-amber-500 transition-colors duration-200" />
                      <input
                        type="email" required
                        value={form.email} onChange={set("email")}
                        className="auth-field"
                        placeholder="name@domain.com"
                        onFocus={() => setActive("email")} onBlur={() => setActive(null)}
                      />
                      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-amber-500 rounded-full transition-all duration-500 ${active === "email" ? "w-full" : "w-0"}`} />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.18em]">Password</label>
                    <div className="relative group/f">
                      <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within/f:text-amber-500 transition-colors duration-200" />
                      <input
                        type={showPw ? "text" : "password"} required
                        value={form.password} onChange={set("password")}
                        className="auth-field pr-11"
                        placeholder="Enter your password"
                        onFocus={() => setActive("pw")} onBlur={() => setActive(null)}
                      />
                      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-amber-500 rounded-full transition-all duration-500 ${active === "pw" ? "w-full" : "w-0"}`} />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-amber-400 transition-colors">
                        {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={isLoggingIn}
                    className="relative w-full h-[50px] mt-2 rounded-xl bg-amber-500 text-black font-bold text-sm tracking-wide overflow-hidden hover:bg-amber-400 active:scale-[0.99] transition-all duration-150 shadow-[0_4px_24px_rgba(245,158,11,0.3)] btn-shimmer disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoggingIn
                      ? <><div className="size-4 rounded-full border-2 border-black/30 border-t-black spin" /><span>Authenticating...</span></>
                      : <><span>Continue to Secure Chat</span><ArrowRight className="size-4" /></>}
                  </button>

                  {/* OR Divider */}
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-white/[0.1]" />
                    <span className="text-xs text-zinc-600 font-semibold">OR</span>
                    <div className="flex-1 h-px bg-white/[0.1]" />
                  </div>

                  {/* Create Account Link */}
                  <Link 
                    to="/signup"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-amber-500/20 text-amber-400 hover:text-amber-300 font-semibold text-sm transition-all duration-200"
                  >
                    Create your account
                  </Link>
                </form>
              </div>
            </div>


          </div>
        </div>

        {/* ══ Console (Bottom on mobile only) ══ */}
        <div className="flex flex-col justify-center px-0 py-6 sm:py-8 shrink-0 space-y-0 relative w-full order-3 lg:hidden">
          {/* Floating chat preview */}
          <div className="appear-3 relative min-h-[240px] sm:min-h-[260px] w-full max-w-xl mx-auto">
            {/* Console Header */}
            <div className="absolute -top-6 left-0 right-0 flex items-center justify-between px-2 py-1 bg-white/[0.03] border-x border-t border-white/[0.08] rounded-t-lg">
               <div className="flex items-center gap-1.5 ">
                 <div className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                 <span className="text-[9px] font-mono-cipher text-zinc-500 uppercase tracking-widest">Console // Relay_Monitor</span>
               </div>
               <div className="text-[8px] font-mono-cipher text-zinc-700">NODE: DX-Cipher-09</div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent z-10 pointer-events-none" />
            
            <MessageConsole />
          </div>
        </div>
      </main>
    </div>
  );
}
