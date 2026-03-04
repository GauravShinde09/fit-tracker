import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Workouts from "./pages/Workouts";
import DietPlans from "./pages/DietPlans";
import Supplements from "./pages/Supplements";
import ProgressTracker from "./pages/ProgressTracker";
// import SocialCommunity from "./pages/SocialCommunity";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; 
import "./App.css";
import "./styles/Navbar.css";
import "./styles/Hero.css";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Navbar />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#151822',
            color: '#FFFFFF',
            border: '1px solid #2A2F42',
            padding: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#F43F5E', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        {/* === PUBLIC ROUTES (Anyone can access) === */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>} />

        {/* === PRIVATE ROUTES (Protected by the Bouncer) === */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } /> 
        <Route path="/workouts" element={
          <ProtectedRoute><Workouts /></ProtectedRoute>
        } />
        <Route path="/diet-plans" element={
          <ProtectedRoute><DietPlans /></ProtectedRoute>
        } />
        <Route path="/supplements" element={
          <ProtectedRoute><Supplements /></ProtectedRoute>
        } />
        <Route path="/progress-tracker" element={
          <ProtectedRoute><ProgressTracker /></ProtectedRoute>
        } />
        {/* <Route path="/social-community" element={<ProtectedRoute><SocialCommunity /></ProtectedRoute>} /> */}
      </Routes>
    </>
  );
}

export default App;