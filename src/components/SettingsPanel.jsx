import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, User, Mail, Save, LogOut, X } from "lucide-react";
import toast from "react-hot-toast";
import Avatar from "./Avatar";

const SettingsPanel = ({ onClose }) => {
  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
  const [bio, setBio] = useState(authUser.bio || "");
  
  const ORB_GRADIENT = "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)";

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleSaveBio = async () => {
    if (bio === authUser.bio) return;
    if (bio.length > 150) {
      toast.error("Bio must be 150 characters or less");
      return;
    }
    await updateProfile({ bio: bio });
  };

  return (
    <div
      className='
        absolute inset-0 bg-base-200/80 backdrop-blur-xl
        flex flex-col animate-slide-up z-50
      '
    >
      {/* HEADER */}
      <div className='flex items-center justify-between p-4 border-b border-base-300'>
        <h2 className='text-lg font-bold'>Settings</h2>
        <button className='btn btn-ghost btn-circle btn-sm' onClick={onClose}>
          <X className="size-5" />
        </button>
      </div>

      {/* CONTENT (Applied .no-scrollbar here) */}
      <div className='flex-1 p-4 space-y-6 overflow-y-auto no-scrollbar'>
        
        {/* IDENTITY CARD */}
        <div className="bg-base-100/50 rounded-3xl p-6 flex flex-col items-center border border-base-300/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-base-200/50 to-transparent" />
          
          <div className='relative z-10 mb-4'>
            <div className="relative">
               <div className="p-1 bg-base-100 rounded-full shadow-sm">
                 <Avatar user={authUser} size="size-24" />
               </div>
               <label
                htmlFor='avatar-upload-panel'
                className={`
                  absolute bottom-0 right-0
                  p-2 rounded-full cursor-pointer shadow-lg
                  transition-all duration-300 hover:scale-110 active:scale-95
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
                style={{ background: ORB_GRADIENT }}
              >
                <Camera className='size-4 text-[#374151]' />
                <input
                  type='file'
                  id='avatar-upload-panel'
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
          </div>

          <h3 className='font-bold text-xl text-base-content/90'>{authUser.fullName}</h3>
          <p className='text-sm text-base-content/50'>{authUser.email}</p>
        </div>

        {/* BIO SECTION (Redesigned) */}
        <div className="space-y-2">
           <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                 <User className="size-4" /> About You
              </span>
              <span className={`text-xs ${bio.length > 140 ? "text-error" : "text-base-content/40"}`}>
                 {bio.length}/150
              </span>
           </div>

           <div className="relative group">
             <textarea
                className='textarea w-full bg-base-200/50 border-transparent focus:border-transparent focus:ring-2 focus:ring-[#a1c4fd]/50 rounded-2xl text-base min-h-[120px] resize-none transition-all p-4 pb-12 placeholder:text-base-content/30'
                placeholder='Tell your story...'
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
             ></textarea>
             
             {/* SAVE BUTTON (Inside the box) */}
             <div className="absolute bottom-3 right-3">
                {bio !== authUser.bio && (
                  <button
                    className='btn btn-sm border-none shadow-sm hover:shadow-md rounded-full text-[#374151] font-bold animate-pop-in'
                    style={{ background: ORB_GRADIENT }}
                    onClick={handleSaveBio}
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <span className='loading loading-spinner loading-xs' />
                    ) : (
                      <Save className="size-4" />
                    )}
                  </button>
                )}
             </div>
           </div>
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="pt-2">
           <div className="text-sm font-medium text-base-content/70 mb-3 px-1 flex items-center gap-2">
              <Mail className="size-4" /> Account
           </div>
           <div className="bg-base-100/30 rounded-2xl p-4 border border-base-300/50 space-y-3">
              <div className="flex justify-between items-center text-sm">
                 <span className="text-base-content/50">Member Since</span>
                 <span className="font-medium">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="text-base-content/50">Status</span>
                 <span className="text-green-500 font-medium">Active</span>
              </div>
           </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className='p-4 border-t border-base-300/50 bg-base-100/30'>
        <button 
          className='btn btn-ghost btn-block text-error hover:bg-error/10 transition-colors gap-2' 
          onClick={logout}
        >
          <LogOut className="size-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;