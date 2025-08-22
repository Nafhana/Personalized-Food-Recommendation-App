import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { banUser, fetchUsers } from '../../lib/api';
import type { User } from '../../types/admin';

export default function UsersScreen() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setList(data);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((u) => u.username.toLowerCase().includes(q));
  }, [list, query]);

  const onBan = (id: string) => {
    Alert.prompt(
      'Ban User',
      'Enter reason for banning this account:',
      async (reason) => {
        if (!reason?.trim()) return;
        try {
          await banUser(id, reason.trim());
          setList((prev) => prev.map(u => u.id === id ? { ...u, active: false } : u));
          setSelectedUser(prev => prev ? { ...prev, active: false } : prev);
        } catch (e: any) {
          setError(e?.message ?? 'Failed to ban user');
        }
      }
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Users</Text>

      <TextInput
        placeholder="Search by username"
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 6,
          padding: 8,
          marginBottom: 12
        }}
      />

      {loading && <ActivityIndicator />}

      {!loading && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedUser(item)}
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#eee'
              }}
            >
              <Text style={{ fontWeight: '600' }}>{item.username}</Text>
              <Text style={{ color: item.active ? 'green' : 'gray' }}>
                {item.active ? 'Active' : 'Inactive'}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text>No users found.</Text>}
        />
      )}

      {error && (
        <Text style={{ marginTop: 12, color: 'crimson' }}>
          Error: {error}
        </Text>
      )}

      {/* Detail Modal */}
      <Modal
        visible={!!selectedUser}
        animationType="slide"
        onRequestClose={() => setSelectedUser(null)}
      >
        {selectedUser && (
          <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
              {selectedUser.username}
            </Text>
            <Text>Email: {selectedUser.email}</Text>
            <Text>Password: {selectedUser.password}</Text>
            <Text>Total Liked: {selectedUser.totalLiked}</Text>
            <Text>Total Foodlists: {selectedUser.totalFoodlists}</Text>
            <Text>Joined: {new Date(selectedUser.joinedAt).toLocaleDateString()}</Text>
            <Text style={{ color: selectedUser.active ? 'green' : 'gray', marginBottom: 20 }}>
              {selectedUser.active ? 'Active' : 'Inactive'}
            </Text>

            <Pressable
              onPress={() => onBan(selectedUser.id)}
              style={{
                borderWidth: 1,
                borderColor: '#a00',
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginBottom: 12
              }}
            >
              <Text>Ban</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedUser(null)}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 6
              }}
            >
              <Text>Close</Text>
            </Pressable>
          </View>
        )}
      </Modal>
    </View>
  );
}
