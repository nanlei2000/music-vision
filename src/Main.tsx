import React from 'react';
import { Visualizer, VisualizerContext } from './Visualizer';
import './App.css';
import { Subscription } from 'rxjs';
import { BarView } from './BarView';
const defaultMusicUrl =
  '//m8.music.126.net/21180815163607/04976f67866d4b4d11575ab418904467/ymusic/515a/5508/520b/f0cf47930abbbb0562c9ea61707c4c0b.mp3?infoId=92001';
const fetchSrc = (url: string) => {
  return fetch(url).then(res => res.arrayBuffer());
};

interface State {
  isLoading: boolean;
  viewData: Uint8Array;
  url: string;
}

export class Main extends React.Component<{}, State> {
  private visualizerContext!: VisualizerContext;
  private isPlaying = false;
  public state: State = {
    isLoading: false,
    viewData: new Uint8Array(),
    url: defaultMusicUrl
  };
  private async initVisualizer() {
    const data = await fetchSrc(this.state.url);
    try {
      this.visualizerContext.close();
    } catch {}
    this.visualizerContext = await Visualizer({
      src: data,
      size: 1 << 7,
      volume: 0.6
    });
    this.isPlaying = true;
  }
  private handleLoadingUrl() {
    this.setState({ isLoading: true });
    this.initVisualizer().finally(() => {
      this.setState({ isLoading: false });
    });
  }
  private setPlayStatus() {
    if (this.isPlaying) {
      this.visualizerContext.pause();
      this.isPlaying = false;
    } else {
      this.visualizerContext.resume();
      this.isPlaying = true;
    }
  }
  public componentDidMount() {
    this.handleLoadingUrl();
  }
  render() {
    const { isLoading, url } = this.state;
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            height: '60px'
          }}
        >
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
        </div>
        {/* <Viewer data={viewData} /> */}
        {/* <Draw /> */}
        <BarView></BarView>
      </div>
    );
  }
}
