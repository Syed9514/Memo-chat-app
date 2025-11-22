import { motion } from "framer-motion";

const BackgroundPattern = ({ variant = "default" }) => {
  // The specific gradient used in your buttons
  const ORB_GRADIENT = "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)";

  if (variant === "favorite") {
    return (
      <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
        {/* 1. Darker Overlay for contrast (Optional, good for dark mode) */}
        <div className="absolute inset-0 bg-base-100/10" />

        {/* 2. The Central Breathing Blob */}
        <motion.div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{ 
            background: ORB_GRADIENT,
            width: "40vw", // Responsive size
            height: "40vw",
            maxWidth: "500px",
            maxHeight: "500px"
          }}
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.2, 0.3, 0.2] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* 3. The Ripple Rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/10"
            initial={{ width: "0px", height: "0px", opacity: 0.5 }}
            animate={{ 
              width: ["0px", "800px"], 
              height: ["0px", "800px"], 
              opacity: [0.5, 0] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              delay: i * 3, // Staggered ripples
              ease: "linear" 
            }}
          />
        ))}
      </div>
    );
  }

  // Default Grid Pattern
  return (
    <div className="w-full h-full opacity-5">
      <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  );
};

export default BackgroundPattern;