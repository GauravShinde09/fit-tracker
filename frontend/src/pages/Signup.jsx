
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast"; 
import "../styles/Signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  // 🔥 THE FIX: Changed to "userToken" to match the Bouncer
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      toast.error("All fields are required!"); 
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!"); 
      return;
    }

    try {
      const response = await fetch("https://fit-tracker-backend-7g40.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmedUsername, email: trimmedEmail, password: trimmedPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Signup successful! Redirecting..."); 
        // 🔥 THE FIX: Saved as "userToken"
        localStorage.setItem("userToken", data.token); 
        localStorage.setItem("username", data.username); 
        navigate("/dashboard"); 
      } else {
        toast.error(data.message || "Signup failed! Try again."); 
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Server error! Please try again later."); 
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <div className="password-wrapper">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password (min 6 chars)" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button 
            type="button" 
            className="toggle-password" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
    </div>
  );
};

export default Signup;


