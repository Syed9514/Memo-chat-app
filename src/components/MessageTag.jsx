import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MessageTag = ({ message, onRead }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onRead();
		}, 5000); // 5-second timer

		return () => clearTimeout(timer);
	}, [onRead]);

	return (
		<AnimatePresence>
			<motion.div
				className='absolute -top-24 bg-base-100 text-base-content border border-primary py-2 px-5 rounded-lg shadow-lg'
				initial={{ opacity: 0, y: 10, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
				transition={{ type: "spring", stiffness: 300, damping: 20 }}
			>
				{message}
			</motion.div>
		</AnimatePresence>
	);
};

export default MessageTag;