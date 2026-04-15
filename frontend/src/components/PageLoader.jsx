import { ShieldCheck } from "lucide-react";

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#050507] gap-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative">
          <div className="size-16 rounded-2xl bg-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.35)]">
            <ShieldCheck className="size-8 text-black" strokeWidth={2.5} />
          </div>
          {/* Spinning ring */}
          <div className="absolute -inset-1.5 rounded-[20px] border-2 border-t-amber-500 border-r-amber-500/30 border-b-transparent border-l-transparent spin" />
        </div>

        <div className="text-center space-y-1">
          <p className="text-white font-bold text-lg tracking-tight">
            Cipher<span className="text-amber-500">Chat</span>
          </p>
          <p className="font-mono-cipher text-[10px] text-zinc-600 tracking-[0.3em] uppercase">Establishing secure connection</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-48 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-amber-500 to-transparent loader-bar rounded-full" />
      </div>
    </div>
  );
}
export default PageLoader;
