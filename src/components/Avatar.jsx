import React from 'react';

const Avatar = ({ user, size = "size-10" }) => {
  // If user has an image, show it
  if (user?.profilePic) {
    return (
      <div className={`${size} rounded-full overflow-hidden`}>
        <img 
          src={user.profilePic} 
          alt={user.fullName} 
          className="w-full h-full object-cover" 
        />
      </div>
    );
  }

  // If no image, show Gradient Initials
  // We use 'from-primary to-secondary' so it matches your active theme colors automatically
  return (
    <div className={`${size} rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-tr from-primary to-secondary`}>
      {user?.fullName?.charAt(0).toUpperCase() || "?"}
    </div>
  );
};

export default Avatar;