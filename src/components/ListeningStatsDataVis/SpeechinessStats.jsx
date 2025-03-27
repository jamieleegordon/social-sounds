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
import { getSpeechinessStats } from "../../hooks/getSpeechinessStats";

export const SpeechinessStats = ({ username }) => {
  const [speechinessStats, setSpeechinessStats] = useState([]);

  useEffect(() => {
    const fetchSpeechinessStats = async () => {
      const stats = await getSpeechinessStats(username);
      setSpeechinessStats(stats);
      console.log(stats);
    };

    fetchSpeechinessStats();
  }, [username]);

  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { albumName, speechiness } = payload[0].payload; 
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${albumName}`}</p>
          <p>{`Speechiness: ${speechiness.toFixed(2)}`}</p> 
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={speechinessStats}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="speechiness" hide={true} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} /> 
        <Legend />
        <Line
          type="monotone"
          dataKey="speechiness"
          stroke="#0d6efd"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
