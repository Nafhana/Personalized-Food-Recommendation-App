// app/(tabs)/restaurants/main.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Approved from '../../view/approved';
import Pending from '../../view/pending';
import Rejected from '../../view/rejected';
import Removed from '../../view/removed';

type Tab = 'approved' | 'pending' | 'rejected' | 'removed';

export default function RestaurantsMain() {
  const [activeTab, setActiveTab] = useState<Tab>('approved');

const renderTabContent = () => {
  switch (activeTab) {
    case 'approved':
      return <Approved />;
    case 'pending':
      return <Pending />;
    case 'rejected':
      return <Rejected />;
    case 'removed':
      return <Removed />;
    default:
      return null;
  }
};

  const tabs: Tab[] = ['approved', 'pending', 'rejected', 'removed'];

  return (
    <View style={{ flex: 1 }}>
      {/* Tab buttons */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab content */}
      <View style={{ flex: 1 }}>
        {renderTabContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#eee',
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  tabText: {
    color: '#555',
    fontWeight: '500',
  },
  activeText: {
    color: 'blue',
    fontWeight: '700',
  },
});