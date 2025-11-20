import React, { useEffect, useState, useMemo } from "react";
import "./App.css";

const API_URL = "https://reqres.in/api/users";
const API_KEY = "reqres-free-v1";

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [emailDomainFilter, setEmailDomainFilter] = useState("all");

  const [sortField, setSortField] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const url = `${API_URL}?page=${page}`;
        console.log("Fetching:", url);

        const res = await fetch(url, {
          headers: {
            "x-api-key": API_KEY,              // 👈 KEY GOES HERE
            "Content-Type": "application/json"
          },
        });

        console.log("HTTP status:", res.status);
        setStatus(res.status);

        if (!res.ok) {
          const text = await res.text();
          console.log("Error body:", text);
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();
        console.log("API response:", data);

        setUsers(data.data || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const emailDomains = useMemo(() => {
    const domains = new Set();
    users.forEach((user) => {
      const parts = user.email?.split("@");
      if (parts && parts[1]) domains.add(parts[1]);
    });
    return Array.from(domains);
  }, [users]);

  const processedUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        return (
          fullName.includes(term) ||
          user.email.toLowerCase().includes(term)
        );
      });
    }

    if (emailDomainFilter !== "all") {
      result = result.filter((user) => user.email.endsWith(emailDomainFilter));
    }

    result.sort((a, b) => {
      const aVal = (a[sortField] || "").toLowerCase();
      const bVal = (b[sortField] || "").toLowerCase();
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, searchTerm, emailDomainFilter, sortField, sortOrder]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const handlePageClick = (p) => setPage(p);

  return (
    <div className="app">
      <header className="app-header">
        <h1>User Directory</h1>
        <p className="subtitle">
          Fetched from <code>https://reqres.in/api/users</code>
        </p>
        {status && <p className="subtitle">HTTP status: {status}</p>}
      </header>

      <main className="card">
        <div className="controls">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="filter-group">
            <label htmlFor="domainFilter">Email domain:</label>
            <select
              id="domainFilter"
              value={emailDomainFilter}
              onChange={(e) => setEmailDomainFilter(e.target.value)}
            >
              <option value="all">All</option>
              {emailDomains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th onClick={() => handleSort("first_name")}>
                      First Name{" "}
                      {sortField === "first_name" && (
                        <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                      )}
                    </th>
                    <th>Last Name</th>
                    <th onClick={() => handleSort("email")}>
                      Email{" "}
                      {sortField === "email" && (
                        <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {processedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="no-data">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    processedUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <img
                            src={user.avatar}
                            alt={user.first_name}
                            className="avatar"
                          />
                        </td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="page-btn"
              >
                Prev
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      className={`page-btn ${
                        p === page ? "active-page" : ""
                      }`}
                      onClick={() => handlePageClick(p)}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <small>Bonus: loading spinner + responsive layout ✔</small>
      </footer>
    </div>
  );
}

export default App;
