import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../../../src/pages/Review/Review.css'

// Define colors for each rating (from 1 to 10)
const colors = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CD3',
  '#F45B69', '#82ca9d', '#8884d8', '#ff7300', '#a83279',
];

// Tooltip content filtering out 0 votes
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
  return Object.keys(ratingDistribution).map((rating) => {
    // Create an object with each rating (1, 2, ..., 10) and its vote count
    const dataEntry = { rating };
    // Add the votes for each rating, such as rating1, rating2, ...
    Object.keys(ratingDistribution).forEach((r) => {
      dataEntry[`rating${r}`] = r === rating ? ratingDistribution[r] : 0;
    });
    return dataEntry;
  });
};

export const ReviewAreaChart = ({ ratingDistribution }) => {
  // Generate transformed data from ratingDistribution
  const data = transformedData(ratingDistribution);

  return (
    <ResponsiveContainer className="Review-area-chart" height={400}>
      <AreaChart
        data={data}  // Pass the transformed data to the AreaChart
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rating" />
        <YAxis />
        <Tooltip content={renderTooltipContent} />

        {/* Create one Area for each rating (1-10) */}
        {Object.keys(ratingDistribution).map((rating, index) => (
          <Area
            key={rating}
            type="monotone"
            dataKey={`rating${rating}`}  // Reference the rating key (e.g., rating1, rating2)
            stackId="1"
            stroke={colors[index]}  // Apply color dynamically for each rating
            fill={colors[index]}  // Apply color dynamically for each rating
            name={`${rating} Star`}  // Label each rating
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
