// types/admin.ts
export interface Restaurant {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  priceRange: string;
  status: 'pending' | 'approved' | 'rejected' | 'removed';
  createdAt?: string;
  removedAt?: string;
  removalReason?: string;
  userId?: string;
}

export type User = {
  id: string;
  username: string;
  active: boolean;
  email: string;
  password: string;
  totalLiked: number;
  totalFoodlists: number;
  joinedAt: string; // ISO date
  banReason?: string;
};

export type Foodlist = {
  id: string;
  title: string;
  ownerUserId: string;
  itemCount: number;
  isPublic: boolean;
};

export type Feedback = {
  id: string;
  userId: string;
  restaurantId: string;
  rating: number; // 1..5
  comment: string;
  createdAt: string; // ISO
};
