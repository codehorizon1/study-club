
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const StudentContext = createContext(null);

const STORAGE_KEY = "study-club-data";

const initialStudents = [
  { id: 1, name: "Arun Kumar", rollNo: "IT101", department: "Information Technology", year: "3rd Year" },
  { id: 2, name: "Priya Sharma", rollNo: "IT102", department: "Information Technology", year: "3rd Year" },
  { id: 3, name: "Rahul Raj", rollNo: "IT103", department: "Computer Science", year: "3rd Year" },
  { id: 4, name: "Sneha Devi", rollNo: "IT104", department: "Information Technology", year: "2nd Year" },
  { id: 5, name: "Karthik S", rollNo: "IT105", department: "Electronics", year: "4th Year" },
  { id: 6, name: "Divya Ramesh", rollNo: "IT106", department: "Computer Science", year: "3rd Year" },
  { id: 7, name: "Vikram Anand", rollNo: "IT107", department: "Information Technology", year: "2nd Year" },
  { id: 8, name: "Meera Krishnan", rollNo: "IT108", department: "Mechanical Engineering", year: "4th Year" },
];

const initialCollections = [
  { id: "study", name: "Study Partners", color: "violet" },
  { id: "project", name: "Project Teammates", color: "coral" },
  { id: "friends", name: "Close Friends", color: "mint" },
];

function loadSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return null;

    const parsed = JSON.parse(saved);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function StudentProvider({ children }) {
  const [savedData] = useState(loadSavedData);

  const [favourites, setFavourites] = useState(() =>
    Array.isArray(savedData?.favourites)
      ? savedData.favourites.filter(
          (savedStudent) =>
            initialStudents.some(
              (student) => student.id === savedStudent.id
            )
        )
      : []
  );

  const [collections, setCollections] = useState(() =>
    Array.isArray(savedData?.collections) &&
    savedData.collections.every(
      (collection) =>
        collection &&
        typeof collection.id === "string" &&
        typeof collection.name === "string"
    )
      ? savedData.collections
      : initialCollections
  );

  const [studentCollections, setStudentCollections] = useState(() =>
    savedData?.studentCollections &&
    typeof savedData.studentCollections === "object" &&
    !Array.isArray(savedData.studentCollections)
      ? savedData.studentCollections
      : {}
  );

  const [studentNotes, setStudentNotes] = useState(() =>
    savedData?.studentNotes &&
    typeof savedData.studentNotes === "object" &&
    !Array.isArray(savedData.studentNotes)
      ? savedData.studentNotes
      : {}
  );

  // Save all application data whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          favourites,
          collections,
          studentCollections,
          studentNotes,
        })
      );
    } catch (error) {
      console.error("Unable to save Study Club data:", error);
    }
  }, [
    favourites,
    collections,
    studentCollections,
    studentNotes,
  ]);

  function addFavourite(student) {
    setFavourites((current) => {
      if (current.some((item) => item.id === student.id)) {
        return current;
      }

      return [...current, student];
    });
  }

  function removeFavourite(id) {
    setFavourites((current) =>
      current.filter((student) => student.id !== id)
    );

    setStudentCollections((current) => {
      const updated = { ...current };
      delete updated[id];
      return updated;
    });

    setStudentNotes((current) => {
      const updated = { ...current };
      delete updated[id];
      return updated;
    });
  }

  function isFavourite(id) {
    return favourites.some((student) => student.id === id);
  }

  function createCollection(name) {
    const trimmedName = name.trim();

    if (!trimmedName) return false;

    const alreadyExists = collections.some(
      (collection) =>
        collection.name.toLowerCase() ===
        trimmedName.toLowerCase()
    );

    if (alreadyExists) return false;

    const id = `collection-${Date.now()}`;

    setCollections((current) => [
      ...current,
      {
        id,
        name: trimmedName,
        color: "violet",
      },
    ]);

    return true;
  }

  function assignCollection(studentId, collectionId) {
    setStudentCollections((current) => {
      const existing = current[studentId] || [];

      const updated = existing.includes(collectionId)
        ? existing.filter((id) => id !== collectionId)
        : [...existing, collectionId];

      return {
        ...current,
        [studentId]: updated,
      };
    });
  }

  function getStudentCollections(studentId) {
    const assignedIds = studentCollections[studentId] || [];

    return collections.filter((collection) =>
      assignedIds.includes(collection.id)
    );
  }

  function updateStudentNote(studentId, note) {
    setStudentNotes((current) => ({
      ...current,
      [studentId]: note,
    }));
  }

  return (
    <StudentContext.Provider
      value={{
        students: initialStudents,
        favourites,
        collections,
        studentCollections,
        studentNotes,
        addFavourite,
        removeFavourite,
        isFavourite,
        createCollection,
        assignCollection,
        getStudentCollections,
        updateStudentNote,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);

  if (!context) {
    throw new Error(
      "useStudents must be used inside StudentProvider"
    );
  }

  return context;
}
