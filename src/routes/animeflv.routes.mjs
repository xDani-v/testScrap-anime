import { Router } from "express";
import { getAnimeEpisodes, getBrowser, getBusqueda, getAnimeDetalle, getVerEpisodio } from "../controllers/animeflv.mjs";

const router = Router();

router.get("/animeflv", getAnimeEpisodes);
router.get("/animeflv/browse", getBrowser);
router.get("/animeflv/busqueda", getBusqueda);
router.get('/animeflv/detalle', getAnimeDetalle);
router.get('/animeflv/ver', getVerEpisodio);




export default router;