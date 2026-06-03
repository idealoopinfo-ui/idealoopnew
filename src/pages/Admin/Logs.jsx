import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Logs() {

  // =========================
  // STATES
  // =========================
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH LOGS
  // =========================
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {

    setLoading(true);

    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Error fetching logs:", error.message);
      setLogs([]);
    } else {
      setLogs(data || []);
    }

    setLoading(false);
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="admin-page">

      <h1>Activity Logs</h1>

      <table className="admin-table">

        <thead>
          <tr>
            <th>Action</th>
            <th>User ID</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>

          {loading ? (
            <tr>
              <td colSpan="3">Loading logs...</td>
            </tr>
          ) : logs.length === 0 ? (
            <tr>
              <td colSpan="3">No logs found</td>
            </tr>
          ) : (
            logs.map((log) => (

              <tr key={log.id}>

                <td>{log.action}</td>

                <td>
                  {log.user_id || "System"}
                </td>

                <td>
                  {log.created_at
                    ? new Date(log.created_at).toLocaleString()
                    : "N/A"}
                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}