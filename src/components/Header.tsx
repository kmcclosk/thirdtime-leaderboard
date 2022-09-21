import Image from 'next/image';
import raceHorse from '../../public/images/racehorse.jpg';

export const Header = () => {
  return (
    <header className="flex gap-x-3">
      <div className="avatar">
        <div className="w-16 rounded-full">
          <Image
            src={raceHorse}
            alt="Highstakes Leaderboard Logo"
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="text-3xl md:text-3xl leading-normal font-extrabold text-purple-300">
          Highstakes Leaderboard
        </div>
      </div>
    </header>
  );
};
