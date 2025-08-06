export type User = {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  role: 'user' | 'admin';
  is_email_verified: boolean;
};

export type UserCreateInput = Omit<User, 'id' | 'created_at' | 'updated_at'>;

export type UserUpdateInput = Partial<
  Omit<User, 'id' | 'created_at' | 'updated_at'>
>;

export type UserResponse = Omit<User, 'password_hash'>;
