
import { useEffect, useState } from "react";
import "./index.css";
import Auth from "./Auth.jsx";
import Courses from "./courses.jsx";
import { apiRequest } from "./services/api";

const topics = [
  { name: "HTML", icon: "🌐", lessons: 12, category: "Web Development" },
  { name: "CSS", icon: "🎨", lessons: 15, category: "Web Development" },
  { name: "JavaScript", icon: "⚡", lessons: 18, category: "Web Development" },
  { name: "Python", icon: "🐍", lessons: 20, category: "Programming" },
  { name: "Java", icon: "☕", lessons: 16, category: "Programming" },
  { name: "SQL", icon: "🗄️", lessons: 10, category: "Database" },
  { name: "Data Structures", icon: "🧩", lessons: 24, category: "Computer Science" },
  { name: "Algorithms", icon: "🧠", lessons: 22, category: "Computer Science" },
];

const lessons = [
  {
    title: "Introduction to HTML",
    description: "Learn how to structure web pages using HTML.",
    code: "<h1>Hello, World!</h1>\n<p>My first webpage.</p>",
  },
  {
    title: "Introduction to CSS",
    description: "Learn how to style your web pages with CSS.",
    code: "h1 {\n  color: green;\n  font-size: 32px;\n}",
  },
  {
    title: "Introduction to JavaScript",
    description: "Make your web pages interactive.",
    code: 'console.log("Hello, World!");',
  },
  {
    title: "Introduction to Python",
    description: "Learn your first Python statement.",
    code: 'print("Hello, World!")',
  },
  {
    title: "Introduction to Java",
    description: "Learn the basics of Java programming.",
    code: 'System.out.println("Hello, World!");',
  },
  {
    title: "Introduction to SQL",
    description: "Learn how to retrieve data from a database.",
    code: "SELECT * FROM students;",
  },
];

const quizQuestions = [
  {
    topic: "HTML",
    question: "Which HTML tag is used for the largest heading?",
    options: ["<head>", "<h1>", "<heading>", "<title>"],
    correct: "<h1>",
    explanation: "The <h1> element represents the highest-level heading.",
  },
  {
    topic: "CSS",
    question: "Which CSS property changes the text color?",
    options: ["font-style", "background", "color", "text-size"],
    correct: "color",
    explanation: "The color property sets the foreground color of text.",
  },
  {
    topic: "JavaScript",
    question: "Which keyword declares a block-scoped variable that can be reassigned?",
    options: ["const", "let", "define", "print"],
    correct: "let",
    explanation: "Use let when you need a block-scoped variable that can be reassigned.",
  },
  {
    topic: "Python",
    question: "Which function displays output in Python?",
    options: ["echo()", "show()", "print()", "display()"],
    correct: "print()",
    explanation: "The print() function displays output in Python.",
  },
  {
    topic: "Java",
    question: "Which method is the usual entry point of a Java application?",
    options: ["start()", "main()", "runApp()", "begin()"],
    correct: "main()",
    explanation: "Java applications commonly start execution from the main method.",
  },
  {
    topic: "SQL",
    question: "Which SQL command retrieves data from a table?",
    options: ["GET", "OPEN", "SELECT", "FETCH ALL"],
    correct: "SELECT",
    explanation: "SELECT retrieves rows and columns from database tables.",
  },
  {
    topic: "Data Structures",
    question: "Which data structure follows FIFO order?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correct: "Queue",
    explanation: "FIFO means First In, First Out, which is how a queue works.",
  },
  {
    topic: "Algorithms",
    question: "Which search algorithm requires sorted data?",
    options: ["Linear search", "Binary search", "Sequential scan", "Simple traversal"],
    correct: "Binary search",
    explanation: "Binary search repeatedly halves the search range in sorted data.",
  },
];

function App() {
  const [activeTopic, setActiveTopic] = useState("HTML");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Learn");
  const [completed, setCompleted] = useState([]);
  const [saved, setSaved] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [notes, setNotes] = useState("");
  const [practiceInput, setPracticeInput] = useState("print('Hello, World!')");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore the user's session when Forma opens.
  useEffect(() => {
    const token = sessionStorage.getItem("formaToken");

    if (!token) {
      setAuthLoading(false);
      return;
    }

    apiRequest("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((result) => {
        setUser(result.user);
      })
      .catch(() => {
        sessionStorage.removeItem("formaToken");
        setUser(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("formaToken");
    setUser(null);
    setShowAuth(false);
    setActiveTab("Learn");
  }

  function toggleSaved(topicName) {
    setSaved((previous) =>
      previous.includes(topicName)
        ? previous.filter((name) => name !== topicName)
        : [...previous, topicName]
    );
  }

  function markComplete() {
    setCompleted((previous) =>
      previous.includes(activeTopic)
        ? previous
        : [...previous, activeTopic]
    );
  }

  function selectTab(tab) {
    setActiveTab(tab);
    setShowQuiz(tab === "Assessments");
    setQuizSubmitted(false);
  }

  function selectTopic(topicName) {
    setActiveTopic(topicName);
    setShowQuiz(false);
    setQuizSubmitted(false);
  }

  function submitQuiz() {
    setQuizSubmitted(true);
  }

  const filteredTopics = topics.filter((topic) =>
    `${topic.name} ${topic.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const currentLesson =
    lessons.find((lesson) => lesson.title.includes(activeTopic)) || {
      title: `Introduction to ${activeTopic}`,
      description: `Start learning ${activeTopic} with this beginner-friendly lesson.`,
      code: `// Welcome to ${activeTopic}\n// Your lesson starts here.`,
    };

  const currentQuiz =
    quizQuestions.find((question) => question.topic === activeTopic) ||
    quizQuestions[0];

  const correctAnswers = quizQuestions.filter(
    (question) => quizAnswers[question.topic] === question.correct
  ).length;

  // Keep all hooks above conditional returns.
  if (authLoading) {
    return (
      <div className="app">
        <main className="main-content">
          <p role="status">Loading your Forma account...</p>
        </main>
      </div>
    );
  }

  if (showAuth) {
    return (
      <Auth
        onBack={() => setShowAuth(false)}
        onAuthSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setShowAuth(false);
        }}
      />
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => selectTab("Learn")}
          aria-label="Go to Forma home"
        >
          <span className="brand-icon">F</span>
          Forma<span className="brand-dot">.</span>
        </button>

        <div className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder={
              activeTab === "Courses"
                ? "Search courses..."
                : "Search tutorials and topics..."
            }
            aria-label="Search learning topics"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);

              if (activeTab === "Courses") {
                // Courses.jsx has its own course search field.
                // Switch to learning topics when using the top search.
                setActiveTab("Learn");
              }
            }}
          />
          <kbd>Search</kbd>
        </div>

        <nav className="top-links" aria-label="Main navigation">
          {["Learn", "Courses", "Tutorials", "Practice", "Assessments"].map(
            (tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "top-link active" : "top-link"}
                onClick={() => selectTab(tab)}
              >
                {tab}
              </button>
            )
          )}
        </nav>

        {user ? (
          <div className="user-menu">
            <span className="user-greeting">Hi, {user.name}</span>
            <button className="login-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button
            className="login-button"
            onClick={() => setShowAuth(true)}
          >
            Sign in
          </button>
        )}
      </header>

      <div className="topicbar" aria-label="Learning topics">
        {topics.map((topic) => (
          <button
            key={topic.name}
            className={
              activeTopic === topic.name ? "topic-link selected" : "topic-link"
            }
            onClick={() => selectTopic(topic.name)}
          >
            {topic.name}
          </button>
        ))}
      </div>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-heading">LEARNING MENU</div>

          <button
            className={`side-link ${activeTab === "Learn" ? "selected" : ""}`}
            onClick={() => selectTab("Learn")}
          >
            <span>⌂</span> Learning dashboard
          </button>

          <button
            className={`side-link ${activeTab === "Tutorials" ? "selected" : ""}`}
            onClick={() => selectTab("Tutorials")}
          >
            <span>▤</span> All tutorials
          </button>

          <button
            className={`side-link ${activeTab === "Courses" ? "selected" : ""}`}
            onClick={() => selectTab("Courses")}
          >
            <span>▣</span> Courses
          </button>

          <button
            className={`side-link ${activeTab === "Practice" ? "selected" : ""}`}
            onClick={() => selectTab("Practice")}
          >
            <span>⌘</span> Coding practice
          </button>

          <button
            className={`side-link ${activeTab === "Assessments" ? "selected" : ""}`}
            onClick={() => selectTab("Assessments")}
          >
            <span>✓</span> Skill assessments
          </button>

          <div className="sidebar-heading section-heading">YOUR LEARNING</div>

          <div className="progress-card">
            <div className="progress-title">Your progress</div>
            <div className="progress-number">
              {completed.length} <span>/ {topics.length} topics</span>
            </div>

            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={completed.length}
              aria-valuemin={0}
              aria-valuemax={topics.length}
              aria-label="Completed topics"
            >
              <div
                className="progress-fill"
                style={{
                  width: `${(completed.length / topics.length) * 100}%`,
                }}
              />
            </div>

            <p>Keep learning a little every day.</p>
          </div>

          <div className="sidebar-heading section-heading">QUICK ACCESS</div>

          <button
            className={`side-link ${activeTab === "Bookmarks" ? "selected" : ""}`}
            onClick={() => selectTab("Bookmarks")}
          >
            <span>☆</span> Bookmarks ({saved.length})
          </button>

          <button
            className={`side-link ${activeTab === "Notes" ? "selected" : ""}`}
            onClick={() => selectTab("Notes")}
          >
            <span>▧</span> My notes
          </button>

          <div className="sidebar-bottom">
            <div className="help-icon">?</div>
            <div>
              <strong>Keep growing</strong>
              <p>One lesson at a time.</p>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div className="breadcrumb">
            Home <span>/</span> {activeTab}
            {activeTab !== "Courses" && (
              <>
                {" "}
                <span>/</span> {activeTopic}
              </>
            )}
          </div>

          {activeTab === "Courses" ? (
            <Courses />
          ) : activeTab === "Bookmarks" ? (
            <section>
              <div className="page-heading">
                <span className="eyebrow">YOUR COLLECTION</span>
                <h1>Saved topics</h1>
                <p>Your bookmarked topics are collected here.</p>
              </div>

              <div className="topic-grid">
                {topics
                  .filter((topic) => saved.includes(topic.name))
                  .map((topic) => (
                    <TopicCard
                      key={topic.name}
                      topic={topic}
                      activeTopic={activeTopic}
                      setActiveTopic={selectTopic}
                      saved={saved}
                      toggleSaved={toggleSaved}
                    />
                  ))}
              </div>

              {saved.length === 0 && (
                <p className="empty-message">
                  No bookmarks yet. Save a topic using the star on its card.
                </p>
              )}
            </section>
          ) : activeTab === "Notes" ? (
            <section className="notes-card">
              <span className="eyebrow">PERSONAL STUDY SPACE</span>
              <h1>My learning notes</h1>
              <p>
                Write down key concepts, questions, and things you want to
                remember.
              </p>

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Start writing your notes here..."
                rows={12}
              />

              <p className="note-hint">
                Notes are currently stored in memory and will reset when you
                refresh the page.
              </p>
            </section>
          ) : activeTab === "Practice" ? (
            <section className="section practice-section">
              <div className="section-header">
                <div>
                  <span className="eyebrow">HANDS-ON LEARNING</span>
                  <h2>Coding practice</h2>
                  <p>
                    Write code in the editor and prepare for practical
                    exercises.
                  </p>
                </div>
                <span className="level-pill">BEGINNER</span>
              </div>

              <div className="practice-card">
                <label htmlFor="practice-code">Your code</label>
                <textarea
                  id="practice-code"
                  className="code-editor"
                  value={practiceInput}
                  onChange={(event) => setPracticeInput(event.target.value)}
                  spellCheck={false}
                />
                <p className="note-hint">
                  This editor currently stores your text only. Code execution
                  will be added with a secure execution service later.
                </p>
              </div>
            </section>
          ) : (
            <>
              {activeTab === "Learn" && (
                <section className="welcome-banner">
                  <div className="welcome-copy">
                    <span className="eyebrow">
                      YOUR LEARNING JOURNEY STARTS HERE
                    </span>
                    <h1>
                      Learn something
                      <br />
                      new today.
                    </h1>
                    <p>
                      Build practical skills with clear tutorials, hands-on
                      practice, and quick assessments.
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => selectTab("Tutorials")}
                    >
                      Explore tutorials <span>→</span>
                    </button>
                  </div>

                  <div className="banner-art" aria-hidden="true">
                    <div className="art-circle circle-one" />
                    <div className="art-circle circle-two" />
                    <div className="code-window">
                      <div className="window-dots">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="code-line muted">
                        01 &nbsp; <span>function</span> learn() {"{"}
                      </div>
                      <div className="code-line">02 &nbsp;&nbsp; practice();</div>
                      <div className="code-line">03 &nbsp;&nbsp; grow();</div>
                      <div className="code-line muted">04 &nbsp; {"}"}</div>
                      <div className="code-cursor" />
                    </div>
                    <div className="floating-tag tag-top">{"</>"}</div>
                    <div className="floating-tag tag-bottom">
                      ✦ Keep learning
                    </div>
                  </div>
                </section>
              )}

              <section className="section">
                <div className="section-header">
                  <div>
                    <span className="eyebrow">EXPLORE & DISCOVER</span>
                    <h2>
                      {activeTab === "Tutorials"
                        ? "All tutorials"
                        : "Browse learning topics"}
                    </h2>
                    <p>
                      {activeTab === "Tutorials"
                        ? "Choose a tutorial and start learning step by step."
                        : "Choose a topic and start building your knowledge."}
                    </p>
                  </div>
                  <span className="result-count">
                    {filteredTopics.length} topics
                  </span>
                </div>

                <div className="topic-grid">
                  {filteredTopics.map((topic) => (
                    <TopicCard
                      key={topic.name}
                      topic={topic}
                      activeTopic={activeTopic}
                      setActiveTopic={selectTopic}
                      saved={saved}
                      toggleSaved={toggleSaved}
                    />
                  ))}
                </div>

                {filteredTopics.length === 0 && (
                  <p className="empty-message">
                    No topics found. Try another search.
                  </p>
                )}
              </section>

              <section className="section lesson-section">
                <div className="section-header">
                  <div>
                    <span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span>
                    <h2>
                      {showQuiz
                        ? `${activeTopic} skill assessment`
                        : `${activeTopic} learning path`}
                    </h2>
                    <p>
                      {showQuiz
                        ? "Test your understanding with a multiple-choice question."
                        : "Learn the basics, follow examples, and practise as you go."}
                    </p>
                  </div>
                  <span className="level-pill">BEGINNER FRIENDLY</span>
                </div>

                {showQuiz ? (
                  <div className="quiz-card">
                    <div className="quiz-topline">
                      <span>QUESTION 1 OF 1</span>
                      <span>{currentQuiz.topic.toUpperCase()} BASICS</span>
                    </div>

                    <h3>{currentQuiz.question}</h3>

                    {currentQuiz.options.map((option) => (
                      <label
                        key={option}
                        className={`quiz-option ${
                          quizAnswers[currentQuiz.topic] === option
                            ? "chosen"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${currentQuiz.topic}`}
                          value={option}
                          checked={quizAnswers[currentQuiz.topic] === option}
                          onChange={() => {
                            setQuizAnswers((previous) => ({
                              ...previous,
                              [currentQuiz.topic]: option,
                            }));
                            setQuizSubmitted(false);
                          }}
                        />
                        <code>{option}</code>
                      </label>
                    ))}

                    <button
                      className="primary-button"
                      onClick={submitQuiz}
                      disabled={!quizAnswers[currentQuiz.topic]}
                    >
                      Check answer
                    </button>

                    {quizSubmitted && (
                      <div
                        className={
                          quizAnswers[currentQuiz.topic] === currentQuiz.correct
                            ? "correct-answer"
                            : "wrong-answer"
                        }
                        role="status"
                      >
                        <p>
                          {quizAnswers[currentQuiz.topic] === currentQuiz.correct
                            ? "Correct!"
                            : `Not quite. The correct answer is ${currentQuiz.correct}.`}
                        </p>
                        <p>{currentQuiz.explanation}</p>
                        <p>
                          Correct answers across topics: {correctAnswers} /{" "}
                          {quizQuestions.length}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="lesson-card">
                    <div className="lesson-copy">
                      <span className="lesson-number">LESSON 01</span>
                      <h3>{currentLesson.title}</h3>
                      <p>{currentLesson.description}</p>
                      <div className="lesson-meta">
                        <span>◷ 5 min read</span>
                        <span>▤ Beginner</span>
                      </div>
                      <button className="primary-button" onClick={markComplete}>
                        {completed.includes(activeTopic)
                          ? "Lesson completed ✓"
                          : "Mark as complete"}
                      </button>
                    </div>

                    <div className="example-panel">
                      <div className="example-heading">
                        <span>Example</span>
                        <span className="live-dot">● Ready to learn</span>
                      </div>
                      <pre>
                        <code>{currentLesson.code}</code>
                      </pre>
                      <div className="example-footer">
                        Try the example as you learn
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}

          <footer className="footer">
            <span>© 2026 Forma Learning</span>
            <span>Learn · Practise · Grow</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function TopicCard({
  topic,
  activeTopic,
  setActiveTopic,
  saved,
  toggleSaved,
}) {
  const isSaved = saved.includes(topic.name);

  return (
    <article
      className={`topic-card ${
        activeTopic === topic.name ? "topic-card-active" : ""
      }`}
    >
      <div className="topic-card-top">
        <div className="topic-icon">{topic.icon}</div>
        <button
          className={`bookmark-button ${isSaved ? "bookmarked" : ""}`}
          aria-label={isSaved ? "Remove bookmark" : "Bookmark topic"}
          aria-pressed={isSaved}
          onClick={() => toggleSaved(topic.name)}
        >
          {isSaved ? "★" : "☆"}
        </button>
      </div>
      <span className="topic-category">{topic.category}</span>
      <h3>{topic.name}</h3>
      <p>{topic.lessons} lessons to explore</p>
      <button className="text-button" onClick={() => setActiveTopic(topic.name)}>
        Start learning <span>→</span>
      </button>
    </article>
  );
}

export default App;
