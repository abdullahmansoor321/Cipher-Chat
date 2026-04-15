import { useChatStore } from "../store/useChatStore";
import { MessageCircle, Users } from "lucide-react";

const tabs = [
  { id: "chats", icon: MessageCircle, label: "Chats" },
  { id: "contacts", icon: Users, label: "Contacts" },
];

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl">
      {tabs.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`
            relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300
            ${activeTab === id
              ? "bg-amber-500 text-black shadow-[0_2px_12px_rgba(245,158,11,0.3)]"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
            }
          `}
        >
          <Icon className="size-3.5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default ActiveTabSwitch;
