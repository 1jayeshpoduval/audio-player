import { useState, useRef, useEffect } from "react";
import useInterval from "./useInterval";
import { motion, useMotionValue } from "framer-motion";

function App() {
  const [currentSongTime, setCurrentSongTime] = useState(0);
  const songDuration = 125;
  const progressBarRef = useRef();
  const hiddenProgressBarRef = useRef();
  const handleRef = useRef();

  const handleXPosition = useMotionValue(currentSongTime);

  //Using useEffect to get the hiddenProgressBarBounds and make calculations to move the handleXPosition accordingly
  useEffect(() => {
    const songProgress = currentSongTime / songDuration;
    const hiddenProgressBarBounds =
      hiddenProgressBarRef.current.getBoundingClientRect();
    handleXPosition.set(songProgress * hiddenProgressBarBounds.width);
  }, [handleXPosition, songDuration, currentSongTime]);

  const handleDrag = () => {
    const handleBounds = handleRef.current.getBoundingClientRect();
    const handleMiddle = handleBounds.x + handleBounds.width / 2; // Middle because only then we can have audioDragProgress all the way from 0 to 1

    const hiddenProgressBarBounds =
      hiddenProgressBarRef.current.getBoundingClientRect();

    const hiddenProgressBarStart = hiddenProgressBarBounds.x;

    const audioDragProgress =
      (handleMiddle - hiddenProgressBarStart) / hiddenProgressBarBounds.width;

    setCurrentSongTime(Math.floor(audioDragProgress * songDuration));
  };

  const songMinutes = Math.floor(currentSongTime / 60);
  const songSeconds = `${currentSongTime % 60}`.padStart(2, "0");
  const songTime = `${songMinutes}:${songSeconds}`;
  const remainingsongMinutes = Math.floor(
    (songDuration - currentSongTime) / 60,
  );
  const remainingsongSeconds =
    `${(songDuration - currentSongTime) % 60}`.padStart(2, "0");
  const remainingsongTime = `${remainingsongMinutes}:${remainingsongSeconds}`;

  useInterval(() => {
    if (currentSongTime < songDuration) {
      setCurrentSongTime(currentSongTime + 1);
    }
  }, 1000);

  return (
    <>
      <section className="h-screen p-12">
        <div className="flex h-full w-[90%] max-w-screen-2xl items-center justify-center">
          <div className="flex w-[450px] items-center gap-4">
            <span className="w-12">{songTime}</span>
            <div
              className="relative flex h-[5px] w-full items-center rounded-full bg-neutral-300"
              ref={progressBarRef}
            >
              <div
                className="absolute left-2 right-2 h-full rounded-full"
                ref={hiddenProgressBarRef}
              ></div>
              <motion.div
                className="absolute h-4 w-4 cursor-grab rounded-full bg-gray-800 active:cursor-grabbing"
                style={{ x: handleXPosition }}
                ref={handleRef}
                drag="x"
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={progressBarRef}
                onDrag={handleDrag}
              ></motion.div>
            </div>

            <span className="w-12">{remainingsongTime}</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
