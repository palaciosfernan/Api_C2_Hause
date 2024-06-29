import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'house',
  password: 'house123',
  database: 'hause',
  connectionLimit: 10,
});

export async function query(sql: string, params?: any[]): Promise<any> {
  const [rows] = await pool.query(sql, params);
  return rows;
}
