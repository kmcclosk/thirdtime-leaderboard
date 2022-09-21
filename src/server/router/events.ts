import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { numeric } from '../../utils/zod';
import { createRouter } from './context';

const pageSize = 15;

/*
  eventName - is the event name user entered
  view - can be passed one of the two values
  a) “hundred” - means only top 100
  b) “global” - means global leaderboard
  page - starting value 1 (allowed values >= 1)
  sortOrder - values are 1 for ascending (rank 1 first) and -1 for descending (rank 100 or max rank first)
*/

export const eventsRouter = createRouter()
  .query(
    'leaderboard',
    {
      input: z.object(
        {
          eventName: z.string(),
          view: z.enum(['hundred', 'global']).default('global'),
          page: numeric(z.number().min(1).default(1)),
          sortOrder: numeric(z.number().refine((val) => val === -1 || val === 1).default(1)),
        }
      ),
      async resolve({ input, ctx }) {

        const {
          eventName,
          view,
          page,
          sortOrder,
        } = input;

        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const orderByRank = sortOrder === 1 ? Prisma.SortOrder.asc : Prisma.SortOrder.desc;

        if (view === 'hundred') {

          const query = {
            where: {
              name: eventName,
            },
            select: {
              entries: {
                where: {
                  rank: {
                    lte: 100,
                  },
                },
                orderBy: {
                  rank: orderByRank,
                },
              },
            },
          };

          const event = await ctx.prisma.event.findUnique(query);

          if (!event) {
            return {
              nextPage: -1,
              sort: sortOrder,
              entries: [],
            };
          }

          return {
            nextPage: -1,
            pageCount: 1,
            sort: sortOrder,
            entries: event.entries,
          };

        } else {

          const query = {
            where: {
              name: eventName,
            },
            include: {
              _count: {
                select: {
                  entries: true,
                },
              },
              entries: {
                skip,
                take,
                orderBy: {
                  rank: orderByRank,
                },
              },
            },
          };

          const event = await ctx.prisma.event.findUnique(query);

          if (!event) {

            return {
              nextPage: -1,
              sort: sortOrder,
              entries: [],
            };
          }

          const nextPage = (page * pageSize) > event._count.entries ? -1 : page + 1;
          const pageCount = Math.ceil(event._count.entries / pageSize);

          return {
            nextPage,
            pageCount,
            sort: sortOrder,
            entries: event.entries,
          };
        }

      },
    }
  );
