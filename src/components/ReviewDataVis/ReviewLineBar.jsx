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

// Example ratings data (number of people giving each rating)
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

// Optional: Example trend data - could represent a cumulative average, etc.
const withTrend = ratingData.map((item, index, arr) => ({
  ...item,
  trend: index === 0 ? item.people : arr.slice(0, index + 1).reduce((acc, i) => acc + i.people, 0) / (index + 1),
}));

export const ReviewLineBar = () => {
  return (
    <ResponsiveContainer className = "Review-line-bar" height={420}>
      <ComposedChart
        data={withTrend}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rating" />
        <YAxis />
        <Tooltip />
        <Legend />

        {/* Bar chart to show number of people per rating */}
        <Bar dataKey="people" barSize={30} fill="#8884d8" name="Number of People" />

        {/* Optional Line to show a trend over ratings */}
        <Line type="monotone" dataKey="trend" stroke="#ff7300" dot={{ r: 4 }} name="Average Trend" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
