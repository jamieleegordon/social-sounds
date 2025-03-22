import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getInstrumentalnessStats } from '../../hooks/getInstrumentalnessStats';

const InstrumentalnessStats = ({ username }) => {
  const [instrumentalnessStats, setInstrumentalnessStats] = useState([]);

  useEffect(() => {
    const fetchInstrumentalnessStats = async () => {
      const stats = await getInstrumentalnessStats(username);
      setInstrumentalnessStats(stats || []); // Ensure stats is always an array
      console.log(stats);
    };

    fetchInstrumentalnessStats();
  }, [username]);

  // Prepare the data for the chart
  const chartData = (instrumentalnessStats || []).map((stat) => ({
    name: stat.albumName, // Album name as 'name' in the chart
    instrumentalness: stat.instrumentalness, // Instrumentalness as a single value for both the line and the area
  }));

  // Custom tooltip to show both albumName and instrumentalness
  const renderCustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { name, instrumentalness } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${name}`}</p>
          <p>{`Instrumentalness: ${instrumentalness.toFixed(4)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        width={500}
        height={400}
        data={chartData} 
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        
        <XAxis dataKey="name" tick={false} />

        <YAxis domain={[-0.25, 'auto']} />

        <Tooltip content={renderCustomTooltip} />

        <Area
          type="monotone"
          dataKey="instrumentalness"
          stroke="none"
          fill="#cccccc" 
          connectNulls
          dot={false}
          activeDot={false}
        />

        <Line type="natural" dataKey="instrumentalness" stroke="red" connectNulls />
        
        <Legend />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default InstrumentalnessStats;
