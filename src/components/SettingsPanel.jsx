import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, LogOut, X } from "lucide-react";

const SettingsPanel = ({ onClose }) => {
	const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
	const [selectedImg, setSelectedImg] = useState(null);

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = async () => {
			const base64Image = reader.result;
			setSelectedImg(base64Image);
			await updateProfile({ profilePic: base64Image });
		};
	};

	return (
		<div
			className='
        absolute inset-0 bg-base-200/80 backdrop-blur-md
        flex flex-col animate-slide-up
      '
		>
			{/* Panel Header */}
			<div className='flex items-center justify-between p-4 border-b border-base-300'>
				<h2 className='text-xl font-bold'>Settings</h2>
				<button className='btn btn-ghost btn-circle' onClick={onClose}>
					<X />
				</button>
			</div>

			{/* Profile Section */}
			<div className='flex-1 p-4 space-y-6 overflow-y-auto'>
				<div className='flex flex-col items-center gap-4'>
					<div className='relative'>
						<img
							src={selectedImg || authUser.profilePic || "/avatar.png"}
							alt='Profile'
							className='size-24 rounded-full object-cover border-2 border-primary'
						/>
						<label
							htmlFor='avatar-upload-panel'
							className={`
                absolute bottom-0 right-0
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer
                transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
						>
							<Camera className='w-4 h-4 text-base-100' />
							<input
								type='file'
								id='avatar-upload-panel'
								className='hidden'
								accept='image/*'
								onChange={handleImageUpload}
								disabled={isUpdatingProfile}
							/>
						</label>
					</div>
					<p className='font-bold text-lg'>{authUser.fullName}</p>
					<p className='text-sm text-base-content/60'>{authUser.email}</p>
				</div>
			</div>

			{/* Panel Footer */}
			<div className='p-4 border-t border-base-300'>
				<button className='btn btn-error btn-block gap-2' onClick={logout}>
					<LogOut size={16} />
					Logout
				</button>
			</div>
		</div>
	);
};

export default SettingsPanel;