import { motion } from "framer-motion";
import { useChatStore } from "../store/useChatStore";

const TypingIndicator = () => {
  const { selectedUser } = useChatStore();

  return (
    <motion.div
      className="chat chat-start mb-2"
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="chat-image avatar">
        <div className="size-10 rounded-full overflow-hidden">
          <img
            src={selectedUser?.profilePic || "/avatar.png"}
            alt="User Avatar"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="chat-bubble bg-base-200 p-4 flex items-center gap-1.5">
        {/* Dot 1 */}
        <motion.div
          className="w-2 h-2 bg-base-content/50 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0,
          }}
        />
        {/* Dot 2 */}
        <motion.div
          className="w-2 h-2 bg-base-content/50 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
        {/* Dot 3 */}
        <motion.div
          className="w-2 h-2 bg-base-content/50 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />
      </div>
    </motion.div>
  );
};

export default TypingIndicator;