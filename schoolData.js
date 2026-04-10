import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql04@#",
  database: "newsql_db"
});

console.log("MySQL Connected Succesfully With Database newsql_db");

// await db.execute(`
//   CREATE TABLE schools(
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(100) NOT NULL,
//   address VARCHAR(300) NOT NULL
//   )
//   `)

export const addSchool = async (name, address, latitude, longitude) => {
  await db.execute("INSERT INTO schools(name,address,latitude,longitude) VALUES(?,?,?,?)", [name, address, latitude, longitude])
}

export const schoolList = async (lat, lng) => {
  const [rows] = await db.execute(`
    SELECT 
        id,
        name,
        address,
        latitude,
        longitude,
        (
          6371 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(latitude)) *
            COS(RADIANS(longitude) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(latitude))
          )
        ) AS distance
      FROM schools
      ORDER BY distance ASC
      `,
    [lat, lng, lat]
  );
  return rows
}

export const deleteSchool = async (id) => {
  await db.execute(`
    DELETE FROM schools
    where id=?
    `, [id])
}