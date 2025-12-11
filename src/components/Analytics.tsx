import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { EnergyReading } from '../types';

interface AnalyticsProps {
  readings: EnergyReading[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ readings }) => {
  // Aggregate breakdown data
  const breakdownTotals = readings.reduce(
    (acc, r) => ({
      hvac: acc.hvac + r.breakdown.hvac,
      lighting: acc.lighting + r.breakdown.lighting,
      plugLoads: acc.plugLoads + r.breakdown.plugLoads,
      evCharging: acc.evCharging + r.breakdown.evCharging,
    }),
    { hvac: 0, lighting: 0, plugLoads: 0, evCharging: 0 }
  );

  const pieData = [
    { name: 'HVAC', value: breakdownTotals.hvac, color: '#3b82f6' },
    { name: 'Lighting', value: breakdownTotals.lighting, color: '#f59e0b' },
    { name: 'Plug Loads', value: breakdownTotals.plugLoads, color: '#10b981' },
    { name: 'EV Charging', value: breakdownTotals.evCharging, color: '#6366f1' },
  ];

  const barData = readings
    .filter((_, i) => i % 2 === 0)
    .map((r) => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit' }),
      HVAC: r.breakdown.hvac,
      Lighting: r.breakdown.lighting,
      Other: r.breakdown.plugLoads + r.breakdown.evCharging,
    }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Consumption Analytics</h2>
        <p className="text-slate-500">Detailed breakdown of energy distribution</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Load Breakdown Pie */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Total Load Distribution</h3>
          <div className="h-[300px] min-h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stacked Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Usage by Category (12h)</h3>
          <div className="h-[300px] min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  unit=" kW"
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey="HVAC" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Lighting" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Other" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Raw Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pieData.map((item) => (
            <div key={item.name} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-500 text-sm">{item.name}</p>
              <p className="text-xl font-bold text-slate-800">
                {Math.round(item.value).toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400">kWh</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
