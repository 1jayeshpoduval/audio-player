import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { faForward } from "@fortawesome/free-solid-svg-icons";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

const AudioControls = ({
  isPlaying,
  setIsPlaying,
  currentSongTime,
  setCurrentSongTime,
  songDuration,
}) => {
  if (currentSongTime == songDuration) {
    setIsPlaying(null);
  }
  return (
    <div className="flex w-full items-center justify-center gap-8">
      <motion.button
        className="relative flex h-10 w-10 items-center justify-center rounded-full"
        whileTap={{ scale: 0.85 }}
        whileHover={{
          backgroundColor: "#d4d4d8",
          transition: {
            duration: 0.1,
          },
        }}
        onClick={() => {
          setCurrentSongTime(0);
          if (!isPlaying) {
            setIsPlaying(null);
          }
        }}
      >
        <FontAwesomeIcon icon={faBackward} />
      </motion.button>
      <motion.button
        className="relative flex h-10 w-10 items-center justify-center rounded-full"
        onClick={() => {
          setIsPlaying(!isPlaying);
          if (currentSongTime == songDuration) {
            setCurrentSongTime(0);
            setIsPlaying(!isPlaying);
          }
        }}
        whileTap={{ scale: 0.85 }}
        whileHover={{
          backgroundColor: "#d4d4d8",
          transition: {
            duration: 0.1,
          },
        }}
      >
        {!isPlaying && <FontAwesomeIcon icon={faPlay} />}
        {isPlaying && <FontAwesomeIcon icon={faPause} className="absolute" />}
      </motion.button>
      <motion.button
        className="relative flex h-10 w-10 items-center justify-center rounded-full"
        whileTap={{ scale: 0.85 }}
        whileHover={{
          backgroundColor: "#d4d4d8",
          transition: {
            duration: 0.1,
          },
        }}
        onClick={() => {
          setCurrentSongTime(songDuration);
          if (isPlaying) {
            setIsPlaying(null);
          }
        }}
      >
        <FontAwesomeIcon icon={faForward} />
      </motion.button>
    </div>
  );
};

export default AudioControls;
