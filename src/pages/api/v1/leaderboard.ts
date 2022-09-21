import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '../../../server/db/client';
import { numeric } from '../../../utils/zod';

const pageSize = 15;

function errMsg(reason: string) {
  return {
    'err_msg': reason,
  };
}

async function leaderboard(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const input = z.object(
    {
      eventName: z.string(),
      view: z.enum(['hundred', 'global']).default('global'),
      page: numeric(z.number().min(1).default(1)),
      sortOrder: numeric(z.number().refine((val) => val === -1 || val === 1).default(1)),
    }
  );

  const parseResult = input.safeParse(req.query);

  if (!parseResult.success) {
    return res.status(400).json(errMsg(parseResult.error.toString()));
  }

  const parsed = parseResult.data;

  const {
    eventName,
    view,
    page,
    sortOrder,
  } = parsed;

  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const orderByRank = sortOrder === 1 ? Prisma.SortOrder.asc : Prisma.SortOrder.desc;

	let rv;

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

    const event = await prisma.event.findUnique(query);

    if (!event) {

      const rv = {
        nextPage: -1,
        sort: sortOrder,
        entries: [],
      };

      return res.status(200).json(rv);
    }

    rv = {
      nextPage: -1,
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

    const event = await prisma.event.findUnique(query);

    if (!event) {

      const rv = {
        nextPage: -1,
        sort: sortOrder,
        entries: [],
      };

      return res.status(200).json(rv);
    }

    const nextPage = (page * pageSize) > event._count.entries ? -1 : page + 1;

    rv = {
      nextPage,
      sort: sortOrder,
      entries: event.entries,
    };

  }

  res.status(200).json(rv);
}

export default leaderboard;
