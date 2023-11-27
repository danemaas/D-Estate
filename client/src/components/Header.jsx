import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";

const Header = () => {
  const [searchInput, setSearchInput] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);

    urlParams.set("searchTerm", searchInput);
    const searchQuery = urlParams.toString();
    setSearchInput("");
    navigate(`/search?${searchQuery}`);
  };

  return (
    <header className="w-full bg-slate-500">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center py-3 px-2">
        <Link to="/" className="flex items-center gap-1">
          <img
            src="/logo.svg"
            alt="house icon"
            className="w-6 md:w-8 h-6 md:h-8"
          />
          <h1 className="font-bold text-sm md:text-xl">
            <span className="text-cyan-400">D'</span>
            <span className="text-slate-100">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="border-2 flex items-center gap-1 py-1 px-2 rounded-md bg-white
        w-[280px] lg:w-[500px] group"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="outline-none border-none bg-transparent ps-1 w-full text-sm md:text-base"
          />
          <button onClick={(e) => {}} className="cursor-pointer">
            <Search className="group-hover:text-cyan-400" />
          </button>
        </form>
        <nav className="font-bold text-slate-100">
          <ul className="flex items-center gap-5">
            <li className="hidden md:block relative group">
              <Link to="/">Home</Link>
              <div
                className="absolute -bottom-[2px] w-0 h-[2px] bg-cyan-400 group-hover:w-full
              transition-all duration-300 origin-center"
              />
            </li>
            <li className="hidden md:block relative group">
              <Link to="/about">About</Link>
              <div
                className="absolute -bottom-[2px] w-0 h-[2px] bg-cyan-400 group-hover:w-full
              transition-all duration-300 origin-center"
              />
            </li>
            <li className="text-sm md:text-base relative group">
              {currentUser ? (
                <>
                  <Link to="/profile">
                    <img
                      src={currentUser.profileImage}
                      alt="profile"
                      className="rounded-full w-8 h-8 object-cover"
                    />
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/sign-in">Sign In</Link>
                  <div
                    className="absolute -bottom-[2px] w-0 h-[2px] bg-cyan-400 group-hover:w-full
              transition-all duration-300 origin-center"
                  />
                </>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
