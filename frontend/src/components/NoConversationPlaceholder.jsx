import { MessageSquareDashed } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 select-none relative">
      {/* Background dot grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Icon with glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/15 blur-2xl rounded-full scale-150" />
          <div className="relative size-20 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center animate-breathe">
            <MessageSquareDashed className="size-9 text-amber-500/70" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">
            Select a conversation
          </h3>
          <p className="text-sm text-zinc-500 max-w-[220px] leading-relaxed">
            Choose someone from the sidebar to start chatting
          </p>
        </div>

        {/* Cipher accent */}
        <div className="flex items-center gap-3 mt-2">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-500/30" />
          <span className="font-mono-cipher text-[9px] text-zinc-700 tracking-[0.3em] uppercase">End-to-End Encrypted</span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-amber-500/30" />
        </div>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;
