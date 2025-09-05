import { useState, useEffect } from "react";
import { socket, joinRoom } from "../../../socket/socket";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PromptDisplay from "../../../components/play/PromptDisplay";

const GameRoom = () => {
  const { roomId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [countdown, setCountdown] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [players, setPlayers] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [joinError, setJoinError] = useState("");
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    // Join the room on mount (ensures all clients are in the room)
    const usernameToSend = user ? user.username : "Guest";
    joinRoom({ roomId, username: usernameToSend });

    // Request current room state on mount
    socket.emit("get_room_state", roomId);

    socket.on("room_state", (data) => {
      console.log("Received room_state:", data); // Debug log
      if (data.roomId === roomId) {
        setPlayers(data.players);
        if (data.prompt) {
          setPrompt(data.prompt);
          // Set word count based on prompt
          const wc = data.prompt.trim().split(/\s+/).length;
          setWordCount(wc);
        }
      }
    });

    // Listen for player_joined to update players list
    socket.on("player_joined", (data) => {
      if (data.roomId === roomId) {
        setPlayers(data.players);
      }
    });

    socket.on("start_countdown", ({ seconds }) => {
      setCountdown(seconds);
      setWaiting(false);
    });

    socket.on("game_start", () => {
      setGameStarted(true);
      setCountdown(null);
      setWaiting(false);
      setStartTime(Date.now());
    });

    // Listen for join_error
    socket.on("join_error", (msg) => {
      if (typeof msg === "object" && msg !== null && msg.message) {
        setJoinError(msg.message);
      } else {
        setJoinError(typeof msg === "string" ? msg : "Unable to join room.");
      }
    });

    return () => {
      socket.off("room_state");
      socket.off("player_joined");
      socket.off("start_countdown");
      socket.off("game_start");
      socket.off("join_error");
    };
  }, [roomId, user]);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Multiplayer typing logic
  const words = prompt.trim().split(/\s+/).slice(0, wordCount);
  const currentWord = words[currentWordIndex] || "";

  const handleInput = (e) => {
    if (!gameStarted || finished) return;
    const value = e.target.value;
    // Only allow space to advance if word is correct
    if (value.endsWith(" ")) {
      const typed = value.trim();
      if (typed === currentWord) {
        setTypedText("");
        setCurrentWordIndex((prev) => prev + 1);
        if (currentWordIndex + 1 === words.length) {
          setFinished(true);
          const timeTaken = (Date.now() - startTime) / 1000;
          const wpmCalc = Math.round((words.length / timeTaken) * 60);
          setWpm(wpmCalc);
          socket.emit("send_progress", { roomId, username: user ? user.username : "Guest", wpm: wpmCalc, time: timeTaken });
        }
      } else {
        // Don't advance, keep input
        setTypedText(value.replace(/\s+$/, ""));
      }
    } else {
      setTypedText(value);
    }
  };

  useEffect(() => {
    // Get prompt from room state
    socket.on("room_state", (data) => {
      if (data.roomId === roomId && data.prompt) {
        setPrompt(data.prompt);
      }
    });
    // Listen for leaderboard
    socket.on("leaderboard", (data) => {
      setLeaderboard(data);
    });
    return () => {
      socket.off("room_state");
      socket.off("leaderboard");
    };
  }, [roomId]);

  const isSelf = (username) => {
    return user && username === user.username;
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (b.wpm !== a.wpm) return b.wpm - a.wpm;
    return a.time - b.time;
  });

  const validLeaderboard = sortedLeaderboard.filter(
    (player) =>
      player &&
      typeof player === "object" &&
      typeof player.username === "string" &&
      typeof player.wpm === "number" &&
      typeof player.time === "number"
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {joinError && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 font-bold">
          {joinError}
        </div>
      )}
      {waiting && !joinError && (
        <>
          <h2 className="text-2xl font-bold mb-4">Waiting for players to join...</h2>
          <div className="mb-2">Players joined: {players.length}</div>
          <ul className="mb-4">
            {players.map((p) => (
              <li key={p.username} className="text-gray-700">
                {isSelf(p.username) ? <b>{p.username} (You)</b> : p.username}
              </li>
            ))}
          </ul>
        </>
      )}
      {countdown !== null && !gameStarted && !joinError && (
        <h2 className="text-2xl font-bold mb-4">Game starting in {countdown}...</h2>
      )}
      {gameStarted && !finished && !joinError && (
        <>
          <h2 className="text-2xl font-bold mb-4">Type the prompt below:</h2>
          <div className="mb-4 w-full max-w-2xl">
            <PromptDisplay prompt={words.join(" ")} typedText={typedText} />
          </div>
          <input
            type="text"
            value={typedText}
            onChange={handleInput}
            className="border rounded px-3 py-2 w-full max-w-md text-xl font-mono"
            disabled={finished || !!joinError}
            autoFocus
          />
          <div className="mt-2">Current word: <span className="font-bold">{currentWord}</span></div>
        </>
      )}
      {finished && !joinError && (
        <>
          <h2 className="text-2xl font-bold mb-4">Game Finished!</h2>
          <div className="mb-2">Your WPM: {wpm}</div>
          <h3 className="text-xl font-bold mt-4">Leaderboard</h3>
          {validLeaderboard.length === 0 ? (
            <div className="text-gray-500">No results yet.</div>
          ) : (
            <ul className="mt-2">
              {validLeaderboard.map((player, idx) => (
                <li key={player.username} className={`mb-1 ${isSelf(player.username) ? "bg-blue-100 font-bold" : ""}`}>
                  {idx + 1}. {player.username} - {player.wpm} WPM ({player.time.toFixed(2)}s)
                  {isSelf(player.username) && " ← You"}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default GameRoom;
