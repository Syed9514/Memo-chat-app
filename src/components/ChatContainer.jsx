import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useMemo, useState } from "react";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, formatMessageDate, formatFullDate } from "../lib/utils";
import TypingIndicator from "./TypingIndicator";
import { AnimatePresence, motion } from "framer-motion";
import Avatar from "./Avatar";
import BackgroundPattern from "./BackgroundPattern"; // --- IMPORT NEW COMPONENT ---

const DateSeparator = ({ date }) => {
  return (
    <div className="flex items-center justify-center my-6 opacity-60">
      <div className="h-px bg-base-content/10 flex-1" />
      <span className="mx-4 text-[10px] font-bold text-base-content/40 uppercase tracking-widest">
        {formatMessageDate(date)}
      </span>
      <div className="h-px bg-base-content/10 flex-1" />
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
          className="absolute top-5 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="bg-base-100/90 backdrop-blur-xl border border-base-content/5 px-4 py-1.5 rounded-full shadow-sm">
            <span className="text-xs font-medium text-base-content/70">
              {formatFullDate(date)}
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
    setShowDateBadge(true);
    const timer = setTimeout(() => setShowDateBadge(false), 5000);

    const handleScroll = () => {
      if (!scrollRef.current) return;
      setShowDateBadge(true);
      clearTimeout(window.badgeTimer);
      window.badgeTimer = setTimeout(() => setShowDateBadge(false), 2000);
    };

    const container = scrollRef.current;
    if (container) container.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      clearTimeout(window.badgeTimer);
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, [selectedUser]);

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
      
      {/* --- BACKGROUND LAYER (Reusable Component) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BackgroundPattern variant={isFavorite ? "favorite" : "default"} />
      </div>

      <FloatingDateBadge date={new Date()} show={showDateBadge} />

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10 custom-scrollbar"
      >
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const isFirstMessage = index === 0;
          const isDifferentDay = prevMessage && 
            new Date(message.createdAt).toDateString() !== new Date(prevMessage.createdAt).toDateString();
          
          const isMyMessage = message.senderId === authUser._id;

          return (
            <div key={message._id}>
              {(isFirstMessage || isDifferentDay) && (
                <DateSeparator date={message.createdAt} />
              )}

              {/* MESSAGE ROW */}
              <div className={`flex w-full mb-1 ${isMyMessage ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 items-end ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* 1. AVATAR + NAME (Updated Sizes) */}
                  <div className="flex flex-col items-center gap-1">
                    {/* INCREASED SIZE HERE: size-10 (mobile), size-12 (desktop) */}
                    <div className="size-10 sm:size-12 rounded-full border border-base-200 shadow-sm overflow-hidden">
                      <Avatar user={isMyMessage ? authUser : selectedUser} size="size-full" />
                    </div>
                    {/* INCREASED FONT SIZE HERE: text-xs (mobile), text-sm (desktop) */}
                    <span className="text-xs sm:text-sm opacity-50 truncate max-w-[60px] text-center font-medium">
                        {isMyMessage ? "You" : selectedUser.fullName.split(" ")[0]}
                    </span>
                  </div>

                  {/* 2. BUBBLE (Time Inside) */}
                  <div 
                    className={`
                      relative px-4 py-2.5 shadow-sm rounded-2xl flex flex-col min-w-[100px]
                      ${isMyMessage 
                        ? "rounded-br-none text-[#374151]" 
                        : "bg-base-200 text-base-content rounded-bl-none"
                      }
                    `}
                    style={isMyMessage ? {
                      background: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)"
                    } : {}}
                  >
                    {/* Image */}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="w-full rounded-lg mb-2 border border-black/5"
                      />
                    )}
                    
                    {/* Text & Time Wrapper */}
                    <div className="flex flex-wrap items-end gap-3 align-bottom">
                      {message.text && (
                        <p className="text-sm sm:text-[15px] leading-relaxed break-words max-w-full">
                          {message.text}
                        </p>
                      )}
                      
                      {/* TIME STAMP (Inside Bubble, Bottom Right) */}
                      <span 
                        className={`text-[10px] ml-auto whitespace-nowrap ${
                          isMyMessage ? "text-black/40" : "text-base-content/40"
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </div>

                  </div>
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