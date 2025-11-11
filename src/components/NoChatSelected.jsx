import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Ripple from "./Ripple";
import MessageTag from "./MessageTag";
import Particle from "./Particle";

// Your default messages
const DEFAULT_MESSAGES = [
	"Welcome to Memo chat",
	"hello user",
	"do you like this app",
	"i know there are less features",
	"but soon new updates will come",
	"Done by SYED , made with love ",
];

// Create a static array for the particles
const particleArray = Array.from({ length: 15 }, (_, i) => ({ id: i }));

const NoChatSelected = () => {
	// State for the main system
	const [isVisible, setIsVisible] = useState(true);
	const [animationState, setAnimationState] = useState("idle"); // 'idle', 'interacting', 'finale'
	const [messageIndex, setMessageIndex] = useState(0);

	// State for spawned components
	const [ripples, setRipples] = useState([]);
	const [currentMessage, setCurrentMessage] = useState(null);

	const handleOrbClick = () => {
		// Don't allow clicks if busy
		if (animationState === "interacting" || animationState === "finale" || !isVisible) return;

		// 1. Set to "interacting"
		setAnimationState("interacting");

		// 2. Spawn a Ripple
		const rippleId = Date.now();
		setRipples((prev) => [...prev, rippleId]);

		// 3. Get the next message
		const messageText = DEFAULT_MESSAGES[messageIndex];

		if (messageText) {
			// Show the message
			setCurrentMessage({ id: rippleId, text: messageText });
		} else {
			// No more messages, run the finale
			runFinale();
		}
	};

	const handleMessageRead = () => {
		setCurrentMessage(null);
		setMessageIndex((prev) => prev + 1); // Move to next message
		setAnimationState("idle"); // Return to idle state
	};

	const runFinale = () => {
		setAnimationState("finale");

		// 1.5s for finale animation
		setTimeout(() => {
			setIsVisible(false); // Disappear

			// 10s wait
			setTimeout(() => {
				// Reset everything
				setIsVisible(true);
				setAnimationState("idle");
				setMessageIndex(0);
			}, 10000);
		}, 1500);
	};

	const orbClassName = useMemo(() => {
		switch (animationState) {
			case "finale":
				return "animate-finale-spin-out bg-base-100 shadow-[0_0_50px_20px_hsl(var(--bc))]"; // Bright white/black glow
			case "interacting":
				return "shadow-[0_0_40px_15px_hsl(var(--p)/0.7)] scale-105"; // Brighter glow
			case "idle":
			default:
				return "animate-pulse-glow";
		}
	}, [animationState]);

	return (
		<div className='flex-1 flex items-center justify-center p-16 relative overflow-hidden bg-base-100'>
			<AnimatePresence>
				{isVisible && (
					<motion.div
						className='relative w-40 h-40 flex items-center justify-center'
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
						transition={{ duration: 0.5 }}
					>
						{/* 1. The Particles */}
						{particleArray.map((p) => (
							<Particle key={p.id} state={animationState} />
						))}

						{/* 2. The Orb */}
						<motion.button
							className={`w-28 h-28 rounded-full transition-all duration-300 ${orbClassName}`}
							onClick={handleOrbClick}
							whileTap={animationState === "idle" ? { scale: 0.9 } : {}}
              style={{
								backgroundImage: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
              }}
            />

						{/* 3. The Ripples */}
						{ripples.map((id) => (
							<Ripple
								key={id}
								onComplete={() => setRipples((prev) => prev.filter((r) => r !== id))}
							/>
						))}

						{/* 4. The Message Tag */}
						<AnimatePresence>
							{currentMessage && (
								<MessageTag message={currentMessage.text} onRead={handleMessageRead} />
							)}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default NoChatSelected;