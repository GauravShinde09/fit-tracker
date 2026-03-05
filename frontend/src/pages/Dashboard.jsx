import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 1. Imported useNavigate
import "../styles/Dashboard.css";
import { FiActivity } from "react-icons/fi";
import { FaWeight, FaFire, FaBullseye } from "react-icons/fa";

// 🔥 Removed const userId = "demo-user";

const Dashboard = () => {
  const navigate = useNavigate(); // ✅ 2. Activated navigate

  const [summary, setSummary] = useState({
    workoutsThisWeek: 0,
    currentWeight: 0,
    caloriesBurnedToday: 0,
    dietEaten: 0,
    dietTarget: 0,
    quote: "Small steps every day lead to big results.",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("userToken"); // 🔥 Grab the secure token

        // 1️⃣ Fetch dashboard summary (Securely pass the token)
        const summaryRes = await fetch(
          `https://fit-tracker-backend-7g40.onrender.com/api/dashboard/summary`, // 🔥 Removed ?user=...
          {
            headers: {
              "Authorization": `Bearer ${token}`, // 🔥 Show ID to the bouncer
              "Content-Type": "application/json"
            }
          }
        );

        const summaryData = summaryRes.ok ? await summaryRes.json() : {};

        // 2️⃣ Fetch latest progress for weight (Securely pass the token)
        const progressRes = await fetch(
          `https://fit-tracker-backend-7g40.onrender.com/api/progress`,
          {
            headers: {
              "Authorization": `Bearer ${token}`, // 🔥 Show ID to the bouncer
              "Content-Type": "application/json"
            }
          }
        );

        let latestWeight = 0;

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          if (Array.isArray(progressData) && progressData.length > 0) {
            latestWeight = progressData[0].weight || 0; // sorted newest first
          }
        }

        setSummary({
          workoutsThisWeek: summaryData.workoutsThisWeek ?? 0,
          currentWeight: latestWeight,
          caloriesBurnedToday: summaryData.caloriesBurnedToday ?? 0,
          dietEaten: summaryData.diet?.eaten ?? 0,
          dietTarget: summaryData.diet?.target ?? 0,
          quote:
            summaryData.quote ||
            "Small steps every day lead to big results.",
        });

      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const dietDiff = summary.dietTarget - summary.dietEaten;
  const isOverDiet = dietDiff < 0;

  if (loading) {
    return (
      <div className="dashboard">
        <h2>Dashboard</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h2>Welcome Back 👋</h2>
          <p className="subtitle">Track your fitness progress in real-time</p>
        </div>
        <button
          className="add-btn"
          onClick={() => navigate("/diet-plans")} // ✅ 3. Fixed the click action!
        >
          + Update Diet
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        {/* Workouts */}
        <div className="card green">
          <div className="card-top">
            <FiActivity className="icon" />
          </div>
          <h3>Workouts This Week</h3>
          <p className="value">{summary.workoutsThisWeek}</p>
        </div>

        {/* Weight */}
        <div className="card blue">
          <div className="card-top">
            <FaWeight className="icon" />
          </div>
          <h3>Current Weight</h3>
          <p className="value">{summary.currentWeight} kg</p>
        </div>

        {/* Calories Burned */}
        <div className="card orange">
          <div className="card-top">
            <FaFire className="icon" />
          </div>
          <h3>Workout Calories</h3>
          <p className="value">{summary.caloriesBurnedToday} kcal</p>
        </div>

        {/* Diet */}
        <div className="card purple">
          <div className="card-top">
            <FaBullseye className="icon" />
          </div>
          <h3>Diet Calories</h3>

          {summary.dietTarget > 0 ? (
            <>
              <p className="value">
                {summary.dietEaten} / {summary.dietTarget} kcal
              </p>

              <small className={isOverDiet ? "over" : "under"}>
                {isOverDiet
                  ? `Over by ${Math.abs(dietDiff)} kcal`
                  : `Remaining ${dietDiff} kcal`}
              </small>
            </>
          ) : summary.dietEaten > 0 ? (
            <>
              <p className="value">{summary.dietEaten} kcal eaten</p>
            </>
          ) : (
            <p className="value">No diet data</p>
          )}
        </div>
      </div>

      {/* Quote Section */}
      <div className="quote-box">
        <p>"{summary.quote}"</p>
      </div>
    </div>
  );
};

export default Dashboard;