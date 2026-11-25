
import type { Knex } from "knex";

const SEASON_IDS = {
  1: 9,
  2: 10,
  3: 11,
  4: 12,
  5: 13,
  6: 14,
  7: 15,
} as const;

const RUNTIME_MINUTES = 23;

const seasonEpisodes: Record<number, string[]> = {
  1: [
    "Izuku Midoriya: Origin",
    "What It Takes to Be a Hero",
    "Roaring Muscles",
    "Start Line",
    "What I Can Do for Now",
    "Rage, You Damn Nerd",
    "Deku vs. Kacchan",
    "Bakugo's Start Line",
    "Yeah, Just Do Your Best, Iida!",
    "Encounter with the Unknown",
    "Game Over",
    "All Might",
    "In Each of Our Hearts",
  ],
  2: [
    "That's the Idea, Ochaco",
    "Roaring Sports Festival",
    "In Their Own Quirky Ways",
    "Strategy, Strategy, Strategy",
    "Cavalry Battle Finale",
    "The Boy Born with Everything",
    "Victory or Defeat",
    "Battle on, Challengers",
    "Bakugo vs. Uraraka",
    "Shoto Todoroki: Origin",
    "Fight on, Iida",
    "Todoroki vs. Bakugo",
    "Time to Pick Some Names",
    "Bizarre! Gran Torino Appears",
    "Midoriya and Shigaraki",
    "Hero Killer: Stain vs. U.A. Students",
    "Climax",
    "The Aftermath of Hero Killer: Stain",
    "Everyone's Internships",
    "Listen Up!! A Tale from the Past",
    "Gear up for Final Exams",
    "Yaoyorozu: Rising",
    "Stripping the Varnish",
    "Katsuki Bakugo: Origin",
    "Encounter",
  ],
  3: [
    "Game Start",
    "Wild, Wild Pussycats",
    "Kota",
    "My Hero",
    "Drive It Home, Iron Fist!!!",
    "Roaring Upheaval",
    "What a Twist!",
    "From Iida to Midoriya",
    "All For One",
    "Symbol of Peace",
    "One For All",
    "End of the Beginning, Beginning of the End",
    "Moving into Dorms",
    "Create Those Ultimate Moves",
    "The Test",
    "Shiketsu High Lurking",
    "Class 1-A",
    "RUSH!",
    "Rescue Exercises",
    "Special Episode: Save the World with Love!",
    "What's the Big Idea?",
    "A Talk about Your Quirk",
    "Deku vs. Kacchan, Part 2",
    "A Season for Encounters",
    "Unforeseen Hope",
  ],
  4: [
    "The Scoop on U.A. Class 1-A",
    "Overhaul",
    "Boy Meets...",
    "Fighting Fate",
    "Let's Go, Gutsy Red Riot",
    "An Unpleasant Talk",
    "GO!!",
    "Suneater of the Big Three",
    "Red Riot",
    "Temp Squad",
    "Lemillion",
    "Unforeseen Hope",
    "Infinite 100%",
    "Bright Future",
    "Smoldering Flames",
    "Win Those Kids' Hearts",
    "Relief for License Trainees",
    "School Festival",
    "Prepping for the School Festival Is the Funnest Part",
    "Gold Tips Imperial",
    "Deku vs. Gentle Criminal",
    "School Festival Start!!",
    "Let It Flow! School Festival!",
    "Japanese Hero Billboard Chart",
    "His Start",
  ],
  5: [
    "All Hands on Deck! Class 1-A",
    "Vestiges",
    "Clash! Class A vs. Class B!",
    "Make It Happen, Shinso!",
    "Operation New Improv Moves",
    "Foresight",
    "Match 3",
    "Match 3 Conclusion",
    "Early Bird!",
    "That Which Is Inherited",
    "Our Brawl",
    "The New Power and All For One",
    "Have a Merry Christmas!",
    "Off to Endeavor's Agency!",
    "One Thing at a Time",
    "Long Time No See, Selkie",
    "The Hellish Todoroki Family",
    "The Unforgiven",
    "More of a Hero Than Anyone",
    "My Villain Academia",
    "Revival Party",
    "Sad Man's Parade",
    "Tenko Shimura: Origin",
    "Tomura Shigaraki: Origin",
    "The High, Deep Blue Sky",
  ],
  6: [
    "A Quiet Beginning",
    "Mirko, the No. 5 Hero",
    "One's Justice",
    "Inheritance",
    "The Thrill of Destruction",
    "Encounter, Part 2",
    "Disaster Walker",
    "League of Villains vs. U.A. Students",
    "Katsuki Bakugo: Rising",
    "The Ones Within Us",
    "Dabi's Dance",
    "Threads of Hope",
    "Final Performance",
    "Hellish Hell",
    "Tartarus",
    "The Hellish Todoroki Family, Part 2",
    "The Wrong Way to Put Out a Fire",
    "Izuku Midoriya and Tomura Shigaraki",
    "Full Power!!",
    "Hired Gun",
    "Friend",
    "A Young Woman's Declaration",
    "Deku vs. Class A",
    "A Young Woman's Declaration",
    "No Man Is an Island",
  ],
  7: [
    "Izuku Midoriya: Mind",
    "Toshinori Yagi: Embers",
    "Heroes: Convictions",
    "Tomura Shigaraki: Destruction",
    "Let You Down",
    "Division",
    "Inflation",
    "Two Flashfires",
    "Light Fades to Rain",
    "Wounded Hero, Burning Bright and True!!",
    "The Lovely Lady Nagant",
    "The Story of How We All Became Heroes",
    "A Chain of Events, Across the Ages",
    "The Final Boss!!",
    "The End of an Era, and the Beginning",
    "The Final Act Begins",
    "The Wrong Way to Put Out a Fire",
    "A Heart That Is Passed On",
    "The Girl Who Loves Smiles",
    "The Girl Who Loves Smiles, Part 2",
    "My Hero Academia",
  ],
};

export async function seed(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    let inserted = 0;
    let updated = 0;

    for (const [seasonNumber, titles] of Object.entries(seasonEpisodes)) {
      const seasonId =
        SEASON_IDS[Number(seasonNumber) as keyof typeof SEASON_IDS];

      for (const [index, title] of titles.entries()) {
        const episodeNumber = index + 1;

        const existing = await trx("episodes")
          .where({
            season_id: seasonId,
            episode_number: episodeNumber,
          })
          .first("id");

        const payload = {
          title,
          duration: RUNTIME_MINUTES,
        };

        if (existing) {
          await trx("episodes")
            .where({ id: existing.id })
            .update(payload);

          updated++;
        } else {
          await trx("episodes").insert({
            season_id: seasonId,
            episode_number: episodeNumber,
            ...payload,
          });

          inserted++;
        }
      }
    }

    console.log(
      `Episodes Part 4 completed: ${inserted} inserted, ${updated} updated.`,
    );
  });
}
