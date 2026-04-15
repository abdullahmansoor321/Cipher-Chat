import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { X, ZoomIn, CheckCheck } from "lucide-react";

function MessageBubble({ msg, isMine, showAvatar, senderPic, onZoom }) {
  const time = new Date(msg.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`msg-enter flex items-end gap-2.5 ${isMine ? "flex-row-reverse" : ""} group`}>
      {/* Avatar (other person) */}
      {!isMine && (
        <div className="flex-shrink-0 mb-1">
          {showAvatar
            ? <img src={senderPic || "/avatar.png"} alt="" className="size-8 rounded-full object-cover border border-white/10" />
            : <div className="w-8" />
          }
        </div>
      )}

      <div className={`flex flex-col max-w-[72%] ${isMine ? "items-end" : "items-start"}`}>
        <div className={`
          relative px-4 py-3 rounded-2xl overflow-hidden
          ${isMine
            ? "bg-amber-500 text-black rounded-br-md shadow-[0_4px_16px_rgba(245,158,11,0.2)]"
            : "bg-[#111116] border border-white/[0.07] text-zinc-200 rounded-bl-md"
          }
        `}>
          {isMine && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
          )}

          {msg.image && (
            <div
              className="relative cursor-zoom-in group/img mb-2 overflow-hidden rounded-xl border border-white/10"
              onClick={() => onZoom(msg.image)}
            >
              <img
                src={msg.image}
                alt="attachment"
                className="max-w-[280px] w-full h-auto object-cover transition-transform duration-500 group-hover/img:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity duration-200 rounded-xl backdrop-blur-[2px]">
                <div className="size-10 rounded-full bg-black/60 flex items-center justify-center">
                  <ZoomIn className="size-4 text-white" />
                </div>
              </div>
            </div>
          )}

          {msg.text && (
            <p className={`text-[14px] leading-relaxed ${isMine ? "text-black font-semibold" : "text-zinc-200"}`}>
              {msg.text}
            </p>
          )}
        </div>

        {/* Always-visible meta with hover effect */}
        <div className={`flex items-center gap-1.5 mt-1.5 px-2 py-1 rounded-lg opacity-60 group-hover:opacity-100 group-hover:bg-amber-500/10 group-hover:px-3 group-hover:scale-105 transition-all duration-200 ${isMine ? "flex-row-reverse" : ""}`}>
          {isMine && <CheckCheck className="size-3 text-amber-500/70 group-hover:text-amber-400" />}
          <span className="text-[10px] text-zinc-500 font-mono-cipher group-hover:text-amber-400/80 transition-colors">{time}</span>
        </div>
      </div>
    </div>
  );
}

function ChatContainer() {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const [zoomedImage, setZoomedImage] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    setTimeout(() => messageEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, [messages]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ChatHeader />

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto cipher-scroll px-4 md:px-8 py-6 relative">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        ) : (
          <div className="max-w-2xl mx-auto space-y-2">
            {messages.map((msg, i) => {
              const isMine = msg.senderId === authUser._id;
              const prev = messages[i - 1];
              const showAvatar = !prev || prev.senderId !== msg.senderId;
              const isUnread = !isMine && !msg.isRead;
              
              return (
                <div
                  key={msg._id}
                  className={`msg-enter transition-all duration-200 ${isUnread ? "bg-amber-500/[0.08] rounded-2xl p-3 -mx-3 px-5 border-l-4 border-amber-500/50" : ""}`}
                >
                  <MessageBubble
                    msg={msg}
                    isMine={isMine}
                    showAvatar={showAvatar}
                    senderPic={selectedUser.profilePic}
                    onZoom={setZoomedImage}
                  />
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 md:px-6 pb-5 pt-3 bg-[#07070a]/80 backdrop-blur-sm border-t border-white/[0.04]">
        <MessageInput />
      </div>

      {/* ── LIGHTBOX ── */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-6 right-6 size-10 rounded-xl bg-white/8 hover:bg-white/15 text-white flex items-center justify-center transition-all border border-white/10 hover:border-white/20"
            onClick={() => setZoomedImage(null)}
          >
            <X className="size-5" />
          </button>
          <img
            src={zoomedImage}
            alt="Full view"
            className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default ChatContainer;
