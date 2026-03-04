
import React, { useState, useMemo, useEffect } from "react";
import "../../styles/ExerciseSearch.css";

// 🔥 Upgraded to a Smart Database: 10 Exercises per Muscle Group
const EXERCISES = [
  // CHEST (10)
  { name: "Barbell Bench Press", type: "Chest" },
  { name: "Dumbbell Bench Press", type: "Chest" },
  { name: "Incline Barbell Press", type: "Chest" },
  { name: "Incline Dumbbell Press", type: "Chest" },
  { name: "Decline Bench Press", type: "Chest" },
  { name: "Cable Chest Fly", type: "Chest" },
  { name: "Pec Deck Fly", type: "Chest" },
  { name: "Machine Chest Press", type: "Chest" },
  { name: "Push-ups", type: "Chest" },
  { name: "Chest Dips", type: "Chest" },

  // BACK (10)
  { name: "Pull-ups", type: "Back" },
  { name: "Chin-ups", type: "Back" },
  { name: "Lat Pulldown", type: "Back" },
  { name: "Bent-over Barbell Rows", type: "Back" },
  { name: "Dumbbell Rows", type: "Back" },
  { name: "Seated Cable Rows", type: "Back" },
  { name: "T-Bar Rows", type: "Back" },
  { name: "Single-Arm Cable Rows", type: "Back" },
  { name: "Deadlifts", type: "Back" },
  { name: "Face Pulls", type: "Back" },

  // LEGS (10)
  { name: "Barbell Squats", type: "Legs" },
  { name: "Hack Squats", type: "Legs" },
  { name: "Bulgarian Split Squats", type: "Legs" },
  { name: "Leg Press", type: "Legs" },
  { name: "Dumbbell Lunges", type: "Legs" },
  { name: "Romanian Deadlifts", type: "Legs" },
  { name: "Leg Extensions", type: "Legs" },
  { name: "Lying Leg Curls", type: "Legs" },
  { name: "Seated Calf Raises", type: "Legs" },
  { name: "Standing Calf Raises", type: "Legs" },

  // SHOULDERS (10)
  { name: "Barbell Overhead Press", type: "Shoulders" },
  { name: "Dumbbell Shoulder Press", type: "Shoulders" },
  { name: "Arnold Press", type: "Shoulders" },
  { name: "Machine Shoulder Press", type: "Shoulders" },
  { name: "Lateral Raises", type: "Shoulders" },
  { name: "Cable Lateral Raises", type: "Shoulders" },
  { name: "Front Raises", type: "Shoulders" },
  { name: "Reverse Flys", type: "Shoulders" },
  { name: "Upright Rows", type: "Shoulders" },
  { name: "Dumbbell Shrugs", type: "Shoulders" },

  // BICEPS (10)
  { name: "Barbell Bicep Curls", type: "Biceps" },
  { name: "Dumbbell Bicep Curls", type: "Biceps" },
  { name: "Hammer Curls", type: "Biceps" },
  { name: "Preacher Curls", type: "Biceps" },
  { name: "Cable Curls", type: "Biceps" },
  { name: "Incline Dumbbell Curls", type: "Biceps" },
  { name: "Concentration Curls", type: "Biceps" },
  { name: "Zottman Curls", type: "Biceps" },
  { name: "Spider Curls", type: "Biceps" },
  { name: "Reverse Curls", type: "Biceps" },

  // TRICEPS (10)
  { name: "Close-Grip Bench Press", type: "Triceps" },
  { name: "Skull Crushers", type: "Triceps" },
  { name: "Overhead Tricep Extension", type: "Triceps" },
  { name: "Cable Tricep Pushdowns", type: "Triceps" },
  { name: "Rope Tricep Extensions", type: "Triceps" },
  { name: "Single-Arm Cable Pushdowns", type: "Triceps" },
  { name: "Tricep Kickbacks", type: "Triceps" },
  { name: "Diamond Push-ups", type: "Triceps" },
  { name: "Tricep Dips", type: "Triceps" },
  { name: "French Press", type: "Triceps" },

  // CORE (10)
  { name: "Crunches", type: "Core" },
  { name: "Bicycle Crunches", type: "Core" },
  { name: "Cable Crunches", type: "Core" },
  { name: "Sit-ups", type: "Core" },
  { name: "V-Ups", type: "Core" },
  { name: "Planks", type: "Core" },
  { name: "Side Planks", type: "Core" },
  { name: "Russian Twists", type: "Core" },
  { name: "Hanging Leg Raises", type: "Core" },
  { name: "Ab Wheel Rollouts", type: "Core" }
];

const ExerciseSearch = ({ value, onSelectExercise }) => {
  const [query, setQuery] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);

  // Sync with parent
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const filteredExercises = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    
    // 🔥 Smart Filter: Checks if query matches the exercise name OR the muscle group type
    return EXERCISES.filter((ex) =>
      ex.name.toLowerCase().includes(lowerQuery) || 
      ex.type.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Showing 8 items so they see plenty of options when searching a full muscle group
  }, [query]);

  // Pass only the string name back to the parent so the rest of your app doesn't break
  const handleSelect = (exerciseName) => {
    setQuery(exerciseName);
    onSelectExercise(exerciseName);
    setIsFocused(false);
  };

  const handleChange = (val) => {
    setQuery(val);
    onSelectExercise(val);
    setIsFocused(true); 
  };

  return (
    <div className="exercise-search-container">
      <input
        type="text"
        placeholder="Search exercise or muscle (e.g. 'Back')"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="exercise-search-input"
        required
      />

      {isFocused && filteredExercises.length > 0 && (
        <div className="exercise-dropdown">
          {filteredExercises.map((exercise, index) => (
            <div
              key={index}
              className="exercise-item"
              onMouseDown={() => handleSelect(exercise.name)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} // Ensures clean layout
            >
              <span style={{ fontWeight: "600" }}>{exercise.name}</span>
              <span style={{ fontSize: "12px", color: "#FF6B00", fontWeight: "800", textTransform: "uppercase" }}>
                {exercise.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseSearch;


