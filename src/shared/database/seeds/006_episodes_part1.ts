
import type { Knex } from "knex";

type EpisodeSeed = {
  seasonId: number;
  title: string;
  episodeNumber: number;
  duration: number;
};

const episodes: EpisodeSeed[] = [
  // ==========================================
  // Alice in Borderland - Season 1 (Partial)
  // ==========================================
  { seasonId: 5, episodeNumber: 1, title: "Episode 1", duration: 49 },
  { seasonId: 5, episodeNumber: 2, title: "Episode 2", duration: 51 },
  { seasonId: 5, episodeNumber: 3, title: "Episode 3", duration: 42 },
  { seasonId: 5, episodeNumber: 4, title: "Episode 4", duration: 47 },

  // ==========================================
  // Alice in Borderland - Season 2 (Partial)
  // ==========================================
  { seasonId: 6, episodeNumber: 1, title: "Episode 1", duration: 48 },
  { seasonId: 6, episodeNumber: 2, title: "Episode 2", duration: 60 },
  { seasonId: 6, episodeNumber: 3, title: "Episode 3", duration: 66 },
  { seasonId: 6, episodeNumber: 4, title: "Episode 4", duration: 52 },

  // ==========================================
  // Baymax! - Season 1 (Full)
  // ==========================================
  { seasonId: 7, episodeNumber: 1, title: "Cass", duration: 9 },
  { seasonId: 7, episodeNumber: 2, title: "Kiko", duration: 7 },
  { seasonId: 7, episodeNumber: 3, title: "Sofia", duration: 9 },
  { seasonId: 7, episodeNumber: 4, title: "Mbita", duration: 8 },
  { seasonId: 7, episodeNumber: 5, title: "Yachi", duration: 9 },
  { seasonId: 7, episodeNumber: 6, title: "Baymax", duration: 9 },

  // ==========================================
  // Big Hero 6: The Series - Season 1 (Partial)
  // ==========================================
  { seasonId: 4, episodeNumber: 1, title: "Baymax Returns", duration: 60 },
  { seasonId: 4, episodeNumber: 2, title: "Issue 188", duration: 30 },
  { seasonId: 4, episodeNumber: 3, title: "Big Roommates 2", duration: 30 },
  { seasonId: 4, episodeNumber: 4, title: "Fred's Bro-Tillion", duration: 30 },
  { seasonId: 4, episodeNumber: 5, title: "Food Fight", duration: 30 },
  { seasonId: 4, episodeNumber: 6, title: "Muirahara Woods", duration: 30 },

  // ==========================================
  // Blue Lock - Season 1 (Partial)
  // ==========================================
  { seasonId: 2, episodeNumber: 1, title: "Dream", duration: 25 },
  { seasonId: 2, episodeNumber: 2, title: "Monster", duration: 24 },
  { seasonId: 2, episodeNumber: 3, title: "Soccer's Zero", duration: 24 },
  { seasonId: 2, episodeNumber: 4, title: "Premonition and Intuition", duration: 23 },

  // ==========================================
  // Duty After School - Season 1 (Full)
  // ==========================================
  { seasonId: 3, episodeNumber: 1, title: "Episode 1", duration: 73 },
  { seasonId: 3, episodeNumber: 2, title: "Episode 2", duration: 70 },
  { seasonId: 3, episodeNumber: 3, title: "Episode 3", duration: 75 },
  { seasonId: 3, episodeNumber: 4, title: "Episode 4", duration: 67 },
  { seasonId: 3, episodeNumber: 5, title: "Episode 5", duration: 73 },
  { seasonId: 3, episodeNumber: 6, title: "Episode 6", duration: 71 },
  { seasonId: 3, episodeNumber: 7, title: "Episode 7", duration: 55 },
  { seasonId: 3, episodeNumber: 8, title: "Episode 8", duration: 55 },
  { seasonId: 3, episodeNumber: 9, title: "Episode 9", duration: 66 },
  { seasonId: 3, episodeNumber: 10, title: "Episode 10", duration: 92 },

  // ==========================================
  // Happiness - Season 1 (Partial)
  // ==========================================
  { seasonId: 8, episodeNumber: 1, title: "Public Rental Apartment", duration: 61 },
  { seasonId: 8, episodeNumber: 2, title: "Thirsty Patients", duration: 67 },
  { seasonId: 8, episodeNumber: 3, title: "Locked In", duration: 63 },

  // ==========================================
  // Ted Lasso - Season 1 (Full)
  // ==========================================
  { seasonId: 16, episodeNumber: 1, title: "Pilot", duration: 31 },
  { seasonId: 16, episodeNumber: 2, title: "Biscuits", duration: 29 },
  { seasonId: 16, episodeNumber: 3, title: "Trent Crimm: The Independent", duration: 30 },
  { seasonId: 16, episodeNumber: 4, title: "For the Children", duration: 34 },
  { seasonId: 16, episodeNumber: 5, title: "Tan Lines", duration: 31 },
  { seasonId: 16, episodeNumber: 6, title: "Two Aces", duration: 32 },
  { seasonId: 16, episodeNumber: 7, title: "Make Rebecca Great Again", duration: 32 },
  { seasonId: 16, episodeNumber: 8, title: "The Diamond Dogs", duration: 30 },
  { seasonId: 16, episodeNumber: 9, title: "All Apologies", duration: 31 },
  { seasonId: 16, episodeNumber: 10, title: "The Hope That Kills You", duration: 34 },

  // ==========================================
  // Ted Lasso - Season 2 (Full)
  // ==========================================
  { seasonId: 17, episodeNumber: 1, title: "Goodbye Earl", duration: 34 },
  { seasonId: 17, episodeNumber: 2, title: "Lavender", duration: 33 },
  { seasonId: 17, episodeNumber: 3, title: "Do the Right-est Thing", duration: 36 },
  { seasonId: 17, episodeNumber: 4, title: "Carol of the Bells", duration: 30 },
  { seasonId: 17, episodeNumber: 5, title: "Rainbow", duration: 38 },
  { seasonId: 17, episodeNumber: 6, title: "The Signal", duration: 35 },
  { seasonId: 17, episodeNumber: 7, title: "Headspace", duration: 35 },
  { seasonId: 17, episodeNumber: 8, title: "Man City", duration: 45 },
  { seasonId: 17, episodeNumber: 9, title: "Beard After Hours", duration: 43 },
  { seasonId: 17, episodeNumber: 10, title: "No Weddings and a Funeral", duration: 46 },
  { seasonId: 17, episodeNumber: 11, title: "Midnight Train to Royston", duration: 42 },
  { seasonId: 17, episodeNumber: 12, title: "Inverting the Pyramid of Success", duration: 49 },

  // ==========================================
  // Ted Lasso - Season 3 (Full)
  // ==========================================
  { seasonId: 18, episodeNumber: 1, title: "Smells Like Mean Spirit", duration: 43 },
  { seasonId: 18, episodeNumber: 2, title: "(I Don't Want to Go to) Chelsea", duration: 47 },
  { seasonId: 18, episodeNumber: 3, title: "4-5-1", duration: 47 },
  { seasonId: 18, episodeNumber: 4, title: "Big Week", duration: 49 },
  { seasonId: 18, episodeNumber: 5, title: "Signs", duration: 50 },
  { seasonId: 18, episodeNumber: 6, title: "Sunflowers", duration: 63 },
  { seasonId: 18, episodeNumber: 7, title: "The Strings That Bind Us", duration: 58 },
  { seasonId: 18, episodeNumber: 8, title: "We'll Never Have Paris", duration: 54 },
  { seasonId: 18, episodeNumber: 9, title: "La Locker Room Aux Folles", duration: 44 },
  { seasonId: 18, episodeNumber: 10, title: "International Break", duration: 64 },
  { seasonId: 18, episodeNumber: 11, title: "Mom City", duration: 69 },
  { seasonId: 18, episodeNumber: 12, title: "So Long, Farewell", duration: 75 },
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
    console.log("Episodes seed skipped: all records already exist.");
    return;
  }

  await knex("episodes").insert(
    newEpisodes.map((episode) => ({
      season_id: episode.seasonId,
      title: episode.title,
      episode_number: episode.episodeNumber,
      duration: episode.duration,
    })),
  );

  console.log(
    `Episodes seed completed: ${newEpisodes.length} records inserted.`,
  );
}
