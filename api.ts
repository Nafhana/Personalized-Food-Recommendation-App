// lib/api.ts
// Centralized mock API for Eatoo Admin.
// All functions are async and return mock data with a tiny delay
// to simulate network. Replace with real fetch/axios later.

import type { Feedback, Foodlist, Restaurant, User } from '../types/admin';

type ExtendedRestaurant = Restaurant & {
  userId?: string;
  rejectionReason?: string;
};

// Simulate network delay
const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));

// =======================
// Mock Data Stores
// =======================

let mockUsers: User[] = [
  { id: 'u_1', username: 'alice', email: 'alice@example.com', password: 'pass123', active: true, totalLiked: 15, totalFoodlists: 2, joinedAt: '2023-04-15T10:00:00Z' },
  { id: 'u_2', username: 'bob', email: 'bob@example.com', password: 'hunter2', active: true, totalLiked: 8, totalFoodlists: 1, joinedAt: '2023-06-02T15:30:00Z' },
  { id: 'u_3', username: 'charlie', email: 'charlie@example.com', password: 'letmein', active: false, totalLiked: 0, totalFoodlists: 0, joinedAt: '2022-12-20T08:45:00Z', banReason: 'Violation of terms' },
  { id: 'u_4', username: 'daphne', email: 'daphne@example.com', password: 'qwerty', active: true, totalLiked: 12, totalFoodlists: 3, joinedAt: '2023-01-11T12:00:00Z' },
  { id: 'u_5', username: 'ed', email: 'ed@example.com', password: 'password', active: true, totalLiked: 25, totalFoodlists: 4, joinedAt: '2023-08-05T09:20:00Z' },
];

let mockRestaurants: ExtendedRestaurant[] = [
  { id: 'r_1', name: 'Nasi Lemak Legend', location: 'KL', cuisine: 'Malay', priceRange: '$', status: 'pending', userId: 'u_1', createdAt: new Date().toISOString() },
  { id: 'r_2', name: 'Sushi Senja', location: 'Penang', cuisine: 'Japanese', priceRange: '$$', status: 'approved', userId: 'u_2', createdAt: new Date(Date.now() - 3600e3 * 24 * 3).toISOString() },
  { id: 'r_3', name: 'Tandoori Hub', location: 'Ipoh', cuisine: 'Indian', priceRange: '$$', status: 'rejected', userId: 'u_2', rejectionReason: 'Poor hygiene rating', createdAt: new Date(Date.now() - 3600e3 * 24 * 7).toISOString() },
  { id: 'r_4', name: 'Dim Sum Garden', location: 'Melaka', cuisine: 'Chinese', priceRange: '$$', status: 'pending', userId: 'u_5', createdAt: new Date().toISOString() },
  { id: 'r_5', name: 'Pasta Pockets', location: 'JB', cuisine: 'Italian', priceRange: '$$$', status: 'approved', userId: 'u_4', createdAt: new Date(Date.now() - 3600e3 * 24 * 3).toISOString() },
  { id: 'r_6', name: 'Burger Bunga', location: 'Shah Alam', cuisine: 'Western', priceRange: '$', status: 'approved', userId: 'u_3', createdAt: new Date(Date.now() - 3600e3 * 24 * 3).toISOString() },
];

let mockFoodlists: Foodlist[] = [
  { id: 'fl_1', title: 'KL Budget Eats', ownerUserId: 'u_1', itemCount: 12, isPublic: true },
  { id: 'fl_2', title: 'Penang Seafood Crawl', ownerUserId: 'u_2', itemCount: 7, isPublic: false },
  { id: 'fl_3', title: 'Sweet Tooth Tour', ownerUserId: 'u_4', itemCount: 9, isPublic: true },
  { id: 'fl_4', title: 'Halal Japanese Spots', ownerUserId: 'u_5', itemCount: 5, isPublic: true },
];

// Put this right after your mockFoodlists in lib/api.ts
type FoodlistItem = {
  id: string;
  foodlistId: string;
  name: string;
  price: number;
  restaurantId: string;
};

let mockFoodlistItems: FoodlistItem[] = [
  { id: 'fi_1', foodlistId: 'fl_1', name: 'Nasi Lemak Ayam', price: 6.5, restaurantId: 'r_1' },
  { id: 'fi_2', foodlistId: 'fl_1', name: 'Roti Canai', price: 2.5, restaurantId: 'r_1' },
  { id: 'fi_3', foodlistId: 'fl_2', name: 'Grilled Fish', price: 18.0, restaurantId: 'r_2' },
  { id: 'fi_4', foodlistId: 'fl_2', name: 'Lobster Roll', price: 25.0, restaurantId: 'r_2' },
  { id: 'fi_5', foodlistId: 'fl_3', name: 'Chocolate Cake', price: 12.0, restaurantId: 'r_5' },
  { id: 'fi_6', foodlistId: 'fl_4', name: 'Halal Ramen', price: 15.0, restaurantId: 'r_4' },
];

// And add this function below deleteFoodlist
export async function fetchFoodlistItems(foodlistId: string): Promise<FoodlistItem[]> {
  await delay();
  return mockFoodlistItems.filter(item => item.foodlistId === foodlistId);
}

let mockFeedback: Feedback[] = [
  { id: 'fb_1', userId: 'u_1', restaurantId: 'r_2', rating: 5, comment: 'Fresh sushi and friendly staff!', createdAt: new Date(Date.now() - 3600e3 * 6).toISOString() },
  { id: 'fb_2', userId: 'u_3', restaurantId: 'r_1', rating: 3, comment: 'Good sambal, portion small.', createdAt: new Date(Date.now() - 3600e3 * 24).toISOString() },
  { id: 'fb_3', userId: 'u_2', restaurantId: 'r_6', rating: 4, comment: 'Great value, juicy burgers.', createdAt: new Date(Date.now() - 3600e3 * 48).toISOString() },
  { id: 'fb_4', userId: 'u_5', restaurantId: 'r_4', rating: 2, comment: 'Long wait time.', createdAt: new Date(Date.now() - 3600e3 * 72).toISOString() },
  { id: 'fb_5', userId: 'u_4', restaurantId: 'r_5', rating: 5, comment: 'Loved the truffle pasta!', createdAt: new Date(Date.now() - 3600e3 * 96).toISOString() },
  { id: 'fb_6', userId: 'u_2', restaurantId: 'r_3', rating: 1, comment: 'Not worth it.', createdAt: new Date(Date.now() - 3600e3 * 120).toISOString() },
];

// =======================
// Dashboard
// =======================
export async function fetchDashboardStats(): Promise<{
  users: number;
  restaurants: number;
  feedback: number;
  pendingApprovals: number;
}> {
  await delay();
  return {
    users: mockUsers.length,
    restaurants: mockRestaurants.length,
    feedback: mockFeedback.length,
    pendingApprovals: mockRestaurants.filter(r => r.status === 'pending').length,
  };
}

// =======================
// Users API
// =======================
export async function fetchUsers(): Promise<User[]> {
  await delay();
  return [...mockUsers];
}

export async function deleteUser(id: string): Promise<void> {
  await delay(250);
  mockUsers = mockUsers.filter(u => u.id !== id);
}

export async function banUser(id: string, reason: string): Promise<void> {
  await delay(250);
  const user = mockUsers.find(u => u.id === id);
  if (user) {
    user.active = false;
    user.banReason = reason;
  }
}

// =======================
// Restaurants API
// =======================
export async function fetchRestaurants(status?: 'pending' | 'approved' | 'rejected' | 'removed'): Promise<Restaurant[]> {
  await delay();
  return status ? mockRestaurants.filter(r => r.status === status) : [...mockRestaurants];
}

export async function approveRestaurant(id: string): Promise<void> {
  await delay(250);
  mockRestaurants = mockRestaurants.map(r => r.id === id ? { ...r, status: 'approved' } : r);
}

export const rejectRestaurant = async (id: string, reason?: string) => {
  const restaurant = mockRestaurants.find(r => r.id === id);
  if (restaurant) {
    restaurant.status = 'rejected';
    restaurant.rejectionReason = reason;
  }
  return restaurant;
};

export const removeRestaurant = async (id: string, reason?: string, adminId?: string): Promise<Restaurant | undefined> => {
  const restaurant = mockRestaurants.find(r => r.id === id);
  if (restaurant) {
    restaurant.status = 'removed';
    restaurant.removalReason = reason;
    restaurant.removedAt = new Date().toISOString();
    if (adminId) restaurant.userId = adminId;
  }
  return restaurant;
};

export async function createRestaurant(newR: Omit<Restaurant, 'id' | 'status'> & { status?: Restaurant['status'] }): Promise<Restaurant> {
  await delay(300);
  const created: Restaurant = { id: `r_${Date.now()}`, status: newR.status ?? 'pending', ...newR };
  mockRestaurants = [created, ...mockRestaurants];
  return created;
}

// =======================
// Foodlists API
// =======================
export async function fetchFoodlists(): Promise<Foodlist[]> {
  await delay();
  return [...mockFoodlists];
}

export async function deleteFoodlist(id: string): Promise<void> {
  await delay(250);
  mockFoodlists = mockFoodlists.filter(f => f.id !== id);
}

// =======================
// Feedback API
// =======================
export async function fetchFeedback(): Promise<Feedback[]> {
  await delay();
  return [...mockFeedback].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
