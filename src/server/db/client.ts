// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";
import { env } from "../../env/server.mjs";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// const log = ;

export const prisma = global.prisma || new PrismaClient(
    {
        log: env.NODE_ENV === "development" ? [
            {
                emit: 'stdout', // 'event',
                level: 'query',
            },
            {
                emit: 'stdout',
                level: 'error',
            },
            {
                emit: 'stdout',
                level: 'info',
            },
            {
                emit: 'stdout',
                level: 'warn',
            },
        ] : [
            'error'
        ],
    },
);

if (env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
