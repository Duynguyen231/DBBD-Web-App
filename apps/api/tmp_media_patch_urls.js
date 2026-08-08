require('dotenv').config({ path: './.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const oldHost = 'https://7e5ece7bc80f50d8b85ae5504ea9f7eb.r2.cloudflarestorage.com';
  const newHost = 'https://pub-bf3fc5fb8f9c4c9fbec571c5d3e33ec4.r2.dev';

  const mediaWithOldHost = await prisma.media.findMany({
    where: {
      url: {
        contains: oldHost,
      },
    },
  });

  console.log(`Found ${mediaWithOldHost.length} media record(s) with old R2 host.`);

  for (const media of mediaWithOldHost) {
    const updatedUrl = media.url.replace(oldHost, newHost);
    if (updatedUrl !== media.url) {
      await prisma.media.update({
        where: { id: media.id },
        data: { url: updatedUrl },
      });
      console.log(`Updated media ${media.id}: ${updatedUrl}`);
    }
  }

  const remaining = await prisma.media.count({
    where: { url: { contains: oldHost } },
  });
  console.log(`Remaining records with old host: ${remaining}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
