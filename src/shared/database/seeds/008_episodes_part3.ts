
import type { Knex } from "knex";

type EpisodeSeed = {
  seasonId: number;
  episodeNumber: number;
  title: string;
  duration: number;
};

const episodes: EpisodeSeed[] = [
  // ==========================================
  // Blue Lock - Season 1 (Episodes 5-24)
  // ==========================================
  { seasonId: 2, episodeNumber: 5, title: "To Be Reborn", duration: 24 },
  { seasonId: 2, episodeNumber: 6, title: "I'm Sorry", duration: 23 },
  { seasonId: 2, episodeNumber: 7, title: "Rush", duration: 23 },
  { seasonId: 2, episodeNumber: 8, title: "The Formula for Goals", duration: 23 },
  { seasonId: 2, episodeNumber: 9, title: "Awakening", duration: 23 },
  { seasonId: 2, episodeNumber: 10, title: "Just the Way It Is", duration: 23 },
  { seasonId: 2, episodeNumber: 11, title: "The Final Piece", duration: 24 },
  { seasonId: 2, episodeNumber: 12, title: "The Second Selection", duration: 24 },
  { seasonId: 2, episodeNumber: 13, title: "TOP3", duration: 25 },
  { seasonId: 2, episodeNumber: 14, title: "The Geniuses and the Average Joes", duration: 24 },
  { seasonId: 2, episodeNumber: 15, title: "Devour", duration: 24 },
  { seasonId: 2, episodeNumber: 16, title: "Tri-Fusion", duration: 24 },
  { seasonId: 2, episodeNumber: 17, title: "Donkey", duration: 24 },
  { seasonId: 2, episodeNumber: 18, title: "The Stage for the Lead", duration: 25 },
  { seasonId: 2, episodeNumber: 19, title: "Dancing Boy", duration: 25 },
  { seasonId: 2, episodeNumber: 20, title: "Super Link-Up Play", duration: 24 },
  { seasonId: 2, episodeNumber: 21, title: "I'm Not There", duration: 25 },
  { seasonId: 2, episodeNumber: 22, title: "Voice", duration: 23 },
  { seasonId: 2, episodeNumber: 23, title: "Luck", duration: 24 },
  { seasonId: 2, episodeNumber: 24, title: "The Time Has Come", duration: 23 },

  // ==========================================
  // Big Hero 6: The Series - Season 1
  // Episodes 7-23
  // ==========================================
  { seasonId: 4, episodeNumber: 7, title: "Failure Mode", duration: 30 },
  { seasonId: 4, episodeNumber: 8, title: "Aunt Cass Goes Out", duration: 30 },
  { seasonId: 4, episodeNumber: 9, title: "The Impatient Patient", duration: 30 },
  { seasonId: 4, episodeNumber: 10, title: "Mr. Sparkles Loses His Sparkle", duration: 30 },
  { seasonId: 4, episodeNumber: 11, title: "Killer App", duration: 30 },
  { seasonId: 4, episodeNumber: 12, title: "Small Hiro One", duration: 30 },
  { seasonId: 4, episodeNumber: 13, title: "Kentucky Kaiju", duration: 30 },
  { seasonId: 4, episodeNumber: 14, title: "Rivalry Weak", duration: 30 },
  { seasonId: 4, episodeNumber: 15, title: "Fan Friction", duration: 30 },
  { seasonId: 4, episodeNumber: 16, title: "Mini-Max", duration: 30 },
  { seasonId: 4, episodeNumber: 17, title: "Big Hero 7", duration: 30 },
  { seasonId: 4, episodeNumber: 18, title: "Big Problem", duration: 30 },
  { seasonId: 4, episodeNumber: 19, title: "Steamer's Revenge", duration: 30 },
  { seasonId: 4, episodeNumber: 20, title: "The Bot Fighter", duration: 30 },
  { seasonId: 4, episodeNumber: 21, title: "Obake Yashiki", duration: 30 },
  { seasonId: 4, episodeNumber: 22, title: "Countdown to Catastrophe Part 1", duration: 30 },
  { seasonId: 4, episodeNumber: 23, title: "Countdown to Catastrophe Part 2", duration: 30 },
];

export async function seed(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    let inserted = 0;
    let updated = 0;

    for (const episode of episodes) {
      const existing = await trx("episodes")
        .where({
          season_id: episode.seasonId,
          episode_number: episode.episodeNumber,
        })
        .first("id");

      const payload = {
        title: episode.title,
        duration: episode.duration,
      };

      if (existing) {
        await trx("episodes")
          .where({ id: existing.id })
          .update(payload);

        updated++;
      } else {
        await trx("episodes").insert({
          season_id: episode.seasonId,
          episode_number: episode.episodeNumber,
          ...payload,
        });

        inserted++;
      }
    }

    console.log(
      `Episodes Part 3 completed: ${inserted} inserted, ${updated} updated.`,
    );
  });
}
