
import { useState } from "react";
import "./index.css";

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
    title: "Introduction to Python",
    description: "Learn your first Python statement.",
    code: 'print("Hello, World!")',
  },
  {
    title: "Introduction to JavaScript",
    description: "Make your web pages interactive.",
    code: 'console.log("Hello, World!");',
  },
];

function App() {
  const [activeTopic, setActiveTopic] = useState("HTML");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Learn");
  const [completed, setCompleted] = useState([]);
  const [saved, setSaved] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answer, setAnswer] = useState("");
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentLesson =
    lessons.find((lesson) => lesson.title.includes(activeTopic)) ||
    {
      title: `Introduction to ${activeTopic}`,
      description: `Start learning ${activeTopic} with this beginner-friendly lesson.`,
      code: `// Welcome to ${activeTopic}\n// Your lesson starts here.`,
    };

  function toggleSaved(topicName) {
    setSaved((previous) =>
      previous.includes(topicName)
        ? previous.filter((name) => name !== topicName)
        : [...previous, topicName]
    );
  }

  function markComplete() {
    if (!completed.includes(activeTopic)) {
      setCompleted([...completed, activeTopic]);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setActiveTab("Learn")}>
          <span className="brand-icon">F</span>
          Forma<span className="brand-dot">.</span>
        </a>

        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search tutorials and topics..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <kbd>Search</kbd>
        </div>

        <nav className="top-links">
          {["Learn", "Tutorials", "Practice", "Assessments"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "top-link active" : "top-link"}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "Assessments") setShowQuiz(true);
                else setShowQuiz(false);
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <button className="login-button" onClick={() => alert("Authentication will be added in a later step.")}>
          Sign in
        </button>
      </header>

      <div className="topicbar">
        {topics.map((topic) => (
          <button
            key={topic.name}
            className={activeTopic === topic.name ? "topic-link selected" : "topic-link"}
            onClick={() => {
              setActiveTopic(topic.name);
              setShowQuiz(false);
            }}
          >
            {topic.name}
          </button>
        ))}
      </div>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-heading">LEARNING MENU</div>

          <button className="side-link selected" onClick={() => setActiveTab("Learn")}>
            <span>⌂</span> Learning dashboard
          </button>
          <button className="side-link" onClick={() => setActiveTab("Tutorials")}>
            <span>▤</span> All tutorials
          </button>
          <button className="side-link" onClick={() => setActiveTab("Practice")}>
            <span>⌘</span> Coding practice
          </button>
          <button className="side-link" onClick={() => setShowQuiz(true)}>
            <span>✓</span> Skill assessments
          </button>

          <div className="sidebar-heading section-heading">YOUR LEARNING</div>
          <div className="progress-card">
            <div className="progress-title">Your progress</div>
            <div className="progress-number">
              {completed.length} <span>/ {topics.length} topics</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(completed.length / topics.length) * 100}%` }}
              />
            </div>
            <p>Keep learning a little every day.</p>
          </div>

          <div className="sidebar-heading section-heading">QUICK ACCESS</div>
          <button className="side-link" onClick={() => setActiveTab("Bookmarks")}>
            <span>☆</span> Bookmarks ({saved.length})
          </button>
          <button className="side-link" onClick={() => setActiveTab("Notes")}>
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
            Home <span>/</span> {activeTopic}
          </div>

          {activeTab === "Bookmarks" ? (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">YOUR COLLECTION</span>
                  <h1>Saved topics</h1>
                  <p>Your bookmarked topics are collected here.</p>
                </div>
              </div>
              <div className="topic-grid">
                {topics.filter((topic) => saved.includes(topic.name)).map((topic) => (
                  <TopicCard
                    key={topic.name}
                    topic={topic}
                    activeTopic={activeTopic}
                    setActiveTopic={setActiveTopic}
                    saved={saved}
                    toggleSaved={toggleSaved}
                  />
                ))}
              </div>
              {saved.length === 0 && <p className="empty-message">No bookmarks yet. Save a topic using the star on its card.</p>}
            </>
          ) : activeTab === "Notes" ? (
            <Notes />
          ) : (
            <>
              <section className="welcome-banner">
                <div className="welcome-copy">
                  <span className="eyebrow">YOUR LEARNING JOURNEY STARTS HERE</span>
                  <h1>Learn something<br />new today.</h1>
                  <p>Build practical skills with clear tutorials, hands-on practice, and quick assessments.</p>
                  <button
                    className="primary-button"
                    onClick={() => {
                      setActiveTab("Tutorials");
                      setShowQuiz(false);
                    }}
                  >
                    Explore tutorials <span>→</span>
                  </button>
                </div>
                <div className="banner-art" aria-hidden="true">
                  <div className="art-circle circle-one" />
                  <div className="art-circle circle-two" />
                  <div className="code-window">
                    <div className="window-dots"><i /><i /><i /></div>
                    <div className="code-line muted">01 &nbsp; <span>function</span> learn() {"{"}</div>
                    <div className="code-line">02 &nbsp;&nbsp; practice();</div>
                    <div className="code-line">03 &nbsp;&nbsp; grow();</div>
                    <div className="code-line muted">04 &nbsp; {"}"}</div>
                    <div className="code-cursor" />
                  </div>
                  <div className="floating-tag tag-top">{"</>"}</div>
                  <div className="floating-tag tag-bottom">✦ Keep learning</div>
                </div>
              </section>

              <section className="section">
                <div className="section-header">
                  <div>
                    <span className="eyebrow">EXPLORE & DISCOVER</span>
                    <h2>Browse learning topics</h2>
                    <p>Choose a topic and start building your knowledge.</p>
                  </div>
                  <span className="result-count">{filteredTopics.length} topics</span>
                </div>

                <div className="topic-grid">
                  {filteredTopics.map((topic) => (
                    <TopicCard
                      key={topic.name}
                      topic={topic}
                      activeTopic={activeTopic}
                      setActiveTopic={setActiveTopic}
                      saved={saved}
                      toggleSaved={toggleSaved}
                    />
                  ))}
                </div>

                {filteredTopics.length === 0 && (
                  <p className="empty-message">No topics found. Try another search.</p>
                )}
              </section>

              <section className="section lesson-section">
                <div className="section-header">
                  <div>
                    <span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span>
                    <h2>{showQuiz ? "Quick skill assessment" : `${activeTopic} learning path`}</h2>
                    <p>
                      {showQuiz
                        ? "Test your understanding with a quick question."
                        : "Learn the basics, follow examples, and practise as you go."}
                    </p>
                  </div>
                  <span className="level-pill">BEGINNER FRIENDLY</span>
                </div>

                {showQuiz ? (
                  <div className="quiz-card">
                    <div className="quiz-topline">
                      <span>QUESTION 1 OF 1</span>
                      <span>HTML BASICS</span>
                    </div>
                    <h3>Which HTML tag is used for the largest heading?</h3>
                    {["<head>", "<h1>", "<heading>", "<title>"].map((option) => (
                      <label key={option} className={`quiz-option ${answer === option ? "chosen" : ""}`}>
                        <input
                          type="radio"
                          name="quiz"
                          value={option}
                          checked={answer === option}
                          onChange={() => {
                            setAnswer(option);
                            setQuizSubmitted(false);
                          }}
                        />
                        <code>{option}</code>
                      </label>
                    ))}
                    <button className="primary-button" onClick={() => setQuizSubmitted(true)} disabled={!answer}>
                      Check answer
                    </button>
                    {quizSubmitted && (
                      <p className={answer === "<h1>" ? "correct-answer" : "wrong-answer"}>
                        {answer === "<h1>"
                          ? "Correct! The <h1> element represents the highest-level heading."
                          : "Not quite. Try again! The correct answer is <h1>."}
                      </p>
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
                        {completed.includes(activeTopic) ? "Lesson completed ✓" : "Mark as complete"}
                      </button>
                    </div>
                    <div className="example-panel">
                      <div className="example-heading">
                        <span>Example</span>
                        <span className="live-dot">● Ready to learn</span>
                      </div>
                      <pre><code>{currentLesson.code}</code></pre>
                      <div className="example-footer">Try the example as you learn</div>
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

function TopicCard({ topic, activeTopic, setActiveTopic, saved, toggleSaved }) {
  const isSaved = saved.includes(topic.name);

  return (
    <article className={`topic-card ${activeTopic === topic.name ? "topic-card-active" : ""}`}>
      <div className="topic-card-top">
        <div className="topic-icon">{topic.icon}</div>
        <button
          className={`bookmark-button ${isSaved ? "bookmarked" : ""}`}
          aria-label={isSaved ? "Remove bookmark" : "Bookmark topic"}
          onClick={() => toggleSaved(topic.name)}
        >
          {isSaved ? "★" : "☆"}
        </button>
      </div>
      <span className="topic-category">{topic.category}</span>
      <h3>{topic.name}</h3>
      <p>{topic.lessons} lessons to explore</p>
      <button
        className="text-button"
        onClick={() => {
          setActiveTopic(topic.name);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        Start learning <span>→</span>
      </button>
    </article>
  );
}

function Notes() {
  const [note, setNote] = useState("");

  return (
    <section className="notes-card">
      <span className="eyebrow">PERSONAL STUDY SPACE</span>
      <h1>My learning notes</h1>
      <p>Write down key concepts, questions, and things you want to remember.</p>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Start writing your notes here..."
        rows={10}
      />
      <p className="note-hint">Demo only: notes are not saved after you refresh the page yet.</p>
    </section>
  );
}

export default App;
