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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, reset } from "./features/auth/authSlice";

function App() {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // check for a token in localStorage
    const token = localStorage.getItem("token");
    if (token && !user) {
      // if a token exists and user data is not loaded, fetch user data
      dispatch(getUserData())
        .unwrap()
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    }
    return () => {
      // cleanup if necessary
      dispatch(reset());
    };
  }, [dispatch, user]);

  return (
    <>
      <Router>
        <Header />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/play" element={<PlayingMenu />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/play/singleplayer" element={<SinglePlayer />} />
          <Route path="/play/multiplayer/">
            <Route index element={<RoomChoice />} />
            <Route path="create" element={<CreateRoom />} />
            <Route path="join" element={<JoinRoom />} />
            <Route path="waiting/:roomId" element={<WaitingRoom />} />
            <Route path="room/:roomId" element={<GameRoom />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
