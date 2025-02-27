import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../../../src/pages/Review/Review.css'

// Sample data (number of people giving each rating)
const ratingData = [
  { rating: '1', people: 10 },
  { rating: '2', people: 30 },
  { rating: '3', people: 25 },
  { rating: '4', people: 15 },
  { rating: '5', people: 20 },
  { rating: '6', people: 18 },
  { rating: '7', people: 22 },
  { rating: '8', people: 30 },
  { rating: '9', people: 35 },
  { rating: '10', people: 40 },
];

// Colors for each rating
const colors = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CD3',
  '#F45B69', '#82ca9d', '#8884d8', '#ff7300', '#a83279',
];

// Transform data into stacked format where each rating has its own key
const transformedData = ratingData.map((item) => {
  const dataEntry = { rating: item.rating };
  ratingData.forEach((r) => {
    dataEntry[`rating${r.rating}`] = r.rating === item.rating ? item.people : 0;
  });
  return dataEntry;
});

// Tooltip that filters out ratings with value 0
const renderTooltipContent = ({ payload, label }) => {
  if (!payload || payload.length === 0) return null;

  // Filter out items where value is 0 (these are the "other" ratings)
  const nonZeroPayload = payload.filter((entry) => entry.value > 0);

  if (nonZeroPayload.length === 0) return null;

  return (
    <div className="custom-tooltip" style={{ background: '#fff', border: '1px solid #ccc', padding: '8px' }}>
      <p>{`Rating: ${label}`}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {nonZeroPayload.map((entry, index) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} people`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ReviewAreaChart = () => {
  return (
    <ResponsiveContainer className="Review-area-chart"  height={400}>
      <AreaChart
        data={transformedData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rating" />
        <YAxis />
        <Tooltip content={renderTooltipContent} />
        {ratingData.map((r, index) => (
          <Area
            key={r.rating}
            type="monotone"
            dataKey={`rating${r.rating}`}
            stackId="1"
            stroke={colors[index]}
            fill={colors[index]}
            name={`Rating ${r.rating}`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
