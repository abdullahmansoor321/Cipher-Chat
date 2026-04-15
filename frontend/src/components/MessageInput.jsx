import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImagePlus, SendHorizonal, X } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isSoundEnabled } = useChatStore();
  const [isSending, setIsSending] = useState(false);
  const canSend = (text.trim() || imagePreview) && !isSending;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!canSend) return;
    setIsSending(true);
    if (isSoundEnabled) playRandomKeyStrokeSound();
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Message failed to send");
    } finally {
      setIsSending(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded-xl border border-white/10 shadow-lg" />
          <button
            type="button"
            onClick={() => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
            className="absolute -top-2 -right-2 size-6 rounded-full bg-zinc-900 border border-white/15 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-500 transition-all shadow-lg"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 bg-[#0d0d11] border border-white/[0.07] rounded-2xl px-2 py-2 focus-within:border-amber-500/30 focus-within:shadow-[0_0_0_3px_rgba(245,158,11,0.06)] transition-all duration-300"
      >
        {/* Image attach */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`size-10 flex-shrink-0 flex items-center justify-center rounded-xl transition-all duration-200 ${imagePreview ? "bg-amber-500/15 text-amber-500" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]"}`}
        >
          <ImagePlus className="size-4.5" />
        </button>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />

        {/* Text input */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (isSoundEnabled) playRandomKeyStrokeSound();
          }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSend(e); }}
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 outline-none py-2 px-2 font-medium"
          disabled={isSending}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!canSend}
          className={`
            flex-shrink-0 size-10 rounded-xl flex items-center justify-center transition-all duration-200
            ${canSend
              ? "bg-amber-500 text-black hover:bg-amber-400 shadow-[0_2px_12px_rgba(245,158,11,0.3)] active:scale-95"
              : "bg-white/[0.04] text-zinc-600 cursor-not-allowed"
            }
          `}
        >
          {isSending
            ? <div className="size-4 rounded-full border-2 border-current border-t-transparent spin" />
            : <SendHorizonal className="size-4 translate-x-px" />
          }
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
