
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast"; 
import "../styles/Login.css";

const Login = () => {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      const response = await fetch("https://fit-tracker-backend-7g40.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!"); 
        // 🔥 THE FIX: Saved as "userToken"
        localStorage.setItem("userToken", data.token); 
        localStorage.setItem("username", data.username); 
        navigate("/dashboard"); 
      } else {
        toast.error(data.message || "Login failed"); 
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Something went wrong! Please try again."); 
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
            placeholder="Password" 
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

        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <span onClick={() => navigate("/signup")}>Sign up</span></p>
    </div>
  );
};

export default Login;





