
import type { Knex } from "knex";

const contentGenreMap: Record<string, string[]> = {
  "Don't Look Up": ["Comedy", "Drama", "Science Fiction"],
  "All of Us Are Dead": ["Mystery", "Crime", "Fantasy"],
  "Blue Lock": ["Anime", "Sport"],
  "A Man Called Otto": ["Drama", "Comedy", "Romance"],
  "Dr. Strange: Multiverse of Madness": [
    "Action",
    "Fantasy",
    "Adventure",
  ],
  "Duty After School": ["Action", "Drama", "Science Fiction"],
  Suzume: ["Anime", "Fantasy", "Adventure"],
  "Jurrasic World": ["Action", "Adventure", "Science Fiction"],
  "Sonic 2": ["Action", "Comedy", "Adventure"],
  "Big Hero 6": ["Animation", "Action", "Comedy"],
  "The Little Mermaid": ["Fantasy", "Musical", "Adventure"],
  "The Tomorrow War": ["Action", "Science Fiction", "Adventure"],
  "Ant-Man and the Wasp: Quantumania": [
    "Action",
    "Fantasy",
    "Adventure",
  ],
  "Guardians of the Galaxy": ["Action", "Comedy", "Science Fiction"],
  "Alice in Borderland": ["Action", "Mystery", "Thriller"],
  Avatar: ["Action", "Fantasy", "Adventure"],
  "Baymax!": ["Animation", "Comedy", "Adventure"],
  "Black Adam": ["Action", "Fantasy", "Adventure"],
  "Dilan 1991": ["Drama", "Romance"],
  "Fast X": ["Action", "Crime", "Thriller"],
  Happiness: ["Drama", "Thriller", "Mystery"],
  M3GAN: ["Horror", "Thriller", "Science Fiction"],
  "My Hero Academia": ["Anime", "Action", "Adventure"],
  Missing: ["Mystery", "Thriller", "Drama"],
  Rio: ["Animation", "Comedy", "Adventure"],
  "Spider-Man: Across the Spider-Verse": [
    "Animation",
    "Action",
    "Adventure",
  ],
  "Stuart Little": ["Animation", "Comedy", "Adventure"],
  "Ted Lasso": ["Comedy", "Drama", "Sport"],
  "The Batman": ["Action", "Crime", "Drama"],
  "Shazam!": ["Action", "Comedy", "Fantasy"],
};

export async function seed(knex: Knex): Promise<void> {
  const contents = await knex("contents").select("uuid", "title");
  const genres = await knex("genres").select("id", "name");
  const existingRelations = await knex("content_genres").select(
    "content_uuid",
    "genre_id"
  );

  const contentMap = new Map(
    contents.map((content) => [content.title, content.uuid])
  );

  const genreMap = new Map(
    genres.map((genre) => [genre.name, genre.id])
  );

  const existingKeys = new Set(
    existingRelations.map(
      (relation) => `${relation.content_uuid}:${relation.genre_id}`
    )
  );

  const newRelations = Object.entries(contentGenreMap).flatMap(
    ([title, genreNames]) => {
      const contentUuid = contentMap.get(title);

      if (!contentUuid) {
        throw new Error(`Content not found: ${title}`);
      }

      return genreNames.map((genreName) => {
        const genreId = genreMap.get(genreName);

        if (!genreId) {
          throw new Error(`Genre not found: ${genreName}`);
        }

        return {
          content_uuid: contentUuid,
          genre_id: genreId,
        };
      });
    }
  ).filter(
    (relation) =>
      !existingKeys.has(
        `${relation.content_uuid}:${relation.genre_id}`
      )
  );

  if (newRelations.length === 0) {
    console.log("Content genres seed skipped: all relations already exist.");
    return;
  }

  await knex("content_genres").insert(newRelations);

  console.log(
    `Content genres seed completed: ${newRelations.length} relations inserted.`
  );
}
