import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const events = [
    'KentuckyDerby',
    'PreaknessStakes',
    'BreedersCup',
    'GrandNational',
];

async function main() {

    for (let i = 0; i < events.length; i++) {

        const eventName = events[i];

        const numEntries = randomNumber(150, 300);

        const entries = [];

        let score = numEntries * 100 + randomNumber(100, 500);
        let rank = 1;

        for (let j = 0; j < numEntries; j++) {

            const gamerName = faker.name.fullName();
            const profilePic = `https://api.multiavatar.com/${gamerName}.png`;

            score -= randomNumber(1, 100);

            entries[j] = {
                gamerName,
                profilePic,
                score,
                rank,
            };

            rank++;
        }

        const event = await prisma.event.create(
            {
                data: {
                    name: eventName,
                    entries: {
                        create: entries,
                    },
                },
            },
        );
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
