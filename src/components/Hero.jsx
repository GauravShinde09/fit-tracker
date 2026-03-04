
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("userToken"); // auth check

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Track Your Fitness Goals</h1>
        <p>Your journey to a healthier lifestyle starts here.</p>
        <button className="cta-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </section>
  );
}

export default Hero;


