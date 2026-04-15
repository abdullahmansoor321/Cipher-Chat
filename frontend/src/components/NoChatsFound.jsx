import { useChatStore } from "../store/useChatStore";
import { MessagesSquare } from "lucide-react";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16 px-6 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full scale-150" />
        <div className="relative size-14 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
          <MessagesSquare className="size-6 text-zinc-600" strokeWidth={1.5} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-zinc-400">No conversations yet</p>
        <p className="text-xs text-zinc-600">Find someone to chat with</p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold hover:bg-amber-500/20 transition-all duration-200 hover:shadow-[0_0_12px_rgba(245,158,11,0.15)]"
      >
        Browse Contacts →
      </button>
    </div>
  );
}
export default NoChatsFound;
