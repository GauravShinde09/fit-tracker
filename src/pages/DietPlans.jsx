
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast"; // 🔥 Added toast
import "../styles/DietPlans.css";

const DietPlans = () => {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [meals, setMeals] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [dietInput, setDietInput] = useState({
    type: "",
    food: "",
    calories: "",
  });

  const [targetCalories, setTargetCalories] = useState(2200);
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchDiet = async () => {
      try {
        const token = localStorage.getItem("userToken"); // 🔥 Get Token
        const res = await fetch(
          `http://localhost:5000/api/diet/history?date=${date}`, // 🔥 Removed user from URL
          {
            headers: {
              "Authorization": `Bearer ${token}` // 🔥 Send Token
            }
          }
        );
        const data = await res.json();

        if (res.ok && Array.isArray(data.meals)) {
          setMeals(data.meals);
        } else {
          setMeals([]);
        }
      } catch (err) {
        console.error(err);
        setMeals([]);
      }
    };

    fetchDiet();
  }, [date]);

  // ================= ADD / UPDATE =================
  const handleAddMeal = async () => {
    if (!dietInput.type || !dietInput.food || !dietInput.calories) {
      toast.error("Fill all fields"); // 🔥 Toast
      return;
    }

    let updatedMeals;

    if (editingIndex !== null) {
      updatedMeals = meals.map((meal, idx) =>
        idx === editingIndex
          ? {
              type: dietInput.type,
              food: dietInput.food,
              calories: Number(dietInput.calories),
            }
          : meal
      );
    } else {
      updatedMeals = [
        ...meals,
        {
          type: dietInput.type,
          food: dietInput.food,
          calories: Number(dietInput.calories),
        },
      ];
    }

    const token = localStorage.getItem("userToken"); // 🔥 Get Token
    const res = await fetch("http://localhost:5000/api/diet/add", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // 🔥 Send Token
      },
      body: JSON.stringify({
        date, // 🔥 Removed user from body
        meals: updatedMeals,
      }),
    });

    if(res.ok) {
        toast.success(editingIndex !== null ? "Meal updated!" : "Meal added!");
    } else {
        toast.error("Failed to save meal");
    }

    const data = await res.json();
    setMeals(data.diet.meals);

    setDietInput({ type: "", food: "", calories: "" });
    setEditingIndex(null);
  };

  // ================= EDIT =================
  const handleEditMeal = (meal, originalIndex) => {
    setDietInput({
      type: meal.type,
      food: meal.food,
      calories: meal.calories,
    });
    setEditingIndex(originalIndex);
  };

  // ================= DELETE =================
  const handleDeleteMeal = async (originalIndex) => {
    const updatedMeals = meals.filter(
      (_, idx) => idx !== originalIndex
    );

    const token = localStorage.getItem("userToken"); // 🔥 Get Token
    const res = await fetch("http://localhost:5000/api/diet/add", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // 🔥 Send Token
      },
      body: JSON.stringify({
        date, // 🔥 Removed user from body
        meals: updatedMeals,
      }),
    });

    if(res.ok) {
        toast.success("Meal deleted");
    }

    const data = await res.json();
    setMeals(data.diet.meals);
  };

  // ================= DATE =================
  const changeDate = (days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split("T")[0]);
  };

  // ================= TOTAL CAL =================
  const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
  const diff = targetCalories - totalCalories;
  const isOver = diff < 0;
  const progressPercent = Math.min(
    (totalCalories / targetCalories) * 100,
    100
  );

  // ================= GROUP + ORIGINAL INDEX =================
  const groupedMeals = meals.reduce((acc, meal, index) => {
    if (!acc[meal.type]) acc[meal.type] = [];
    acc[meal.type].push({ ...meal, originalIndex: index });
    return acc;
  }, {});

  const mealOrder = ["Breakfast", "Lunch", "Snack", "Dinner"];

  // ================= MEAL-WISE CALORIES =================
  const mealCalories = mealOrder.reduce((acc, type) => {
    acc[type] =
      groupedMeals[type]?.reduce(
        (sum, meal) => sum + meal.calories,
        0
      ) || 0;
    return acc;
  }, {});

  return (
    <div className="diet-tracker">
      <h2>DIET PLAN TRACKER</h2>

      <div className="diet-date-nav">
        <button onClick={() => changeDate(-1)}>&#8592;</button>
        <span>{date}</span>
        <button onClick={() => changeDate(1)}>&#8594;</button>
      </div>

      {/* ===== SUMMARY ===== */}
      <div className="calorie-summary">
        <h3>Daily Calories</h3>

        {isEditingTarget ? (
          <input
            type="number"
            value={targetCalories}
            onChange={(e) =>
              setTargetCalories(Number(e.target.value))
            }
            onBlur={() => setIsEditingTarget(false)}
            autoFocus
          />
        ) : (
          <p onClick={() => setIsEditingTarget(true)} style={{ cursor: 'pointer' }}>
            Target: <strong>{targetCalories}</strong> kcal <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '8px' }}>(Edit)</span>
          </p>
        )}

        <p>Eaten: {totalCalories} kcal</p>
        <p className={isOver ? "over" : "under"}>
          {isOver
            ? `Over by ${Math.abs(diff)} kcal`
            : `Remaining ${diff} kcal`}
        </p>

        <div className="progress-bar">
          <div
            className={`progress-fill ${isOver ? "red" : "green"}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ===== ADD MEAL ===== */}
      <div className="diet-form">
        <select
          value={dietInput.type}
          onChange={(e) =>
            setDietInput({ ...dietInput, type: e.target.value })
          }
        >
          <option value="">Select Meal Type</option>
          {mealOrder.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <input
          placeholder="Food"
          value={dietInput.food}
          onChange={(e) =>
            setDietInput({ ...dietInput, food: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Calories"
          value={dietInput.calories}
          onChange={(e) =>
            setDietInput({ ...dietInput, calories: e.target.value })
          }
        />

        <button onClick={handleAddMeal}>
          {editingIndex !== null ? "UPDATE MEAL" : "ADD MEAL"}
        </button>
      </div>

      {/* ===== MEAL GROUPS ===== */}
      <div className="meal-groups">
        {mealOrder.map(
          (type) =>
            groupedMeals[type] && (
              <div className="meal-card" key={type}>
                <div className="meal-header">
                  <h3>{type}</h3>
                  <span className="meal-total">
                    {mealCalories[type]} kcal
                  </span>
                </div>

                <ul>
                  {groupedMeals[type].map((meal) => (
                    <li key={meal.originalIndex}>
                      <span>{meal.food}</span>
                      <span>{meal.calories} cal</span>
                      <div className="meal-actions">
                        <button
                          onClick={() =>
                            handleEditMeal(
                              meal,
                              meal.originalIndex
                            )
                          }
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteMeal(
                              meal.originalIndex
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default DietPlans;

