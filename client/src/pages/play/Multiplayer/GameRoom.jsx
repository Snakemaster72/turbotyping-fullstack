import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  socket,
  joinRoom,
  getRoomState,
  startGame,
  sendProgress,
} from "../../../socket/socket";
import PromptDisplay from "../../../components/play/PromptDisplay";

const GameRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  // Stable guest name per tab so two guest windows don't collide.
  const usernameRef = useRef(
    user?.username ||
      sessionStorage.getItem("mp_guest_name") ||
      (() => {
        const name = `Guest_${Math.random().toString(36).slice(2, 6)}`;
        sessionStorage.setItem("mp_guest_name", name);
        return name;
      })()
  );
  const username = usernameRef.current;

  const [phase, setPhase] = useState("waiting"); // waiting | countdown | playing | finished
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [completedWords, setCompletedWords] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [liveWpm, setLiveWpm] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const inputRef = useRef(null);
  const startTimeRef = useRef(null);

  const words = prompt.trim() ? prompt.trim().split(/\s+/) : [];
  const currentWordIndex = completedWords.length;
  const currentWord = words[currentWordIndex] || "";

  const typedText =
    completedWords.join(" ") +
    (completedWords.length > 0 ? " " : "") +
    currentInput;

  useEffect(() => {
    if (!socket.connected) socket.connect();

    joinRoom({ roomId, username });
    const t = setTimeout(() => getRoomState(roomId), 100);

    const onRoomState = (data) => {
      setPlayers(data.players || []);
      setMaxPlayers(data.maxPlayers || 0);
      if (data.prompt) setPrompt(data.prompt);
      if (data.status) setPhase(data.status);
      setIsHost(!!data.isHost);
    };
    const onPlayerJoined = (data) => {
      if (data.roomId === roomId) {
        setPlayers(data.players || []);
        setMaxPlayers(data.maxPlayers || 0);
      }
    };
    const onJoinError = (msg) => {
      setErrorMsg(msg?.message || "Unable to join room.");
    };
    const onStartCountdown = ({ seconds }) => {
      setCountdown(seconds);
      setPhase("countdown");
    };
    const onGameStart = () => {
      const now = Date.now();
      setStartTime(now);
      startTimeRef.current = now;
      setPhase("playing");
      setCountdown(null);
      setTimeout(() => inputRef.current?.focus(), 0);
    };
    const onUpdatePlayers = (list) => {
      setPlayers(list || []);
    };
    const onGameOver = (board) => {
      setLeaderboard(board || []);
      setPhase("finished");
    };

    socket.on("room_state", onRoomState);
    socket.on("player_joined", onPlayerJoined);
    socket.on("join_error", onJoinError);
    socket.on("start_countdown", onStartCountdown);
    socket.on("game_start", onGameStart);
    socket.on("update_players", onUpdatePlayers);
    socket.on("game_over", onGameOver);

    return () => {
      clearTimeout(t);
      socket.off("room_state", onRoomState);
      socket.off("player_joined", onPlayerJoined);
      socket.off("join_error", onJoinError);
      socket.off("start_countdown", onStartCountdown);
      socket.off("game_start", onGameStart);
      socket.off("update_players", onUpdatePlayers);
      socket.off("game_over", onGameOver);
    };
  }, [roomId, username]);

  // Recalculate live WPM whenever a word is completed.
  useEffect(() => {
    if (!startTimeRef.current || completedWords.length === 0) {
      setLiveWpm(0);
      return;
    }
    const minutes = (Date.now() - startTimeRef.current) / 1000 / 60;
    if (minutes > 0) {
      setLiveWpm(Math.round(completedWords.length / minutes));
    }
  }, [completedWords]);

  const handleInput = (e) => {
    if (phase !== "playing") return;
    const value = e.target.value;

    if (value.endsWith(" ") && value.trim() === currentWord) {
      const newCompleted = [...completedWords, currentWord];
      setCompletedWords(newCompleted);
      setCurrentInput("");

      const progress = Math.round(
        (newCompleted.length / Math.max(words.length, 1)) * 100,
      );
      const minutes = (Date.now() - startTimeRef.current) / 1000 / 60;
      const wpm = minutes > 0 ? Math.round(newCompleted.length / minutes) : 0;

      const finishedNow = newCompleted.length === words.length;
      sendProgress({
        roomId,
        username,
        progress: finishedNow ? 100 : progress,
        wpm,
      });

      if (finishedNow) {
        setPhase("finished");
      }
    } else {
      setCurrentInput(value);
    }
  };

  const myProgress = Math.round(
    (completedWords.length / Math.max(words.length, 1)) * 100,
  );

  const shareUrl = `${window.location.origin}/play/multiplayer/room/${roomId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#1d2021] text-[#ebdbb2] gap-4">
        <div className="text-[#fb4934] font-bold text-lg">{errorMsg}</div>
        <button
          onClick={() => navigate("/play/multiplayer")}
          className="bg-[#458588] text-[#ebdbb2] font-bold px-4 py-2 rounded hover:bg-[#3a7174] transition"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1d2021] text-[#ebdbb2] p-6">
      {/* WAITING */}
      {phase === "waiting" && (
        <div className="w-full max-w-xl bg-[#282828] border border-[#504945] rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">Room: {roomId}</h2>

          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 bg-[#1d2021] border border-[#504945] rounded px-3 py-2 text-sm text-[#a89984]"
            />
            <button
              onClick={handleCopy}
              className="bg-[#458588] text-[#ebdbb2] font-bold px-3 py-2 rounded hover:bg-[#3a7174] transition whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div>
            <h3 className="font-bold mb-2">
              Players ({players.length}/{maxPlayers})
            </h3>
            <ul className="space-y-1">
              {players.map((p) => (
                <li
                  key={p.username}
                  className={
                    p.username === username
                      ? "font-bold text-[#fabd2f]"
                      : "text-[#d5c4a1]"
                  }
                >
                  {p.username}
                  {p.username === username ? " (You)" : ""}
                </li>
              ))}
            </ul>
          </div>

          {isHost ? (
            <button
              onClick={() => startGame(roomId)}
              className="w-full bg-[#b8bb26] text-[#1d2021] font-bold rounded py-2 hover:bg-[#a9b126] transition"
            >
              Start Game
            </button>
          ) : (
            <div className="text-center text-[#a89984]">
              Waiting for host to start...
            </div>
          )}
        </div>
      )}

      {/* COUNTDOWN */}
      {phase === "countdown" && (
        <h2 className="text-5xl font-bold">Game starting in {countdown}...</h2>
      )}

      {/* PLAYING */}
      {phase === "playing" && (
        <div className="w-full max-w-3xl space-y-6">
          <div className="bg-[#282828] border border-[#504945] rounded-lg p-4">
            {players.map((p) => (
              <div key={p.username} className="flex items-center gap-3 mb-2">
                <span
                  className={`w-24 text-sm truncate ${
                    p.username === username
                      ? "font-bold text-[#fabd2f]"
                      : "text-[#d5c4a1]"
                  }`}
                >
                  {p.username}
                  {p.username === username ? " (You)" : ""}
                </span>
                <div className="flex-1 h-5 bg-[#3c3836] rounded-full overflow-hidden">
                  <div
                    className={`h-5 rounded-full transition-all duration-300 ${
                      p.username === username ? "bg-[#fabd2f]" : "bg-[#458588]"
                    }`}
                    style={{
                      width: `${
                        p.username === username ? myProgress : p.progress || 0
                      }%`,
                    }}
                  />
                </div>
                <span className="w-16 text-sm text-right text-[#d5c4a1]">
                  {p.wpm || 0} WPM
                </span>
                {p.finished && (
                  <span className="text-[#b8bb26] text-xs">✓</span>
                )}
              </div>
            ))}
          </div>

          <PromptDisplay prompt={prompt} typedText={typedText} />

          <div className="text-center text-[#a89984]">
            Current word:{" "}
            <span className="font-bold text-[#ebdbb2]">{currentWord}</span>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={handleInput}
            disabled={phase !== "playing"}
            autoFocus
            className="w-full bg-[#282828] border border-[#504945] rounded px-3 py-3 text-xl font-mono text-[#ebdbb2] focus:outline-none focus:border-[#b8bb26]"
            placeholder="Type here..."
          />

          <div className="text-center text-lg font-bold text-[#fabd2f]">
            {liveWpm} WPM
          </div>
        </div>
      )}

      {/* FINISHED */}
      {phase === "finished" && (
        <div className="w-full max-w-xl bg-[#282828] border border-[#504945] rounded-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center">Race Over!</h2>

          {leaderboard.length === 0 ? (
            <div className="text-center text-[#a89984]">
              Waiting for results...
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#504945] text-[#a89984]">
                  <th className="py-2">Rank</th>
                  <th className="py-2">Player</th>
                  <th className="py-2">WPM</th>
                  <th className="py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr
                    key={entry.username}
                    className={
                      entry.username === username ? "bg-[#fabd2f]/10" : ""
                    }
                  >
                    <td className="py-2">#{i + 1}</td>
                    <td className="py-2">
                      {entry.username}
                      {entry.username === username ? " (You)" : ""}
                    </td>
                    <td className="py-2">{entry.wpm}</td>
                    <td className="py-2">
                      {entry.time != null ? `${entry.time.toFixed(2)}s` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button
            onClick={() => navigate("/play/multiplayer")}
            className="w-full bg-[#b8bb26] text-[#1d2021] font-bold rounded py-2 hover:bg-[#a9b126] transition"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
