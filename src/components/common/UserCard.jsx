
import React from "react";
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  return (
    <Link to={`/profile/${user.username}`}>
        <div className="user-card flex items-center bg-gray-800 p-4 mb-4 hover:bg-gray-700">
          <img
            src={user.profilePicture || "/default-profile.jpg"}
            alt={user.username}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.fullName}</h2>
            <p className="text-sm text-gray-400 mb-2">@{user.username} ● {user.followers.length + " followers"}</p>
            <p className="text-sm text-gray-300">{user.email}</p>
          </div>
        </div>
    </Link>
  );
};

export default UserCard;
