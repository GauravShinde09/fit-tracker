
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast"; // 🔥 Add toast notifications while we are here!
import "../styles/ProgressTracker.css";

const ProgressTracker = () => {
  const [progressData, setProgressData] = useState([]);
  const [entry, setEntry] = useState({ weight: "", notes: "" });
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingId, setEditingId] = useState(null);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("userToken"); // 🔥 Get Token
      const res = await fetch("https://fit-tracker-backend-7g40.onrender.com/api/progress", {
        headers: {
          "Authorization": `Bearer ${token}` // 🔥 Send Token
        }
      });
      const data = await res.json();
      setProgressData(data);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...entry, date };
    const token = localStorage.getItem("userToken"); // 🔥 Get Token

    try {
      const endpoint = editingId
        ? `https://fit-tracker-backend-7g40.onrender.com/api/progress/update/${editingId}`
        : "https://fit-tracker-backend-7g40.onrender.com/api/progress/add";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 🔥 Send Token
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingId ? "Progress updated!" : "Progress added!"); // 🔥 Toast
        fetchProgress();
        setEntry({ weight: "", notes: "" });
        setEditingId(null);
        setDate(new Date().toISOString().split("T")[0]);
      } else {
        toast.error("Failed to save progress");
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Error connecting to server");
    }
  };

  const handleEdit = (item) => {
    setEntry({ weight: item.weight, notes: item.notes });
    setDate(item.date.split("T")[0]);
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken"); // 🔥 Get Token
    try {
      const res = await fetch(`https://fit-tracker-backend-7g40.onrender.com/api/progress/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}` // 🔥 Send Token
        }
      });
      if (res.ok) {
        toast.success("Entry deleted"); // 🔥 Toast
        fetchProgress();
      }
    } catch (error) {
      console.error("Error deleting progress:", error);
    }
  };

  const changeDate = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split("T")[0]);
  };

  return (
    <div className="progress-tracker">
      <h2>PROGRESS TRACKER</h2>

      {/* Date Navigation */}
      <div className="progress-date-nav">
        <button onClick={() => changeDate(-1)}>&#8592;</button>
        <span>{date}</span>
        <button onClick={() => changeDate(1)}>&#8594;</button>
      </div>

      {/* Form (Left Column) */}
      <form className="progress-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Log Entry</h3>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={entry.weight}
          onChange={(e) => setEntry({ ...entry, weight: e.target.value })}
          required
        />
        <textarea
          placeholder="Notes (How did you feel today?)"
          value={entry.notes}
          onChange={(e) => setEntry({ ...entry, notes: e.target.value })}
        />
        <button type="submit">
          {editingId ? "UPDATE ENTRY" : "ADD PROGRESS"}
        </button>
      </form>

      {/* Log (Right Column) */}
      <div className="progress-log">
        <div className="log-header">
          <h3>Past Entries</h3>
        </div>
        
        {progressData.length === 0 ? (
          <p className="empty-state">No progress tracked for this date yet.</p>
        ) : (
          <ul className="progress-list">
            {progressData
              .filter((item) => item.date.split("T")[0] === date)
              .map((item) => (
                <li key={item._id} className="progress-card">
                  
                  {/* NEW PRESENTATION: Grouped Data Header */}
                  <div className="progress-info">
                    <span className="progress-weight">
                      {item.weight} <span className="weight-unit">kg</span>
                    </span>
                    <span className="progress-divider">|</span>
                    <span className="progress-date">{new Date(item.date).toDateString()}</span>
                  </div>
                  
                  {item.notes && <div className="progress-notes">{item.notes}</div>}
                  
                  <div className="progress-actions">
                    <button type="button" onClick={() => handleEdit(item)}>Edit</button>
                    <button type="button" className="delete" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>

                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;