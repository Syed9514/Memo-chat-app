import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useMemo, useState } from "react";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, formatMessageDate } from "../lib/utils";
import TypingIndicator from "./TypingIndicator";
import { AnimatePresence, motion } from "framer-motion";

const DateSeparator = ({ date }) => {
  return (
    <div className="flex items-center justify-center my-4 opacity-60">
      <div className="h-px bg-base-content/20 flex-1" />
      <span className="mx-4 text-xs font-bold text-base-content/50 uppercase tracking-wider">
        {formatMessageDate(date)}
      </span>
      <div className="h-px bg-base-content/20 flex-1" />
    </div>
  );
};

const FloatingDateBadge = ({ date, show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="bg-base-300/80 backdrop-blur-md border border-base-content/10 px-4 py-1.5 rounded-full shadow-lg">
            <span className="text-xs font-medium text-base-content/70">
              {formatMessageDate(date)}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    isTyping,
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const scrollRef = useRef(null);

  const [showDateBadge, setShowDateBadge] = useState(false);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // 1. Show badge initially on mount (for 5 seconds)
    setShowDateBadge(true);
    const timer = setTimeout(() => setShowDateBadge(false), 5000);

    // 2. Handle Scroll Events
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      // Show badge if user scrolls
      setShowDateBadge(true);
      
      // Reset the hide timer on every scroll
      clearTimeout(window.badgeTimer);
      window.badgeTimer = setTimeout(() => setShowDateBadge(false), 2000);
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(window.badgeTimer);
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, [selectedUser]);

  // Check if current user is a favorite
  const isFavorite = useMemo(() => {
    return authUser.favorites.includes(selectedUser._id);
  }, [authUser.favorites, selectedUser._id]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto relative bg-base-100">
      
      {/* --- BACKGROUND LAYER START --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isFavorite ? (
          <div className="w-full h-full relative">
            {/* 1. Soft Gradient Base (Dark Blue/Purple wash for depth) */}
            <div className="absolute inset-0 bg-gradient-to-b from-base-100 via-base-100 to-primary/5" />

            {/* 2. Stardust Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                key={i}
                className="absolute bg-yellow-200 rounded-full"
                initial={{
                    x: Math.random() * window.innerWidth, // Random horizontal pos
                    y: Math.random() * window.innerHeight, // Random vertical pos
                    opacity: 0,
                    scale: 0,
                }}
                animate={{
                    y: [null, Math.random() * -100], // Float up
                    opacity: [0, 0.3, 0], // Fade in and out (Twinkle)
                    scale: [0, 1.5, 0], // Grow and shrink
                }}
                transition={{
                    duration: Math.random() * 5 + 5, // Random duration between 5-10s
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 5, // Random start time
                }}
                style={{
                    width: Math.random() * 4 + 1 + "px", // Random size 1px-5px
                    height: Math.random() * 4 + 1 + "px",
                }}
                />
            ))}
            
            {/* 3. Subtle Gradient Glows (Optional: Adds color depth) */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-base-100 to-transparent z-10" />
            </div>
        ) : (
          // 2. REGULAR BACKGROUND: Technical Grid
          <div className="w-full h-full opacity-5">
             <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          </div>
        )}
      </div>
      {/* --- BACKGROUND LAYER END --- */}

      <FloatingDateBadge date={new Date()} show={showDateBadge} />


      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 custom-scrollbar"
      >
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const isFirstMessage = index === 0;
          const isDifferentDay = prevMessage && 
            new Date(message.createdAt).toDateString() !== new Date(prevMessage.createdAt).toDateString();
          
          const isMyMessage = message.senderId === authUser._id;

          return (
            <div key={message._id}>
              
              {/* Render Separator if needed */}
              {(isFirstMessage || isDifferentDay) && (
                <DateSeparator date={message.createdAt} />
              )}

              <div
                className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`}
                ref={messageEndRef}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        isMyMessage
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                
                {/* --- UPDATED CHAT HEADER (NAME + TIME) --- */}
                <div className="chat-header mb-1">
                  <span className="font-bold opacity-70 mr-2 text-xs">
                    {isMyMessage ? authUser.fullName : selectedUser.fullName}
                  </span>
                  <time className="text-xs opacity-50">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                {/* ---------------------------------------- */}

                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            </div>
          );
        })}
        
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
        
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;