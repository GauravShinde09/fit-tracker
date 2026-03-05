
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../styles/WorkoutHistory.css";

const WorkoutHistory = ({ date, refreshTrigger }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (!date) return;

    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("userToken"); // 🔥 Gets the secure token
        
        const response = await fetch(`https://fit-tracker-backend-7g40.onrender.com/api/workouts/history?date=${date}`, {
          headers: {
            "Authorization": `Bearer ${token}` // 🔥 Hands the token to the backend bouncer
          }
        });
        
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to fetch workouts");

        if (Array.isArray(data)) setWorkouts(data);
        else if (Array.isArray(data.history)) setWorkouts(data.history);
        else if (Array.isArray(data.workouts)) setWorkouts(data.workouts);
        else setWorkouts([]);
      } catch (error) {
        console.error("Error fetching workout history:", error);
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [date, refreshTrigger]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(`https://fit-tracker-backend-7g40.onrender.com/api/workouts/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Failed to delete workout");
      
      toast.success("Workout deleted!"); 
      setWorkouts((prev) => prev.filter((workout) => workout._id !== id));
    } catch (error) {
      console.error("Error deleting workout:", error);
      toast.error("Failed to delete workout");
    }
  };

  const handleEdit = (workout) => {
    setEditingId(workout._id);
    setEditData({ ...workout });
  };

  const calculateCalories = (sets, duration) => {
    const bodyWeight = 63;
    const MET = 4.5;
    const minutes = Number(duration) || 0;
    return Math.round((MET * bodyWeight * minutes) / 60);
  };

  const handleUpdate = async () => {
    try {
      const updatedWorkout = {
        ...editData,
        calories: calculateCalories(editData.sets, editData.duration),
      };

      const token = localStorage.getItem("userToken");
      const response = await fetch(`https://fit-tracker-backend-7g40.onrender.com/api/workouts/${editingId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedWorkout),
      });

      if (!response.ok) throw new Error("Failed to update workout");

      toast.success("Workout updated!");
      setEditingId(null);
      setEditData(null);
      
      setWorkouts((prev) => 
        prev.map((w) => (w._id === editingId ? { ...w, ...updatedWorkout } : w))
      );
    } catch (error) {
      console.error("Error updating workout:", error);
      toast.error("Failed to update workout");
    }
  };

  return (
    <div className="workout-history-container">
      {loading ? (
        <p className="status-message">Fetching workouts...</p>
      ) : workouts.length === 0 ? (
        <p className="status-message empty">No workouts logged yet for {date}.</p>
      ) : (
        <ul className="history-list">
          {workouts.map((workout, index) => (
            <li key={workout._id || index} className="history-card-premium">
              {editingId === workout._id ? (
                <div className="edit-mode-container">
                  <input
                    className="premium-input"
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                  <input
                    className="premium-input"
                    type="number"
                    value={editData.duration}
                    onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                  />
                  <input
                    className="premium-input"
                    type="text"
                    value={editData.type}
                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                  />

                  <div className="edit-sets-wrapper">
                    <span className="section-label">Sets:</span>
                    {editData.sets.map((set, i) => (
                      <div className="edit-set-row" key={i}>
                        <input
                          className="premium-input small"
                          type="number"
                          value={set.weight}
                          onChange={(e) => {
                            const newSets = [...editData.sets];
                            newSets[i].weight = e.target.value;
                            setEditData({ ...editData, sets: newSets });
                          }}
                        />
                        <input
                          className="premium-input small"
                          type="number"
                          value={set.reps}
                          onChange={(e) => {
                            const newSets = [...editData.sets];
                            newSets[i].reps = e.target.value;
                            setEditData({ ...editData, sets: newSets });
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <p className="calorie-readout">
                    Calories: {calculateCalories(editData.sets, editData.duration)} kcal
                  </p>

                  <div className="action-buttons">
                    <button className="btn-save" onClick={handleUpdate}>Save</button>
                    <button className="btn-cancel" onClick={() => { setEditingId(null); setEditData(null); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="view-mode-container">
                  <h4 className="workout-title">{workout.name}</h4>
                  <div className="workout-meta">
                    <span>Duration: {workout.duration} min</span> • <span>Type: {workout.type}</span>
                  </div>
                  <p className="workout-calories">Calories: {workout.calories} kcal</p>

                  <div className="sets-display">
                    <span className="section-label">Sets:</span>
                    {Array.isArray(workout.sets) && workout.sets.length > 0 ? (
                      workout.sets.map((set, i) => (
                        <div className="set-data-line" key={i}>
                          Set {i + 1} — Weight: <strong>{set?.weight || 0}kg</strong> | Reps: <strong>{set?.reps || 0}</strong>
                        </div>
                      ))
                    ) : (
                      <p className="no-sets">No sets available</p>
                    )}
                  </div>

                  <div className="card-footer">
                    <small className="date-stamp">{workout.date}</small>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEdit(workout)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(workout._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkoutHistory;



