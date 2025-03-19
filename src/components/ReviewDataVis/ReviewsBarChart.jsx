import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Define colors for each bar
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink', '#8884d8', '#82ca9d', '#d0ed57', '#ff8042'];

// Function to create a triangular shape
const getPath = (x, y, width, height) => {
  const halfWidth = width / 2;
  return `M${x + halfWidth},${y} L${x},${y + height} L${x + width},${y + height} Z`;
};

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

export const ReviewsBarChart = ({ ratingDistribution }) => {
  
  const data = Object.keys(ratingDistribution).map((rating) => ({
    name: `${rating} Star`,  // Label for the bar (e.g., "1 Star")
    count: ratingDistribution[rating], // Number of votes
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" shape={<TriangleBar />} label={{ position: 'top' }}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
