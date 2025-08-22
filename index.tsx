// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { StatCard } from '../../components/StatCard';
import { fetchDashboardStats } from '../../lib/api';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ users: number; restaurants: number; feedback: number; pendingApprovals: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchDashboardStats();
        if (mounted) setStats(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Unknown error');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Dashboard</Text>

      {loading && <ActivityIndicator testID="loading-dashboard" />}

      {!loading && stats && (
        <View>
          <StatCard label="Total Users" value={stats.users} testID="stat-users" />
          <StatCard label="Total Restaurants" value={stats.restaurants} testID="stat-restaurants" />
          <StatCard label="Total Feedback" value={stats.feedback} testID="stat-feedback" />
          <StatCard label="Pending Approvals" value={stats.pendingApprovals} testID="stat-pending" />
        </View>
      )}

      {!loading && !stats && <Text testID="empty-dashboard">No stats found.</Text>}


      {error && <Text style={{ marginTop: 16, color: 'crimson' }} testID="error-dashboard">Error: {error}</Text>}
    </View>
  );
}