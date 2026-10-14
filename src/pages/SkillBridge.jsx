import { useMemo, useState } from "react";
import { useStudents } from "../context/StudentContext";

const ALL_SKILLS = [
  "React",
  "JavaScript",
  "HTML",
  "CSS",
  "Java",
  "Spring Boot",
  "SQL",
  "Python",
  "Data Structures",
  "Git",
  "UI/UX Design",
  "Figma",
  "Machine Learning",
  "Data Science",
  "Embedded Systems",
  "C",
  "CAD",
  "3D Modelling",
];

function findMatches(student, candidate) {
  const canLearn = student.learningGoals.filter((skill) =>
    candidate.skills.includes(skill)
  );

  const canTeach = student.skills.filter((skill) =>
    candidate.learningGoals.includes(skill)
  );

  const denominator =
    student.learningGoals.length + student.skills.length;

  const score = denominator
    ? Math.round(
        ((canLearn.length + canTeach.length) / denominator) * 100
      )
    : 0;

  return {
    canLearn,
    canTeach,
    score,
    isMutual: canLearn.length > 0 && canTeach.length > 0,
  };
}

function SkillTags({ skills, variant = "" }) {
  if (!skills.length) {
    return <span className="sb-muted">None selected</span>;
  }

  return (
    <div className="sb-tags">
      {skills.map((skill) => (
        <span
          className={`sb-tag ${variant}`}
          key={skill}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

export default function SkillBridge() {
  const { students } = useStudents();

  const [profileId, setProfileId] = useState(
    students[0]?.id ?? ""
  );
  const [skillFilter, setSkillFilter] = useState("all");
  const [mutualOnly, setMutualOnly] = useState(true);
  const [sortBy, setSortBy] = useState("match");

  const currentStudent = students.find(
    (student) => student.id === Number(profileId)
  );

  const recommendations = useMemo(() => {
    if (!currentStudent) return [];

    return students
      .filter((student) => student.id !== currentStudent.id)
      .map((student) => ({
        student,
        ...findMatches(currentStudent, student),
      }))
      .filter((match) => {
        if (mutualOnly && !match.isMutual) return false;

        if (skillFilter !== "all") {
          const relevantSkills = [
            ...match.canLearn,
            ...match.canTeach,
          ];

          if (!relevantSkills.includes(skillFilter)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "match") {
          return (
            Number(b.isMutual) - Number(a.isMutual) ||
            b.score - a.score ||
            a.student.name.localeCompare(b.student.name)
          );
        }

        return a.student.name.localeCompare(b.student.name);
      });
  }, [students, currentStudent, skillFilter, mutualOnly, sortBy]);

  const mutualCount = recommendations.filter(
    (match) => match.isMutual
  ).length;

  return (
    <div className="skillbridge">
      <header className="sb-header">
        <div>
          <div className="sb-eyebrow">
            <span className="sb-eyebrow-line" />
            LEARN TOGETHER. GROW TOGETHER.
          </div>

          <h1 className="sb-title">
            Skills are better
            <br />
            <span>when shared.</span>
          </h1>

          <p className="sb-intro">
            Find classmates who can teach what you want to learn
            and learn what you can teach.
          </p>
        </div>

        <div className="sb-header-art" aria-hidden="true">
          <div className="sb-orbit sb-orbit-one" />
          <div className="sb-orbit sb-orbit-two" />
          <div className="sb-art-center">S/B</div>
          <span className="sb-art-node sb-node-one">01</span>
          <span className="sb-art-node sb-node-two">02</span>
          <span className="sb-art-node sb-node-three">↗</span>
        </div>
      </header>

      <section className="sb-profile-panel">
        <div className="sb-profile-heading">
          <span className="sb-step">01</span>
          <div>
            <h2>Start with your profile</h2>
            <p>Choose the student whose learning needs you want to explore.</p>
          </div>
        </div>

        <label className="sb-label" htmlFor="sb-profile">
          SELECT STUDENT
        </label>

        <select
          id="sb-profile"
          className="sb-select"
          value={profileId}
          onChange={(event) => {
            setProfileId(Number(event.target.value));
            setSkillFilter("all");
          }}
        >
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} — {student.department}
            </option>
          ))}
        </select>

        {currentStudent && (
          <div className="sb-profile-details">
            <div className="sb-avatar sb-own-avatar">
              {currentStudent.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>

            <div className="sb-profile-info">
              <h3>{currentStudent.name}</h3>
              <p>
                {currentStudent.department} · {currentStudent.year}
              </p>
            </div>
            <span className="sb-profile-badge">YOUR VIEW</span>
          </div>
        )}

        {currentStudent && (
          <div className="sb-profile-skills">
            <div className="sb-skill-column">
              <span className="sb-label">I CAN TEACH</span>
              <SkillTags
                skills={currentStudent.skills}
                variant="teach"
              />
            </div>

            <div className="sb-skill-column">
              <span className="sb-label">I WANT TO LEARN</span>
              <SkillTags
                skills={currentStudent.learningGoals}
                variant="learn"
              />
            </div>
          </div>
        )}
      </section>

      <section className="sb-results">
        <div className="sb-results-heading">
          <div>
            <div className="sb-section-kicker">YOUR LEARNING NETWORK</div>
            <h2>People worth learning with.</h2>
            <p>
              {recommendations.length} potential{" "}
              {recommendations.length === 1 ? "partner" : "partners"} found
            </p>
          </div>

          <div className="sb-result-count">
            <strong>{String(mutualCount).padStart(2, "0")}</strong>
            <span>MUTUAL MATCHES</span>
          </div>
        </div>

        <div className="sb-filters">
          <label className="sb-filter-field">
            <span className="sb-label">FILTER BY SKILL</span>
            <select
              className="sb-select"
              value={skillFilter}
              onChange={(event) => setSkillFilter(event.target.value)}
            >
              <option value="all">All skills</option>
              {ALL_SKILLS.map((skill) => (
                <option value={skill} key={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </label>

          <label className="sb-filter-field">
            <span className="sb-label">SORT RESULTS</span>
            <select
              className="sb-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="match">Best matches first</option>
              <option value="name">Student name</option>
            </select>
          </label>
        </div>

        <label className="sb-toggle">
          <input
            type="checkbox"
            checked={mutualOnly}
            onChange={(event) => setMutualOnly(event.target.checked)}
          />
          <span className="sb-toggle-track" />
          <span>Show mutual skill exchanges only</span>
        </label>

        <div className="sb-match-list">
          {recommendations.map((match, index) => (
            <article
              className="sb-match-card"
              key={match.student.id}
            >
              <div className="sb-card-top">
                <span className="sb-match-index">
                  MATCH / {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className={`sb-match-badge ${
                    match.isMutual ? "is-mutual" : ""
                  }`}
                >
                  {match.isMutual
                    ? "↔ Mutual exchange"
                    : "→ One-way opportunity"}
                </span>
              </div>

              <div className="sb-person">
                <div className="sb-avatar">
                  {match.student.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="sb-person-info">
                  <h3>{match.student.name}</h3>
                  <p>
                    {match.student.department} · {match.student.year}
                  </p>
                  <span>{match.student.rollNo}</span>
                </div>

                <div className="sb-score">
                  <strong>{match.score}%</strong>
                  <span>COMPATIBILITY</span>
                </div>
              </div>

              <div className="sb-exchange">
                <div className="sb-exchange-column">
                  <span className="sb-exchange-label">
                    YOU CAN LEARN
                  </span>
                  <SkillTags skills={match.canLearn} variant="learn" />
                  {!match.canLearn.length && (
                    <p className="sb-no-overlap">
                      No matching teaching skill yet
                    </p>
                  )}
                </div>

                <div className="sb-exchange-arrow" aria-hidden="true">
                  ↔
                </div>

                <div className="sb-exchange-column">
                  <span className="sb-exchange-label">
                    YOU CAN TEACH
                  </span>
                  <SkillTags skills={match.canTeach} variant="teach" />
                  {!match.canTeach.length && (
                    <p className="sb-no-overlap">
                      No matching learning goal yet
                    </p>
                  )}
                </div>
              </div>

              <div className="sb-card-footer">
                <p>
                  <span className="sb-footer-sparkle">✳</span>
                  {match.isMutual
                    ? "You can help each other grow."
                    : "There may still be an opportunity to learn together."}
                </p>

                <button
                  type="button"
                  className="sb-plan-button"
                  onClick={() => {
                    const topics = [
                      ...match.canLearn,
                      ...match.canTeach,
                    ];

                    const message = match.isMutual
                      ? `Study session with ${match.student.name}: discuss ${topics.join(", ")}. Suggested duration: 30 minutes.`
                      : `Explore a study session with ${match.student.name}. Potential topics: ${topics.join(", ") || "discover each other's skills"}.`;

                    window.alert(message);
                  }}
                >
                  Study session idea <span>↗</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {recommendations.length === 0 && (
          <div className="sb-empty">
            <span className="sb-empty-icon">⌕</span>
            <h3>No matching partners yet</h3>
            <p>
              Try another skill, select a different student, or turn off
              the mutual-match filter to explore more opportunities.
            </p>
            <button
              type="button"
              className="sb-reset-button"
              onClick={() => {
                setSkillFilter("all");
                setMutualOnly(false);
                setSortBy("match");
              }}
            >
              Explore all opportunities ↗
            </button>
          </div>
        )}
      </section>

      <footer className="sb-footer">
        <span>STUDY CLUB / SKILLBRIDGE</span>
        <span>BETTER TOGETHER, ONE SKILL AT A TIME.</span>
      </footer>
    </div>
  );
}
