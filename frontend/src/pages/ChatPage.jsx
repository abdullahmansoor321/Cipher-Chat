import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#050507] relative">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-500/4 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-amber-600/3 blur-[100px]" />
      </div>

      {/* ── SIDEBAR ── */}
      <aside className={`
        flex-shrink-0 flex flex-col relative z-20
        bg-[#07070a] border-r border-white/[0.05]
        transition-all duration-300
        ${selectedUser ? "hidden md:flex w-72 lg:w-80" : "flex w-full md:w-72 lg:w-80"}
      `}>
        {/* Top amber accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

        {/* Profile */}
        <div className="flex-shrink-0 px-4 py-4 border-b border-white/[0.05]">
          <ProfileHeader />
        </div>

        {/* Tab Switch */}
        <div className="flex-shrink-0 px-3 py-3">
          <ActiveTabSwitch />
        </div>

        {/* Section label */}
        <div className="px-4 pb-2">
          <span className="font-mono-cipher text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
            {activeTab === "chats" ? "Recent" : "Directory"}
          </span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto cipher-scroll">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-white/[0.05] bg-[#060609]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
              <span className="font-mono-cipher text-[9px] text-zinc-600 tracking-widest">ENCRYPTED · SECURE</span>
            </div>
            <span className="font-mono-cipher text-[9px] text-zinc-700">v2.0</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className={`
        flex-1 flex flex-col overflow-hidden relative z-10
        ${selectedUser ? "flex" : "hidden md:flex"}
      `}>
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </main>

      {/* HUD bracket corners */}
      <div className="pointer-events-none fixed inset-0 hidden lg:block z-50">
        <div className="absolute top-5 left-5 size-5 border-t border-l border-amber-500/15" />
        <div className="absolute top-5 right-5 size-5 border-t border-r border-amber-500/15" />
        <div className="absolute bottom-5 left-5 size-5 border-b border-l border-amber-500/15" />
        <div className="absolute bottom-5 right-5 size-5 border-b border-r border-amber-500/15" />
      </div>
    </div>
  );
}

export default ChatPage;
