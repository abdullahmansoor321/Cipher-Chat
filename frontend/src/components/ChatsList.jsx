import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => { getMyChatPartners(); }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="px-2 py-1 space-y-0.5">
      {chats.map((chat, i) => {
        const isOnline = onlineUsers.includes(chat._id);
        const isActive = selectedUser?._id === chat._id;
        return (
          <button
            key={chat._id}
            onClick={() => setSelectedUser(chat)}
            style={{ animationDelay: `${i * 40}ms` }}
            className={`
              sidebar-item group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left relative
              ${isActive
                ? "bg-amber-500/10 border border-amber-500/20"
                : "border border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]"
              }
            `}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            )}

            <div className="relative flex-shrink-0">
              <img
                src={chat.profilePic || "/avatar.png"}
                alt={chat.fullName}
                className={`size-11 rounded-xl object-cover border transition-colors ${isActive ? "border-amber-500/30" : "border-white/8 group-hover:border-white/15"}`}
              />
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-green-500 border-2 border-[#07070a]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5 gap-2">
                <p className={`text-sm font-semibold truncate transition-colors ${isActive ? "text-amber-400" : "text-zinc-200 group-hover:text-white"}`}>
                  {chat.fullName}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="flex-shrink-0 min-w-[1.5rem] h-6 px-1.5 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                  </span>
                )}
                {isOnline && <span className="text-[10px] text-green-400 font-medium flex-shrink-0">●</span>}
              </div>
              <p className={`text-[11px] truncate font-mono-cipher tracking-wide ${isOnline ? "text-green-500/60" : "text-zinc-600"}`}>
                {isOnline ? "online" : "offline"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ChatsList;
