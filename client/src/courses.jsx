
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "./services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load courses from backend
  useEffect(() => {
    let active = true;

    async function loadCourses() {
      try {
        setLoading(true);
        setError("");

        const result = await apiRequest("/courses");

        if (active) {
          setCourses(result.courses || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load courses.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      active = false;
    };
  }, []);

  // Get course categories
  const categories = useMemo(
    () => [
      "All",
      ...new Set(courses.map((course) => course.category)),
    ],
    [courses]
  );

  // Search and filter courses
  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory =
        category === "All" ||
        course.category === category;

      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [courses, search, category]);

  // Loading screen
  if (loading) {
    return (
      <main className="courses-page">
        <p>Loading courses...</p>
      </main>
    );
  }

  // Error screen
  if (error) {
    return (
      <main className="courses-page">
        <h2>Unable to load courses</h2>
        <p>{error}</p>

        <button onClick={() => window.location.reload()}>
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="courses-page">

      {/* Page heading */}
      <header className="courses-heading">
        <p className="courses-eyebrow">
          FORMA LEARNING LIBRARY
        </p>

        <h1>Explore Courses</h1>

        <p>
          Learn new skills with structured courses
          and trusted resources.
        </p>
      </header>

      {/* Search and category filter */}
      <section className="courses-toolbar">
        <input
          type="search"
          aria-label="Search courses"
          placeholder="Search courses..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          aria-label="Filter by category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "All"
                ? "All categories"
                : item}
            </option>
          ))}
        </select>
      </section>

      {/* Course count */}
      <p className="courses-count">
        {filteredCourses.length} course
        {filteredCourses.length === 1 ? "" : "s"} available
      </p>

      {/* Course cards */}
      <section className="courses-grid">
        {filteredCourses.map((course) => (
          <article
            className="course-card"
            key={course._id}
          >
            <div className="course-card-top">
              <span className="course-category">
                {course.category}
              </span>

              <span className="course-level">
                {course.level}
              </span>
            </div>

            <div className="course-card-body">
              <h2>{course.title}</h2>

              <p>{course.description}</p>

              <div className="course-meta">
                <span>◷ {course.duration}</span>

                <span>
                  {(course.resources || []).length} resources
                </span>
              </div>

              <button
                className="course-button"
                onClick={() => setSelectedCourse(course)}
              >
                Explore course →
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Empty search result */}
      {filteredCourses.length === 0 && (
        <p className="courses-empty">
          No courses match your search.
          Try another keyword or category.
        </p>
      )}

      {/* Course details modal */}
      {selectedCourse && (
        <div
          className="course-modal-backdrop"
          onClick={() => setSelectedCourse(null)}
        >
          <section
            className="course-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="course-modal-close"
              aria-label="Close course details"
              onClick={() => setSelectedCourse(null)}
            >
              ×
            </button>

            {/* Course information */}
            <span className="course-category">
              {selectedCourse.category}
            </span>

            <h2 id="course-modal-title">
              {selectedCourse.title}
            </h2>

            <p>{selectedCourse.description}</p>

            <p>
              <strong>Level:</strong>{" "}
              {selectedCourse.level}
              {" · "}
              <strong>Duration:</strong>{" "}
              {selectedCourse.duration}
            </p>

            {/* Learning resources */}
            <h3>Learning Lessons</h3>

            {(selectedCourse.resources || []).length === 0 ? (
              <p>No lessons have been added yet.</p>
            ) : (
              <div className="course-resources">
                {selectedCourse.resources.map((resource) => (
                  <article
                    key={resource._id}
                    className="course-resource"
                  >
                    <h4>{resource.title}</h4>

                    <p>
                      {resource.description ||
                        "Open this resource to start learning."}
                    </p>

                    <span>{resource.type}</span>

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Start learning →
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

    </main>
  );
}
