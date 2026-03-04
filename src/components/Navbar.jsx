
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navbar.css"; 

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Checks if the user is exactly on the homepage
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    // Runs every single time the route changes
    const checkAuth = () => {
      const token = localStorage.getItem("userToken");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    // Keeps cross-tab sync working
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
    
  }, [location.pathname]); 

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("username"); 
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className={`navbar ${isHomePage ? "transparent" : ""}`}>
      
      {/* LOGO */}
      <Link to="/" className="logo">
        <span className="logo-icon"> 💪</span> FIT TRACKER
      </Link>

      {/* CENTER NAVIGATION BUTTONS */}
      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/workouts">Workouts</NavLink></li>
        <li><NavLink to="/diet-plans">Diet Plans</NavLink></li>
        <li><NavLink to="/progress-tracker">Progress</NavLink></li>
      </ul>

      {/* AUTH & DASHBOARD BUTTONS */}
      <div className="auth-section">
        {!isAuthenticated ? (
          <>
            <Link to="/signup" className="btn btn-outline">Signup</Link>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="btn btn-dashboard">DASHBOARD</Link>
            <button onClick={handleLogout} className="btn logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;