import React, { useState, useEffect } from 'react';
import { Visualizer } from './Visualizer';
import { Viewer, ChartDatum } from './Viewer';
let pause = () => {};
let resume = () => {};
export default function Example(): JSX.Element {
  const [viewData, setViewData] = useState([] as ChartDatum[]);
  const [url, setUrl] = useState('http://47.94.108.47/Wormhole.mp3');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const setPlayStatus = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      resume();
      setIsPlaying(true);
    }
  };
  const fetchSrc = (url: string) => {
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(data => {
        setIsPlaying(true);
        const controlFunc = Visualizer({
          src: data,
          size: 128,
          volume: 0.6,
          drawMethod: data => {
            const viewList: ChartDatum[] = [];
            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              viewList.push({
                index: i,
                volume: element
              });
            }
            // console.log(viewList);
            setViewData(viewList);
          }
        });
        pause = controlFunc.pause;
        resume = controlFunc.resume;
      });
  };
  useEffect(() => {
    !isMounted && fetchSrc(url);
    setIsMounted(true);
  });
  return (
    <div>
      <button onClick={() => (setPlayStatus(), fetchSrc(url))}>Click me</button>
      <button onClick={() => setPlayStatus()}>toggle</button>
      <input onChange={e => setUrl(e.target.value)} value={url} />
      <Viewer data={viewData} />
    </div>
  );
}
