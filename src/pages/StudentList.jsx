
import { useMemo, useState } from "react";
import StudentCard from "../components/StudentCard";
import { useStudents } from "../context/StudentContext";

export default function StudentList() {
  const { students, favourites } = useStudents();
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) =>
      [
        student.name,
        student.rollNo,
        student.department,
        student.year,
      ].some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
  }, [students, search]);

  return (
    <section className="page-content">
      <div className="page-eyebrow">
        <span className="eyebrow-line" />
        YOUR PEOPLE, ALL IN ONE PLACE
      </div>

      <header className="page-heading">
        <div>
          <h1>
            Find your <span className="heading-accent">people.</span>
          </h1>

          <p className="page-description">
            A little directory of the people who make campus interesting.
          </p>
        </div>

        <div className="heading-index">
          <span>DIRECTORY</span>
          <strong>
            01<span>/02</span>
          </strong>
        </div>
      </header>

      <div className="overview-strip">
        <div className="overview-item">
          <span className="overview-label">TOTAL STUDENTS</span>
          <strong>
            {String(students.length).padStart(2, "0")}
          </strong>
          <span className="overview-description">
            Campus directory
          </span>
        </div>

        <div className="overview-divider" />

        <div className="overview-item">
          <span className="overview-label">YOUR FAVOURITES</span>
          <strong>
            {String(favourites.length).padStart(2, "0")}
          </strong>
          <span className="overview-description">
            People you have saved
          </span>
        </div>

        <div className="overview-spacer" />

        <div className="directory-tag">
          <span className="status-dot" />

          <div className="directory-status-text">
            <strong>Directory active</strong>
            <span>Ready to explore</span>
          </div>
        </div>
      </div>

      <div className="list-toolbar">
        <div>
          <div className="page-eyebrow list-eyebrow">
            GET TO KNOW YOUR CAMPUS
          </div>

          <h2>
            Student directory{" "}
            <span className="student-count-badge">
              {filteredStudents.length}
            </span>
          </h2>

          <p>Discover someone worth keeping in touch with.</p>
        </div>

        <label className="search-box">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>

          <input
            type="search"
            placeholder="Search students..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search students by name, roll number, department or year"
          />

          {search ? (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          ) : (
            <span className="search-shortcut">/</span>
          )}
        </label>
      </div>

      {filteredStudents.length > 0 ? (
        <div className="student-list">
          {filteredStudents.map((student, index) => (
            <StudentCard
              key={student.id}
              student={student}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state search-empty">
          <div className="empty-symbol">⌕</div>

          <h3>No students found.</h3>

          <p>
            Try a different name, roll number, department or year.
          </p>

          <button
            type="button"
            className="text-action"
            onClick={() => setSearch("")}
          >
            Clear search ↗
          </button>
        </div>
      )}

      <footer className="list-footer">
        <span>END OF DIRECTORY</span>

        <span>
          MADE FOR YOUR COMMUNITY{" "}
          <span className="footer-star">✳</span>
        </span>
      </footer>
    </section>
  );
}
