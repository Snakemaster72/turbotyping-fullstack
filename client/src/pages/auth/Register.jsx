// src/pages/auth/Register.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../../features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

const Register = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const { username, email, password, password2 } = formData;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message || "Something went wrong");
      dispatch(reset());
    }
    if (isSuccess || user) {
      navigate("/");
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        username,
        email,
        password,
      };
      
      try {
        const result = await dispatch(register(userData)).unwrap();
        toast.success(result.message);
        setFormData({
          username: '',
          email: '',
          password: '',
          password2: ''
        });
      } catch (error) {
        toast.error(error || 'Registration failed');
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 font-jetbrains"
      style={{ 
        backgroundColor: theme.bg,
        color: theme.text
      }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-lg border-2"
        style={{
          backgroundColor: theme.bgDark,
          borderColor: theme.border
        }}
      >
        <h1 
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: theme.primary }}
        >
          Create an Account
        </h1>
        
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="relative">
            <div 
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: theme.textSoft }}
            >
              <FiUser size={20} />
            </div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={onChange}
              className="w-full py-3 px-11 rounded-lg border-2 outline-none transition-colors"
              style={{ 
                backgroundColor: theme.bg,
                borderColor: theme.border,
                color: theme.text
              }}
            />
          </div>

          <div className="relative">
            <div 
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: theme.textSoft }}
            >
              <FiMail size={20} />
            </div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full py-3 px-11 rounded-lg border-2 outline-none transition-colors"
              style={{ 
                backgroundColor: theme.bg,
                borderColor: theme.border,
                color: theme.text
              }}
            />
          </div>

          <div className="relative">
            <div 
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: theme.textSoft }}
            >
              <FiLock size={20} />
            </div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full py-3 px-11 rounded-lg border-2 outline-none transition-colors"
              style={{ 
                backgroundColor: theme.bg,
                borderColor: theme.border,
                color: theme.text
              }}
            />
          </div>

          <div className="relative">
            <div 
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: theme.textSoft }}
            >
              <FiLock size={20} />
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={password2}
              onChange={onChange}
              className="w-full py-3 px-11 rounded-lg border-2 outline-none transition-colors"
              style={{ 
                backgroundColor: theme.bg,
                borderColor: theme.border,
                color: theme.text
              }}
            />
          </div>

          <button 
            type="submit" 
            className="py-3 px-6 rounded-lg font-bold text-lg transition-colors mt-4"
            style={{ 
              backgroundColor: theme.primary,
              color: theme.bg
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p 
          className="mt-6 text-center"
          style={{ color: theme.textSoft }}
        >
          Already have an account?{" "}
          <Link 
            to="/auth/login" 
            className="font-medium hover:opacity-90 transition-colors"
            style={{ color: theme.primary }}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
