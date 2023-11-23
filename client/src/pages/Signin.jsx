import { useState } from "react";
import { Link } from "react-router-dom";
import { EyeIcon, EyeOff } from "lucide-react";

const Signin = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  return (
    <section
      className="w-full min-h-screen flex flex-col items-center
    bg-slate-200"
    >
      <h2 className="pt-10 text-2xl font-medium mb-5">Sign In</h2>
      <form
        action=""
        className="w-full max-w-[320px] md:max-w-[400px]
        flex flex-col gap-3 p-2 rounded-md"
      >
        <div className="flex flex-col w-full">
          <label>Email</label>
          <input
            type="email"
            value={userDetails.email}
            onChange={(e) =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
            className="p-2 rounded-md border-2 outline-none"
          />
        </div>
        <div className="flex flex-col w-full relative">
          <label>Password</label>
          <input
            type={isVisible ? "text" : "password"}
            value={userDetails.password}
            onChange={(e) =>
              setUserDetails({ ...userDetails, password: e.target.value })
            }
            className="p-2 rounded-md border-2 outline-none"
          />
          <div className="absolute right-3 bottom-3 cursor-pointer">
            {isVisible ? (
              <EyeIcon onClick={() => setIsVisible(false)} size={20} />
            ) : (
              <EyeOff onClick={() => setIsVisible(true)} size={20} />
            )}
          </div>
        </div>
        <div className="flex flex-col w-full gap-3">
          <button
            className="bg-slate-500 p-2 uppercase text-white disabled:opacity-50
            rounded-md font-medium hover:scale-105 shadow-sm shadow-black
            transition-all duration-300"
          >
            sign in
          </button>
          <button
            className="border-2 p-2 uppercase rounded-md hover:bg-cyan-500
            hover:text-slate-800 transition-all duration-300"
          >
            continue with google
          </button>
        </div>
        <p className="mt-5">
          Still don't have an account?{" "}
          <Link to="/sign-up" className="text-cyan-500 font-medium">
            Sign Up
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Signin;
