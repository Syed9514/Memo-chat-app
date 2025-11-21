import { useEffect, useState, useMemo } from "react";
import { Search, Settings } from "lucide-react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import ThemeToggle from "./ThemeToggle";
import SettingsPanel from "./SettingsPanel";
import MemoLogo from "./MemoLogo";
import Avatar from "./Avatar";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
	const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, unreadMessages } = useChatStore();
	const { authUser, onlineUsers } = useAuthStore();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [filter, setFilter] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		getUsers();
	}, [getUsers]);

	const handleSelectUser = (user) => {
		setSelectedUser(user);
		// Close sidebar on mobile after selecting a user
		if (window.innerWidth < 768) {
			setIsSidebarOpen(false);
		}
	};

	const filteredUsers = useMemo(() => {
		let usersToShow = users;

		// First, filter by "All" or "Favorites"
		if (filter === "favorites") {
			usersToShow = users.filter((user) => authUser.favorites.includes(user._id));
		}

		// Then, filter by the search term
		if (searchTerm.trim() !== "") {
			usersToShow = usersToShow.filter((user) =>
				user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		return usersToShow;
	}, [filter, users, authUser.favorites, searchTerm]);

	return (
		<aside
			className={`
        fixed inset-y-0 left-0 z-50 w-[300px] bg-base-100/80 backdrop-blur-xl border-r border-base-300
        flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}
		>
			{/* --- 1. HEADER --- */}
			<div className='flex items-center justify-between p-5'>
				<MemoLogo />
				<ThemeToggle />
			</div>

			{/* --- 2. SEARCH BAR --- */}
			<div className='px-5 pb-4'>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search users...'
						className='input w-full pl-10 bg-base-200 border-none focus:ring-2 focus:ring-primary/20 focus:bg-base-200/50 rounded-2xl transition-all placeholder:text-base-content/40'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40' />
				</div>
			</div>

			{/* --- 3. FILTER BUTTONS --- */}
			<div className='px-5 pb-2'>
				<div className='flex items-center gap-2'>
					<button
						className={`
              flex-1 btn btn-sm rounded-full normal-case border-none transition-all duration-300
              ${filter === "all" 
                ? "bg-primary text-primary-content shadow-lg shadow-primary/25 hover:bg-primary" 
                : "bg-base-200 text-base-content/60 hover:bg-base-300"}
            `}
						onClick={() => setFilter("all")}
					>
						All
					</button>
					<button
						className={`
              flex-1 btn btn-sm rounded-full normal-case border-none transition-all duration-300
              ${filter === "favorites" 
                ? "bg-primary text-primary-content shadow-lg shadow-primary/25 hover:bg-primary" 
                : "bg-base-200 text-base-content/60 hover:bg-base-300"}
            `}
						onClick={() => setFilter("favorites")}
					>
						Favorites
					</button>
				</div>
			</div>

			{/* --- 4. CONTACT LIST --- */}
			<div className='flex-1 overflow-y-auto px-3 py-2 space-y-1'>
				{isUsersLoading && <SidebarSkeleton />}
				
				{!isUsersLoading && filteredUsers.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full text-base-content/40 pb-10">
						<p className="text-sm">No users found</p>
					</div>
				)}

				{!isUsersLoading &&
					filteredUsers.map((user) => {
						const unreadCount = unreadMessages[user._id] || 0;
						const isOnline = onlineUsers.includes(user._id);

						return (
							<div
								key={user._id}
								onClick={() => handleSelectUser(user)}
								className={`
                  w-full p-3 flex items-center gap-3 rounded-2xl cursor-pointer transition-all duration-200 group
                  ${selectedUser?._id === user._id 
                    ? "bg-primary/10 ring-1 ring-primary/20" 
                    : "hover:bg-base-200/50"}
                `}
							>
								<div className="relative">
									<Avatar user={user} size="size-12" />
									{isOnline && (
										<span className="absolute bottom-0 right-0 size-3.5 border-2 border-base-100 rounded-full bg-green-500"></span>
									)}
								</div>

								<div className='min-w-0 flex-1'>
									<div className="flex justify-between items-baseline mb-0.5">
										<p className={`font-semibold truncate transition-colors ${selectedUser?._id === user._id ? "text-primary" : "text-base-content"}`}>
											{user.fullName}
										</p>
										{unreadCount > 0 && (
											<span className="badge badge-sm badge-primary h-5 min-w-5 px-1.5">{unreadCount}</span>
										)}
									</div>
									<p className='text-sm text-base-content/50 truncate group-hover:text-base-content/70 transition-colors'>
										{isOnline ? "Online" : (user.bio || "Hey there! I'm using Memo.")}
									</p>
								</div>
							</div>
						);
					})}
			</div>

			{/* --- 5. FOOTER (Updated to match List Item Size) --- */}
			{/* Changed p-4 to px-3 py-3 to align width with list items */}
			<div className='px-3 py-3 mt-auto'> 
				<div className='p-3 rounded-2xl bg-base-200/50 border border-base-300/50 flex items-center gap-3 transition-all hover:bg-base-200/80 group cursor-pointer' onClick={() => setIsSettingsOpen(true)}>
					
					{/* Avatar matches list size (size-12) */}
					<div className="relative transition-transform duration-300 group-hover:scale-105">
						<Avatar user={authUser} size="size-12" />
						<span className="absolute bottom-0 right-0 size-3.5 border-2 border-base-100 rounded-full bg-green-500 animate-pulse"></span>
					</div>

					<div className="min-w-0 flex-1">
						{/* Font size increased to match contact list (font-semibold) */}
						<p className='font-semibold truncate text-base-content'>{authUser.fullName}</p>
						<p className='text-sm text-base-content/50 flex items-center gap-1'>
							Online
						</p>
					</div>

					{/* Settings button acts as the 'end' action */}
					<button 
						className='btn btn-ghost btn-sm btn-circle text-base-content/60 group-hover:text-primary group-hover:bg-primary/10 transition-colors' 
					>
						<Settings className="size-5" />
					</button>
				</div>
			</div>

			{isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} />}
		</aside>
	);
};
export default Sidebar;