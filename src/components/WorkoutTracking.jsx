// import React, { useState, useEffect } from "react";
// import WorkoutLog from "./workout/WorkoutLog";
// import WorkoutHistory from "./WorkoutHistory";
// import "../styles/WorkoutTracking.css";

// const WorkoutTracking = () => {
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [refreshTrigger, setRefreshTrigger] = useState(false); // Used to trigger workout history refresh

//   // ✅ Handle adding a new workout
//   const handleAddWorkout = async (workout) => {
//     const { name, sets, reps, weight, duration, caloriesBurned } = workout;

//     // Validation: make sure all required fields are filled
//     if (!name || !sets || !reps || !duration || !caloriesBurned) {
//       alert("❌ Please fill in all required fields.");
//       return;
//     }

//     const workoutData = {
//       name,
//       sets,
//       reps,
//       weight: weight || 0,
//       duration,
//       calories: parseFloat(caloriesBurned),
//       date,
//     };

//     try {
//       const response = await fetch("http://localhost:5000/api/workouts/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(workoutData),
//       });

//       if (!response.ok) {
//         const errorResponse = await response.json();
//         throw new Error(errorResponse.message || "Unknown error");
//       }

//       console.log("✅ Workout saved successfully!");
//       setRefreshTrigger((prev) => !prev); // Trigger WorkoutHistory to refresh
//     } catch (error) {
//       console.error("❌ Error saving workout:", error);
//       alert("Error saving workout. Please try again.");
//     }
//   };

//   // ✅ Handle date navigation
//   const changeDate = (days) => {
//     setDate((prev) => {
//       const newDate = new Date(prev);
//       newDate.setDate(newDate.getDate() + days);
//       return newDate.toISOString().split("T")[0];
//     });
//   };

//   return (
//     <div className="workout-tracker">
//       <h2>🏋️ Workout Tracker</h2>

//       {/* ✅ Date Navigation */}
//       <div className="date-nav">
//         <button onClick={() => changeDate(-1)}>⬅️</button>
//         <span>{date}</span>
//         <button onClick={() => changeDate(1)}>➡️</button>
//       </div>

//       {/* ✅ Workout Log Component */}
//       <WorkoutLog onLogWorkout={handleAddWorkout} />

//       {/* ✅ Workout History Component */}
//       <WorkoutHistory date={date} refreshTrigger={refreshTrigger} />
//     </div>
//   );
// };

// export default WorkoutTracking;


// import React, { useState } from "react";
// import WorkoutLog from "./workout/WorkoutLog";
// import WorkoutHistory from "./WorkoutHistory";
// import "../styles/WorkoutTracking.css";

// const WorkoutTracking = () => {
//   const [date, setDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [refreshTrigger, setRefreshTrigger] = useState(false);

//   const userId = "demo-user";

//   const detectMuscleGroup = (exercise) => {
//     const lower = exercise.toLowerCase();
//     if (lower.includes("chest")) return "Chest";
//     if (lower.includes("row") || lower.includes("pull") || lower.includes("deadlift") || lower.includes("chin")) return "Back";
//     if (lower.includes("squat") || lower.includes("leg") || lower.includes("calf")) return "Legs";
//     if (lower.includes("shoulder") || lower.includes("press") || lower.includes("raise") || lower.includes("fly")) return "Shoulders";
//     if (lower.includes("curl") || lower.includes("bicep")) return "Biceps";
//     if (lower.includes("tricep") || lower.includes("kickback") || lower.includes("dip")) return "Triceps";
//     return "Full Body";
//   };

//   const handleAddWorkout = async (workout) => {
//     const { name, sets, duration, caloriesBurned } = workout;

//     if (!name || sets.length === 0 || !duration) {
//       alert("Please fill all required fields.");
//       return;
//     }

//     const workoutData = {
//       user: userId,
//       name,
//       sets,
//       duration: Number(duration),
//       type: detectMuscleGroup(name),
//       calories: Number(caloriesBurned),
//       date,
//     };

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/workouts/add",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(workoutData),
//         }
//       );

//       if (!response.ok) {
//         const errorResponse = await response.json();
//         throw new Error(errorResponse.message || "Unknown error");
//       }

//       console.log("Workout saved successfully");
//       setRefreshTrigger((prev) => !prev);
//     } catch (error) {
//       console.error("Error saving workout:", error);
//       alert("Error saving workout. Please try again.");
//     }
//   };

//   const changeDate = (days) => {
//     setDate((prev) => {
//       const newDate = new Date(prev);
//       newDate.setDate(newDate.getDate() + days);
//       return newDate.toISOString().split("T")[0];
//     });
//   };

//   return (
//     <div className="workout-tracker">
//       <h2>Workout Tracker</h2>

//       <div className="date-nav">
//         <button onClick={() => changeDate(-1)}>⬅️</button>
//         <span>{date}</span>
//         <button onClick={() => changeDate(1)}>➡️</button>
//       </div>

//       <WorkoutLog onLogWorkout={handleAddWorkout} />

//       <WorkoutHistory
//         userId={userId}
//         date={date}
//         refreshTrigger={refreshTrigger}
//       />
//     </div>
//   );
// };

// export default WorkoutTracking;


import React, { useState } from "react";
import toast from "react-hot-toast"; 
import WorkoutLog from "./workout/WorkoutLog";
import WorkoutHistory from "./WorkoutHistory";
import "../styles/WorkoutTracking.css";

const WorkoutTracking = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  
  // 🔥 THE FIX: Smarter exercise detection engine
  const detectMuscleGroup = (exercise) => {
    const lower = exercise.toLowerCase();

    // 1. Core / Abs
    if (lower.includes("crunch") || lower.includes("plank") || lower.includes("sit-up") || lower.includes("core") || lower.includes("ab")) return "Core";
    
    // 2. Chest (Now correctly catches Bench, Incline Press, and Decline Press)
    if (lower.includes("chest") || lower.includes("bench") || lower.includes("pec") || lower.includes("push-up") || lower.includes("pushup") || lower.includes("fly") || (lower.includes("incline") && lower.includes("press")) || (lower.includes("decline") && lower.includes("press"))) return "Chest";
    
    // 3. Back
    if (lower.includes("row") || lower.includes("pull") || lower.includes("deadlift") || lower.includes("chin") || lower.includes("lat")) return "Back";
    
    // 4. Legs (Will catch "Leg Press" before the fallback)
    if (lower.includes("squat") || lower.includes("leg") || lower.includes("calf") || lower.includes("lunge") || lower.includes("extension")) return "Legs";
    
    // 5. Shoulders (Now catches Military Press and Overhead)
    if (lower.includes("shoulder") || lower.includes("overhead") || lower.includes("military") || lower.includes("lateral") || lower.includes("raise") || lower.includes("delt")) return "Shoulders";
    
    // 6. Arms
    if (lower.includes("curl") || lower.includes("bicep")) return "Biceps";
    if (lower.includes("tricep") || lower.includes("kickback") || lower.includes("dip")) return "Triceps";

    // 7. Generic Fallbacks
    if (lower.includes("press")) return "Shoulders"; 

    return "Full Body"; 
  };

  const handleAddWorkout = async (workout) => {
    const { name, sets, duration, caloriesBurned } = workout;
    if (!name || sets.length === 0 || !duration) {
      toast.error("Please fill all required fields."); 
      return;
    }

    const workoutData = {
      name,
      sets,
      duration: Number(duration),
      type: detectMuscleGroup(name),
      calories: Number(caloriesBurned),
      date,
    };

    try {
      const token = localStorage.getItem("userToken"); 
      const response = await fetch("http://localhost:5000/api/workouts/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(workoutData),
      });
      
      if (!response.ok) throw new Error("Failed to save");
      
      toast.success("Workout logged successfully!"); 
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save workout");
    }
  };

  const changeDate = (days) => {
    setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + days);
      return newDate.toISOString().split("T")[0];
    });
  };

  return (
    <div className="tracker-page-root">
      {/* Header Section */}
      <div className="tracker-top-nav">
        <div className="brand-group">
          <h1>Workout Tracker</h1>
          <p>Analyze and log your daily performance</p>
        </div>

        <div className="date-controller">
          <button onClick={() => changeDate(-1)}>←</button>
          <div className="current-date">{date}</div>
          <button onClick={() => changeDate(1)}>→</button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="tracker-main-layout">
        <aside className="input-sidebar">
          <div className="card-label">Log Exercise</div>
          <div className="component-container">
            <WorkoutLog onLogWorkout={handleAddWorkout} />
          </div>
        </aside>

        <main className="history-feed">
          <div className="card-label">Recent Sessions</div>
          <div className="component-container">
            <WorkoutHistory 
              date={date} 
              refreshTrigger={refreshTrigger} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkoutTracking;


