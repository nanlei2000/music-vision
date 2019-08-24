import React, { useState, useEffect } from 'react';
import { Visualizer, defaultObservable, VisualizerContext } from './Visualizer';
import { Viewer, ChartDatum } from './Viewer';
import './App.css';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
const defaultMusicUrl =
  'https://raw.githubusercontent.com/nanlei2000/music-src/master/Levitate.mp3';
let pause = () => {};
let resume = () => {};
let close = () => {};

let visualizerContext: VisualizerContext = {
  pause,
  resume,
  close,
  subject: defaultObservable
};
const mapFrequencyDataToChart: (
  value: Uint8Array,
  index: number
) => ChartDatum[] = data => {
  return data.reduce(
    (prev, cur, index) => {
      return prev.concat({
        index: index + 1,
        volume: cur
      });
    },
    [] as ChartDatum[]
  );
};
export default function App(): JSX.Element {
  const [viewData, setViewData] = useState([] as ChartDatum[]);
  const [url, setUrl] = useState(defaultMusicUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visualizerSub, setVisualizerSub] = useState(Subscription.EMPTY);
  const setPlayStatus = () => {
    if (isPlaying) {
      visualizerContext.pause();
      visualizerSub.unsubscribe();
      setIsPlaying(false);
    } else {
      visualizerContext.resume();
      runVisualize(visualizerContext);
      setIsPlaying(true);
    }
  };
  const fetchSrc = (url: string) => {
    return fetch(url).then(res => res.arrayBuffer());
  };
  const initVisualizer = () => {
    return fetchSrc(url)
      .then(data => {
        return Visualizer({
          src: data,
          size: 128,
          volume: 0.6
        });
      })
      .then(context => {
        visualizerContext = context;
        runVisualize(context);
      });
  };
  const handleLoadingUrl = () => {
    visualizerContext.close();
    setIsLoading(true);
    initVisualizer().finally(() => {
      setIsLoading(false);
    });
  };
  useEffect(() => {
    if (!isMounted) {
      setIsLoading(true);
      initVisualizer().finally(() => {
        setIsLoading(false);
        setIsPlaying(true);
      });
    }
    setIsMounted(true);
  }, []);
  return (
    <div>
      <button
        style={{
          marginRight: '10px',
          backgroundColor: isLoading ? 'orange' : ''
        }}
        onClick={() => {
          handleLoadingUrl();
        }}
      >
        {isLoading ? 'loading' : 'load'}
      </button>
      <input
        style={{
          width: '70%'
        }}
        placeholder={'Paste url here,then press load button'}
        onChange={e => setUrl(e.target.value)}
        value={url}
      />
      <p>
        <button onClick={() => setPlayStatus()}>toggle player status</button>
      </p>
      <Viewer data={viewData} />
      {/* <Draw /> */}
    </div>
  );

  function runVisualize(context: VisualizerContext) {
    const sub = context.subject
      .pipe(map(mapFrequencyDataToChart))
      .subscribe(setViewData);
    setVisualizerSub(sub);
  }
}
