import 'dotenv/config';
import app from './server/index.js';

const port = Number(process.env.PORT) || 3000;
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
app.listen(port, host, () => {
  console.log(`Notes API berjalan di http://${host}:${port}`);
});
