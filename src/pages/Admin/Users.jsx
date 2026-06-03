import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { exportCSV } from "../utils/exportCSV";

export default function Users() {

  // =========================
  // STATES
  // =========================
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH USERS
  // =========================
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {

    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Error fetching users:", error.message);
      setUsers([]);
    } else {
      setUsers(data || []);
    }

    setLoading(false);
  };

  // =========================
  // SEARCH USERS
  // =========================
  const handleSearch = async (value) => {

    setSearch(value);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("email", `%${value}%`)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Search error:", error.message);
      setUsers([]);
    } else {
      setUsers(data || []);
    }
  };

  // =========================
  // DELETE USER
  // =========================
  const deleteUser = async (id) => {

    await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    fetchUsers();
  };

  // =========================
  // BAN USER
  // =========================
  const banUser = async (id) => {

    await supabase
      .from("profiles")
      .update({
        banned: true,
      })
      .eq("id", id);

    fetchUsers();
  };

  // =========================
  // UNBAN USER
  // =========================
  const unbanUser = async (id) => {

    await supabase
      .from("profiles")
      .update({
        banned: false,
      })
      .eq("id", id);

    fetchUsers();
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="admin-page">

      <h1>Users</h1>

      {/* =========================
          TOP ACTIONS
      ========================= */}
      <div className="users-top-bar">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) =>
            handleSearch(e.target.value)
          }
          className="search-input"
        />

        {/* EXPORT */}
        <button
          className="btn btn-primary"
          onClick={() => exportCSV(users)}
        >
          Export CSV
        </button>

      </div>

      {/* =========================
          USERS TABLE
      ========================= */}
      <table className="admin-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {loading ? (

            <tr>
              <td colSpan="5">
                Loading users...
              </td>
            </tr>

          ) : users.length === 0 ? (

            <tr>
              <td colSpan="5">
                No users found
              </td>
            </tr>

          ) : (

            users.map((user) => (

              <tr key={user.id}>

                <td>
                  {user.first_name} {user.last_name}
                </td>

                <td>{user.email}</td>

                <td>
                  {user.created_at
                    ? new Date(user.created_at).toDateString()
                    : "N/A"}
                </td>

                <td>
                  {user.banned
                    ? "⛔ Banned"
                    : "✅ Active"}
                </td>

                {/* =========================
                    ACTIONS
                ========================= */}
                <td>

                  {!user.banned ? (

                    <button
                      className="btn"
                      onClick={() => banUser(user.id)}
                    >
                      Ban
                    </button>

                  ) : (

                    <button
                      className="btn"
                      onClick={() => unbanUser(user.id)}
                    >
                      Unban
                    </button>

                  )}

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}