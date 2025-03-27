import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, Rectangle, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getPitchStats } from '../../hooks/getPitchStats';

export const PitchStats = ({ username }) => {
  const [pitchStats, setPitchStats] = useState([])

  useEffect(() => {
    const fetchPitchStats = async () => {
      const stats = await getPitchStats(username);
      
      if (!stats || !Array.isArray(stats)) {
        setPitchStats([])
        return;
      }
  
      setPitchStats(
        stats.map(stat => ({
          albumName: stat.albumName,
          pitch: Number(stat.pitch) || 0,  
        }))
      )
    }
  
    fetchPitchStats()
  }, [username])
  

  if (!pitchStats || pitchStats.length === 0) {
    return <p>No pitch stats available.</p>;
  }

  // Custom Tooltip
  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { albumName, pitch } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${albumName}`}</p>
          <p>{`Pitch: ${pitch.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={pitchStats}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis domain={[0, 1]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="pitch" 
          fill="green" 
          activeBar={<Rectangle fill="pink" stroke="green" />} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
