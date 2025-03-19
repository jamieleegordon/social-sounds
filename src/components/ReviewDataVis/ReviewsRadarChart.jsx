import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// Assuming the data comes in as props
export const ReviewsRadarChart = ({ ratingDistribution }) => {
  // Transform ratingDistribution into an array for the radar chart
  const data = Object.keys(ratingDistribution).map((rating) => ({
    subject: rating,  // Rating (1-10)
    A: ratingDistribution[rating], // Number of people who gave that rating
    fullMark: 100,  // Max value (can be adjusted if needed)
  }));

  // Get the max value in data to adjust the domain dynamically
  const maxValue = Math.max(...data.map(item => item.A));

  return (
    <ResponsiveContainer className="Review-radar-chart" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        
        {/* Dynamically adjust the domain based on max value */}
        <PolarRadiusAxis angle={30} domain={[0, maxValue]} />
        
        {/* Radar with improved fill opacity */}
        <Radar name="Number of Ratings" dataKey="A" stroke="#ff7300" fill="#ff7300" fillOpacity={0.7} />
      </RadarChart>
    </ResponsiveContainer>
  );
};


