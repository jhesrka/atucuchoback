export const regularExp = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/,
  phone: /^\d{10}$/,
  date: /^\d{4}-\d{2}-\d{2}$/, // Formato YYYY-MM-DD
};
