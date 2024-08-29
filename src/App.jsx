import { useEffect, useState } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import AudioBar from "./Components/AudioBar";
import useInterval from "./useInterval";
import AudioControls from "./Components/AudioControls";

function App() {
  const [currentSongTime, setCurrentSongTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const songDuration = 200;
  const coverRevolutions = Math.ceil(songDuration / 25);
  const coverRotate = useMotionValue(currentSongTime);
  coverRotate.set(currentSongTime);

  const newCoverRotate = useTransform(
    () => (coverRotate.get() / songDuration) * (360 * coverRevolutions),
  );

  useInterval(
    () => {
      if (currentSongTime < songDuration) {
        coverRotate.set(coverRotate.get() + 0.01);
      }
    },
    isPlaying ? 10 : null,
  );

  useInterval(
    () => {
      if (currentSongTime < songDuration) {
        setCurrentSongTime(currentSongTime + 1);
      }
    },
    isPlaying ? 1000 : null,
  );

  return (
    <>
      <section className="h-screen p-12">
        <div className="mx-auto flex h-full w-[90%] max-w-screen-2xl items-center justify-center">
          <div className="flex w-[400px] flex-col gap-4 rounded-3xl bg-zinc-100 p-5">
            <div className="flex items-center gap-4">
              <div>
                <motion.img
                  style={{ rotate: newCoverRotate }}
                  id="audio"
                  src="./audio-cover.png"
                  className="h-16 w-16"
                ></motion.img>
              </div>
              <div className="gap-0.25 flex flex-col">
                <span className="font-semibold text-black/85">Tangerine</span>
                <span className="font-regular text-black/60">
                  Glass Animals
                </span>
              </div>
            </div>
            <AudioBar
              currentSongTime={currentSongTime}
              setCurrentSongTime={setCurrentSongTime}
              songDuration={songDuration}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
            <AudioControls
              songDuration={songDuration}
              currentSongTime={currentSongTime}
              setCurrentSongTime={setCurrentSongTime}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
