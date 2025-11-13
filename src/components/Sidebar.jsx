import { useEffect, useState, useMemo } from "react";
import { LogOut, Search, Settings } from "lucide-react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import ThemeToggle from "./ThemeToggle";
import SettingsPanel from "./SettingsPanel";
// We will create SettingsPanel in the next step
// import SettingsPanel from "./SettingsPanel"; 

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
	const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
	const { authUser } = useAuthStore();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [filter, setFilter] = useState("all");

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
		if (filter === "favorites") {
			// Return only users whose ID is in the authUser.favorites array
			return users.filter((user) => authUser.favorites.includes(user._id));
		}
		// Otherwise, return all users
		return users;
	}, [filter, users, authUser.favorites]);

	return (
		<aside
			className={`
        fixed inset-y-0 left-0 z-50 w-[300px] bg-base-200/60 backdrop-blur-lg
        flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "transform-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}
		>
			{/* Sidebar Header */}
			<div className='flex items-center justify-between p-4 border-b border-base-300'>
				<h1 className='text-2xl font-bold'>Memo Chat</h1>
				<ThemeToggle />
			</div>

			{/* Search Bar */}
			<div className='p-4'>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search users'
						className='input input-bordered w-full pl-10'
					/>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/60' />
				</div>
			</div>
			{/* Filter Buttons */}
			<div className='px-4 pb-2'>
				<div className='join flex'>
					<button
						className={`join-item btn btn-sm flex-1 ${filter === "all" ? "btn-primary" : ""}`}
						onClick={() => setFilter("all")}
					>
						All
					</button>
					<button
						className={`join-item btn btn-sm flex-1 ${filter === "favorites" ? "btn-primary" : ""}`}
						onClick={() => setFilter("favorites")}
					>
						Favorites
					</button>
				</div>
			</div>

			{/* Contacts List */}
			<div className='flex-1 overflow-y-auto px-2'>
				{isUsersLoading && <SidebarSkeleton />}
				{!isUsersLoading &&
					filteredUsers.map((user) => ( // <-- CHANGED from 'users' to 'filteredUsers'
						<div
							key={user._id}
							onClick={() => handleSelectUser(user)}
							className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                hover:bg-base-300
                ${selectedUser?._id === user._id ? "bg-base-300" : ""}
              `}
						>
							<div className='avatar'>
								<div className='w-12 rounded-full'>
									<img src={user.profilePic || "/avatar.png"} alt={user.fullName} />
								</div>
							</div>
							<div>
								<p className='font-semibold'>{user.fullName}</p>
								<p className='text-sm text-base-content/60'>{user.bio || "Im using Memo chat"}</p>
							</div>
						</div>
					))}
			</div>

			{/* Sidebar Footer */}
			<div className='p-4 border-t border-base-300 flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div className='avatar'>
						<div className='w-10 rounded-full'>
							<img src={authUser.profilePic || "/avatar.png"} alt={authUser.fullName} />
						</div>
					</div>
					<div>
						<p className='font-semibold'>{authUser.fullName}</p>
						<p className='text-sm text-green-500'>Online</p>
					</div>
				</div>
				<button className='btn btn-ghost btn-circle' onClick={() => setIsSettingsOpen(true)}>
					<Settings />
				</button>
			</div>

			{/* We'll add the SettingsPanel component here in the next step */}
			{isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} />}
		</aside>
	);
};
export default Sidebar;