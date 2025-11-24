export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface BuyerRegisterData {
  fullName: string;
  email: string;
  password: string;
  address: string;
}

export interface StoreFormData {
  nombreUsuario: string;
  areaResponsable: string;
  direccion: string;
  telefono: string;
  correo: string;
  contrasena: string;
}

export interface StoreRegisterData {
  nombreUsuario: string;
  areaResponsable: string;
  direccion: string;
  telefono: string;
  correo: string;
  contrasena: string;
}

export interface RegisterFormData {
  role: 'comprador' | 'vendedor';
  buyer?: BuyerRegisterData;
  store?: StoreRegisterData;
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

