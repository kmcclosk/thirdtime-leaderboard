import { createRouter } from './context';
import superjson from 'superjson';
import { eventsRouter } from './events';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('events.', eventsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
