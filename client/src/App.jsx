import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/NavBar";
import LandingPage from "./pages/LandingPage.jsx";
import PlayingMenu from "./pages/PlayMenu.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import SinglePlayer from "./pages/play/SingPlayer.jsx";
import RoomChoice from "./pages/play/Multiplayer/RoomChoice";
import CreateRoom from "./pages/play/Multiplayer/CreateRoom";
import JoinRoom from "./pages/play/Multiplayer/JoinRoom";
import WaitingRoom from "./pages/play/Multiplayer/WaitingRoom";
import GameRoom from "./pages/play/Multiplayer/GameRoom";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, reset, getAuthenticatedUser } from "./features/auth/authSlice";
import { ThemeProvider } from "./context/ThemeContext";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      // If there's a token but no user, fetch the user data
      dispatch(getUserData())
        .unwrap()
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    } else if (user?.token) {
      // If we have a user with a token, ensure authenticated state is maintained
      dispatch(getAuthenticatedUser());
    }
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, user]);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen font-jetbrains">
          <Header />
          <ToastContainer theme="dark" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/play" element={<PlayingMenu />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/play/singleplayer" element={<SinglePlayer />} />
            <Route path="/play/multiplayer/">
              <Route index element={<RoomChoice />} />
              <Route path="create" element={<CreateRoom />} />
              <Route path="join" element={<JoinRoom />} />
              <Route path="waiting/:roomId" element={<WaitingRoom />} />
              <Route path="room/:roomId" element={<GameRoom />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
