// app/(tabs)/restaurants/rejected.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchRestaurants, fetchUsers } from '../../lib/api';
import type { Restaurant, User } from '../../types/admin';

type ExtendedRestaurant = Restaurant & {
  userId?: string;
  rejectionReason?: string;
};

export default function Rejected() {
  const [rejectedRestaurants, setRejectedRestaurants] = useState<ExtendedRestaurant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<ExtendedRestaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const rejected = await fetchRestaurants('rejected') as ExtendedRestaurant[];
      const allUsers = await fetchUsers();
      setRejectedRestaurants(rejected);
      setUsers(allUsers);
      setLoading(false);
    };
    loadData();
  }, []);

  const getUsername = (userId?: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : 'Unknown';
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
        data={rejectedRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelectedRestaurant(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.location}</Text>
            <Text>{item.cuisine}</Text>
            <Text>Submitted by: {getUsername(item.userId)}</Text>
            <Text>Reason: {item.rejectionReason ?? 'No reason provided'}</Text>
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
              <Text>Submitted by: {getUsername(selectedRestaurant.userId)}</Text>
              <Text style={styles.label}>Rejection Reason:</Text>
              <Text>{selectedRestaurant.rejectionReason ?? 'No reason provided'}</Text>

              <Button title="Close" onPress={() => setSelectedRestaurant(null)} />
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
});