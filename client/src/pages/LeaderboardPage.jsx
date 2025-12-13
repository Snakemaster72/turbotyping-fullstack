import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const LeaderboardPage = () => {
  const { theme } = useTheme();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/api/games/leaderboard');
        setLeaderboard(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div 
      className="min-h-screen p-8"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <h1 
        className="text-4xl font-bold mb-8 text-center"
        style={{ color: theme.primary }}
      >
        Global Leaderboard
      </h1>

      <div className="max-w-3xl mx-auto">
        {leaderboard.length === 0 ? (
          <p className="text-center" style={{ color: theme.textSoft }}>
            No games played yet. Be the first to make it to the leaderboard!
          </p>
        ) : (
          <div 
            className="rounded-lg overflow-hidden border-2"
            style={{ borderColor: theme.border }}
          >
            {leaderboard.map((entry, index) => (
              <div 
                key={entry._id}
                className="p-4 flex items-center"
                style={{ 
                  backgroundColor: index % 2 === 0 ? theme.bgSoft : theme.bgDark 
                }}
              >
                <div 
                  className="w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-full mr-4"
                  style={{ 
                    backgroundColor: theme.primary,
                    color: theme.bg 
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{entry.user.username}</div>
                  <div style={{ color: theme.textSoft }}>
                    <span className="text-lg" style={{ color: theme.primary }}>
                      {entry.wpm} WPM
                    </span>
                    <span className="mx-2">|</span>
                    <span>{entry.accuracy}% accuracy</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
