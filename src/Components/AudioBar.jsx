import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import useInterval from "../useInterval";

const AudioBar = ({
  currentSongTime,
  setCurrentSongTime,
  songDuration,
  setIsPlaying,
  isPlaying,
}) => {
  const scrubberHandleSize = 0.75;
  const progressBarRef = useRef();
  const hiddenScrubberBarRef = useRef();
  const scrubberHandleRef = useRef();
  const scrubberRef = useRef();

  const scrubberHandlePosition = useMotionValue(currentSongTime);
  const scrubberWidth = useMotionValue(currentSongTime);
  scrubberWidth.set(currentSongTime);

  const songMinutes = Math.floor(currentSongTime / 60);
  const songSeconds = `${currentSongTime % 60}`.padStart(2, "0");
  const songTime = `${songMinutes}:${songSeconds}`;
  const remainingsongMinutes = Math.floor(
    (songDuration - currentSongTime) / 60,
  );
  const remainingsongSeconds =
    `${(songDuration - currentSongTime) % 60}`.padStart(2, "0");
  const remainingsongTime = `${remainingsongMinutes}:${remainingsongSeconds}`;

  //Get the hiddenScrubberBarBounds to move the scrubberHandlePosition
  useEffect(() => {
    const songProgress = currentSongTime / songDuration;
    const hiddenScrubberBarBounds =
      hiddenScrubberBarRef.current.getBoundingClientRect();
    scrubberHandlePosition.set(songProgress * hiddenScrubberBarBounds.width);
  }, [scrubberHandlePosition, songDuration, currentSongTime]);

  const newScrubberWidth = useTransform(
    () => (scrubberWidth.get() / songDuration) * 100,
  );

  const handleDrag = () => {
    const handleBounds = scrubberHandleRef.current.getBoundingClientRect();
    const handleMiddle = handleBounds.x + handleBounds.width / 2;
    // Finding middle to get the full range of the drag progress

    const hiddenScrubberBarBounds =
      hiddenScrubberBarRef.current.getBoundingClientRect();

    const hiddenProgressBarStart = hiddenScrubberBarBounds.x;

    let audioDragProgress =
      (handleMiddle - hiddenProgressBarStart) / hiddenScrubberBarBounds.width;

    setCurrentSongTime(Math.floor(audioDragProgress * songDuration));
    if (currentSongTime == songDuration) setIsPlaying(null);
  };

  const clampTime = (progress, duration, setSongTime) => {
    let clampProgress = Math.min(Math.max(progress, 0), 1);
    setSongTime(Math.floor(clampProgress * duration));
  };

  /*   useInterval(
    () => {
      if (currentSongTime < songDuration) {
        scrubberHandlePosition.set(scrubberHandlePosition.get() + 0.01);
      }
    },
    isPlaying ? 10 : null,
  ); */

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <div className="flex select-none justify-between text-sm text-black/60">
          <span>{songTime}</span>
          <span>{remainingsongTime}</span>
        </div>
        <div
          className="relative flex h-[5px] w-full items-center rounded-full bg-neutral-300"
          ref={progressBarRef}
        >
          <div
            className="absolute h-full w-full rounded-bl-full rounded-tl-full bg-gray-800"
            ref={scrubberRef}
            style={{ width: `${newScrubberWidth.current}%` }}
          ></div>
          <div
            className="absolute h-full rounded-full"
            ref={hiddenScrubberBarRef}
            style={{
              left: `${scrubberHandleSize / 2}rem`,
              right: `${scrubberHandleSize / 2}rem`,
            }}
          ></div>
          <div
            className="absolute h-2 w-full rounded-full"
            onPointerDown={(e) => {
              const hiddenScrubberBarBounds =
                hiddenScrubberBarRef.current.getBoundingClientRect();
              const marginExcess = e.pageX - hiddenScrubberBarBounds.left;
              let audioPointerDownProgress =
                marginExcess / hiddenScrubberBarBounds.width;
              setCurrentSongTime(
                Math.floor(audioPointerDownProgress * songDuration),
              );
              clampTime(
                audioPointerDownProgress,
                songDuration,
                setCurrentSongTime,
              );
            }}
          ></div>
          <motion.div
            className="absolute cursor-grab rounded-full bg-gray-800 active:cursor-grabbing"
            style={{
              x: scrubberHandlePosition,
              width: `${scrubberHandleSize}rem`,
              height: `${scrubberHandleSize}rem`,
            }}
            ref={scrubberHandleRef}
            drag="x"
            dragMomentum={false}
            whileTap={{ scale: 1.4 }}
            dragElastic={0}
            dragConstraints={progressBarRef}
            onDrag={handleDrag}
          ></motion.div>
        </div>
      </div>
    </>
  );
};

export default AudioBar;
