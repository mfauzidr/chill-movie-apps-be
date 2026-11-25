
import type { Knex } from "knex";

const series = [
  { title: "All of Us Are Dead", totalSeasons: 1 },
  { title: "Blue Lock", totalSeasons: 1 },
  { title: "Duty After School", totalSeasons: 1 },
  { title: "Big Hero 6", totalSeasons: 1 },
  { title: "Alice in Borderland", totalSeasons: 2 },
  { title: "Baymax!", totalSeasons: 1 },
  { title: "Happiness", totalSeasons: 1 },
  { title: "My Hero Academia", totalSeasons: 7 },
  { title: "Ted Lasso", totalSeasons: 3 },
];

export async function seed(knex: Knex): Promise<void> {
  const contents = await knex("contents").select(
    "uuid",
    "title",
    "content_type"
  );

  const contentMap = new Map(
    contents.map((content) => [
      content.title,
      {
        uuid: content.uuid,
        contentType: content.content_type,
      },
    ])
  );

  const existingSeasons = await knex("seasons").select(
    "content_uuid",
    "name"
  );

  const existingKeys = new Set(
    existingSeasons.map(
      (season) => `${season.content_uuid}:${season.name}`
    )
  );

  const newSeasons = series.flatMap((item) => {
    const content = contentMap.get(item.title);

    if (!content) {
      throw new Error(`Content not found: ${item.title}`);
    }

    if (content.contentType !== "series") {
      throw new Error(`Content is not a series: ${item.title}`);
    }

    return Array.from(
      { length: item.totalSeasons },
      (_, index) => ({
        content_uuid: content.uuid,
        name: `Season ${index + 1}`,
      })
    );
  }).filter(
    (season) =>
      !existingKeys.has(`${season.content_uuid}:${season.name}`)
  );

  if (newSeasons.length === 0) {
    console.log("Seasons seed skipped: all records already exist.");
    return;
  }

  await knex("seasons").insert(newSeasons);

  console.log(
    `Seasons seed completed: ${newSeasons.length} records inserted.`
  );
}
