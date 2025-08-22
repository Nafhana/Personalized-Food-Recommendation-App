import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, Text, TextInput, View, } from 'react-native';
import { deleteFoodlist, fetchFoodlistItems, fetchFoodlists, fetchRestaurants, } from '../../lib/api';
import type { Foodlist } from '../../types/admin';

export default function FoodlistsScreen() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Foodlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, allRestaurants] = await Promise.all([
        fetchFoodlists(),
        fetchRestaurants(),
      ]);
      setList(data);
      setRestaurants(allRestaurants);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((f) => f.title.toLowerCase().includes(q));
  }, [list, query]);

  const onRemove = async (id: string) => {
    try {
      await deleteFoodlist(id);
      setList((prev) => prev.filter((f) => f.id !== id));
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete');
    }
  };

  const onViewItems = async (id: string) => {
    setSelectedListId(id);
    try {
      const foodlistItems = await fetchFoodlistItems(id);
      // join with restaurant names
      const joined = foodlistItems.map((item) => ({
        ...item,
        restaurantName:
          restaurants.find((r) => r.id === item.restaurantId)?.name || 'Unknown',
      }));
      setItems(joined);
      setModalVisible(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>
        Foodlists
      </Text>

      <TextInput
        placeholder="Filter by title"
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 6,
          padding: 8,
          marginBottom: 12,
        }}
        testID="input-foodlists-filter"
      />

      {loading && <ActivityIndicator testID="loading-foodlists" />}

      {!loading && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
              testID={`foodlist-${item.id}`}
            >
              <Text style={{ fontWeight: '600' }}>{item.title}</Text>
              <Text>
                Owner: {item.ownerUserId} • Items: {item.itemCount} •{' '}
                {item.isPublic ? 'Public' : 'Private'}
              </Text>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <Pressable
                  onPress={() => onViewItems(item.id)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#0a0',
                    borderRadius: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                >
                  <Text>View Items</Text>
                </Pressable>

                <Pressable
                  onPress={() => onRemove(item.id)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#a00',
                    borderRadius: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                  testID={`btn-remove-foodlist-${item.id}`}
                >
                  <Text>Remove</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text testID="empty-foodlists">No items found.</Text>
          }
        />
      )}

      {error && (
        <Text style={{ marginTop: 12, color: 'crimson' }} testID="error-foodlists">
          Error: {error}
        </Text>
      )}

      {/* Items Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              maxHeight: '80%',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
              Foodlist Items
            </Text>
            {items.length > 0 ? (
              <FlatList
                data={items}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                  <Text>
                    {item.name} — RM{item.price} @ {item.restaurantName}
                  </Text>
                )}
              />
            ) : (
              <Text>No items found.</Text>
            )}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 12,
                alignSelf: 'flex-end',
                backgroundColor: '#ccc',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
              }}
            >
              <Text>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
