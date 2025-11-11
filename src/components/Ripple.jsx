import { motion } from "framer-motion";

const Ripple = ({ onComplete }) => {
	return (
		<motion.div
			className='absolute border-2 border-primary rounded-full'
			style={{ width: 50, height: 50 }}
			initial={{ scale: 0, opacity: 1 }}
			animate={{ scale: 40, opacity: 0 }}
			transition={{ duration: 1, ease: "easeOut" }}
			onAnimationComplete={onComplete}
		/>
	);
};

export default Ripple;