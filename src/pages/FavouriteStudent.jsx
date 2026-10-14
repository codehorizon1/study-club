
import { useState } from "react";
import { useStudents } from "../context/StudentContext";

export default function FavouriteStudents() {
  const {
    favourites,
    removeFavourite,
    collections,
    createCollection,
    assignCollection,
    getStudentCollections,
    studentNotes,
    updateStudentNote,
  } = useStudents();

  const [activeCollection, setActiveCollection] = useState("all");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [message, setMessage] = useState("");

  const visibleStudents =
    activeCollection === "all"
      ? favourites
      : favourites.filter((student) =>
          getStudentCollections(student.id).some(
            (collection) => collection.id === activeCollection
          )
        );

  function handleCreateCollection(event) {
    event.preventDefault();

    if (!newCollectionName.trim()) {
      setMessage("Enter a collection name first.");
      return;
    }

    const created = createCollection(newCollectionName);

    if (!created) {
      setMessage("That collection already exists.");
      return;
    }

    setNewCollectionName("");
    setMessage("Your new collection is ready!");
    setActiveCollection("all");
  }

  return (
    <section className="favourites-page">
      <header className="page-heading">
        <div>
          <span className="eyebrow">YOUR PERSONAL DIRECTORY</span>
          <h1>Your favourites<span className="heading-period">.</span></h1>
          <p className="page-description">
            Keep your favourite people close and organise the connections
            that matter to you.
          </p>
        </div>

        <div className="favourites-total">
          <span className="total-number">{favourites.length}</span>
          <span className="total-label">SAVED PEOPLE</span>
        </div>
      </header>

      <section className="collection-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ORGANISE YOUR PEOPLE</span>
            <h2>Favourite collections</h2>
          </div>
          <span className="collection-count">
            {collections.length} COLLECTIONS
          </span>
        </div>

        <div className="collection-filters">
          <button
            type="button"
            className={`collection-chip ${
              activeCollection === "all" ? "selected" : ""
            }`}
            onClick={() => setActiveCollection("all")}
          >
            All favourites
            <span>{favourites.length}</span>
          </button>

          {collections.map((collection) => {
            const count = favourites.filter((student) =>
              getStudentCollections(student.id).some(
                (item) => item.id === collection.id
              )
            ).length;

            return (
              <button
                type="button"
                key={collection.id}
                className={`collection-chip ${
                  activeCollection === collection.id ? "selected" : ""
                }`}
                onClick={() => setActiveCollection(collection.id)}
              >
                {collection.name}
                <span>{count}</span>
              </button>
            );
          })}
        </div>

        <form className="create-collection-form" onSubmit={handleCreateCollection}>
          <input
            type="text"
            value={newCollectionName}
            onChange={(event) => setNewCollectionName(event.target.value)}
            placeholder="Create a collection, e.g. Hackathon Team"
            aria-label="New collection name"
            maxLength={40}
          />
          <button type="submit" className="create-collection-button">
            + Create collection
          </button>
        </form>

        {message && (
          <p className="collection-message" role="status">
            {message}
          </p>
        )}
      </section>

      <div className="favourite-list-heading">
        <div>
          <span className="eyebrow">THE PEOPLE YOU PICKED</span>
          <h2>
            {activeCollection === "all"
              ? "Your saved students"
              : collections.find((item) => item.id === activeCollection)?.name}
          </h2>
        </div>
        <span className="results-count">
          {visibleStudents.length}{" "}
          {visibleStudents.length === 1 ? "STUDENT" : "STUDENTS"}
        </span>
      </div>

      {visibleStudents.length === 0 ? (
        <div className="empty-state">
          <span className="empty-symbol">♡</span>
          <h3>
            {favourites.length === 0
              ? "Your story starts here."
              : "No students in this collection yet."}
          </h3>
          <p>
            {favourites.length === 0
              ? "Visit All Students and tap the favourite button to save someone here."
              : "Choose a student below this page's collection controls and assign them to this collection."}
          </p>
        </div>
      ) : (
        <div className="favourite-students-grid">
          {visibleStudents.map((student) => {
            const assignedCollections = getStudentCollections(student.id);

            return (
              <article className="favourite-student-card" key={student.id}>
                <div className="student-card-top">
                  <div className="student-avatar">
                    {student.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  <button
                    type="button"
                    className="remove-favourite-button"
                    onClick={() => removeFavourite(student.id)}
                    aria-label={`Remove ${student.name} from favourites`}
                    title="Remove from favourites"
                  >
                    ♥
                  </button>
                </div>

                <h3>{student.name}</h3>
                <p className="student-roll">{student.rollNo}</p>
                <p className="student-department">{student.department}</p>

                <div className="student-meta">
                  <span>{student.year}</span>
                </div>

                <div className="student-collection-editor">
                  <span className="field-label">ADD TO COLLECTIONS</span>

                  <div className="student-collection-options">
                    {collections.map((collection) => {
                      const isAssigned = assignedCollections.some(
                        (item) => item.id === collection.id
                      );

                      return (
                        <label
                          key={collection.id}
                          className={`collection-option ${
                            isAssigned ? "checked" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={() =>
                              assignCollection(student.id, collection.id)
                            }
                          />
                          <span>{collection.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="student-note-editor">
                  <label
                    className="field-label"
                    htmlFor={`student-note-${student.id}`}
                  >
                    PERSONAL NOTE
                  </label>
                  <textarea
                    id={`student-note-${student.id}`}
                    value={studentNotes[student.id] || ""}
                    onChange={(event) =>
                      updateStudentNote(student.id, event.target.value)
                    }
                    placeholder="E.g. Great teammate for projects..."
                    rows={2}
                    maxLength={200}
                  />
                  <span className="note-counter">
                    {(studentNotes[student.id] || "").length}/200
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
