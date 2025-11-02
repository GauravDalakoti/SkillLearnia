import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets.js";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authentication.js";
import { Link, useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/checkTokenExpires.js";
import toast from "react-hot-toast";

const Header = () => {
  const suggestionsList = [
    "frontend development", "node js", "data science", "python programming",
    "java programming", "mongodb", "react native", "machine learning",
    "full stack web developer", "cloud computing","cyber security","react native","ui/ux design fundamental"
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false)

  const { userData } = useSelector((state) => state.auth);
  const userToken = localStorage.getItem("userToken");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userToken == null) navigate("/");
    else if (isTokenExpired(userToken)) navigate("/refresh-token");
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const filtered = suggestionsList.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  const submitSearch = async () => {
    if (searchQuery === "") return toast.error("Try entering a keyword to search.");
    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/course/search-course`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchQuery }),
        }
      );
      if (response.ok) {
        setLoading(false)
        const res = await response.json();
        navigate(`/course-detail/${res.data}`);
      }
      else {
        setLoading(false)
        toast.error("No Such Course Found")
      }
    } catch (error) {
      setLoading(false)
      console.log("Error while searching the course", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/user/logout-user`,
        { method: "GET", credentials: "include" }
      );
      if (response.ok) {
        const res = await response.json();
        dispatch(logout());
        localStorage.removeItem(res.data === "instructor" ? "instructorToken" : "userToken");
        toast.success("Logout successfully");
        navigate("/");
      }
    } catch (error) {
      console.log("Error while logout the user", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-20 py-3 flex justify-between items-center max-lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <img src={assets.logo} alt="logo" width={50} />
          <h1 className="font-bold text-xl sm:text-2xl text-gray-900 tracking-tight">
            SkillLearnia
          </h1>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 text-gray-900 font-medium">
          <Link to="/home" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/all-courses" className="hover:text-blue-600 transition">Courses</Link>
          <Link to="/subscription" className="hover:text-blue-600 transition">Subscription</Link>
        </ul>

        {/* Right side (desktop) */}
        <div className="hidden md:flex items-center gap-5">
          {/* Search Icon */}
          <button
            onClick={() => setShowSearch((p) => !p)}
            className="hover:scale-110 transition-transform"
          >

            <img src={assets.search} alt="search" width={24} />

          </button>

          {userToken ? (
            <div className="flex items-center gap-4">
              <Link
                to="/my-courses"
                className="flex items-center gap-2 hover:text-blue-600 transition"
              >
                <img src={assets.courses} alt="" width={26} />
                <span className="font-medium">My Courses</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-gray-800 font-semibold text-gray-800 hover:bg-gray-900 hover:text-white transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/sign-in">
              <button className="px-4 py-2 rounded-lg border border-gray-800 font-semibold text-gray-800 hover:bg-gray-900 hover:text-white transition-all">
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <img src={assets.menu} alt="menu" width={28} />
        </button>
      </nav>

      {/* Search Bar */}
      {showSearch && (
        <div className="relative w-full flex justify-center px-4 pb-3">
          <div className="relative w-full sm:w-[70%] md:w-[50%]">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 transition"
            />

            {
              loading ?
                <img className="absolute right-12 top-2.5 cursor-pointer opacity-70 hover:opacity-100" src={assets.ringloading} alt="search" width={22} />
                :
                <img
                  src={assets.search}
                  onClick={submitSearch}
                  alt="search"
                  width={22}
                  className="absolute right-12 top-2.5 cursor-pointer opacity-70 hover:opacity-100"
                />
            }
            <img
              src={assets.close}
              onClick={() => setShowSearch(false)}
              alt="close"
              width={25}
              className="absolute right-3 top-2 cursor-pointer"
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-12 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-20">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-50 border-t shadow-inner py-4 px-6 flex flex-col gap-3">
          <button
            className="flex items-center gap-2"
            onClick={() => setShowSearch((p) => !p)}
          >
            <img src={assets.search} alt="search" width={20} />
            <span>Search</span>
          </button>
          <Link to="/home" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/all-courses" onClick={() => setMenuOpen(false)}>
            Courses
          </Link>
          <Link to="/subscription" onClick={() => setMenuOpen(false)}>
            Subscription
          </Link>
          {userToken ? (
            <>
              <Link to="/my-courses" onClick={() => setMenuOpen(false)}>
                My Courses
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/sign-in" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
