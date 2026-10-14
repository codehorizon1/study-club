
import { useEffect } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import StudentList from "./pages/StudentList";
import FavouriteStudents from "./pages/FavouriteStudent";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-kicker">STUDY CLUB</span>
        <span className="topbar-slash">/</span>
        <span>THE PEOPLE INDEX</span>
        <span className="topbar-year">2026</span>
      </div>

      <div className="topbar-right">
        <span className="status-dot" />
        <span>BUILT AROUND PEOPLE</span>
      </div>
    </header>
  );
}

function NotFound() {
  return (
    <section className="page-content not-found-page">
      <div className="empty-state">
        <div className="empty-symbol">404</div>
        <span className="empty-kicker">WRONG TURN?</span>
        <h3>This page doesn't exist.</h3>
        <p>
          The people index is still here.
          Let's get you back to the directory.
        </p>
        <Link to="/" className="primary-button">
          Explore students <span>↗</span>
        </Link>
      </div>
    </section>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <ScrollToTop />

      <Navbar />

      <main className="main-area">
        <Topbar />

        <div key={location.pathname} className="route-view">
          <Routes>
            <Route path="/" element={<StudentList />} />

            <Route
              path="/favourites"
              element={<FavouriteStudents />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <footer className="app-footer">
          <span>STUDY CLUB®</span>
          <span>GOOD PEOPLE. GOOD ENERGY.</span>
          <span>EDITION 001 — 2026</span>
        </footer>
      </main>
    </div>
  );
}
