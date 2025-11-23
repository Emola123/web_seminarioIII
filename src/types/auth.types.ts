export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  address: string;
  role: 'comprador' | 'vendedor'; // Cambiado a tu modelo
}

export interface StoreFormData {
  businessName: string;
  taxId: string;
  physicalAddress: string;
  phone: string;
  email: string;
  password: string;
  role: 'vendedor'; // Siempre es 'vendedor' para tiendas
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

