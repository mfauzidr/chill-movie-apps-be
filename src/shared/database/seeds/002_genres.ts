
import type { Knex } from "knex";

const genres = [
  "Action",
  "Adventure",
  "Anime",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Musical",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Sport",
  "Thriller",
];

export async function seed(knex: Knex): Promise<void> {
  const existingGenres = await knex("genres").select("name");

  const existingNames = new Set(
    existingGenres.map((genre) => genre.name.toLowerCase())
  );

  const newGenres = genres
    .filter((name) => !existingNames.has(name.toLowerCase()))
    .map((name) => ({ name }));

  if (newGenres.length === 0) {
    console.log("Genres seed skipped: all records already exist.");
    return;
  }

  await knex("genres").insert(newGenres);

  console.log(
    `Genres seed completed: ${newGenres.length} records inserted.`
  );
}
