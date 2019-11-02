import React, { useState, useEffect } from 'react';
import { Visualizer, defaultObservable, VisualizerContext } from './Visualizer';
import { Viewer, ChartDatum } from './Viewer';
import './App.css';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
const defaultMusicUrl =
  'https://sz.btfs.mail.ftn.qq.com/ftn_handler/3662a85df299326f60ab7ce4c9756169004c294c7574e43a5a1d61fab4fbdeeb8934ffe3a8c7ef85498e46c1f392d63fa5d0a1eade620182d1b7f6a8a1d80ad5?compressed=0&dtype=1&fname=Sunflower.mp3';
let pause = () => {};
let resume = () => {};
let close = () => {};
const fetchSrc = (url: string) => {
  return fetch(url).then(res => res.arrayBuffer());
};

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

interface State {
  isLoading: boolean;
  viewData: ChartDatum[];
  url: string;
}

export class Main extends React.Component<{}, State> {
  private visualizerSub = Subscription.EMPTY;
  private isPlaying = false;
  public state: State = {
    isLoading: false,
    viewData: [],
    url: defaultMusicUrl
  };
  private async initVisualizer() {
    const data = await fetchSrc(this.state.url);
    const context = await Visualizer({
      src: data,
      size: 128,
      volume: 0.6
    });
    visualizerContext = context;
    this.runVisualize(context);
  }
  private runVisualize(context: VisualizerContext) {
    const sub = context.subject
      .pipe(map(mapFrequencyDataToChart))
      .subscribe(data => this.setState({ viewData: data }));
    // setVisualizerSub(sub);
    this.visualizerSub = sub;
  }
  private handleLoadingUrl() {
    visualizerContext.close();
    this.setState({ isLoading: false });
    this.initVisualizer().finally(() => {
      this.setState({ isLoading: false });
    });
  }
  private setPlayStatus() {
    if (this.isPlaying) {
      visualizerContext.pause();
      this.visualizerSub.unsubscribe();
      this.isPlaying = false;
    } else {
      visualizerContext.resume();
      this.runVisualize(visualizerContext);
      this.isPlaying = true;
    }
  }
  public componentDidMount() {
    this.setState({ isLoading: true });
    this.initVisualizer().finally(() => {
      this.setState({ isLoading: false });
    });
  }
  render() {
    const { isLoading, viewData, url } = this.state;
    return (
      <div>
        <button
          style={{
            marginRight: '10px',
            backgroundColor: isLoading ? 'orange' : ''
          }}
          onClick={() => {
            this.handleLoadingUrl();
          }}
        >
          {isLoading ? 'loading' : 'load'}
        </button>
        <input
          style={{
            width: '70%'
          }}
          placeholder={'Paste url here,then press load button'}
          onChange={e => this.setState({ url: e.target.value })}
          value={url}
        />
        <p>
          <button onClick={() => this.setPlayStatus()}>
            toggle player status
          </button>
        </p>
        <Viewer data={viewData} />
        {/* <Draw /> */}
      </div>
    );
  }
}
