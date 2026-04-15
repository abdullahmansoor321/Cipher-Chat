import { Zap } from "lucide-react";

const NoChatHistoryPlaceholder = ({ name }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 select-none">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full scale-150" />
          <div className="relative size-14 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
            <Zap className="size-6 text-amber-500/70" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-zinc-300">
            Say hello to <span className="text-amber-400">{name}</span>
          </p>
          <p className="text-xs text-zinc-600">
            This is the beginning of your encrypted conversation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="size-1 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono-cipher text-[9px] text-zinc-700 tracking-widest">CHANNEL OPEN</span>
        </div>
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
