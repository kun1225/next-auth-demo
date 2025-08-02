import knex, { Knex } from 'knex';
import dbConfig from './knexfile';

async function testMigration() {
  const db: Knex = knex(dbConfig.development);

  try {
    console.log('🔍 檢查資料庫連線...');
    await db.raw('SELECT 1');
    console.log('✅ 資料庫連線成功');

    console.log('🔍 檢查 users 表...');
    const users = await db('users').select('*').limit(1);
    console.log('✅ users 表存在');

    console.log('🔍 檢查 refresh_tokens 表...');
    const tokens = await db('refresh_tokens').select('*').limit(1);
    console.log('✅ refresh_tokens 表存在');

    console.log('🔍 檢查測試用戶...');
    const testUsers = await db('users').whereIn('email', [
      'admin@example.com',
      'user@example.com',
    ]);
    console.log(`✅ 找到 ${testUsers.length} 個測試用戶`);

    console.log('\n🎉 所有測試通過！');
  } catch (error) {
    console.error(
      '❌ 測試失敗:',
      error instanceof Error ? error.message : '未知錯誤'
    );
  } finally {
    await db.destroy();
  }
}

testMigration();
