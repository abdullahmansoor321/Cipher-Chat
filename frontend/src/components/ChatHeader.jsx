import { ArrowLeft, X, ShieldCheck } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 bg-[#07070a]/80 backdrop-blur-xl border-b border-white/[0.05] relative z-10">
      {/* Top amber accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="flex items-center gap-3">
        {/* Mobile back */}
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden size-8 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className={`size-10 rounded-full object-cover border-2 transition-colors ${isOnline ? "border-amber-500/30" : "border-white/10"}`}
          />
          <div className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#07070a] ${isOnline ? "bg-green-500" : "bg-zinc-600"}`} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">{selectedUser.fullName}</p>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/15">
              <ShieldCheck className="size-2.5 text-amber-500" />
              <span className="font-mono-cipher text-[8px] text-amber-500/80 tracking-wider">E2E</span>
            </div>
          </div>
          <p className={`text-[11px] font-medium mt-0.5 ${isOnline ? "text-green-400" : "text-zinc-500"}`}>
            {isOnline ? "● Active now" : "● Offline"}
          </p>
        </div>
      </div>

      {/* Close (desktop) */}
      <button
        onClick={() => setSelectedUser(null)}
        className="hidden md:flex size-8 items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all border border-transparent hover:border-white/[0.08]"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export default ChatHeader;
