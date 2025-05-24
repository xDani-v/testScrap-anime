import express from "express";
import animeflvRoutes from "./routes/animeflv.routes.mjs"

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api", animeflvRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});