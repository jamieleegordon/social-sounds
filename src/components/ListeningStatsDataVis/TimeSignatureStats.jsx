import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
} from 'recharts';
import { getTimeSignatureStats } from '../../hooks/getTimeSignature';

export const TimeSignatureStats = ({ username }) => {
  const [timeSignatureStats, setTimeSignature] = useState([]);

  useEffect(() => {
    const fetchTimeSignatureStats = async () => {
      const stats = await getTimeSignatureStats(username);
      
      if (!stats || !Array.isArray(stats)) {
        setTimeSignature([]);
        return;
      }

      setTimeSignature(
        stats.map(stat => ({
          albumName: stat.albumName,
          timeSignature: Number(stat.timeSignature) || 0,
        }))
      );
    };

    fetchTimeSignatureStats()
  }, [username]);

  if (timeSignatureStats.length === 0) {
    return <p>No time signature stats available.</p>;
  }

  // Custom Tooltip
  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { albumName, timeSignature } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${albumName}`}</p>
          <p>{`Time Signature: ${timeSignature.toFixed(2)} BPM`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={timeSignatureStats}
        margin={{ top: 20, right: 80, bottom: 20, left: 20 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <YAxis type="number" label={{ angle: -90, position: 'insideLeft' }} />
        <Scatter name="Time Signature" dataKey="timeSignature" fill="blue" />
        <Line dataKey="timeSignature" stroke="red" dot={false} activeDot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
