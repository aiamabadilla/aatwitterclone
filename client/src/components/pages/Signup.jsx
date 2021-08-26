import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory, Redirect } from "react-router-dom";

import TwitterIcon from "@material-ui/icons/Twitter";

import Button from "@material-ui/core/Button";

import { UserContext } from "../AppRouter";
import { loginUser, registerUser, checkUserAvailability } from "../../api";

import "../../styles/pages/Signup.css";

const Signup = () => {
  const history = useHistory();
  const [user, setUser] = useContext(UserContext);
  const formRef = useRef(null);
  const [error, setError] = useState({
    name: false,
    username: false,
    password: false,
    vPassword: false,
  });
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    password: "",
    vPassword: "",
    birthday: "",
  });

  const handleExploreLink = (e) => {
    history.push("/u/explore");
  };

  const handleLoginLink = (e) => {
    history.push("/u/login");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const errors = {
      name: false,
      username: false,
      password: false,
      vPassword: false,
    };
    if (!newUser.name) {
      errors.name = true;
    }
    if (!newUser.username) {
      errors.username = true;
    }
    if (!newUser.password) {
      errors.password = true;
    }
    if (!newUser.vPassword) {
      errors.vPassword = true;
    }
    if (errors.name || errors.username || errors.password || errors.vPassword) {
      return setError(errors);
    }
    if (newUser.password !== newUser.vPassword) {
      return console.log("The passwords do not match.");
    }
    registerUser(newUser)
      .then((res) => {
        loginUser({ username: newUser.username, password: newUser.password })
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
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (newUser.name && error.name) {
      setError({ ...error, name: false });
    }
    if (newUser.username && error.username) {
      setError({ ...error, username: false });
    }
    if (newUser.password && error.password) {
      setError({ ...error, password: false });
    }
    if (newUser.vPassword && error.vPassword) {
      setError({ ...error, vPassword: false });
    } // eslint-disable-next-line
  }, [newUser]);

  useEffect(() => {
    if (newUser.username) {
      checkUserAvailability(newUser.username)
        .then((res) => setError({ ...error, username: !res.data.available }))
        .catch((err) => console.log(err));
    } // eslint-disable-next-line
  }, [newUser.username]);

  if (user.accesstoken) return <Redirect to="/u/home" />;

  return (
    <div className="signup">
      <Button className="signup__IconButton" onClick={handleExploreLink}>
        <TwitterIcon className="signup__Icon" />
      </Button>
      <h2 className="signup__header">Create your account</h2>
      <form
        action=""
        className="signup__form"
        onSubmit={handleSignupSubmit}
        ref={formRef}
      >
        <label
          htmlFor="name"
          className="signup__inputContainer"
          name="name"
          style={{
            border: error.name
              ? "1px solid var(--error)"
              : newUser.name
              ? "1px solid var(--primary)"
              : "1px solid var(--dark)",
            color: error.name
              ? "var(--error)"
              : newUser.name
              ? "var(--primary)"
              : "var(--dark)",
          }}
        >
          Name
          <input
            name="name"
            id="name"
            type="text"
            className="signup__input"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
          />
        </label>
        <label
          htmlFor="username"
          className="signup__inputContainer"
          name="username"
          style={{
            border: error.username
              ? "1px solid var(--error)"
              : newUser.username
              ? "1px solid var(--primary)"
              : "1px solid var(--dark)",
            color: error.username
              ? "var(--error)"
              : newUser.username
              ? "var(--primary)"
              : "var(--dark)",
          }}
        >
          Username
          <input
            name="username"
            id="username"
            type="text"
            className="signup__input"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
          />
        </label>
        <label
          htmlFor="password"
          className="signup__inputContainer"
          name="password"
          style={{
            border: error.password
              ? "1px solid var(--error)"
              : newUser.password
              ? "1px solid var(--primary)"
              : "1px solid var(--dark)",
            color: error.password
              ? "var(--error)"
              : newUser.password
              ? "var(--primary)"
              : "var(--dark)",
          }}
        >
          Password
          <input
            name="password"
            id="password"
            type="password"
            className="signup__input"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
          />
        </label>
        <label
          htmlFor="vPassword"
          className="signup__inputContainer"
          name="vPassword"
          style={{
            border: error.vPassword
              ? "1px solid var(--error)"
              : newUser.vPassword
              ? "1px solid var(--primary)"
              : "1px solid var(--dark)",
            color: error.vPassword
              ? "var(--error)"
              : newUser.vPassword
              ? "var(--primary)"
              : "var(--dark)",
          }}
        >
          Verify Password
          <input
            name="vPassword"
            id="vPassword"
            type="password"
            className="signup__input"
            value={newUser.vPassword}
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
          />
        </label>
        <label
          htmlFor="birthday"
          className="signup__inputContainer"
          name="birthday"
        >
          Birthday
          <input
            name="birthday"
            id="birthday"
            type="text"
            className="signup__input"
            value={newUser.birthday}
            placeholder="MM/DD/YYYY"
            onChange={(e) =>
              setNewUser({ ...newUser, [e.target.name]: e.target.value })
            }
          />
        </label>
        <Button className="signup__Button" type="submit">
          Create Account
        </Button>
        <p className="signup__text">Have an account already?</p>
        <Button className="login__Button" onClick={handleLoginLink}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default Signup;
