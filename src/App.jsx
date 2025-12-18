import "./App.css";
import { useEffect, useState } from "react";
import { Sun, Moon, Plus, Trash2 } from "lucide-react";
import "./App.css";

export default function App() {
  const [view, setView] = useState("home");
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState("");
  const [dark, setDark] = useState(false);
  const [isTodo, setIsTodo] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/journal")
      .then((res) => res.json())
      .then((data) => setEntries(data));
  }, []);

  const addEntry = async () => {
    if (!content.trim()) return;
    const text = isTodo ? `☐ ${content}` : content;

    const res = await fetch("http://localhost:8080/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });

    const newEntry = await res.json();
    setEntries([newEntry, ...entries]);
    setContent("");
    setIsTodo(false);
  };

  const deleteEntry = async (id) => {
    await fetch(`http://localhost:8080/api/journal/${id}`, {
      method: "DELETE",
    });
    setEntries(entries.filter((e) => e.id !== id));
  };

  const isArchived = (entry) => entry.id % 2 === 0;

  return (
    <div className={dark ? "app dark" : "app"}>
      <div className="container">
        {/* NAVBAR */}
        <nav className="navbar">
          <h1 className="logo">📓 Journal</h1>

          <div className="nav-links">
            <span onClick={() => setView("home")} className={view === "home" ? "active" : ""}>Home</span>
            <span onClick={() => setView("list")} className={view === "list" ? "active" : ""}>My List</span>
            <span onClick={() => setView("archive")} className={view === "archive" ? "active" : ""}>Archives</span>
            <span onClick={() => setView("about")} className={view === "about" ? "active" : ""}>More</span>
          </div>

          <button className="icon-btn" onClick={() => setDark(!dark)}>
            {dark ? <Sun /> : <Moon />}
          </button>
        </nav>

        {/* HOME */}
        {view === "home" && (
          <>
            <div className="notebook">
              <textarea
                rows="5"
                placeholder="Write your thoughts like a notebook…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="controls">
                <label>
                  <input
                    type="checkbox"
                    checked={isTodo}
                    onChange={() => setIsTodo(!isTodo)}
                  />
                  Save as checklist item
                </label>

                <button className="add-btn" onClick={addEntry}>
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>

            <div className="entries">
              {entries.map((entry) => (
                <div key={entry.id} className="entry">
                  <span>{entry.content}</span>
                  <button onClick={() => deleteEntry(entry.id)}>
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* LIST */}
        {view === "list" && (
          <div className="entries">
            {entries
              .filter((e) => e.content.startsWith("☐"))
              .map((entry) => (
                <div key={entry.id} className="entry">
                  {entry.content}
                </div>
              ))}
          </div>
        )}

        {/* ARCHIVE */}
        {view === "archive" && (
          <div className="entries">
            <h3>📦 Archived Entries</h3>
            {entries.filter(isArchived).map((entry) => (
              <div key={entry.id} className="entry faded">
                {entry.content}
              </div>
            ))}
          </div>
        )}

        {/* ABOUT */}
        {view === "about" && (
          <p className="center-text">⚙️ Settings & About coming soon</p>
        )}
      </div>
    </div>
  );
}
