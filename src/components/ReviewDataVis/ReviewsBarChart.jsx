import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Define colors for each bar
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink', '#8884d8', '#82ca9d', '#d0ed57', '#ff8042'];

// Data representing the number of people who gave each rating from 1 to 10
const data = [
  { name: '1', count: 10 },
  { name: '2', count: 30 },
  { name: '3', count: 25 },
  { name: '4', count: 15 },
  { name: '5', count: 40 },
  { name: '6', count: 60 },
  { name: '7', count: 80 },
  { name: '8', count: 45 },
  { name: '9', count: 20 },
  { name: '10', count: 50 },
];

// Function to create a triangular shape
const getPath = (x, y, width, height) => {
  const halfWidth = width / 2;
  return `M${x + halfWidth},${y} L${x},${y + height} L${x + width},${y + height} Z`;
};

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

export const ReviewsBarChart = () => {
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
