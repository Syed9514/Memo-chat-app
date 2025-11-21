import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ImageModal = ({ isOpen, onClose, imageSrc, onNext, onPrev, hasNext, hasPrev }) => {
  // Handle Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose} // Click outside to close
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn btn-circle btn-ghost text-white hover:bg-white/20 z-50"
        >
          <X size={24} />
        </button>

        {/* Previous Button */}
        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 btn btn-circle btn-ghost text-white hover:bg-white/20 z-50 hidden sm:flex"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* The Image */}
        <motion.img
          key={imageSrc} // Key change triggers animation
          src={imageSrc}
          alt="Full View"
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()} // Don't close when clicking image
        />

        {/* Next Button */}
        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 btn btn-circle btn-ghost text-white hover:bg-white/20 z-50 hidden sm:flex"
          >
            <ChevronRight size={32} />
          </button>
        )}
        
        {/* Mobile Caption / Hints (Optional) */}
        <div className="absolute bottom-4 text-white/50 text-sm sm:hidden">
            Swipe or tap sides (coming soon)
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;