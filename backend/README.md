# Next Auth Demo Backend

Express + TypeScript 後端 API，搭配 PostgreSQL 資料庫和 Knex.js ORM。

## 功能特色

- ✅ Express.js + TypeScript
- ✅ PostgreSQL 資料庫
- ✅ Knex.js ORM
- ✅ JWT 認證
- ✅ 密碼加密 (bcrypt)
- ✅ 輸入驗證
- ✅ CORS 支援
- ✅ Docker 容器化
- ✅ 資料庫 Migration 和 Seed

## 快速開始

### 使用 Docker (推薦)

1. 複製環境變數檔案：
```bash
cp env.example .env
```

2. 啟動服務：
```bash
docker-compose up -d
```

3. 執行資料庫 migration：
```bash
docker-compose exec backend npm run migrate
```

4. 執行資料庫 seed：
```bash
docker-compose exec backend npm run seed
```

### 本地開發

1. 安裝依賴：
```bash
npm install
```

2. 複製環境變數檔案：
```bash
cp env.example .env
```

3. 設定 PostgreSQL 資料庫

4. 執行 migration：
```bash
npm run migrate
```

5. 執行 seed：
```bash
npm run seed
```

6. 啟動開發伺服器：
```bash
npm run dev
```

## API 端點

### 認證相關

- `POST /api/auth/register` - 註冊新使用者
- `POST /api/auth/login` - 使用者登入

### 使用者相關

- `GET /api/users/me` - 取得當前使用者資料
- `PUT /api/users/me` - 更新使用者資料
- `GET /api/users` - 取得所有使用者 (僅管理員)

### 健康檢查

- `GET /health` - 服務健康檢查

## 預設使用者

系統會自動建立以下測試使用者：

- **管理員**: admin@example.com / password123
- **一般使用者**: user@example.com / password123

## 環境變數

| 變數名稱 | 說明 | 預設值 |
|---------|------|--------|
| `PORT` | 伺服器埠號 | 3001 |
| `NODE_ENV` | 執行環境 | development |
| `DB_HOST` | 資料庫主機 | localhost |
| `DB_PORT` | 資料庫埠號 | 5432 |
| `DB_NAME` | 資料庫名稱 | next_auth_demo |
| `DB_USER` | 資料庫使用者 | postgres |
| `DB_PASSWORD` | 資料庫密碼 | password |
| `JWT_SECRET` | JWT 密鑰 | - |
| `JWT_EXPIRES_IN` | JWT 過期時間 | 24h |
| `CORS_ORIGIN` | CORS 來源 | http://localhost:3000 |

## 開發指令

```bash
# 開發模式
npm run dev

# 建置專案
npm run build

# 啟動生產環境
npm start

# 執行 migration
npm run migrate

# 建立新的 migration
npm run migrate:make

# 執行 seed
npm run seed

# 建立新的 seed
npm run seed:make
```

## Docker 指令

```bash
# 啟動所有服務
docker-compose up -d

# 查看日誌
docker-compose logs -f

# 停止服務
docker-compose down

# 重建並啟動
docker-compose up --build
```

## 專案結構

```
backend/
├── src/
│   ├── database/
│   │   ├── connection.ts
│   │   ├── migrations/
│   │   └── seeds/
│   ├── middleware/
│   │   └── auth.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   └── users.ts
│   ├── types/
│   │   └── user.ts
│   ├── utils/
│   │   └── auth.ts
│   └── index.ts
├── Dockerfile
├── docker-compose.yml
├── knexfile.ts
├── package.json
└── tsconfig.json
``` 