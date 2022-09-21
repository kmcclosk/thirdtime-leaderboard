# About

This repo contains the Web Developer Test for Third Time games. It implements a leaderboard for showing the top ranking users across several events.

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.

The T3-Stack uses the following frameworks:

- [NextJS](https://nextjs.org/)
- [Prisma](https://prisma.io)
- [TailwindCSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

The backend datastore is a sqlite database. This database is queried through Prisma.

# How to run

`yarn install`
`yarn prisma migrate reset`
`yarn run dev`

`yarn prisma migrate reset` will seed the database. If you skip this, all queries will return "No results".

# Interacting w/ the app

Type an event name and select a range, then click the Refresh Leaderboard button.

The event name input is restricted to alphanumeric characters. Above the event name input is a (Random) link that you can click that will cycle through a series of events that are already in the database.

The Events populated in the database are:

KentuckyDerby
PreaknessStakes
BreedersCup
GrandNational
00Invalid

00Invalid has no data so as to flex that use case. You can of course type any other event name to see this same result.

# API

A single API endpoint is exposed using the API Routes functionality built into NextJS.

`GET /api/v1/leaderboard?event_name=&view=&page=&sortOrder=`

`eventName` - required - the event name to be searched for
`view` - optional - hundred - return only top 100, global - return entire leaderboard
`page` - optional - defaults to 1 (allowed values >= 1)
`sortOrder` - 1 for ascending (rank 1 first) and -1 for descending (rank 100 or max rank first)

# Learnings

Instead of using the API endpoint to get data (via React Query), I decided to use TRPC. TRPC is a typesafe way to call the backend and uses React Query under the hood. I chose TRPC since it was a technology that has been gaining attention recently (https://www.youtube.com/watch?v=PYUqYcPMPeQ) (https://www.youtube.com/watch?v=Lam0cYOEst8) and while I would not have made this decision in a production app, this small project was an ideal way to gain experience with it. While I see some promise and advantage to it, unfamiliarity led to some delays (but this is consistent w/ learning). TRPC uses the schema validation library Zod (https://github.com/colinhacks/zod). I found this library to be less comfortable to use than joi or superstruct.
