import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particle from "./Particle";
import { useAuthStore } from "../store/useAuthStore"; // Import the auth store

// Your default messages
const DEFAULT_MESSAGES = [
	"Welcome to Memo chat",
	"hello user", // This will be replaced by the authUser name
	"do you like this app",
	"i know there are less features",
	"but soon new updates will come",
	"Done by SYED , made with love ",
];

// Create a static array for the particles
const particleArray = Array.from({ length: 15 }, (_, i) => ({ id: i }));

const NoChatSelected = () => {
	// Get the authenticated user
	const { authUser } = useAuthStore();

	// State for the main system
	const [isVisible, setIsVisible] = useState(true);
	const [animationState, setAnimationState] = useState("idle"); // 'idle', 'interacting', 'finale'
	const [messageIndex, setMessageIndex] = useState(0);

	// Dynamically replace "hello user" with the actual username
	const messages = useMemo(() => {
		return DEFAULT_MESSAGES.map((msg) =>
			msg === "hello user" ? `Hello, ${authUser.fullName}` : msg
		);
	}, [authUser.fullName]);

	const handleOrbClick = () => {
		// Don't allow clicks if busy
		if (animationState === "interacting" || animationState === "finale" || !isVisible) return;

		// 1. Set to "interacting" to make particles speed up
		setAnimationState("interacting");

		// 2. Check if we are at the end of the message list
		if (messageIndex < messages.length - 1) {
			// Not at the end: just show the next message
			setMessageIndex((prev) => prev + 1);
			// Reset to idle after a short "pop"
			setTimeout(() => setAnimationState("idle"), 300);
		} else {
			// At the end: run the finale
			runFinale();
		}
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
				return "animate-finale-spin-out bg-base-100 shadow-[0_0_50px_20px_hsl(var(--bc))]";
			case "interacting":
				return "shadow-[0_0_40px_15px_hsl(var(--p)/0.7)] scale-105";
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
						className='flex flex-col items-center gap-12' // Main container for all 3 elements
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
						transition={{ duration: 0.5 }}
					>
						{/* 1. The Title */}
						<h2 className='text-2xl font-bold text-base-content text-center'>
							{messages[messageIndex] === `Hello, ${authUser.fullName}`
								? messages[messageIndex]
								: `Hello, ${authUser.fullName}`}
						</h2>

						{/* 2. The Orb Container */}
						<div className='relative w-40 h-40 flex items-center justify-center'>
							{/* Particles */}
							{particleArray.map((p) => (
								<Particle key={p.id} state={animationState} />
							))}

							{/* The Orb */}
							<motion.button
								className={`w-28 h-28 rounded-full transition-all duration-300 ${orbClassName}`}
								onClick={handleOrbClick}
								whileTap={animationState === "idle" ? { scale: 0.9 } : {}}
								style={{
									backgroundImage: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
								}}
							/>
						</div>

						{/* 3. The Message Area */}
						<motion.p
							key={messageIndex} // This makes Framer Motion re-run the animation
							className='text-base-content/70 text-lg text-center h-12'
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							{messages[messageIndex]}
						</motion.p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default NoChatSelected;