import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Area,
  Bar,
  Line,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getLoudnessStats } from '../../hooks/getLoudnessStats';

export const LoudnessStats = ({ username }) => {
  const [loudnessStats, setLoudnessStats] = useState([]); // Store loudness stats

  // Fetch loudness stats when the component mounts
  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getLoudnessStats(username);
      setLoudnessStats(stats || []); // Set the fetched data to the state
      console.log(stats); // Debugging to check the structure of the stats
    };

    fetchStats(); // Call the function to fetch data
  }, [username]);

  if (!loudnessStats || loudnessStats.length === 0) {
    return <p>No loudness data available.</p>; // Display message if no stats
  }

  // Transform data into a format suitable for the chart
  const chartData = loudnessStats.map((stat) => ({
    name: stat.albumName, // Album name
    loudness: stat.loudness, // Loudness value
  }));

  // Custom Tooltip to display album name and loudness
  const CustomTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { name, loudness } = payload[0].payload; // Get album name and loudness
      return (
        <div className="custom-tooltip">
          <p>{`Album: ${name}`}</p>
          <p>{`Loudness: ${loudness?.toFixed(2) || 'N/A'}`}</p>
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
        data={chartData} // Pass chartData to the chart
        margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" /> {/* Add grid to the chart */}
        <YAxis /> {/* Display the Y axis */}
        <Tooltip content={<CustomTooltip />} /> {/* Custom Tooltip */}
        <Legend /> {/* Optional: To display the chart legend */}

        {/* Bar chart for loudness */}
        <Bar dataKey="loudness" barSize={20} fill="#8884d8" />

        {/* Optional: Line chart for the loudness trend */}
        <Line type="monotone" dataKey="loudness" stroke="#ff7300" />

        {/* Optional: Area chart for loudness */}
        <Area type="monotone" dataKey="loudness" fill="#8884d8" stroke="#8884d8" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
