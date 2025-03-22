import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAcousticnessStats } from '../../hooks/getAcousticnessStats';

const AcousticnessStats = ({ username }) => {
  const [acousticStats, setAcousticStats] = useState([]);

  useEffect(() => {
    const fetchAcousticStats = async () => {
      const stats = await getAcousticnessStats(username);
      setAcousticStats(stats || []);
      console.log(stats);
    };

    fetchAcousticStats();
  }, [username]);

  // Prepare chart data based on fetched acousticness stats
  const chartData = acousticStats.map((stat) => ({
    name: stat.albumName, // album name as the label
    uv: stat.acousticness, // acousticness as the value
  }));

  // Custom Tooltip to display album names and their acousticness values
  const CustomTooltip = ({ payload, label }) => {
    if (payload && payload.length) {
      const { uv, name } = payload[0].payload; // Fetch acousticness and albumName from payload
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${name}`}</p>
          <p>{`Acousticness: ${uv.toFixed(2)}`}</p> {/* Format the acousticness value */}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={chartData} // Use the actual chart data
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barSize={20}
      >
        <XAxis dataKey="name" hide={true} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} /> 
        
        <Legend 
          formatter={() => "Acousticness"} // Set the legend text to "Acousticness"
          iconType="square" 
          wrapperStyle={{ color: '#0d6efd', fontSize: '14px' }} 
        />

        <CartesianGrid strokeDasharray="3 3" />
        
        <Bar
          dataKey="uv" // The 'dataKey' is still "uv" but the legend will show "Acousticness"
          fill="#0d6efd"  // Color of the bars and legend
          background={{ fill: '#eee' }}
          isAnimationActive={false}
          activeDot={false}  // Disable the dot hover effect
          // Disable hover interaction and active state
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AcousticnessStats;
