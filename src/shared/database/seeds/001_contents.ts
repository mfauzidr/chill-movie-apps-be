import type { Knex } from "knex";

const contents = [
  {
    title: "Don't Look Up",
    release_date: "2021-12-24",
    synopsis:
      "Two astronomers discover a comet heading toward Earth and attempt to warn humanity, but struggle to get the public and world leaders to take the threat seriously.",
    age_rating: "16+",
    poster: "poster-dl-up.webp",
    banner: "banner-dl-up.webp",
    content_type: "movie",
  },
  {
    title: "All of Us Are Dead",
    release_date: "2022-01-28",
    synopsis:
      "A group of students becomes trapped inside their high school during a zombie outbreak and must fight to survive.",
    age_rating: "13+",
    poster: "poster-aoud.webp",
    banner: "banner-aoud.webp",
    content_type: "series",
  },
  {
    title: "Blue Lock",
    release_date: "2022-10-09",
    synopsis:
      "Young football strikers compete in an intense training program designed to create Japan's ultimate striker.",
    age_rating: "13+",
    poster: "poster-blue-lock.webp",
    banner: "banner-blue-lock.webp",
    content_type: "series",
  },
  {
    title: "A Man Called Otto",
    release_date: "2022-12-29",
    synopsis:
      "A grumpy widower whose life changes after a lively family moves in next door.",
    age_rating: "13+",
    poster: "poster-tmco.webp",
    banner: "banner-tmco.webp",
    content_type: "movie",
  },
  {
    title: "Dr. Strange: Multiverse of Madness",
    release_date: "2022-05-06",
    synopsis:
      "Doctor Strange travels through the multiverse and faces dangerous threats that could affect multiple realities.",
    age_rating: "13+",
    poster: "poster-ds-mom.webp",
    banner: "banner-ds-mom.webp",
    content_type: "movie",
  },
  {
    title: "Duty After School",
    release_date: "2023-03-31",
    synopsis:
      "High school students are recruited into military training when mysterious alien creatures threaten humanity.",
    age_rating: "13+",
    poster: "poster-das.webp",
    banner: "banner-das.webp",
    content_type: "series",
  },
  {
    title: "Suzume",
    release_date: "2022-11-11",
    synopsis:
      "A young girl travels across Japan to close mysterious doors that unleash destructive disasters.",
    age_rating: "13+",
    poster: "poster-suzume.webp",
    banner: "banner-suzume.webp",
    content_type: "movie",
  },
  {
    title: "Jurrasic World",
    release_date: "2015-06-12",
    synopsis:
      "A dinosaur theme park descends into chaos after a genetically engineered dinosaur escapes containment.",
    age_rating: "13+",
    poster: "poster-jw.webp",
    banner: "banner-jw.webp",
    content_type: "movie",
  },
  {
    title: "Sonic 2",
    release_date: "2022-04-08",
    synopsis:
      "Sonic teams up with Tails to stop Dr. Robotnik and Knuckles from obtaining a powerful ancient artifact.",
    age_rating: "SU",
    poster: "poster-sonic-2.webp",
    banner: "banner-sonic-2.webp",
    content_type: "movie",
  },
  {
    title: "Big Hero 6",
    release_date: "2014-11-07",
    synopsis:
      "A young robotics prodigy and his healthcare companion Baymax form a superhero team to protect their city.",
    age_rating: "SU",
    poster: "poster-bh6.webp",
    banner: "banner-bh6.webp",
    content_type: "series",
  },
  {
    title: "The Little Mermaid",
    release_date: "2023-05-26",
    synopsis:
      "A young mermaid dreams of life on land and makes a dangerous bargain to experience the human world.",
    age_rating: "SU",
    poster: "poster-tlm.webp",
    banner: "banner-tlm.webp",
    content_type: "movie",
  },
  {
    title: "The Tomorrow War",
    release_date: "2021-07-02",
    synopsis:
      "A soldier is recruited to travel into the future and help humanity fight an alien invasion.",
    age_rating: "16+",
    poster: "poster-ttw.webp",
    banner: "banner-ttw.webp",
    content_type: "movie",
  },
  {
    title: "Ant-Man and the Wasp: Quantumania",
    release_date: "2023-02-17",
    synopsis:
      "Scott Lang and his family become trapped in the Quantum Realm and encounter a powerful new enemy.",
    age_rating: "13+",
    poster: "poster-amqm.webp",
    banner: "banner-amqm.webp",
    content_type: "movie",
  },
  {
    title: "Guardians of the Galaxy",
    release_date: "2014-08-01",
    synopsis:
      "A group of unlikely criminals joins forces to protect the galaxy from a powerful threat.",
    age_rating: "13+",
    poster: "poster-gotg.webp",
    banner: "banner-gotg.webp",
    content_type: "movie",
  },
  {
    title: "Alice in Borderland",
    release_date: "2020-12-10",
    synopsis:
      "A group of strangers finds themselves in an abandoned Tokyo where survival depends on winning deadly games.",
    age_rating: "18+",
    poster: "poster-aib.webp",
    banner: "banner-aib.webp",
    content_type: "series",
  },
  {
    title: "Avatar",
    release_date: "2009-12-18",
    synopsis:
      "A former Marine travels to Pandora and becomes involved in the conflict between humans and the Na'vi people.",
    age_rating: "13+",
    poster: "poster-avatar.webp",
    banner: "banner-avatar.webp",
    content_type: "movie",
  },
  {
    title: "Baymax!",
    release_date: "2022-06-29",
    synopsis:
      "Baymax helps the residents of San Fransokyo by providing healthcare and support in everyday situations.",
    age_rating: "SU",
    poster: "poster-baymax-series.webp",
    banner: "banner-baymax-series.webp",
    content_type: "series",
  },
  {
    title: "Black Adam",
    release_date: "2022-10-21",
    synopsis:
      "An ancient champion with extraordinary powers awakens in the modern world and challenges the established order.",
    age_rating: "13+",
    poster: "poster-black-adam.webp",
    banner: "banner-black-adam.webp",
    content_type: "movie",
  },
  {
    title: "Dilan 1991",
    release_date: "2019-02-28",
    synopsis:
      "Dilan and Milea navigate their relationship as love, friendship, and personal choices test their bond.",
    age_rating: "13+",
    poster: "poster-dilan-1991.webp",
    banner: "banner-dilan-1991.webp",
    content_type: "movie",
  },
  {
    title: "Fast X",
    release_date: "2023-05-19",
    synopsis:
      "Dom Toretto and his family face a dangerous enemy seeking revenge for events from their past.",
    age_rating: "13+",
    poster: "poster-fast-x.webp",
    banner: "banner-fast-x.webp",
    content_type: "movie",
  },
  {
    title: "Happiness",
    release_date: "2021-11-05",
    synopsis:
      "Residents of a newly built apartment complex struggle to survive when a mysterious infectious disease spreads.",
    age_rating: "18+",
    poster: "poster-happiness.webp",
    banner: "banner-happiness.webp",
    content_type: "series",
  },
  {
    title: "M3GAN",
    release_date: "2023-01-06",
    synopsis:
      "An advanced artificial intelligence doll becomes dangerously attached to the child it was designed to protect.",
    age_rating: "16+",
    poster: "poster-megan.webp",
    banner: "banner-megan.webp",
    content_type: "movie",
  },
  {
    title: "My Hero Academia",
    release_date: "2016-04-03",
    synopsis:
      "A boy born without superpowers pursues his dream of becoming a professional hero in a world full of abilities.",
    age_rating: "13+",
    poster: "poster-mha.webp",
    banner: "banner-mha.webp",
    content_type: "series",
  },
  {
    title: "Missing",
    release_date: "2023-01-20",
    synopsis:
      "A teenager uses digital tools and online clues to investigate her mother's mysterious disappearance.",
    age_rating: "13+",
    poster: "poster-missing.webp",
    banner: "banner-missing.webp",
    content_type: "movie",
  },
  {
    title: "Rio",
    release_date: "2011-04-15",
    synopsis:
      "A domesticated blue macaw travels to Rio de Janeiro and discovers adventure, friendship, and freedom.",
    age_rating: "SU",
    poster: "poster-rio.webp",
    banner: "banner-rio.webp",
    content_type: "movie",
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    release_date: "2023-06-02",
    synopsis:
      "Miles Morales travels across the multiverse and encounters other Spider-People while facing a new threat.",
    age_rating: "13+",
    poster: "poster-sasv.webp",
    banner: "banner-sasv.webp",
    content_type: "movie",
  },
  {
    title: "Stuart Little",
    release_date: "1999-12-17",
    synopsis:
      "A small mouse adopted by a human family discovers friendship, adventure, and his place in the world.",
    age_rating: "SU",
    poster: "poster-stuart-l.webp",
    banner: "banner-stuart-l.webp",
    content_type: "movie",
  },
  {
    title: "Ted Lasso",
    release_date: "2020-08-14",
    synopsis:
      "An optimistic American football coach takes charge of an English football club despite having little experience with the sport.",
    age_rating: "13+",
    poster: "poster-ted-lasso.webp",
    banner: "banner-ted-lasso.webp",
    content_type: "series",
  },
  {
    title: "The Batman",
    release_date: "2022-03-04",
    synopsis:
      "Batman investigates a series of murders in Gotham City that reveal corruption and secrets surrounding its powerful figures.",
    age_rating: "13+",
    poster: "poster-the-batman.webp",
    banner: "banner-the-batman.webp",
    content_type: "movie",
  },
  {
    title: "Shazam!",
    release_date: "2019-04-05",
    synopsis:
      "A teenage boy gains magical powers and learns what it means to become a superhero.",
    age_rating: "13+",
    poster: "poster-shazam.webp",
    banner: "banner-shazam.webp",
    content_type: "movie",
  },
];

export async function seed(knex: Knex): Promise<void> {
  const existingContents = await knex("contents").select("title");

  const existingTitles = new Set(
    existingContents.map((content) => content.title),
  );

  const newContents = contents
    .filter((content) => !existingTitles.has(content.title))
    .map((content) => ({
      ...content,
      is_premium: 0,
      is_active: 1,
    }));

  if (newContents.length === 0) {
    console.log("Contents seed skipped: all records already exist.");
    return;
  }

  await knex("contents").insert(newContents);

  console.log(
    `Contents seed completed: ${newContents.length} records inserted.`,
  );
}
