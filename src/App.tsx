import React, { useState, useEffect } from 'react';
import { Visualizer, defaultObservable, VisualizerContext } from './Visualizer';
import { Viewer, ChartDatum } from './Viewer';
import './App.css';
import { throttleTime, tap, map } from 'rxjs/operators';
const defaultMusicUrl = 'http://47.94.108.47/Levitate.mp3';
let pause = () => {};
let resume = () => {};

let visualizerContext = {
  pause,
  resume,
  subject: defaultObservable
};
export default function Example(): JSX.Element {
  const [viewData, setViewData] = useState([] as ChartDatum[]);
  const [url, setUrl] = useState(defaultMusicUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setPlayStatus = () => {
    if (isPlaying) {
      visualizerContext.pause();
      setIsPlaying(false);
    } else {
      visualizerContext.resume();
      setIsPlaying(true);
    }
  };
  const fetchSrc = (url: string) => {
    return fetch(url)
      .then(res => res.arrayBuffer())
      .then(data => {
        return Visualizer({
          src: data,
          size: 128,
          volume: 0.6
        });
      });
  };
  useEffect(() => {
    if (!isMounted) {
      setIsLoading(true);
      fetchSrc(url)
        .then(context => {
          visualizerContext = context;
          context.subject
            .pipe(
              map(data => {
                return data.reduce(
                  (prev, cur, index) => {
                    return prev.concat({
                      index: index + 1,
                      volume: cur
                    });
                  },
                  [] as ChartDatum[]
                );
              })
            )
            .subscribe(setViewData);
          context.subject
            .pipe(
              throttleTime(1000),
              tap(data => {
                console.log(data);
              })
            )
            .subscribe();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    setIsMounted(true);
  }, []);
  return (
    <div>
      <button
        style={{
          marginRight: '10px',
          backgroundColor: isLoading ? 'orange' : 'unset'
        }}
        onClick={() => (setPlayStatus(), fetchSrc(url))}
      >
        {isLoading ? 'loading' : 'load'}
      </button>
      <input onChange={e => setUrl(e.target.value)} value={url} />
      <p>
        <button onClick={() => setPlayStatus()}>toggle</button>
      </p>
      <Viewer data={viewData} />
    </div>
  );
}
