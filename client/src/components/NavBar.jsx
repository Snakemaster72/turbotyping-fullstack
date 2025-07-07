// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../features/auth/authSlice";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header className="w-full px-4 py-3 flex justify-between items-center border-b">
      <Link to="/" className="text-2xl font-bold">
        Turbotyping
      </Link>
      <nav className="flex gap-6">
        <Link to="/play">Play</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        {user ? (
          <>
            <div className="group relative">
              {/* Apply 'peer' to a real HTML element, not the icon directly */}
              <div className="cursor-pointer peer">
                <CgProfile className="text-2xl" />
              </div>

              {/* Dropdown appears on hover of either the icon or dropdown */}
              <div
                className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md 
                      opacity-0 invisible 
                      peer-hover:opacity-100 peer-hover:visible 
                      group-hover:opacity-100 group-hover:visible 
                      transition-all duration-200 z-50"
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            </div>{" "}
          </>
        ) : (
          <Link to="/auth/login">Sign In</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
