"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DonutChartProps {
  greens: number;
  ambers: number;
  reds: number;
  avgScore: number;
}

export default function DonutChart({ greens, ambers, reds, avgScore }: DonutChartProps) {
  const data = [
    { name: 'Green', value: greens, color: 'url(#gradGreen)' },
    { name: 'Amber', value: ambers, color: 'url(#gradAmber)' },
    { name: 'Red', value: reds, color: 'url(#gradRed)' },
  ].filter(d => d.value > 0);

  // If no data, show a grey empty circle
  if (data.length === 0) {
    data.push({ name: 'Empty', value: 1, color: '#f3f4f6' });
  }

  return (
    <div className="relative w-44 h-44 flex-shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.15" />
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1" />
            </filter>
            
            {/* 3D Gradients for the Pie Slices */}
            <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="gradAmber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            stroke="#ffffff"
            strokeWidth={3}
            paddingAngle={3}
            dataKey="value"
            isAnimationActive={true}
            filter="url(#shadow3d)"
            cornerRadius={4}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [`${value} Members`, 'Count']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: 'bold' }}
            itemStyle={{ color: '#374151' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 pointer-events-none">
        <span className="text-[32px] font-extrabold text-gray-900 leading-none tracking-tight">{avgScore}</span>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">/100 avg</span>
      </div>
    </div>
  );
}
