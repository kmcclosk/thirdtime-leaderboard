import type { NextPage } from "next";
import Head from "next/head";
import { Header } from '../components/Header';
import { Main } from '../components/Main';

const Home: NextPage = () => {

    return (
        <>
            <Head>
                <title>Highstakes Leaderboard</title>
                <meta name="description" content="Highstakes Leaderboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container mx-auto flex flex-col p-4">
                <Header />
                <main className="flex flex-col p-4">
                    <Main />
                </main>
            </div>
        </>
    );
};

export default Home;
