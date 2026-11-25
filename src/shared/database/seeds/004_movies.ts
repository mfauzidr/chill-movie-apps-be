
import type { Knex } from "knex";

const movies = [
  { title: "Don't Look Up", duration: 138 },
  { title: "A Man Called Otto", duration: 153 },
  { title: "Dr. Strange: Multiverse of Madness", duration: 126 },
  { title: "Suzume", duration: 121 },
  { title: "Jurrasic World", duration: 124 },
  { title: "Sonic 2", duration: 122 },
  { title: "The Little Mermaid", duration: 135 },
  { title: "The Tomorrow War", duration: 138 },
  { title: "Ant-Man and the Wasp: Quantumania", duration: 125 },
  { title: "Guardians of the Galaxy", duration: 121 },
  { title: "Avatar", duration: 162 },
  { title: "Black Adam", duration: 125 },
  { title: "Dilan 1991", duration: 121 },
  { title: "Fast X", duration: 141 },
  { title: "M3GAN", duration: 102 },
  { title: "Missing", duration: 111 },
  { title: "Rio", duration: 96 },
  { title: "Spider-Man: Across the Spider-Verse", duration: 140 },
  { title: "Stuart Little", duration: 84 },
  { title: "The Batman", duration: 176 },
  { title: "Shazam!", duration: 132 },
];

export async function seed(knex: Knex): Promise<void> {
  const contents = await knex("contents").select("uuid", "title");

  const contentMap = new Map(
    contents.map((content) => [content.title, content.uuid])
  );

  const existingMovies = await knex("movies").select("content_uuid");

  const existingContentUuids = new Set(
    existingMovies.map((movie) => movie.content_uuid)
  );

  const newMovies = movies.map((movie) => {
    const contentUuid = contentMap.get(movie.title);

    if (!contentUuid) {
      throw new Error(`Content not found: ${movie.title}`);
    }

    return {
      content_uuid: contentUuid,
      duration: movie.duration,
    };
  }).filter(
    (movie) => !existingContentUuids.has(movie.content_uuid)
  );

  if (newMovies.length === 0) {
    console.log("Movies seed skipped: all records already exist.");
    return;
  }

  await knex("movies").insert(newMovies);

  console.log(
    `Movies seed completed: ${newMovies.length} records inserted.`
  );
}
