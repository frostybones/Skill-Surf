import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { SkillSurf } from "../skillsurf";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

export const Signup = () => {
  const onSubmit = () => {
    console.log("Form submitted");
  };
  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("invalid email").required("Email is required"),
    password: yup.string().min(5).max(10).required("password is required"),
    confirmpassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "passwords must match")
      .required("confirm password is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mainsignup">
        <div className="signup">
          <div className="header1">
            <Link to="/skillsurf" id="logo">
              <h1 id="logo">
                Skill<span style={{ color: "seagreen" }}>Surf</span>
              </h1>
            </Link>
            <h1>
              <Link to="/signin" id="signin2">
                Log In
              </Link>
            </h1>
          </div>
        </div>

        <div className="container">
          <div className="signupbox">
            <h1>create your account</h1>
            <p>
              Already have an account?<Link to="/signin">LogIn</Link>
            </p>
            <div className="signupform">
              <b>username: </b>
              <input
                type="text"
                placeholder="username"
                {...register("username", { required: true })}
              />
              {errors.username && <p>{errors.username.message}</p>}

              <br />
              <b>email: </b>
              <input
                type="email"
                placeholder="email"
                {...register("email", { required: true })}
              />
              {errors.email && <p>{errors.email.message}</p>}

              <br />
              <b>password: </b>
              <input
                type="password"
                placeholder="password"
                {...register("password", { required: true })}
              />
              {errors.password && <p>{errors.password?.message}</p>}

              <br />
              <b>confirm password: </b>
              <input
                type="password"
                placeholder="confirm password"
                {...register("confirmpassword", { required: true })}
              />
              {errors.confirmpassword && (
                <p>{errors.confirmpassword.message}</p>
              )}

              <br />
              <input type="submit" value="create account" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
