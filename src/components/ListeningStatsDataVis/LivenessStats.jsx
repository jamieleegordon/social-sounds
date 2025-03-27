import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getLivenessStats } from "../../hooks/getLivenessStats";

export const LivenessStats = ({ username }) => {
  const [livenessStats, setLivenessStats] = useState([]);

  // Fetch the liveness stats when the component mounts
  useEffect(() => {
    const fetchLivenessStats = async () => {
      const stats = await getLivenessStats(username);
      setLivenessStats(stats);
      console.log(stats);
    };

    fetchLivenessStats(); // Call the function to fetch data
  }, [username]); // Dependency on username

  // Custom Tooltip for the LineChart
  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { albumName, liveness } = payload[0].payload; // Extract albumName and liveness from payload
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${albumName}`}</p>
          <p>{`Liveness: ${liveness.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={livenessStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="albumName" hide={true} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="liveness"
          stroke="pink"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
