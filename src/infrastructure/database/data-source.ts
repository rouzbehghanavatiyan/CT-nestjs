import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'N0v@t00l$123',
  database: 'novadb',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/infrastructure/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});

// -----------------------------------------------------------------------------------------------
// SELECT conname, conrelid::regclass
// FROM pg_constraint
// WHERE conname = 'PK_313ee7159517cb494d532ee5466';
// -----------------------------------------------------------------------------------------------
// SELECT setval(
//   pg_get_serial_sequence('product_names', 'id'),
//   (SELECT MAX(id) FROM product_names),
//   true
// );
// -----------------------------------------------------------------------------------------------
// DO $$
// DECLARE
//   r RECORD;
// BEGIN
//   FOR r IN
//     SELECT
//       c.relname AS table_name,
//       a.attname AS column_name,
//       pg_get_serial_sequence(c.relname, a.attname) AS seq_name
//     FROM pg_class c
//     JOIN pg_attribute a ON a.attrelid = c.oid
//     JOIN pg_namespace n ON n.oid = c.relnamespace
//     WHERE c.relkind = 'r'
//       AND a.attidentity IN ('a','d')
//       AND n.nspname = 'public'
//   LOOP
//     EXECUTE format(
//       'SELECT setval(%L, (SELECT COALESCE(MAX(%I), 0) FROM %I), true);',
//       r.seq_name,
//       r.column_name,
//       r.table_name
//     );
//   END LOOP;
// END $$;
// -----------------------------------------------------------------------------------------------
// آپدیت جدول محصولات که ستون desId = product_names.id شود
//  UPDATE product_names
//  SET "desId" = id
// WHERE id < 898;