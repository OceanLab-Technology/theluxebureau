// Database types for the API routes
export type Activity = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  type: string; // e.g. "product_created"
  entity_type: string;
  entity_id: string;
  user_id: string | null;
  metadata?: Record<string, any>;
} & DerivedActivityFields;

type DerivedActivityFields = {
  timestamp?: string;
  status?: string;
};

export interface CartItem {
  id?: string;
  user_id: string;
  product_id: string;
  quantity: number;
  custom_data?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  last_order_date?: string;
  total_spent?: number;
  order_count?: number;
  status?: 'Active' | 'Inactive';
  created_at?: string;
  updated_at?: string;
}

export interface FormSubmission {
  id?: string;
  name?: string;
  email?: string;
  message?: string;
  phone?: string;
  company?: string;
  form_data?: Record<string, any>;
  submitted_at?: string;
  status?: string;
  source?: string;
  order_type?: string;
  recipients?: Record<string, any>;
  event_details?: Record<string, any>;
  design_options?: Record<string, any>;
  delivery_date?: string;
  order_value?: number;
}

export interface OrderItem {
  id?: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
}

export interface Order {
  id?: string;
  customer_name: string;
  customer_email: string;
  recipient_name: string;
  recipient_address: string;
  delivery_date: string;
  notes?: string;
  status?: 'New' | 'Active' | 'Complete';
  total_amount?: number;
  created_at?: string;
  updated_at?: string;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
  product_details?: Record<string, any>;
  personalization?: Record<string, any>;
}

export interface Product {
  id?: string;
  slug?: string;
  category?: string;
  name: string;
  description?: string;
  inventory: number;
  price: number;
  title?: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
  packaging?: string; // URL of selected packaging
  why_we_chose_it?: string;
  about_the_maker?: string;
  particulars?: string;
  least_inventory_trigger?: number;
  created_at?: string;
  updated_at?: string;
  // Computed fields for frontend compatibility
  image?: string; // Will map to image_1
  availability?: "in-stock" | "limited-edition" | "sold-out"; // Will compute from inventory
  originalPrice?: number;
  tags?: string[];
  // Cart/Checkout specific fields
  quantity?: number;
  cartItemId?: string;
  customData?: Record<string, any>;
  contains_alcohol: boolean;
}

export interface Profile {
  id: string;
  email?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSetting {
  id?: string;
  fonts: FontSetting[];
  quotes: {
    text: string;
    author: string;
  }[];
  packaging: PackagingSetting[];
  api_key?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FontSetting {
  name: string;
  url: string;
}

export interface PackagingSetting {
  id: string;
  title: string;
  image_url: string;
  created_at?: string;
}

export interface TeamInvitation {
  id?: string;
  email: string;
  invited_by: string;
  role?: 'admin' | 'user';
  token?: string;
  expires_at?: string;
  accepted_at?: string;
  created_at?: string;
}

export interface TeamMember {
  id?: string;
  user_id: string;
  email: string;
  added_by: string;
  role?: 'admin' | 'user';
  permissions?: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  [key: string]: any;
}
