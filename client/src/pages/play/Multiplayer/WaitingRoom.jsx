import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const WaitingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/play/multiplayer/room/${roomId}`, { replace: true });
  }, []);
  return null;
};

export default WaitingRoom;
