// src/pages/auth/Register.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../../features/auth/authSlice";

const Register = () => {
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

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        username,
        email,
        password,
      };
      console.log("Registering user with data:", userData); // ✅ ADD THIS
      dispatch(register(userData));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
      <form className="flex flex-col gap-4 w-80" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded"
          name="username"
          value={username}
          onChange={onChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          name="email"
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          name="password"
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password2}
          name="password2"
          onChange={onChange}
        />
        <button type="submit" className="border p-2 rounded">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/auth/login" className="underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
