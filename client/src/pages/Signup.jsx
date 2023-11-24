import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOff, Loader2 } from "lucide-react";
import OAuth from "../components/OAuth";

const Signup = () => {
  const initialData = {
    username: "",
    email: "",
    password: "",
  };
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(initialData);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      navigate("/sign-in");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-col items-center bg-slate-200">
      <h2 className="pt-10 text-2xl font-medium mb-5">Sign Up</h2>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-full max-w-[320px] md:max-w-[400px]
        flex flex-col gap-3 p-2 rounded-md"
      >
        <div className="flex flex-col w-full">
          <label>Username</label>
          <input
            type="text"
            value={userDetails.username}
            onChange={(e) =>
              setUserDetails({ ...userDetails, username: e.target.value })
            }
            className="p-2 rounded-md border-2
            outline-none "
          />
        </div>
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
            disabled={loading}
            className="bg-slate-500 p-2 uppercase text-white disabled:opacity-50
            rounded-md font-medium hover:scale-105 shadow-sm shadow-black
            transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                processing <Loader2 className="animate-spin" />
              </div>
            ) : (
              "sign up"
            )}
          </button>
          <OAuth />
        </div>
        <p className="mt-5">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-cyan-500 font-medium">
            Sign In
          </Link>
        </p>
      </form>
      <div className="text-red-500 text-center mt-5 p-3">{error}</div>
    </section>
  );
};

export default Signup;
