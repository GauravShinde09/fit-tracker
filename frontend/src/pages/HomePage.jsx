import React from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Features from "../components/Features";
import Benefits from "../components/Benefits";
import Testimonials from "../components/Testimonials";

import "../styles/Homepage.css"

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Benefits />
      <Testimonials/>
      <Footer />
    </>
  );
}

export default HomePage;
