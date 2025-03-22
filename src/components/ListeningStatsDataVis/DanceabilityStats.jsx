import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getDanceabilityStats } from '../../hooks/getDanceabilityStats';

export const DanceabilityStats = ({ username }) => {
  const [danceStats, setDanceStats] = useState([]); 
  const threshold = 0.5; // Define the threshold for danceability 

  useEffect(() => {
    const fetchDanceStats = async () => {
      const stats = await getDanceabilityStats(username);
      setDanceStats(stats || []); 
      console.log(stats);
    };

    fetchDanceStats();
  }, [username]);

  if (!danceStats || danceStats.length === 0) {
    return <p>No danceability stats available.</p>;
  }

  // Transform the fetched data to fit the chart format (albumName and danceability)
  const chartData = danceStats.map((stat) => ({
    name: stat.albumName, // album name as the label
    uv: stat.danceability, // danceability as the value
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

  // Custom Tooltip to show albumName along with danceability
  const CustomTooltip = ({ payload, label }) => {
    if (payload && payload.length) {
      const { uv, name } = payload[0].payload; // Fetch danceability and albumName from payload
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${name}`}</p>
          <p>{`Danceability: ${uv.toFixed(2)}`}</p> {/* Format the danceability value */}
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
          <span key={index} style={{ color: 'green', fontWeight: 'bold', marginLeft: 10, marginRight: 10 }}>
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
          stroke="#000"
          fill="url(#splitColor)"
          name="Danceability" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
