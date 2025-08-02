import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // 清空現有資料
  await knex('refresh_tokens').del();
  await knex('users').del();

  // 建立測試用戶
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'admin@example.com',
      name: 'Admin User',
      password_hash: hashedPassword,
      is_verified: true,
      role: 'admin',
    },
    {
      email: 'user@example.com',
      name: 'Regular User',
      password_hash: hashedPassword,
      is_verified: true,
      role: 'user',
    },
  ];

  await knex('users').insert(users);
}
