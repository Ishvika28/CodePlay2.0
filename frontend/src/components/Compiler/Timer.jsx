import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Timer({
  startTime,
  duration,
  roomCode,
  onContestEnd
}) {

  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {

    if (!startTime || !duration) return;

    const calculateTimeLeft = () => {

      const start = new Date(startTime).getTime();

      const end = start + duration * 60 * 1000;

      const now = Date.now();

      const remaining = Math.max(
        Math.floor((end - now) / 1000),
        0
      );

      setTimeLeft(remaining);

      // Contest ended
      if (remaining <= 0) {

        if (onContestEnd) {
          onContestEnd();
        }

        navigate(`/leaderboard/${roomCode}`);
      }
    };

    calculateTimeLeft();

    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);

  }, [
    startTime,
    duration,
    navigate,
    roomCode,
    onContestEnd
  ]);

  const formatTime = (totalSeconds) => {

    const hrs = Math.floor(totalSeconds / 3600);

    const mins = Math.floor((totalSeconds % 3600) / 60);

    const secs = totalSeconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins
        .toString()
        .padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    return `${mins
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const isDanger = timeLeft <= 300;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border font-mono text-sm shadow-inner cursor-default transition-colors ${
        isDanger
          ? "bg-red-900/30 border-red-500/30 text-red-300"
          : "bg-gray-800 border-gray-700 text-gray-300"
      }`}
    >

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isDanger ? "text-red-400" : "text-blue-400"}
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>

      {formatTime(timeLeft)}

    </div>
  );
}

export default Timer;