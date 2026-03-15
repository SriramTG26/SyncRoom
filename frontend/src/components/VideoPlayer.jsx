import React from 'react';
import YouTube from 'react-youtube';

export default function VideoPlayer({ videoId, onReady }) {
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1,
      rel: 0
    },
  };

  return (
    <div className="w-full aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl border border-gray-800">
      {videoId ? (
        <YouTube 
          videoId={videoId} 
          opts={opts} 
          onReady={onReady}
          className="w-full h-full"
          containerClassName="w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500 italic">
          Search for a video to start the party!
        </div>
      )}
    </div>
  );
}