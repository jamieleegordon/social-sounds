import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getModeStats } from '../../hooks/getModeStats';  // Assuming you have a hook for Mode stats

export const ModeStats = ({ username }) => {
  const [modeStats, setModeStats] = useState([]); 
  const threshold = 0.5; // Define the threshold for mode (this value may vary depending on how you define the threshold for mode)

  useEffect(() => {
    const fetchModeStats = async () => {
      const stats = await getModeStats(username);  // Fetch mode stats
      setModeStats(stats || []); 
      console.log(stats);
    };

    fetchModeStats();
  }, [username]);

  if (!modeStats || modeStats.length === 0) {
    return <p>No mode stats available.</p>;
  }

  // Transform the fetched data to fit the chart format (albumName and mode)
  const chartData = modeStats.map((stat) => ({
    name: stat.albumName, // album name as the label
    uv: stat.mode, // mode value as uv
  }));

  // Calculate gradient offset for dynamic color transition
  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map((i) => i.uv));
    const dataMin = Math.min(...chartData.map((i) => i.uv));

    if (dataMax <= threshold) {
      return 0; 
    }
    if (dataMin >= threshold) {
      return 1; 
    }

    return dataMax / (dataMax - dataMin); 
  };

  const off = gradientOffset();

  // Custom Tooltip to show albumName along with mode value
  const CustomTooltip = ({ payload, label }) => {
    if (payload && payload.length) {
      const { uv, name } = payload[0].payload; // Fetch mode and albumName from payload
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${name}`}</p>
          <p>{`Mode: ${uv.toFixed(2)}`}</p> {/* Format the mode value */}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <div style={{ textAlign: 'center' }}>
        {payload.map((entry, index) => (
          <span key={index} style={{ color: 'orange', fontWeight: 'bold', marginLeft: 10, marginRight: 10 }}>
            {entry.value}
          </span>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        width={500}
        height={400}
        data={chartData} 
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 40, 
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="uv" 
          hide={true} 
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} /> 
        
        <Legend layout="horizontal" align="center" content={<CustomLegend />} />
        
        <defs>
          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={off} stopColor="green" stopOpacity={1} />
            <stop offset={off} stopColor="red" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="uv"
          stroke="orange"
          fill="orange"
          name="Mode" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
