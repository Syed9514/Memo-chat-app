import { motion } from "framer-motion";
import { useMemo } from "react";

const Particle = ({ state }) => {
	// Use useMemo to generate a unique set of random values for EACH particle
	// that won't change on re-renders. This is what fixes the "one particle" bug.
	const { radius, initialRotation, duration, size } = useMemo(() => {
		return {
			radius: 80 + Math.random() * 40, // 80px to 120px orbit
			initialRotation: Math.random() * 360, // Random start position
			duration: 10 + Math.random() * 10, // 10s to 20s spin
			size: Math.random() * 4 + 4, // 4px to 8px size
		};
	}, []);

	// Determine animation properties based on state
	const getAnimationProps = () => {
		switch (state) {
			case "interacting":
				// Spin faster
				return { rotate: initialRotation + 360, transition: { duration: duration / 3, repeat: Infinity, ease: "linear" } };
			case "finale":
				// Spin very fast and fade out
				return { scale: 0, opacity: 0, transition: { duration: 1.5, ease: "easeIn" } };
			case "idle":
			default:
				// Normal spin
				return { rotate: initialRotation + 360, transition: { duration: duration, repeat: Infinity, ease: "linear" } };
		}
	};

	return (
		<motion.div
			className='absolute w-full h-full'
			animate={getAnimationProps()}
			initial={{ rotate: initialRotation }}
		>
			<div
				className='absolute rounded-full border border-gray-400' // Added grey border
				style={{
					// Apply random size
					width: `${size}px`,
					height: `${size}px`,
					top: "50%",
					left: "50%",
					// Apply random orbit
					transform: `translateY(-50%) translateX(${radius}px)`,
					// Apply new gradient
					backgroundImage: "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)",
					// Add a white glow
					boxShadow: "0 0 8px 1px rgba(255, 255, 255, 0.7)",
				}}
			/>
		</motion.div>
	);
};

export default Particle;