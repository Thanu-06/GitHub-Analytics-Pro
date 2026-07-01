import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    try {
      setLoading(true);

      const userRes = await axios.get(
        `https://api.github.com/users/${username}`
      );

      const repoRes = await axios.get(
        `https://api.github.com/users/${username}/repos`
      );

      const topRepos = repoRes.data
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);

      setUser(userRes.data);
      setRepos(topRepos);
    } catch (err) {
      alert("User not found!");
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>⚡ GitHub Analytics Pro</h1>
      <p className="subtitle">
        Search any GitHub profile and review top repositories.
      </p>

      <div className="search">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username..."
        />
        <button onClick={getUser}>Search</button>
      </div>

      {loading && <div className="loader">Loading...</div>}

      {user && (
        <div className="profileCard">
          <img src={user.avatar_url} alt="avatar" />

          <div>
            <h2>{user.name || "No Name"}</h2>
            <p>@{user.login}</p>

            <div className="stats">
              <span>👥 {user.followers}</span>
              <span>➡️ {user.following}</span>
              <span>📦 {user.public_repos}</span>
            </div>

            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub →
            </a>
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div className="repoSection">
          <h2>🔥 Top Repositories</h2>

          {repos.map((repo) => (
            <div className="repoCard" key={repo.id}>
              <h3>{repo.name}</h3>

              <p>
                ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
              </p>

              <p>💻 {repo.language || "N/A"}</p>

              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Repo →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
