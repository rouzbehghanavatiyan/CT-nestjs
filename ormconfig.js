require('dotenv').config();

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'nova_db',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/infrastructure/database/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/infrastructure/database/migrations',
    entitiesDir: 'src/domain/entities'
  },
  synchronize: false,
  logging: true,
};