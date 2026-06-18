import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// Use axiosInstance (not bare axios) so the global response interceptor can catch
// 401 TOKEN_EXPIRED responses and redirect to login automatically.
import axiosInstance from '../utils/axiosConfig.js';
import { useTheme } from '../context/ThemeContext';

const ProfilePage = () => {
  const { theme } = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Token is now attached automatically by the axiosInstance request interceptor;
        // the manual Authorization header was reading from Redux state, which became
        // stale/expired after 30 days with no way to recover.
        const response = await axiosInstance.get('/api/games/my-history');
        setHistory(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchHistory();
  }, [user]);

  if (!user) return <div className="text-center mt-8">Please log in to view your profile</div>;
  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div 
      className="min-h-screen p-8"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <h1 
        className="text-4xl font-bold mb-8"
        style={{ color: theme.primary }}
      >
        Your Typing History
      </h1>

      <div className="max-w-4xl mx-auto">
        {history.length === 0 ? (
          <p className="text-center" style={{ color: theme.textSoft }}>
            No games played yet. Start typing to see your history!
          </p>
        ) : (
          <div 
            className="rounded-lg overflow-hidden border-2"
            style={{ borderColor: theme.border }}
          >
            {history.map((game, index) => (
              <div 
                key={game._id}
                className="p-4 flex justify-between items-center"
                style={{ 
                  backgroundColor: index % 2 === 0 ? theme.bgSoft : theme.bgDark 
                }}
              >
                <div>
                  <span className="text-lg font-semibold">{game.wpm} WPM</span>
                  <span className="mx-2">|</span>
                  <span>{game.accuracy}% accuracy</span>
                  <span className="mx-2">|</span>
                  <span style={{ color: theme.textSoft }}>{game.category?.mode}</span>
                </div>
                <div className="text-sm" style={{ color: theme.textSoft }}>
                  {new Date(game.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
