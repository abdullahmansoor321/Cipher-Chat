import { useState, useRef } from "react";
import { LogOutIcon, Volume2, VolumeX, Camera, Fingerprint } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const clickSfx = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setSelectedImg(reader.result);
      await updateProfile({ profilePic: reader.result });
    };
  };

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Avatar + Identity */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => fileInputRef.current.click()}
          className="relative flex-shrink-0 group"
        >
          <img
            src={selectedImg || authUser.profilePic || "/avatar.png"}
            alt="avatar"
            className="size-10 rounded-xl object-cover border border-white/10 group-hover:border-amber-500/50 transition-all duration-300"
          />
          <div className="absolute inset-0 rounded-xl bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Camera className="size-3.5 text-amber-500" />
          </div>
          {/* Online dot */}
          <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-green-500 border-2 border-[#07070a] status-online" />
        </button>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />

        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate leading-tight">{authUser.fullName}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Fingerprint className="size-3 text-amber-500/60" />
            <span className="font-mono-cipher text-[9px] text-zinc-500 tracking-wider">VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          onClick={() => { clickSfx.currentTime = 0; clickSfx.play().catch(() => {}); toggleSound(); }}
          className={`size-8 flex items-center justify-center rounded-lg transition-all duration-200 ${isSoundEnabled ? "text-amber-500 bg-amber-500/10" : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"}`}
        >
          {isSoundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
        </button>
        <button
          onClick={logout}
          className="size-8 flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
        >
          <LogOutIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;
