import useMultiplayerSocket from "../../socket/useMultiplayerSocket";
import { Router, Route, Routes } from "react-router-dom";
import RoomChoice from "./Multiplayer/RoomChoice";
import CreateRoom from "./Multiplayer/CreateRoom";
import JoinRoom from "./Multiplayer/JoinRoom";
import WaitingRoom from "./Multiplayer/WaitingRoom";
import GameRoom from "./Multiplayer/GameRoom";

const MultiplayerPage = () => {
  useMultiplayerSocket();
  return (
    <Route path="/play/multiplayer//">
      <Route index element={<RoomChoice />} />
      <Route path="create" element={<CreateRoom />} />
      <Route path="join" element={<JoinRoom />} />
      <Route path="waiting/:roomId" element={<WaitingRoom />} />
      <Route path="play/:roomId" element={<GameRoom />} />
    </Route>
  );
};

export default MultiplayerPage;
