import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Save, Edit3, Camera, LogOut, X } from "lucide-react";
import toast from "react-hot-toast";

const SettingsPanel = ({ onClose }) => {
	const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
	const [bio, setBio] = useState(authUser.bio || "");
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

	const handleSaveBio = async () => {
		if (bio === authUser.bio) return; // No changes
		if (bio.length > 150) {
			toast.error("Bio must be 150 characters or less");
			return;
		}
		await updateProfile({ bio: bio });
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

				<div className='form-control relative'>
					<label className='label'>
						<span className='label-text flex items-center gap-2'>
							<Edit3 size={14} />
							Your Bio (max 150)
						</span>
						<span className='label-text-alt'>{bio.length}/150</span>
					</label>
					<textarea
						className='textarea textarea-bordered h-24'
						placeholder='Tell everyone a little about yourself...'
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						maxLength={150}
					></textarea>
					<button
						className='btn btn-primary btn-circle btn-sm absolute bottom-3 right-3'
						onClick={handleSaveBio}
						disabled={isUpdatingProfile}
					>
						{isUpdatingProfile ? (
							<span className='loading loading-spinner loading-xs' />
						) : (
							<Save size={16} />
						)}
					</button>
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