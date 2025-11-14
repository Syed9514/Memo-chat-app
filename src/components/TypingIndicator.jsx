import { motion } from "framer-motion";
import { useChatStore } from "../store/useChatStore";

const TypingIndicator = () => {
	const { selectedUser } = useChatStore();

	// SVG arc properties
	const radius = 22;
	const circumference = 2 * Math.PI * radius;

	return (
		<motion.div
			className='chat chat-start'
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			transition={{ duration: 0.3 }}
		>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full relative'>
					<img
						src={selectedUser?.profilePic || "/avatar.png"}
						alt='Typing user'
						className='rounded-full'
					/>
					{/* Animated border */}
					<svg className='absolute -top-1 -left-1 w-12 h-12' viewBox='0 0 50 50'>
						{/* Background track */}
						<circle
							cx='25'
							cy='25'
							r={radius}
							fill='transparent'
							stroke='hsl(var(--b2))' // base-200
							strokeWidth='3'
						/>
						{/* Animated progress circle */}
						<motion.circle
							cx='25'
							cy='25'
							r={radius}
							fill='transparent'
							stroke='hsl(var(--p))' // primary color
							strokeWidth='3'
							strokeLinecap='round'
							strokeDasharray={circumference}
							strokeDashoffset={circumference}
							animate={{ strokeDashoffset: [circumference, 0, circumference] }}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								ease: "linear",
							}}
							transform='rotate(-90 25 25)' // Start from the top
						/>
					</svg>
				</div>
			</div>
			<div className='chat-bubble'>...</div>
		</motion.div>
	);
};

export default TypingIndicator;