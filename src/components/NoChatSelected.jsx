import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Image as ImageIcon, Shield, Zap } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

// A tiny reusable "Typing..." bubble component
const TypingBubble = () => (
  <div className="flex gap-1 p-2 bg-base-200 rounded-2xl rounded-tl-none items-center w-fit">
    <motion.div 
      className="size-1.5 bg-base-content/40 rounded-full" 
      animate={{ y: [0, -3, 0] }} 
      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} 
    />
    <motion.div 
      className="size-1.5 bg-base-content/40 rounded-full" 
      animate={{ y: [0, -3, 0] }} 
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} 
    />
    <motion.div 
      className="size-1.5 bg-base-content/40 rounded-full" 
      animate={{ y: [0, -3, 0] }} 
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} 
    />
  </div>
);

// A reusable message bubble
const MessageBubble = ({ text, isUser = false }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    className={`max-w-[80%] p-2.5 rounded-2xl text-sm ${
      isUser 
        ? "bg-primary text-primary-content rounded-tr-none ml-auto" 
        : "bg-base-200 text-base-content rounded-tl-none"
    }`}
  >
    {text}
  </motion.div>
);

const NoChatSelected = () => {
  const { authUser } = useAuthStore();
  
  // Sequence State: 0=Blob, 1=Window, 2=Typing1, 3=Msg1, 4=Typing2, 5=Msg2, 6=UserTyping
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setStep(1), 800),   // Morph to Window
      setTimeout(() => setStep(2), 1600),  // App Starts Typing
      setTimeout(() => setStep(3), 2800),  // Show "Welcome"
      setTimeout(() => setStep(4), 3500),  // App Starts Typing again
      setTimeout(() => setStep(5), 4800),  // Show "Hello User"
      setTimeout(() => setStep(6), 5500),  // User Starts Typing (End state)
    ];

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-base-100/50 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* MAIN ANIMATION CONTAINER */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        
        {/* 1. Morphing Window */}
        <motion.div
          layout
          className="relative bg-base-100 border border-base-300 shadow-2xl overflow-hidden flex flex-col"
          initial={{ width: 64, height: 64, borderRadius: "50%" }}
          animate={{
            width: step === 0 ? 64 : 320,
            height: step === 0 ? 64 : 420,
            borderRadius: step === 0 ? "50%" : "16px",
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* 1a. Initial Blob Icon (Only visible at step 0) */}
          <AnimatePresence>
            {step === 0 && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-primary text-primary-content"
                exit={{ opacity: 0 }}
              >
                <MessageSquare className="size-8 fill-current animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1b. The Chat Interface (Visible after step 0) */}
          {step > 0 && (
            <motion.div 
              className="flex-1 flex flex-col w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Mock Header */}
              <div className="h-12 border-b border-base-200 flex items-center px-4 gap-2 bg-base-100">
                <div className="size-3 rounded-full bg-red-400" />
                <div className="size-3 rounded-full bg-yellow-400" />
                <div className="size-3 rounded-full bg-green-400" />
              </div>

              {/* Mock Chat Area */}
              <div className="flex-1 p-4 space-y-4 overflow-hidden bg-base-100/50 relative">
                
                {/* Message 1 Sequence */}
                <div className="flex gap-3">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="size-4 text-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    {step === 2 && <TypingBubble />}
                    {step >= 3 && <MessageBubble text="Welcome to Memo Chat! 👋" />}
                    
                    {step === 4 && <TypingBubble />}
                    {step >= 5 && <MessageBubble text={`Hello ${authUser?.fullName || "friend"}, ready to chat?`} />}
                  </div>
                </div>

                {/* User Reply Sequence (Right Side) */}
                {step >= 6 && (
                  <div className="flex gap-3 justify-end mt-4">
                    <div className="flex flex-col gap-2 items-end">
                      <div className="bg-primary/10 p-2 rounded-2xl rounded-tr-none">
                         {/* User Typing Indicator */}
                         <div className="flex gap-1">
                            <motion.div className="size-1.5 bg-primary/50 rounded-full" animate={{ y: [0,-3,0] }} transition={{ duration:0.6, repeat:Infinity }} />
                            <motion.div className="size-1.5 bg-primary/50 rounded-full" animate={{ y: [0,-3,0] }} transition={{ duration:0.6, repeat:Infinity, delay:0.2 }} />
                            <motion.div className="size-1.5 bg-primary/50 rounded-full" animate={{ y: [0,-3,0] }} transition={{ duration:0.6, repeat:Infinity, delay:0.4 }} />
                         </div>
                      </div>
                    </div>
                    <div className="size-8 rounded-full bg-base-300 border flex-shrink-0 overflow-hidden">
                        <img src={authUser?.profilePic || "/avatar.png"} className="w-full h-full object-cover opacity-80" alt="Me" />
                    </div>
                  </div>
                )}
              </div>

              {/* Mock Input Area */}
              <div className="p-3 border-t border-base-200 bg-base-100">
                <div className="h-8 bg-base-200 rounded-full w-full opacity-50 animate-pulse" />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* 2. Features Pills (Fade in at the end) */}
        {step >= 6 && (
          <motion.div 
            className="flex gap-4 flex-wrap justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="badge badge-lg gap-2 p-4 bg-base-200/50 text-base-content/70 border-base-300 shadow-sm">
              <Zap className="size-3.5" /> Instant Messaging
            </div>
            <div className="badge badge-lg gap-2 p-4 bg-base-200/50 text-base-content/70 border-base-300 shadow-sm">
              <ImageIcon className="size-3.5" /> Image Sharing
            </div>
            <div className="badge badge-lg gap-2 p-4 bg-base-200/50 text-base-content/70 border-base-300 shadow-sm">
              <Shield className="size-3.5" /> Secure & Private
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NoChatSelected;