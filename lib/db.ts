import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Sree4827#mysql',  // put your MySQL password
  database: 'medisearch_pro',
})