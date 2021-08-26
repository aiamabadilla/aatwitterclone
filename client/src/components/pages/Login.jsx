import React, { useState, useEffect, useContext } from "react";
import { useHistory, Redirect } from "react-router-dom";

import TwitterIcon from "@material-ui/icons/Twitter";

import Button from "@material-ui/core/Button";

import { loginUser } from "../../api";

import { UserContext } from "../AppRouter";

import "../../styles/pages/Login.css";

const Login = () => {
  const history = useHistory();
  const [user, setUser] = useContext(UserContext);
  const [logUser, setLogUser] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState({
    username: false,
    password: false,
  });

  const handleExploreLink = (e) => {
    history.push("/u/explore");
  };

  const handleSignupLink = (e) => {
    history.push("/u/signup");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errors = {
      username: false,
      password: false,
    };
    if (!logUser.username) {
      errors.username = true;
    }
    if (!logUser.password) {
      errors.password = true;
    }
    if (errors.username || errors.password) {
      return setError(errors);
    }
    loginUser(logUser)
      .then((res) => {
        if (res.data.accesstoken) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
          localStorage.setItem("active", "Home");
          return history.push("/u/home");
        } else if (!res.data.accesstoken) {
          setError({ username: true, password: true });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (logUser.username && error.username) {
      setError({ ...error, username: false });
    }
    if (logUser.password && error.password) {
      setError({ ...error, password: false });
    }
    // eslint-disable-next-line
  }, [logUser]);

  if (user.accesstoken) return <Redirect to="/u/home" />;

  return (
    <div className="login">
      <Button className="login__IconButton" onClick={handleExploreLink}>
        <TwitterIcon className="login__Icon" />
      </Button>
      <h2 className="login__header">Login to your account</h2>
      <form action="" className="login__form" onSubmit={handleLoginSubmit}>
        <label
          htmlFor="username"
          className="login__inputContainer"
          name="username"
          style={{
            border: error.username
              ? "1px solid var(--error)"
              : logUser.username
              ? "1px solid var(--primary)"
              : "1px solid var(--dark)",
            color: error.username
              ? "var(--error)"
              : logUser.username
              ? "var(--primary)"
              : "var(--dark)",
          }}
        >
          Username
          <input
            name="username"
            id="username"
            type="text"
            className="login__input"
            value={logUser.username}
            onChange={(e) =>
              setLogUser({ ...logUser, [e.target.name]: e.target.value })
            }
          />
        </label>
        <label
          htmlFor="password"
          className="login__inputContainer"
          name="password"
          style={{
            border: error.password
              ? "1px solid var(--error)"
              : logUser.password
              ? "1px solid var(--primary)"
              : "1px solid var(--dark)",
            color: error.password
              ? "var(--error)"
              : logUser.password
              ? "var(--primary)"
              : "var(--dark)",
          }}
        >
          Password
          <input
            name="password"
            id="password"
            type="password"
            className="login__input"
            value={logUser.password}
            onChange={(e) =>
              setLogUser({ ...logUser, [e.target.name]: e.target.value })
            }
          />
        </label>

        <Button className="login__Button" type="submit">
          Login Account
        </Button>
        <p className="login__text">Don't have an account?</p>
        <Button className="signup__Button" onClick={handleSignupLink}>
          Signup
        </Button>
      </form>
    </div>
  );
};

export default Login;
