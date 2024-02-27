import React, { useState } from "react";
import styles from "./Login.module.css"; // Import your CSS Modules styles

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (isNewUser) {
      registerUser(email, password);
    } else {
      loginUser(email, password);
    }
  };

  const registerUser = (email, password) => {
    // For demonstration, we'll use localStorage to store user data
    const userData = {
      email,
      password,
      interactions: [],
    };

    // Save user data
    localStorage.setItem(email, JSON.stringify(userData));

    // Log in the user
    onLogin();
  };

  const loginUser = (email, password) => {
    // Retrieve user data from localStorage
    const userDataJSON = localStorage.getItem(email);
    if (!userDataJSON) {
      alert("User not found. Please register first.");
      return;
    }

    const userData = JSON.parse(userDataJSON);

    // Perform authentication logic (password check)
    if (userData.password === password) {
      // Log in the user and pass interactions to the main App
      onLogin(userData.interactions);
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className={styles["login-container"]}>
      <h2>{isNewUser ? "Register" : "Login"}</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles["input"]} // Apply the input styling
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles["input"]} // Apply the input styling
        />
        {isNewUser ? (
          <div>
            <button type="submit" className={styles["register-button"]}>
              Register
            </button>
            <p className={styles["register-toggle"]}>
              Already have an account?{" "}
              <a
                href="#"
                onClick={() => setIsNewUser(false)}
                className={`${styles["yellow-text"]} ${styles["bold-text"]}`}
                style={{ fontSize: "1.3rem" }}
              >
                Login here
              </a>
            </p>
          </div>
        ) : (
          <div>
            <button type="submit" className={styles["login-button"]}>
              Login
            </button>
            <p className={styles["register-toggle"]}>
              Don't have an account?{" "}
              <a
                href="#"
                onClick={() => setIsNewUser(true)}
                className={`${styles["yellow-text"]} ${styles["bold-text"]}`}
                style={{ fontSize: "1.3rem" }}
              >
                Register now
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
