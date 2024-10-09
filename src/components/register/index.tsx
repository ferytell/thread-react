import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAppDispatch } from "../hooks";
import { register as registerUser } from "../../stores/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import { useNavigate, Link } from "react-router-dom";
import "./index.css"; // Import component-specific CSS

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    const resultAction = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate("/"); // Redirect after successful registration
    }
  };

  return (
    <div className="container">
      <div className="register-form">
        <h1>Register</h1>
        {auth.error && <p className="error">{auth.error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Name</label>
            <input type="text" {...register("name")} />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>
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
            {auth.loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </div>
    </div>
  );
};

export default Register;
