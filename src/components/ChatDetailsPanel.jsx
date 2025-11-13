import { useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Star, X } from "lucide-react";

const ChatDetailsPanel = ({ onClose }) => {
	const { selectedUser, messages } = useChatStore();
	const { authUser, toggleFavorite } = useAuthStore();

	// Check if the selected user is in our favorites list
	const isFavorite = useMemo(() => {
		return authUser.favorites.includes(selectedUser?._id);
	}, [authUser.favorites, selectedUser]);

	// Filter messages to get only those with images
	const sharedMedia = useMemo(() => {
		return messages.filter((message) => message.image);
	}, [messages]);

	if (!selectedUser) return null;

	const handleToggleFavorite = () => {
		toggleFavorite(selectedUser._id);
	};

	return (
		<>
			{/* Overlay */}
			<div
				className='fixed inset-0 z-40 bg-black/50 md:hidden'
				onClick={onClose}
			/>
			{/* Panel */}
			<div
				className='
          fixed top-0 right-0 z-50 h-full w-full
          md:w-[350px] bg-base-200/80 backdrop-blur-lg
          flex flex-col animate-slide-in-right
        '
			>
				{/* Header */}
				<div className='flex items-center justify-between p-4 border-b border-base-300'>
					<h2 className='text-xl font-bold'>Details</h2>
					<button className='btn btn-ghost btn-circle' onClick={onClose}>
						<X />
					</button>
				</div>

				{/* Content */}
				<div className='flex-1 p-4 space-y-6 overflow-y-auto'>
					{/* User Info */}
					<div className='flex flex-col items-center gap-4'>
						<div className='avatar'>
							<div className='w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
								<img
									src={selectedUser.profilePic || "/avatar.png"}
									alt={selectedUser.fullName}
								/>
							</div>
						</div>
						{/* --- ADDED BUTTON AND NAME --- */}
						<div className='flex items-center gap-2'>
							<p className='font-bold text-lg'>{selectedUser.fullName}</p>
							<button className='btn btn-ghost btn-circle btn-sm' onClick={handleToggleFavorite}>
								<Star
									className={`transition-all ${
										isFavorite ? "fill-yellow-400 text-yellow-400" : "text-base-content/60"
									}`}
								/>
							</button>
						</div>
						

						{/* --- Bio Section Updated --- */}
						{selectedUser.bio && (
							<p className='text-sm text-center text-base-content/70'>
								{selectedUser.bio}
							</p>
						)}
					</div>

					{/* Shared Media */}
					<div>
						<h3 className='font-semibold mb-2'>Shared Media</h3>
						{sharedMedia.length > 0 ? (
							<div className='grid grid-cols-3 gap-2'>
								{sharedMedia.map((message) => (
									<a
										key={message._id}
										href={message.image}
										target='_blank'
										rel='noopener noreferrer'
									>
										<img
											src={message.image}
											alt='Shared media'
											className='aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity'
										/>
									</a>
								))}
							</div>
						) : (
							<p className='text-sm text-base-content/60 text-center py-4'>
								No media shared yet.
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ChatDetailsPanel;