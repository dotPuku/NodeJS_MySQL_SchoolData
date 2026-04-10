import express, { urlencoded } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { addSchool, deleteSchool, schoolList, connectDB } from "./schoolData.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(urlencoded({ extended: true }));

await connectDB();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "schoolData.html"));
});

app.get("/listSchools", async (req, res) => {
  const { lat, lng } = req.query;
  const list = await schoolList(lat, lng);
  res.send(list);
});

app.post("/addSchool", async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({
      data: "Fill all the fields"
    });
  }

  await addSchool(name, address, latitude, longitude);

  res.status(200).json({
    data: "School added successfully!"
  });
});

app.delete("/deleteSchool/:id", async (req, res) => {
  await deleteSchool(req.params.id);

  res.status(200).json({
    data: "School deleted successfully!"
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
