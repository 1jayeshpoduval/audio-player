import { useState, useRef, useEffect } from "react";
import useInterval from "./useInterval";
import { motion, useMotionValue, useTransform } from "framer-motion";

function App() {
  const [currentSongTime, setCurrentSongTime] = useState(0);
  const songDuration = 125;
  const progressBarRef = useRef();
  const hiddenProgressBarRef = useRef();
  const scrubberHandleRef = useRef();
  const scrubberRef = useRef();

  const scrubberHandlePosition = useMotionValue(currentSongTime);
  const scrubberWidth = useMotionValue(currentSongTime);
  scrubberWidth.set(currentSongTime);

  //Using useEffect to get the hiddenProgressBarBounds and make calculations to move the scrubberHandlePosition accordingly
  useEffect(() => {
    const songProgress = currentSongTime / songDuration;
    const hiddenProgressBarBounds =
      hiddenProgressBarRef.current.getBoundingClientRect();
    scrubberHandlePosition.set(songProgress * hiddenProgressBarBounds.width);
  }, [scrubberHandlePosition, songDuration, currentSongTime]);

  const newScrubberWidth = useTransform(
    () => (scrubberWidth.current / songDuration) * 100,
  );

  const handleDrag = () => {
    const handleBounds = scrubberHandleRef.current.getBoundingClientRect();
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
        <div className="mx-auto flex h-full w-[90%] max-w-screen-2xl items-center justify-center">
          <div className="flex w-[450px] items-center gap-4">
            <span className="w-12">{songTime}</span>
            <div
              className="relative flex h-[5px] w-full items-center rounded-full bg-neutral-300"
              ref={progressBarRef}
            >
              <div
                className="absolute h-full rounded-bl-full rounded-tl-full bg-gray-800"
                ref={scrubberRef}
                style={{ width: `${newScrubberWidth.current}%` }}
              ></div>
              <div
                className="absolute left-2 right-2 h-full rounded-full"
                ref={hiddenProgressBarRef}
              ></div>
              <div
                className="absolute h-4 w-full rounded-full"
                onPointerDown={(e) => {
                  const hiddenProgressBarBounds =
                    hiddenProgressBarRef.current.getBoundingClientRect();
                  const marginExcess = e.pageX - hiddenProgressBarBounds.left;
                  let audioPointerDownProgress =
                    marginExcess / hiddenProgressBarBounds.width;
                  setCurrentSongTime(
                    Math.floor(audioPointerDownProgress * songDuration),
                  );
                  if (audioPointerDownProgress < 0) {
                    audioPointerDownProgress = 0;
                    setCurrentSongTime(
                      Math.floor(audioPointerDownProgress * songDuration),
                    );
                  } else if (audioPointerDownProgress > 1) {
                    audioPointerDownProgress = 1;
                    setCurrentSongTime(
                      Math.floor(audioPointerDownProgress * songDuration),
                    );
                  }
                }}
              ></div>
              <motion.div
                className="absolute h-4 w-4 cursor-grab rounded-full bg-gray-800 active:cursor-grabbing"
                style={{
                  x: scrubberHandlePosition,
                }}
                ref={scrubberHandleRef}
                drag="x"
                dragMomentum={false}
                whileTap={{ scale: 1.5 }}
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
