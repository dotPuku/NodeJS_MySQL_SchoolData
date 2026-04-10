import express, { urlencoded } from "express";
import path from "path"
import { addSchool, deleteSchool, schoolList } from "./schoolData.js";

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(import.meta.dirname, "schoolData.html"));
})

app.get("/listSchools", async (req, res) => {
    const { lat, lng } = req.query;
    const list = await schoolList(lat, lng);
    res.send(list);
})

app.post("/addSchool", (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    if (name == "" || address == "" || latitude == "" || longitude == "") {
        res.status(400).json({
            data: "Fill all the fields"
        })
    } else {
        addSchool(name, address, latitude, longitude);
        res.status(200).json({
            data: "School added succesfully!"
        });
    }
})

app.delete("/deleteSchool/:id", async (req, res) => {
    await deleteSchool(req.params.id);
    res.status(201).json({
        data: "School deleted succesfully!"
    });
})

const port = 3000;
app.listen(port, () => {
    console.log(`port created for http://localhost:${port}`);
});