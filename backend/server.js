const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes"); // Update path if needed

const workoutRoutes = require("./routes/workoutRoutes"); // ✅ Import workout routes
const progressRoutes = require("./routes/progressRoutes");
const dietRoutes = require("./routes/dietRoutes");
const dashboardRoutes = require('./routes/dashboardRoutes');
// const dashboardRoutes = require("./routes/dashboardRoutes");




const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/workouts", workoutRoutes); // ✅ Ensure this is defined
// app.use("/api/diet", dietRoutes);
app.use("/api/diet", require("./routes/dietRoutes"));

app.use("/api/progress", progressRoutes)
app.use("/api/auth", authRoutes); // ✅ Must match frontend route
app.use('/api/dashboard', dashboardRoutes);

// app.use("/api/dashboard", dashboardRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// MongoDB Connection (Ensure you have .env file)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((error) => console.log("❌ MongoDB connection error:", error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
