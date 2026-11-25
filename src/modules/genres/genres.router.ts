import { Router } from "express"
import { createGenre, deleteGenre, getAllGenres, getGenreById, updateGenre } from "./genres.handler";

const genresRouter = Router();

genresRouter.get("/", getAllGenres)
genresRouter.get("/:id", getGenreById)
genresRouter.post("/", createGenre)
genresRouter.patch("/:id", updateGenre)
genresRouter.delete("/:id", deleteGenre)


export default genresRouter