import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

// only allow test or development environment
const ALLOWED_ENVS = ['test', 'development'];
if (!ALLOWED_ENVS.includes(process.env.NODE_ENV || '')) {
  throw new Error(`Seeding not allowed in NODE_ENV="${process.env.NODE_ENV}"`);
}

export async function seed(knex: Knex): Promise<void> {
  await knex('refresh_tokens').del();
  await knex('users').del();

  const passwordHash = await bcrypt.hash('password123', 10);

  const [adminId, userId] = await knex('users')
    .insert([
      {
        email: 'admin@example.com',
        name: 'Admin',
        password_hash: passwordHash,
        is_verified: true,
        role: 'admin',
      },
      {
        email: 'user@example.com',
        name: 'Regular User',
        password_hash: passwordHash,
        is_verified: true,
        role: 'user',
      },
    ])
    .returning('id')
    .then(rows => rows.map(row => (typeof row === 'object' ? row.id : row)));

  await knex('refresh_tokens').insert([
    {
      jti: 'token-admin-001',
      user_id: adminId,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      is_revoked: false,
      user_agent_info: 'CLI seeding script - admin',
      replace_by: null,
      created_at: new Date(),
    },
    {
      jti: 'token-user-001',
      user_id: userId,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      is_revoked: false,
      user_agent_info: 'CLI seeding script - user',
      replace_by: null,
      created_at: new Date(),
    },
  ]);
}
