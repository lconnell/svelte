export * from './user';
export * from './workOrder';
export * from './auth';
export * from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Component Props Types
export interface ModalProps {
  title: string;
  showModal: boolean;
  onClose?: () => void;
  children?: any; // This allows for content to be passed to the modal
}

export interface FormProps<T> {
  data?: T;
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
} 