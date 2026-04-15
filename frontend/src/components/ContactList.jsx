import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { UsersIcon } from "lucide-react";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, selectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => { getAllContacts(); }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  if (allContacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
        <div className="size-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
          <UsersIcon className="size-5 text-zinc-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-400">No contacts yet</p>
          <p className="text-xs text-zinc-600 mt-1">Other users will show here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 py-1 space-y-0.5">
      {allContacts.map((contact, i) => {
        const isOnline = onlineUsers.includes(contact._id);
        const isActive = selectedUser?._id === contact._id;
        return (
          <button
            key={contact._id}
            onClick={() => setSelectedUser(contact)}
            style={{ animationDelay: `${i * 40}ms` }}
            className={`
              sidebar-item group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left relative
              ${isActive
                ? "bg-amber-500/10 border border-amber-500/20"
                : "border border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]"
              }
            `}
          >
            {isActive && (
              <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            )}

            <div className="relative flex-shrink-0">
              <img
                src={contact.profilePic || "/avatar.png"}
                alt={contact.fullName}
                className={`size-11 rounded-full object-cover border transition-colors ${isActive ? "border-amber-500/30" : "border-white/8 group-hover:border-white/15"}`}
              />
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-green-500 border-2 border-[#07070a]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className={`text-sm font-semibold truncate ${isActive ? "text-amber-400" : "text-zinc-200 group-hover:text-white"}`}>
                  {contact.fullName}
                </p>
                {isOnline && <span className="text-[10px] text-green-400">●</span>}
              </div>
              <p className={`text-[11px] font-mono-cipher tracking-wide ${isOnline ? "text-green-500/60" : "text-zinc-600"}`}>
                {isOnline ? "online" : "offline"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ContactList;
