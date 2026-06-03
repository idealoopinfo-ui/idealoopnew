import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  import { useEffect, useState } from "react";
  import { supabase } from "../../lib/supabaseClient";
  
  import "../Admin/Admin.css";
  
  export default function Analytics() {
  
    // =========================
    // STATES
    // =========================
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    // =========================
    // LOAD ANALYTICS
    // =========================
    useEffect(() => {
  
      const loadAnalytics = async () => {
  
        setLoading(true);
  
        try {
  
          // TOTAL USERS
          const {
            data: users,
            error: usersError,
          } = await supabase
            .from("profiles")
            .select("*");
  
          // BANNED USERS
          const {
            data: bannedUsers,
            error: bannedError,
          } = await supabase
            .from("profiles")
            .select("*")
            .eq("banned", true);
  
          // ERROR CHECK
          if (usersError || bannedError) {
            console.error(
              usersError || bannedError
            );
  
            setData([]);
            setLoading(false);
            return;
          }
  
          // FINAL CHART DATA
          setData([
            {
              name: "Users",
              value: users?.length || 0,
            },
            {
              name: "Banned",
              value: bannedUsers?.length || 0,
            },
          ]);
  
        } catch (error) {
  
          console.error(
            "Analytics load failed:",
            error
          );
  
          setData([]);
  
        } finally {
  
          setLoading(false);
        }
      };
  
      loadAnalytics();
  
    }, []);
  
    // =========================
    // UI
    // =========================
    return (
      <div className="analytics-container">
  
        <h1>Analytics</h1>
  
        {loading ? (
  
          <p>Loading analytics...</p>
  
        ) : data.length === 0 ? (
  
          <p>No analytics data available.</p>
  
        ) : (
  
          <div className="analytics-chart">
  
            <ResponsiveContainer
              width="100%"
              height={300}
            >
  
              <BarChart data={data}>
  
                <XAxis dataKey="name" />
  
                <YAxis />
  
                <Tooltip />
  
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                />
  
              </BarChart>
  
            </ResponsiveContainer>
  
          </div>
        )}
  
      </div>
    );
  }