import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
} from 'recharts';
import { getTempoStats } from '../../hooks/getTempoStats';

export const TempoStats = ({ username }) => {
  const [tempoStats, setTempoStats] = useState([]);

  useEffect(() => {
    const fetchTempoStats = async () => {
      const stats = await getTempoStats(username);
      
      if (!stats || !Array.isArray(stats)) {
        setTempoStats([]);
        return;
      }

      setTempoStats(
        stats.map(stat => ({
          albumName: stat.albumName,
          tempo: Number(stat.tempo) || 0,
        }))
      );
    };

    fetchTempoStats();
  }, [username]);

  if (tempoStats.length === 0) {
    return <p>No tempo stats available.</p>;
  }

  // Custom Tooltip
  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { albumName, tempo } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${albumName}`}</p>
          <p>{`Tempo: ${tempo.toFixed(2)} BPM`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={tempoStats}
        margin={{ top: 20, right: 80, bottom: 20, left: 20 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <YAxis unit=" BPM" type="number" label={{ angle: -90, position: 'insideLeft' }} />
        <Scatter name="Tempo" dataKey="tempo" fill="blue" />
        <Line dataKey="tempo" stroke="red" dot={false} activeDot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
