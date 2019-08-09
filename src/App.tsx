import React, { useState, useEffect } from 'react';
import { Visualizer } from './Visualizer';
import { Viewer, ChartDatum } from './Viewer';
export default function Example(): JSX.Element {
  const [viewData, setViewData] = useState([] as ChartDatum[]);
  const [url, setUrl] = useState('http://47.94.108.47/Wormhole.mp3');
  const fetchSrc = (url: string) => {
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(data => {
        Visualizer({
          src: data,
          size: 128,
          volume: 0.6,
          drawMethod: data => {
            console.log(data);
            setViewData(
              data.map((value, index) => {
                return {
                  index: index,
                  volume: value
                };
              })
            );
          }
        });
      });
  };

  useEffect(() => {
    fetchSrc(url);
  });
  return (
    <div>
      <button onClick={() => fetchSrc}>Click me</button>
      <input onChange={e => setUrl(e.target.value)} value={url} />
      <Viewer data={viewData} />
    </div>
  );
}
