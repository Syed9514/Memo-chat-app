import { useMemo, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Star, X, Image as ImageIcon } from "lucide-react";
import ImageModal from "./ImageModal";
import Avatar from "./Avatar";

const ChatDetailsPanel = ({ onClose }) => {
  const { selectedUser, messages } = useChatStore();
  const { authUser, toggleFavorite } = useAuthStore();
  const [selectedImgIndex, setSelectedImgIndex] = useState(null);

  const isFavorite = useMemo(() => {
    return (authUser.favorites || []).includes(selectedUser?._id);
  }, [authUser.favorites, selectedUser]);

  const sharedMedia = useMemo(() => {
    return messages.filter((message) => message.image);
  }, [messages]);

  if (!selectedUser) return null;

  const handleToggleFavorite = () => {
    toggleFavorite(selectedUser._id);
  };

  const handleImageClick = (index) => setSelectedImgIndex(index);
  const closeImageModal = () => setSelectedImgIndex(null);
  const handleNextImage = () => {
    if (selectedImgIndex < sharedMedia.length - 1) setSelectedImgIndex((prev) => prev + 1);
  };
  const handlePrevImage = () => {
    if (selectedImgIndex > 0) setSelectedImgIndex((prev) => prev - 1);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className='fixed inset-0 z-40 bg-black/50 md:hidden'
        onClick={onClose}
      />
      
      {/* Panel Container */}
      <div
        className='
          fixed top-0 right-0 z-50 h-full w-full
          md:w-[350px] bg-base-200/80 backdrop-blur-xl
          flex flex-col animate-slide-in-right border-l border-base-300
        '
      >
        {/* --- 1. HEADER (Clean Line Separator) --- */}
        {/* Replaced 'glow-separator' with standard border for better alignment */}
        <div className='flex items-center justify-between p-4 border-b border-base-300'>
          <h2 className='text-lg font-bold'>Contact Info</h2>
          <button className='btn btn-ghost btn-circle btn-sm' onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className='flex-1 p-4 space-y-6 overflow-y-auto'>
          
          {/* --- 2. PROFILE GLASS CARD --- */}
          <div className="bg-base-100/50 rounded-3xl p-6 flex flex-col items-center border border-base-300/50 shadow-sm">
            <div className="mb-4">
               <Avatar user={selectedUser} size="size-24" />
            </div>
            
            <div className='flex items-center gap-2 mb-2'>
              <h3 className='font-bold text-xl'>{selectedUser.fullName}</h3>
              {/* Favorite Toggle */}
              <button 
                onClick={handleToggleFavorite}
                className={`btn btn-ghost btn-circle btn-sm transition-all ${isFavorite ? "text-yellow-400" : "text-base-content/40 hover:text-yellow-400"}`}
              >
                <Star className={`size-5 ${isFavorite ? "fill-current" : ""}`} />
              </button>
            </div>

            {selectedUser.bio && (
              <p className='text-sm text-center text-base-content/60 px-2'>
                {selectedUser.bio}
              </p>
            )}
            
            {/* Removed "Active Now" badge as requested */}
          </div>

          {/* --- 3. SHARED MEDIA SECTION --- */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-2">
                <ImageIcon className="size-4 text-base-content/60" />
                <h3 className='font-semibold text-sm text-base-content/80'>Shared Media</h3>
                <span className="text-xs text-base-content/40 ml-auto">{sharedMedia.length} photos</span>
            </div>

            {sharedMedia.length > 0 ? (
              <div className='grid grid-cols-3 gap-2'>
                {sharedMedia.map((message, index) => (
                  <div
                    key={message._id}
                    onClick={() => handleImageClick(index)}
                    className="cursor-pointer relative group aspect-square rounded-xl overflow-hidden border border-base-300/50"
                  >
                    <img
                      src={message.image}
                      alt='Shared'
                      className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                    />
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <div className='p-8 text-center bg-base-100/30 rounded-2xl border border-dashed border-base-300'>
                <p className='text-sm text-base-content/40'>No media shared yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal 
        isOpen={selectedImgIndex !== null}
        onClose={closeImageModal}
        imageSrc={selectedImgIndex !== null ? sharedMedia[selectedImgIndex]?.image : null}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
        hasNext={selectedImgIndex < sharedMedia.length - 1}
        hasPrev={selectedImgIndex > 0}
      />
    </>
  );
};

export default ChatDetailsPanel;