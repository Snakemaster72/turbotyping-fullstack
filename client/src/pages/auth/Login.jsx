// src/pages/auth/Login.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { reset, login } from "../../features/auth/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate("/");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, isLoading, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };
  return (
    <div className="mt-20 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-9">Login to Turbotyping</h1>
      <form className="flex flex-col gap-4 w-80" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
        />
        <button type="submit" className="border p-2 rounded">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don’t have an account?{" "}
        <Link to="/auth/register" className="underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
