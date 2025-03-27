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

import { getKeyStats } from "../../hooks/getKeyStats";

export const KeyStats = ({ username }) => {
  const [keyStats, setKeyStats] = useState([]);

  useEffect(() => {
    const fetchKeyStats = async () => {
      const stats = await getKeyStats(username);
      setKeyStats(stats);
      console.log(stats);
    };

    fetchKeyStats();
  }, [username]);

  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { albumName, key } = payload[0].payload; 
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${albumName}`}</p>
          <p>{`Key: ${key.toFixed(2)}`}</p> 
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={keyStats}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="key" hide={true} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} /> 
        <Legend />
        <Line
          type="monotone"
          dataKey="key"
          stroke="yellow"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
