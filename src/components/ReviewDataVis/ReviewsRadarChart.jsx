import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// Data representing the number of people who gave each rating (1-10)
const data = [
  { subject: '1', A: 10, fullMark: 100 },
  { subject: '2', A: 30, fullMark: 100 },
  { subject: '3', A: 25, fullMark: 100 },
  { subject: '4', A: 15, fullMark: 100 },
  { subject: '5', A: 40, fullMark: 100 },
  { subject: '6', A: 60, fullMark: 100 },
  { subject: '7', A: 80, fullMark: 100 },
  { subject: '8', A: 45, fullMark: 100 },
  { subject: '9', A: 20, fullMark: 100 },
  { subject: '10', A: 50, fullMark: 100 },
];

export const ReviewsRadarChart = () => {
  return (
    <ResponsiveContainer className = "Review-radar-chart" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Number of Ratings" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
};
