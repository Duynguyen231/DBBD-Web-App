require('dotenv').config({ path: './.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.media.findMany({ orderBy: { id: 'desc' }, take: 10 })
  .then(rows => {
    rows.forEach(r => console.log(`${r.id} | ${r.filename} | ${r.url}`));
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
