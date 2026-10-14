
import { useStudents } from "../context/StudentContext";

export default function StudentCard({
  student,
  index = 0,
  removable = false,
}) {
  const { addFavourite, removeFavourite, isFavourite } = useStudents();

  const saved = isFavourite(student.id);

  const initials = student.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleFavouriteClick() {
    if (removable) {
      removeFavourite(student.id);
    } else if (!saved) {
      addFavourite(student);
    }
  }

  return (
    <article
      className={`student-card ${removable ? "student-card-removable" : ""}`}
      style={{ "--card-index": index }}
    >
      <div className="student-card-identity">
        <span className="student-number">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div
          className={`student-avatar avatar-${student.color || "blue"}`}
          aria-hidden="true"
        >
          {initials}
        </div>
      </div>

      <div className="student-info">
        <h3>{student.name}</h3>

        <p className="student-department">{student.department}</p>

        <div className="student-meta">
          <span>{student.rollNo}</span>
          <span className="meta-separator" aria-hidden="true">
            /
          </span>
          <span>{student.year}</span>
        </div>
      </div>

      <button
        type="button"
        className={`favourite-button ${
          saved && !removable ? "is-saved" : ""
        } ${removable ? "remove-button" : ""}`}
        onClick={handleFavouriteClick}
        disabled={!removable && saved}
        aria-label={
          removable
            ? `Remove ${student.name} from favourites`
            : saved
              ? `${student.name} is already in favourites`
              : `Add ${student.name} to favourites`
        }
        aria-pressed={removable ? undefined : saved}
      >
        <span className="heart-icon" aria-hidden="true">
          {removable ? "×" : saved ? "♥" : "♡"}
        </span>

        <span className="button-label">
          {removable ? "Remove favourite" : saved ? "Added to favourites" : "Add to favourites"}
        </span>
      </button>
    </article>
  );
}
