// app/view/pending.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { approveRestaurant, fetchRestaurants, fetchUsers, rejectRestaurant } from '../../lib/api';
import type { Restaurant, User } from '../../types/admin';

export default function Pending() {
  const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionRReasonsMap, setRejectionReasonsMap] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const pending = await fetchRestaurants('pending');
      const allUsers = await fetchUsers();
      setPendingRestaurants(pending);
      setUsers(allUsers);
      setLoading(false);
    };
    loadData();
  }, []);

  const getUsername = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : 'Unknown';
  };

  const handleApprove = async (id: string) => {
    await approveRestaurant(id);
    setPendingRestaurants((prev) => prev.filter((r) => r.id !== id));
    setSelectedRestaurant(null);
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    await rejectRestaurant(id);
    // You can store rejectionReason somewhere if needed
    setPendingRestaurants((prev) => prev.filter((r) => r.id !== id));
    setSelectedRestaurant(null);
    setRejectionReason('');
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
        data={pendingRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelectedRestaurant(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.location}</Text>
            <Text>{item.cuisine}</Text>
            {/* <Text>Submitted by: {getUsername(item.userId ?? '')}</Text> */}
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
              {/* <Text>Submitted by: {getUsername(selectedRestaurant.userId ?? '')}</Text> */}

              <Button title="Approve" onPress={() => handleApprove(selectedRestaurant.id)} />
              <Button title="Reject" color="red" onPress={() => setShowRejectionModal(true)} />
              <Button title="Close" onPress={() => setSelectedRestaurant(null)} />
            </>
          )}
        </View>
      </Modal>
      
      <Modal visible={showRejectionModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.rejectionModal}>
            <Text style={styles.modalTitle}>Reason for Rejection</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter reason..."
              value={rejectionReason}
              onChangeText={setRejectionReason}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
              />
              <Button
                title="Confirm"
                color="red"
                onPress={async () => {
                  if (!rejectionReason.trim()) {
                    alert('Please provide a reason.');
                    return;
                  }
                  if (selectedRestaurant) {
                    // Create updated restaurant object including rejection reason
                    const rejectedRestaurant = {
                      ...selectedRestaurant,
                      status: 'rejected',
                      rejectionReason: rejectionReason.trim(),
                    };

                    // Send rejection reason to your API
                    await rejectRestaurant(selectedRestaurant.id, rejectedRestaurant.rejectionReason);

                    // Remove it from pending list
                    setPendingRestaurants((prev) =>
                      prev.filter((r) => r.id !== selectedRestaurant.id)
                    );

                    // Clear modal and input
                    setSelectedRestaurant(null);
                    setRejectionReason('');
                    setShowRejectionModal(false);
                  }
                  setShowRejectionModal(false);
                  setSelectedRestaurant(null);
                  setRejectionReason('');
                }}
              />
            </View>
          </View>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
  overlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
rejectionModal: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 10,
  width: '80%',
  elevation: 5,
},
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});