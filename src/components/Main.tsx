import { useRef, useState } from 'react';
import { RestrictedInput } from './RestrictedInput';
import { Leaderboard } from './Leaderboard';
import { randomNumber } from '../utils';
import { leaderboardRangeToViewMap, defaultEvents } from '../config';
import { LeaderboardView } from '../types';

interface LeaderboardValues {
  eventName: string;
  view: LeaderboardView;
}

export const Main = () => {

  const [leaderboardValues, setLeaderboardValues] = useState<LeaderboardValues>();

  const eventNameRef = useRef<HTMLInputElement>(null);
  const leaderboardRangeRef = useRef<HTMLSelectElement>(null);

  const handleClickRandom = () => {
    if (!eventNameRef.current) {
      return;
    }
    // Ensure a non-duplicated event each click
    let randomEvent = defaultEvents[randomNumber(0, defaultEvents.length)];
    while (randomEvent === eventNameRef.current.value) {
      randomEvent = defaultEvents[randomNumber(0, defaultEvents.length)];
    }
    eventNameRef.current.value = randomEvent as string;
  };

  const handleRefreshLeaderboard = () => {

    if (!eventNameRef.current || !leaderboardRangeRef.current) {
      return;
    }

    setLeaderboardValues(
      {
        eventName: eventNameRef.current.value,
        view: leaderboardRangeRef.current.value as LeaderboardView,
      }
    );
  };

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex gap-x-5">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Event Name</span>
            <span className="label-text-alt text-yellow-400" onClick={handleClickRandom}>(Random)</span>
          </label>
          <RestrictedInput ref={eventNameRef} type="text" placeholder="" className="input input-bordered input-primary w-full max-w-xs" pattern="[a-zA-Z0-9]" />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Leaderboard Range</span>
          </label>
          <select ref={leaderboardRangeRef} defaultValue="global" className="select select-primary w-full max-w-xs">
            {
              Object.entries(leaderboardRangeToViewMap).map(([range, view]) => (
                <option key={view} value={view}>{range}</option>
              ))
            }
          </select>
        </div>
      </div>
      {
        leaderboardValues && <Leaderboard {...leaderboardValues} />
      }
      <button className="btn btn-primary" onClick={handleRefreshLeaderboard}>Refresh Leaderboard</button>
    </div>
  );
};
