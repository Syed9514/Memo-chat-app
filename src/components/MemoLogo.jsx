import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react"; // Or your own logo import

const MemoLogo = () => {
  // States: 'title' | 'icon' | 'combined'
  const [displayMode, setDisplayMode] = useState("title");

  useEffect(() => {
    // After 4 seconds, automatically morph into the full logo + text
    const timer = setTimeout(() => {
      setDisplayMode("combined");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    // If we are already in the final 'combined' state, do nothing (or toggle back if you prefer)
    if (displayMode === "combined") return;

    // Otherwise, toggle between Title and Icon
    setDisplayMode((prev) => (prev === "title" ? "icon" : "title"));
  };

  return (
    <div
      onClick={handleToggle}
      className={`
        relative flex items-center justify-center cursor-pointer
        border border-primary/20 
        rounded-full 
        transition-all duration-700 ease-in-out
        hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] 
        bg-base-100/50 backdrop-blur-sm
        ${
          displayMode === "combined"
            ? "px-5 py-2 gap-3 border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            : "px-3 py-2 gap-0 shadow-[0_0_10px_rgba(59,130,246,0.1)]" // Tighter padding for single items
        }
      `}
    >
      {/* --- LOGO SECTION --- */}
      {/* Visible in 'icon' and 'combined' modes */}
      <div
        className={`
          flex items-center justify-center
          transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${
            displayMode === "title"
              ? "w-0 opacity-0 -translate-x-4 overflow-hidden" // Hidden
              : "w-8 opacity-100 translate-x-0" // Visible
          }
        `}
      >
        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <MessageSquare className="w-5 h-5" />
        </div>
      </div>

      {/* --- TITLE SECTION --- */}
      {/* Visible in 'title' and 'combined' modes */}
      <div
        className={`
          overflow-hidden whitespace-nowrap
          transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${
            displayMode === "icon"
              ? "w-0 opacity-0 translate-x-4" // Hidden
              : "w-auto opacity-100 translate-x-0" // Visible
          }
        `}
      >
        <span className={`font-bold text-xl text-primary block ${displayMode === 'combined' && "pl-0"}`}>
          Memo Chat
        </span>
      </div>
    </div>
  );
};

export default MemoLogo;