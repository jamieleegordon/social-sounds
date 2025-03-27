import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getValenceStats } from '../../hooks/getValenceStats';

export const ValenceStats = ({ username }) => {
  const [valenceStats, setValenceStats] = useState([]);

  useEffect(() => {
    const fetchValenceStats = async () => {
      const stats = await getValenceStats(username);

      if (!stats || !Array.isArray(stats)) {
        setValenceStats([]);
        return;
      }

      setValenceStats(
        stats.map(stat => ({
          albumName: stat.albumName,
          valence: Number(stat.valence) || 0,  
        }))
      );
    };

    fetchValenceStats();
  }, [username]);

  if (valenceStats.length === 0) {
    return <p>No valence stats available.</p>;
  }

  // Custom Tooltip
  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { albumName, valence } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${albumName}`}</p>
          <p>{`Valence: ${valence.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        layout="vertical"
        data={valenceStats}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis type="number" domain={[0, 1]} />
        <YAxis type="category" scale="band" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        <Area dataKey="valence" fill="#8884d8" stroke="#8884d8" />
        <Bar dataKey="valence" barSize={20} fill="#413ea0" />
        <Line dataKey="valence" stroke="#ff7300" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
