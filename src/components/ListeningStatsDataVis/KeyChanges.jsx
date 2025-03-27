import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { getKeyChangesStats } from '../../hooks/getKeyChangesStats';

export const KeyChangesStats = ({ username }) => {
  const [keyChangesStats, setKeyChangesStats] = useState([]); 
  const threshold = 2; // Define a threshold for key changes

  useEffect(() => {
    const fetchKeyChangesStats = async () => {
      const stats = await getKeyChangesStats(username);
      setKeyChangesStats(stats || []); 
      console.log(stats);
    };

    fetchKeyChangesStats();
  }, [username]);

  if (!keyChangesStats || keyChangesStats.length === 0) {
    return <p>No key changes stats available.</p>;
  }

  // Transform data to fit the chart format
  const chartData = keyChangesStats.map((stat) => ({
    name: stat.albumName, // Album name
    keyChanges: stat.keyChanges, // Number of key changes
  }));

  // Calculate gradient offset for dynamic color transition
  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map((i) => i.keyChanges));
    const dataMin = Math.min(...chartData.map((i) => i.keyChanges));

    if (dataMax <= threshold) {
      return 0; 
    }
    if (dataMin >= threshold) {
      return 1; 
    }

    return dataMax / (dataMax - dataMin); 
  };

  const off = gradientOffset();

  // Custom Tooltip
  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { keyChanges, name } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${name}`}</p>
          <p>{`Key Changes: ${keyChanges}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        width={500}
        height={400}
        data={chartData} 
        margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" hide={true} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} /> 
        <Legend />

        <defs>
          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={off} stopColor="blue" stopOpacity={1} />
            <stop offset={off} stopColor="red" stopOpacity={1} />
          </linearGradient>
        </defs>

        <Area
          type="monotone"
          dataKey="keyChanges"
          stroke="blue"
          fill="blue"
          name="Key Changes" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
