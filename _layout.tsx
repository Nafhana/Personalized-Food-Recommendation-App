// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const icon =
    (name: React.ComponentProps<typeof Ionicons>['name']) =>
    ({ color, size }: { color: string; size: number }) =>
      <Ionicons name={name} size={size} color={color} />;

  return (
    <Tabs
      screenOptions={{
        headerTitle: 'Eatoo Admin',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: Platform.select({ default: { height: 56 } }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: icon('speedometer-outline'),
        }}
      />
      <Tabs.Screen
        name="restaurants/main"
        options={{
          title: 'Restaurants',
          tabBarIcon: icon('restaurant-outline'),
        }}
      />
      <Tabs.Screen
        name="foodlists"
        options={{
          title: 'Foodlists',
          tabBarIcon: icon('list-outline'),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: icon('people-outline'),
        }}
      />
    </Tabs>
  );
}
