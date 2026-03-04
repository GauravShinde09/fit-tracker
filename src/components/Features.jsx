import React from "react";
// import "../styles/Features.css"; 

function Features() {
  return (
    <section className="features">
      <h2>Why Choose Fit Tracker?</h2>
      <div className="feature-list">
        <div className="feature-item">
          <h3>Custom Workouts</h3>
          <p>Get personalized workout plans tailored to your fitness level.</p>
        </div>
        <div className="feature-item">
          <h3>Diet Tracking</h3>
          <p>Monitor your meals and calorie intake easily.</p>
        </div>
        <div className="feature-item">
          <h3>Progress Reports</h3>
          <p>Track your fitness progress with detailed reports.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;
