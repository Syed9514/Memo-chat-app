import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Paperclip, SendHorizontal, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { socket } = useAuthStore();

  const typingTimeoutRef = useRef(null);

	const handleTyping = (e) => {
		setText(e.target.value);

		if (!socket || !selectedUser) return;

		// Emit "typing" on first keypress
		if (!typingTimeoutRef.current) {
			socket.emit("typing", { receiverId: selectedUser._id });
		}

		// Clear existing timer
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// Set a new timer
		typingTimeoutRef.current = setTimeout(() => {
			socket.emit("stop_typing", { receiverId: selectedUser._id });
			typingTimeoutRef.current = null;
		}, 1500); // 1.5 seconds after user stops typing
	};

	// Clean up timer on unmount
	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
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
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="w-full p-4 bg-base-100/80 backdrop-blur-lg shadow-[0_-5px_20px_-5px_rgba(var(--p),0.2)] border-t border-base-300 sticky bottom-0 z-10">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={handleTyping}
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
            className={`btn btn-circle 
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
            
          >
            <Paperclip size={22} />
          </button>
        </div>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className={`
            btn btn-circle btn-sm sm:btn-md border-none
            shadow-[0_0_10px_rgba(161,196,253,0.5)] hover:shadow-[0_0_20px_rgba(161,196,253,0.7)]
            transition-all duration-300 transform hover:scale-105 active:scale-95
            disabled:opacity-50 disabled:cursor-allowed
          `}
          style={{
            background: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
          }}
        >
          {/* Using a dark gray icon (#374151) for high contrast against the bright blue */}
          <SendHorizontal size={20} color="#374151" className="ml-0.5" />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
