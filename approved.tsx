import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchFeedback, fetchRestaurants, removeRestaurant } from '../../lib/api';
import type { Feedback, Restaurant } from '../../types/admin';

export default function Approved() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [removalReason, setRemovalReason] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const approved = await fetchRestaurants('approved');
      const allFeedback = await fetchFeedback();
      setRestaurants(approved);
      setFeedback(allFeedback);
      setLoading(false);
    };
    loadData();
  }, []);

  const getRestaurantFeedback = (restaurantId: string) =>
    feedback.filter((fb) => fb.restaurantId === restaurantId);

  const handleRemoveConfirm = async () => {
    if (!removalReason.trim()) {
      alert('Please provide a reason.');
      return;
    }

    if (selectedRestaurant) {
      await removeRestaurant(selectedRestaurant.id, removalReason.trim(), 'admin-123');
      setRestaurants((prev) =>
        prev.filter(r => r.id !== selectedRestaurant.id)
      );
      setSelectedRestaurant(null);
      setRemovalReason('');
      setShowRemovalModal(false);
    }
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
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelectedRestaurant(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.location}</Text>
            <Text>{item.cuisine}</Text>
            <Text>
              ⭐ {getRestaurantFeedback(item.id).length > 0
                ? (getRestaurantFeedback(item.id).reduce((sum, fb) => sum + fb.rating, 0) /
                   getRestaurantFeedback(item.id).length).toFixed(1)
                : 'No ratings yet'}
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

              <Text style={styles.reviewTitle}>User Reviews:</Text>
              {getRestaurantFeedback(selectedRestaurant.id).map((review) => (
                <Text key={review.id}>
                  #{review.comment.split(' ').slice(0, 2).join(' ')} — {review.comment}
                </Text>
              ))}

              <Button title="Remove Restaurant" color="red" onPress={() => setShowRemovalModal(true)} />
              <Button title="Close" onPress={() => setSelectedRestaurant(null)} />
            </>
          )}
        </View>
      </Modal>

      {/* Removal Reason Modal */}
      <Modal visible={showRemovalModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.removalModal}>
            <Text style={styles.modalTitle}>Reason for Removal</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter reason..."
              value={removalReason}
              onChangeText={setRemovalReason}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowRemovalModal(false);
                  setRemovalReason('');
                }}
              />
              <Button
                title="Confirm"
                color="red"
                onPress={handleRemoveConfirm}
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
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  modalContent: { flex: 1, padding: 20, justifyContent: 'center' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  reviewTitle: { marginTop: 20, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removalModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
});
