import { prisma } from "../lib/prisma";

async function main() {
  const achievements = [
    {
      name: "First Reading",
      slug: "FIRST_READING",
      description: "Read your first page of the Quran",
      icon: "book-open",
    },
    {
      name: "Surah Al-Kahf Reader",
      slug: "READ_SURAH_AL_KAHF",
      description: "Read Surah Al-Kahf",
      icon: "moon",
    },
    {
      name: "7 Day Streak",
      slug: "STREAK_7_DAYS",
      description: "Read Quran for 7 consecutive days",
      icon: "flame",
    },
  ];

  console.log("Seeding achievements...");

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: achievement,
      create: achievement,
    });
  }

  console.log("Achievements seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
