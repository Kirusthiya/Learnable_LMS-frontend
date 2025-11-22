export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;  // ISO string
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'request';
  meta?: any;
}
