import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;
// Node-postgres membaca PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE dari .env
export default new Pool();
