import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Tooltip content that filters out 0 votes
const renderTooltipContent = ({ payload, label }) => {
  if (!payload || payload.length === 0) return null;

  const nonZeroPayload = payload.filter((entry) => entry.value > 0);
  if (nonZeroPayload.length === 0) return null;

  return (
    <div className="custom-tooltip" style={{ background: '#fff', border: '1px solid #ccc', padding: '8px' }}>
      <p>{`Rating: ${label}`}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {nonZeroPayload.map((entry, index) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} votes`}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Transform ratingDistribution into an array for the chart
const transformedData = (ratingDistribution) => {
  return Object.keys(ratingDistribution).map((rating) => ({
    rating,
    people: ratingDistribution[rating],
  }));
};

export const ReviewLineBar = ({ ratingDistribution }) => {
  // Transform ratingDistribution data into chart-friendly format
  const data = transformedData(ratingDistribution);

  return (
    <ResponsiveContainer className="Review-line-bar" height={420}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rating" />
        <YAxis domain={['auto', 'auto']} /> {/* Ensures Y-Axis auto-scales to the data */}
        <Tooltip content={renderTooltipContent} />
        <Legend />

        {/* Bar chart to show the number of people per rating */}
        <Bar dataKey="people" barSize={30} fill="#8884d8" name="Number of People" />

        {/* Optional Line to show a trend (cumulative average of people) */}
        <Line type="monotone" dataKey="people" stroke="#ff7300" dot={{ r: 4 }} name="Average Trend" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
