import { Info, MessageSquare, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = ({ setIsSidebarOpen, setIsDetailsPanelOpen }) => {
	const { selectedUser, setSelectedUser } = useChatStore();
	const { onlineUsers } = useAuthStore();

	return (
		<div className='p-2.5 border-b border-base-300 bg-base-100/80 backdrop-blur-lg flex-shrink-0'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					{/* Hamburger menu is always visible on mobile */}
					<button className='btn btn-circle md:hidden' onClick={() => setIsSidebarOpen(true)}>
						<MessageSquare />
					</button>

					{/* Conditionally render user info only if a user is selected */}
					{selectedUser && (
						<>
							<div className='avatar'>
								<div className='size-10 rounded-full relative'>
									<img
										src={selectedUser.profilePic || "/avatar.png"}
										alt={selectedUser.fullName}
									/>
								</div>
							</div>

							<div>
								<h3 className='font-medium'>{selectedUser.fullName}</h3>
								<p className='text-sm text-base-content/70'>
									{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
								</p>
							</div>
						</>
					)}
				</div>

				{/* Close chat button, only shown when a chat is active */}
				{selectedUser && (
					<div className='flex items-center'>
						{/* --- ADD THIS BUTTON --- */}
						<button
							className='btn btn-ghost btn-circle'
							onClick={() => setIsDetailsPanelOpen(true)}
						>
							<Info />
						</button>
						<button
							className='btn btn-ghost btn-circle'
							onClick={() => setSelectedUser(null)}
						>
							<X />
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
export default ChatHeader;