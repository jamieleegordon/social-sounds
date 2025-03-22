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

import { getEnergyStats } from "../../hooks/getEnergyStats";

export const EnergyStats = ({ username }) => {
  const [energyStats, setEnergyStats] = useState([]);

  useEffect(() => {
    const fetchEnergyStats = async () => {
      const stats = await getEnergyStats(username);
      setEnergyStats(stats);
      console.log(stats);
    };

    fetchEnergyStats();
  }, [username]);

  // Custom Tooltip to show albumName along with energy
  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { albumName, energy } = payload[0].payload; // Fetch albumName and energy from payload
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${albumName}`}</p>
          <p>{`Energy: ${energy.toFixed(2)}`}</p> {/* Format the energy value */}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={energyStats}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="energy" hide={true} /> {/* Hide the X-axis */}
        <YAxis />
        <Tooltip content={<CustomTooltip />} /> {/* Use custom Tooltip */}
        <Legend />
        <Line
          type="monotone"
          dataKey="energy"
          stroke="#FF5733"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
