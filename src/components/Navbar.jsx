
// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// function Navbar() {
//   const navigate = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem("userToken");
//       setIsAuthenticated(!!token);
//     };

//     checkAuth();
//     window.addEventListener("storage", checkAuth); // ✅ Listen for token changes
//     return () => window.removeEventListener("storage", checkAuth);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//     navigate("/login");
//     window.location.reload(); // ✅ Ensures full logout effect
//   };

//   return (
//     <nav>
//       <Link to="/">HomePage</Link>
//       <br />
//       <Link to="/workouts">Workouts</Link>
//       <br />
//       <Link to="/diet-plans">Diet Plans</Link>
//       <br />
//       <Link to="/supplements">Supplements</Link>
//       <br />
//       <Link to="/progress-tracker">Progress Tracker</Link>
//       <br />
//       <Link to="/social-community">Community</Link>
//       <br />

//       {!isAuthenticated ? (
//         <>
//           <Link to="/signup">Signup</Link>
//           <br />
//           <Link to="/login">Login</Link>
//           <br />
//         </>
//       ) : (
//         <>
//           <Link to="/dashboard">Dashboard</Link> {/* ✅ Added Dashboard link */}
//           <br />
//           <button onClick={handleLogout}>Logout</button>
//         </>
//       )}
//     </nav>
//   );
// }

// export default Navbar;

// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import "../styles/Navbar.css"; // ✅ Add CSS file

// function Navbar() {
//   const navigate = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem("userToken");
//       setIsAuthenticated(!!token);
//     };

//     checkAuth();
//     window.addEventListener("storage", checkAuth);
//     return () => window.removeEventListener("storage", checkAuth);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//     navigate("/login");
//     window.location.reload(); // ✅ Force UI update after logout
//   };

//   return (
//     <nav className="navbar">
//       <div className="logo">Fit Tracker</div>

//       <ul className="nav-links">
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/workouts">Workouts</Link></li>
//         <li><Link to="/diet-plans">Diet Plans</Link></li>
//         <li><Link to="/progress-tracker">Progress</Link></li>
//         {/* <li><Link to="/social-community">Community</Link></li> */}
//       </ul>

//       <div className="auth-section">
//         {!isAuthenticated ? (
//           <>
//             <Link to="/signup" className="btn">Signup</Link>
//             <Link to="/login" className="btn">Login</Link>
//           </>
//         ) : (
//           <>
//             <Link to="/dashboard" className="btn">Dashboard</Link>
//             <button onClick={handleLogout} className="btn logout-btn">Logout</button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import "../styles/Navbar.css"; 

// function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation(); // 🔥 Added: Listens to URL changes
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // This function now runs every single time the route changes
//     const checkAuth = () => {
//       const token = localStorage.getItem("userToken");
//       setIsAuthenticated(!!token);
//     };

//     checkAuth();

//     // Keeps cross-tab sync working
//     window.addEventListener("storage", checkAuth);
//     return () => window.removeEventListener("storage", checkAuth);
    
//   }, [location.pathname]); // 🔥 Dependency added: Triggers when URL changes

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("username"); // Good practice to clear both
//     setIsAuthenticated(false);
//     navigate("/login");
//     // You actually don't need window.location.reload() anymore, 
//     // but we can leave it if you prefer a hard wipe on logout!
//   };

//   return (
//     <nav className="navbar">
//       <div className="logo">Fit Tracker</div>

//       <ul className="nav-links">
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/workouts">Workouts</Link></li>
//         <li><Link to="/diet-plans">Diet Plans</Link></li>
//         <li><Link to="/progress-tracker">Progress</Link></li>
//         {/* <li><Link to="/social-community">Community</Link></li> */}
//       </ul>

//       <div className="auth-section">
//         {!isAuthenticated ? (
//           <>
//             <Link to="/signup" className="btn">Signup</Link>
//             <Link to="/login" className="btn">Login</Link>
//           </>
//         ) : (
//           <>
//             <Link to="/dashboard" className="btn">Dashboard</Link>
//             <button onClick={handleLogout} className="btn logout-btn">Logout</button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


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