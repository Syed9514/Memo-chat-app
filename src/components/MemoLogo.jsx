import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const MemoLogo = () => {
  const title = "Memo Chat";

  return (
    <div className="flex items-center gap-2 select-none">
      {/* 1. Static Icon (Brand Mark) */}
      <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        <MessageSquare className="size-5 font-bold" />
      </div>

      {/* 2. Animated Text */}
      <h1 className="text-lg font-bold tracking-tight flex text-base-content/90">
        {title.split("").map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1, // Staggered delay for "typing" effect
              type: "spring",     // Adds a tiny bit of bounce
              stiffness: 200
            }}
          >
            {/* Handle spaces correctly in flex containers */}
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </h1>
    </div>
  );
};

export default MemoLogo;