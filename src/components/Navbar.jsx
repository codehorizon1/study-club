
import { Link, NavLink } from "react-router-dom";
import { useStudents } from "../context/StudentContext";

export default function Navbar() {
  const { students, favourites } = useStudents();

  return (
    <aside className="sidebar">
      <Link
        to="/"
        className="brand"
        aria-label="Study Club home"
      >
        <span className="brand-mark">S/C</span>

        <span className="brand-name">
          <span className="brand-title">STUDY CLUB</span>
          <span className="brand-subtitle">
            STUDENT DIRECTORY
          </span>
        </span>
      </Link>

      <div className="nav-section-label">WORKSPACE</div>

      <nav className="nav-links" aria-label="Main navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon" aria-hidden="true">
            ↗
          </span>
          <span className="nav-link-label">All students</span>
          <span className="nav-count">
            {String(students.length).padStart(2, "0")}
          </span>
        </NavLink>

        <NavLink
          to="/favourites"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon heart-nav-icon" aria-hidden="true">
            ♡
          </span>
          <span className="nav-link-label">Favourites</span>
          <span className="nav-count">
            {String(favourites.length).padStart(2, "0")}
          </span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span className="status-dot" />
          <span>YOUR CAMPUS COMMUNITY</span>
        </div>

        <p className="sidebar-tagline">
          Your next
          <br />
          favourite person
          <br />
          is right here.
        </p>

        <span className="sidebar-caption">
          A CAMPUS FULL OF CONNECTIONS.
        </span>

        <span className="sidebar-edition">
          EDITION 001 — 2026
        </span>
      </div>
    </aside>
  );
}
