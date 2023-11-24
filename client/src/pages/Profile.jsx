import { useState } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState({
    username: currentUser.username,
    email: currentUser.email,
    profileImage: currentUser.profileImage,
  });

  return (
    <section className="w-full min-h-screen flex flex-col items-center gap-5">
      <h1 className="text-2xl mt-10">Profile</h1>
      <form className="w-full max-w-[400px] flex flex-col items-center gap-3">
        <img
          src={userDetails.profileImage}
          alt="user image"
          className="rounded-full object-cover w-20 h-20 cursor-pointer"
        />
        <input
          type="text"
          value={userDetails.username}
          className="border w-full p-2 rounded-md outline-none focus:outline-cyan-400"
        />
        <input
          type="email"
          value={userDetails.email}
          className="border w-full p-2 rounded-md outline-none focus:outline-cyan-400"
        />
        <input
          type="password"
          className="border w-full p-2 rounded-md outline-none focus:outline-cyan-400"
        />
        <button
          onClick={() => {}}
          className="w-full bg-slate-500 p-2 rounded-md capitalize text-white
          hover:bg-slate-600"
        >
          update
        </button>
      </form>
      <div className="w-full max-w-[400px] flex items-center justify-between">
        <button
          onClick={() => {}}
          className="text-red-500 font-medium capitalize 
          hover:border-b-red-500 border-b-2 border-b-transparent"
        >
          delete account
        </button>
        <button
          onClick={() => {}}
          className="capitalize font-medium hover:bg-slate-400 hover:text-white p-1 rounded-md
          bg-transparent text-black"
        >
          sign out
        </button>
      </div>
    </section>
  );
};

export default Profile;
