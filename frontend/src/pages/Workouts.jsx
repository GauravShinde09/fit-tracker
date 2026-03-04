
import React, { useState, useEffect } from "react";
import WorkoutTracking from "../components/WorkoutTracking";
// import WorkoutHistory from "../components/WorkoutHistory";
import "../styles/Workouts.css";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // 🔥 Fetch Workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem("userToken"); // 🔥 Get Token
        const response = await fetch(
          `http://localhost:5000/api/workouts/history`, // 🔥 Removed user from URL
          {
            headers: {
              "Authorization": `Bearer ${token}` // 🔥 Send Token
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        setWorkouts(data.history || []);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setWorkouts([]);
      }
    };

    fetchWorkouts();
  }, [refreshTrigger]);

  // 🔥 Trigger refresh after add/edit/delete
  const handleRefresh = () => {
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <div className="workout-container">
      {/* 🔥 Notice we are no longer passing userId, the backend handles it via token */}
      <WorkoutTracking
        onWorkoutChanged={handleRefresh}
      />
{/* <WorkoutHistory
        workouts={workouts}
        onWorkoutChanged={handleRefresh}
      /> */}
    </div>
  );
};

export default Workouts;