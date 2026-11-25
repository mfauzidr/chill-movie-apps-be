
import type { Knex } from "knex";

type EpisodeSeed = {
  seasonId: number;
  episodeNumber: number;
  title: string;
  duration: number;
};

const episodes: EpisodeSeed[] = [
  // ==========================================
  // All of Us Are Dead - Season 1 (Full)
  // ==========================================
  { seasonId: 1, episodeNumber: 1, title: "Episode 1", duration: 66 },
  { seasonId: 1, episodeNumber: 2, title: "Episode 2", duration: 70 },
  { seasonId: 1, episodeNumber: 3, title: "Episode 3", duration: 62 },
  { seasonId: 1, episodeNumber: 4, title: "Episode 4", duration: 72 },
  { seasonId: 1, episodeNumber: 5, title: "Episode 5", duration: 56 },
  { seasonId: 1, episodeNumber: 6, title: "Episode 6", duration: 67 },
  { seasonId: 1, episodeNumber: 7, title: "Episode 7", duration: 60 },
  { seasonId: 1, episodeNumber: 8, title: "Episode 8", duration: 58 },
  { seasonId: 1, episodeNumber: 9, title: "Episode 9", duration: 61 },
  { seasonId: 1, episodeNumber: 10, title: "Episode 10", duration: 54 },
  { seasonId: 1, episodeNumber: 11, title: "Episode 11", duration: 56 },
  { seasonId: 1, episodeNumber: 12, title: "Episode 12", duration: 53 },

  // ==========================================
  // Happiness - Season 1 (Remaining Episodes)
  // ==========================================
  { seasonId: 8, episodeNumber: 4, title: "The Spread", duration: 66 },
  { seasonId: 8, episodeNumber: 5, title: "The Outsiders", duration: 64 },
  { seasonId: 8, episodeNumber: 6, title: "One Man's Life", duration: 63 },
  { seasonId: 8, episodeNumber: 7, title: "The Intruder", duration: 69 },
  { seasonId: 8, episodeNumber: 8, title: "Countdown", duration: 69 },
  { seasonId: 8, episodeNumber: 9, title: "Dwindling Water", duration: 68 },
  { seasonId: 8, episodeNumber: 10, title: "Kim Se Hun Disappears", duration: 62 },
  { seasonId: 8, episodeNumber: 11, title: "Backup Power", duration: 66 },
  { seasonId: 8, episodeNumber: 12, title: "Happiness Is with You", duration: 65 },
];

export async function seed(knex: Knex): Promise<void> {
  const existingEpisodes = await knex("episodes")
    .select("season_id", "episode_number");

  const existingKeys = new Set(
    existingEpisodes.map(
      (episode) => `${episode.season_id}-${episode.episode_number}`,
    ),
  );

  const newEpisodes = episodes.filter(
    (episode) =>
      !existingKeys.has(
        `${episode.seasonId}-${episode.episodeNumber}`,
      ),
  );

  if (newEpisodes.length === 0) {
    console.log("Episodes Part 2 skipped: all records already exist.");
    return;
  }

  await knex("episodes").insert(
    newEpisodes.map((episode) => ({
      season_id: episode.seasonId,
      episode_number: episode.episodeNumber,
      title: episode.title,
      duration: episode.duration,
    })),
  );

  console.log(
    `Episodes Part 2 completed: ${newEpisodes.length} records inserted.`,
  );
}
