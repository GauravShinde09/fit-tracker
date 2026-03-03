import React from "react";
// import "../styles/Testimonials.css"; 

function Testimonials() {
  return (
    <section className="testimonials">
      <h2>What Our Users Say</h2>
      <div className="testimonial-list">
        <div className="testimonial-item">
          <p>"Fit Tracker helped me stay consistent with my workouts. Love it!"</p>
          <h4>- Alex Johnson</h4>
        </div>
        <div className="testimonial-item">
          <p>"The meal tracking feature keeps me on top of my diet goals."</p>
          <h4>- Sarah Lee</h4>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
