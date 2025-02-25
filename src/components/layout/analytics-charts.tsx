import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Type definition from the original component
type VisitorAnalytics = {
    visitor_id: string;
    ip_address: string;
    user_agent: string;
    browser: string;
    browser_version: string;
    os: string;
    os_version: string;
    device_type: string;
    device_model: string;
    referrer_url: string;
    page_url: string;
    visit_count: number;
    first_visited_at: string;
    last_visited_at: string;
    city?: string;
    region_name?: string;
    country_name?: string;
};

// Custom colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const AnalyticsGraphs = ({ data }: { data: VisitorAnalytics[] }) => {
  // Data processing functions
  const countryData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      if (item.country_name) {
        counts[item.country_name] = (counts[item.country_name] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 countries
  }, [data]);

  const regionData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      if (item.region_name) {
        counts[item.region_name] = (counts[item.region_name] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 regions
  }, [data]);

  const pageData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      // Extract just the path part of the URL for cleaner display
      const urlPath = new URL("https://jelius.dev" + item.page_url).pathname;
      counts[urlPath] = (counts[urlPath] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 pages
  }, [data]);

  const deviceData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      counts[item.device_type] = (counts[item.device_type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const osData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      counts[item.os] = (counts[item.os] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 OS
  }, [data]);

  // Daily visits data for line chart
  const visitsOverTime = useMemo(() => {
    const dateVisits: Record<string, number> = {};
    
    data.forEach(item => {
      const date = new Date(item.last_visited_at).toISOString().split('T')[0];
      dateVisits[date] = (dateVisits[date] || 0) + 1;
    });
    
    // Convert to array and sort by date
    return Object.entries(dateVisits)
      .map(([date, visits]) => ({ date, visits }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14); // Last 14 days
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Visits Over Time - Line Chart */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Visits Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visitsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visits" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Countries - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Countries</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" name="Visitors" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Regions - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Regions</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#00C49F" name="Visitors" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Pages - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Most Visited Pages</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Bar dataKey="value" fill="#FFBB28" name="Visits" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device Types - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Device Types</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Operating Systems - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Operating Systems</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={osData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {osData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsGraphs;