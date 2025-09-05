// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../features/auth/authSlice";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header
      className="w-full px-4 py-3 flex justify-between items-center border-b font-jetbrains"
      style={{
        backgroundColor: theme.bg,
        borderColor: theme.border,
        color: theme.text,
      }}
    >
      <Link
        to="/"
        className="text-2xl font-bold"
        style={{ color: theme.primary }}
      >
        Turbo Typing
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          to="/play"
          className="hover:text-[#fe8019] transition-colors"
        >
          Play
        </Link>
        <Link
          to="/leaderboard"
          className="hover:text-[#fe8019] transition-colors"
        >
          Leaderboard
        </Link>
        <ThemeToggle />
        {user ? (
          <div className="group relative">
            <div className="cursor-pointer peer">
              <CgProfile className="text-2xl" />
            </div>

            <div
              className="absolute right-0 mt-2 w-40 rounded shadow-md 
                    opacity-0 invisible 
                    peer-hover:opacity-100 peer-hover:visible 
                    group-hover:opacity-100 group-hover:visible 
                    transition-all duration-200 z-50"
              style={{
                backgroundColor: theme.bgSoft,
                borderColor: theme.border,
              }}
            >
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm hover:bg-[#3c3836] transition-colors"
                style={{ color: theme.text }}
              >
                Profile
              </Link>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-[#3c3836] transition-colors flex items-center gap-2"
                style={{ color: theme.text }}
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/auth/login"
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: theme.bgSoft,
                color: theme.text,
                borderColor: theme.border,
              }}
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: theme.primary,
                color: theme.bg,
              }}
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
