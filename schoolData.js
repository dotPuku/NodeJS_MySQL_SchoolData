import mysql from "mysql2/promise";

try {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  console.log("✅ DB Connected");
} catch (err) {
  console.error("❌ DB Error:", err.message);
}

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
