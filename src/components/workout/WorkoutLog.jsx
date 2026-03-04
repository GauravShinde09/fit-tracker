import React, { useState, useEffect } from "react";
import ExerciseSearch from "./ExerciseSearch";
import "../../styles/WorkoutLog.css";

const USER_WEIGHT = 63; // Base weight in kg for calculations

const WorkoutLog = ({ onLogWorkout }) => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [sets, setSets] = useState([{ weight: "", reps: "" }]);
  const [caloriesBurned, setCaloriesBurned] = useState("0");

  // 🔥 THE FIX: Smart MET (Metabolic Equivalent) Engine
  // Adjusts the calorie burn rate based on how heavy the exercise actually is
  const getSmartMETValue = (exerciseName) => {
    const lower = exerciseName.toLowerCase();

    // 1. High Intensity / Cardio (Burns the most)
    if (lower.includes("run") || lower.includes("jump") || lower.includes("burpee") || lower.includes("sprint")) return 8.0;

    // 2. Heavy Compound Lower Body (High burn)
    if (lower.includes("squat") || lower.includes("deadlift") || lower.includes("leg press") || lower.includes("lunge")) return 6.0;

    // 3. Compound Upper Body (Moderate burn - ~60-75 kcal per 15 mins)
    if (lower.includes("press") || lower.includes("pull-up") || lower.includes("row") || lower.includes("chin-up") || lower.includes("chest")) return 5.0;

    // 4. Bodyweight & Core (Lower moderate burn)
    if (lower.includes("push-up") || lower.includes("plank") || lower.includes("crunch") || lower.includes("core")) return 4.0;

    // 5. Isolation Exercises (Arms, Shoulders, Calves - Burns the least, ~30-40 kcal)
    if (lower.includes("curl") || lower.includes("extension") || lower.includes("raise") || lower.includes("fly") || lower.includes("calf") || lower.includes("kickback")) return 3.0;

    // Default for standard, generic weight training
    return 3.5;
  };

  const calculateCalories = () => {
    if (!name || !duration) return "0";
    
    // Get the smart multiplier based on the exercise name
    const MET = getSmartMETValue(name);
    const totalMinutes = Number(duration) || 0;
    
    // Calculate total weight moved
    const totalVolume = sets.reduce((acc, set) => acc + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0);
    
    // The Formula: MET * Weight(kg) * Time(hours)
    const timeCalories = MET * USER_WEIGHT * (totalMinutes / 60);
    
    // A tiny bonus for moving heavier total volume
    const volumeCalories = totalVolume * 0.0005;
    
    // Combine and round to a clean whole number
    return Math.round(timeCalories + volumeCalories).toString();
  };

  // Recalculates automatically whenever you change the name, duration, or weight/reps
  useEffect(() => {
    setCaloriesBurned(calculateCalories());
  }, [name, duration, sets]);

  const handleSetChange = (index, field, value) => {
    const updated = [...sets];
    updated[index][field] = value;
    setSets(updated);
  };

  const addSet = () => setSets([...sets, { weight: "", reps: "" }]);
  
  const removeSet = (index) => {
    if (sets.length === 1) return;
    setSets(sets.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !duration) {
      alert("Please fill required fields.");
      return;
    }
    const formattedSets = sets.map((set) => ({ weight: Number(set.weight), reps: Number(set.reps) }));
    onLogWorkout({ name, duration: Number(duration), sets: formattedSets, caloriesBurned });
    
    // Reset form after logging
    setName("");
    setDuration("");
    setSets([{ weight: "", reps: "" }]);
    setCaloriesBurned("0");
  };

  return (
    <div className="workout-log-premium">
      <ExerciseSearch onSelectExercise={setName} />

      <form onSubmit={handleSubmit} className="log-form-premium">
        <input
          className="input-premium full-width"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (min)"
          required
        />

        <div className="sets-grid-container">
          <div className="sets-header-grid">
            <span>Set</span>
            <span>Weight (kg)</span>
            <span>Reps</span>
            <span></span>
          </div>

          {sets.map((set, index) => (
            <div className="sets-row-grid" key={index}>
              <span className="set-number">{index + 1}</span>
              <input
                className="input-premium"
                type="number"
                placeholder="0"
                value={set.weight}
                onChange={(e) => handleSetChange(index, "weight", e.target.value)}
                required
              />
              <input
                className="input-premium"
                type="number"
                placeholder="0"
                value={set.reps}
                onChange={(e) => handleSetChange(index, "reps", e.target.value)}
                required
              />
              <button type="button" className="btn-remove-set" onClick={() => removeSet(index)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        <button type="button" className="btn-add-set" onClick={addSet}>
          + Add Set
        </button>

        <div className="calories-wrapper">
          <span>Calories Burned:</span>
          <strong className="calories-highlight">{caloriesBurned} kcal</strong>
        </div>

        <button type="submit" className="btn-log-workout">
          Log Workout
        </button>
      </form>
    </div>
  );
};

export default WorkoutLog;