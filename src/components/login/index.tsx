import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAppDispatch } from "../hooks";
import { login } from "../../stores/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import { useNavigate, Link } from "react-router-dom";
import "./index.css"; // Import component-specific CSS

interface LoginFormInputs {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    const resultAction = await dispatch(login(data));
    if (login.fulfilled.match(resultAction)) {
      navigate("/"); // Redirect after successful login
    }
  };

  return (
    <div className="container">
      <div className="login-form">
        <h1>Login</h1>
        {auth.error && <p className="error">{auth.error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Email</label>
            <input type="email" {...register("email")} />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div>
            <label>Password</label>
            <input type="password" {...register("password")} />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" disabled={auth.loading}>
            {auth.loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have an account? <Link to="/register">Register here</Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;
