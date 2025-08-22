// app/view/removed.tsx
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { fetchRestaurants, fetchUsers } from '../../lib/api';
import type { Restaurant, User } from '../../types/admin';

export default function Removed() {
  const [removedRestaurants, setRemovedRestaurants] = useState<Restaurant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
    const removed = await fetchRestaurants('removed');
      const allUsers = await fetchUsers();
      setRemovedRestaurants(removed);
      setUsers(allUsers);
      setLoading(false);
    };
    loadData();
  }, []);

  const getUsername = (userId?: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  };

  const formatDuration = (start: string | undefined, end: string | undefined) => {
    if (!start || !end) return 'Unknown';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} day(s)`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={removedRestaurants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedRestaurant(item)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Cuisine: {item.cuisine}</Text>
            <Text>Removed by: {getUsername(item.userId)}</Text>
            <Text>Reason: {item.removalReason ?? 'No reason provided'}</Text>
            <Text>
              Duration: {formatDuration(item.createdAt, item.removedAt)}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Detail Modal */}
      <Modal visible={!!selectedRestaurant} animationType="slide">
        <View style={styles.modalContent}>
          {selectedRestaurant && (
            <>
              <Text style={styles.modalTitle}>{selectedRestaurant.name}</Text>
              <Text>Location: {selectedRestaurant.location}</Text>
              <Text>Cuisine: {selectedRestaurant.cuisine}</Text>
              <Text>Price Range: {selectedRestaurant.priceRange}</Text>
              <Text>Removed by: {getUsername(selectedRestaurant.userId)}</Text>
              <Text style={styles.label}>Removal Reason:</Text>
              <Text>{selectedRestaurant.removalReason ?? 'No reason provided'}</Text>
              <Text style={styles.label}>Time Active:</Text>
              <Text>{formatDuration(selectedRestaurant.createdAt, selectedRestaurant.removedAt)}</Text>

              <Text
                style={styles.closeButton}
                onPress={() => setSelectedRestaurant(null)}
              >
                Close
              </Text>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  modalContent: { flex: 1, padding: 20, justifyContent: 'center' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  label: { marginTop: 20, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  closeButton: {
    marginTop: 30,
    fontSize: 18,
    color: 'blue',
    textAlign: 'center',
  },
});
