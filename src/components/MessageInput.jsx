import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Paperclip, SendHorizontal, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { socket } = useAuthStore();
  const typingTimeoutRef = useRef(null);

  const handleTyping = (e) => {
    setText(e.target.value);
    if (!socket || !selectedUser) return;
    if (!typingTimeoutRef.current) {
      socket.emit("typing", { receiverId: selectedUser._id });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { receiverId: selectedUser._id });
      typingTimeoutRef.current = null;
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    if (socket && selectedUser && typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      socket.emit("stop_typing", { receiverId: selectedUser._id });
    }

    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    // Added 'overflow-hidden' here to prevent the animation from causing scrollbars
    <div className="w-full p-4 bg-base-100/80 backdrop-blur-lg shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] sticky bottom-0 z-10 relative overflow-hidden">
      
      {/* --- THE ENERGY LINE (Fixed) --- */}
      {/* Instead of animating background-position, we physically move the div from left to right */}
      <motion.div
        className="absolute top-0 left-0 h-[3px] w-full"
        initial={{ x: "-100%" }} // Start completely off-screen left
        animate={{ x: "100%" }}   // Move completely off-screen right
        transition={{
          duration: isFocused || text ? 1.5 : 3, // Fast when active, slow when idle
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: isFocused || text 
            ? "linear-gradient(90deg, transparent 0%, #a1c4fd 50%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(161, 196, 253, 0.3) 50%, transparent 100%)",
        }}
      />
      {/* ------------------------------- */}

      <AnimatePresence>
        {imagePreview && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-3 flex items-center gap-2"
          >
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-xl border border-base-300 shadow-sm"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-base-100 border border-base-200 shadow-md flex items-center justify-center hover:bg-error hover:text-white transition-colors"
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-base-200/50 rounded-full px-4 py-1.5 border border-transparent focus-within:border-primary/20 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none text-sm sm:text-base h-10 w-full min-w-0 placeholder:text-base-content/40"
            placeholder="Type a message..."
            value={text}
            onChange={handleTyping}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          
          <button
            type="button"
            className={`
              p-2 rounded-full transition-all duration-200
              hover:bg-base-300 active:scale-95
              ${imagePreview ? "text-emerald-500 bg-emerald-500/10" : "text-[#81b0ff] hover:text-[#a1c4fd]"}
            `}
            onClick={() => fileInputRef.current?.click()}
            title="Attach Image"
          >
            {imagePreview ? <ImageIcon size={20} /> : <Paperclip size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className={`
            flex-shrink-0 btn btn-circle btn-md border-none
            shadow-[0_0_15px_rgba(161,196,253,0.4)] hover:shadow-[0_0_25px_rgba(161,196,253,0.6)]
            transition-all duration-300 transform hover:scale-105 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
          `}
          style={{
            background: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
          }}
        >
          <SendHorizontal size={22} color="#374151" className="ml-0.5" />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;