import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import ChatHeader from "../components/ChatHeader";

const HomePage = () => {
	const { selectedUser } = useChatStore();
	// Initialize sidebar state based on screen width
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Handle window resize to show/hide sidebar appropriately
	// useEffect(() => {
	// 	const handleResize = () => {
	// 		if (window.innerWidth >= 768) {
	// 			setIsSidebarOpen(true);
	// 		} else {
	// 			setIsSidebarOpen(false);
	// 		}
	// 	};
	// 	window.addEventListener("resize", handleResize);
	// 	return () => window.removeEventListener("resize", handleResize);
	// }, []);

	return (
		<div className='flex h-screen overflow-hidden'>
			{/* Overlay for mobile view to close the sidebar */}
			{isSidebarOpen && (
				<div
					className='fixed inset-0 z-40 bg-black/50 md:hidden'
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			<Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

			<main className='flex-1 flex flex-col'>
				{/* The ChatHeader is now part of the main layout, ensuring the toggle is always visible */}
				<ChatHeader setIsSidebarOpen={setIsSidebarOpen} />

				{/* Conditionally render the chat container or the placeholder */}
				{!selectedUser ? <NoChatSelected /> : <ChatContainer />}
			</main>
		</div>
	);
};
export default HomePage;