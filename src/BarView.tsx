import React from 'react';
import { tap } from 'rxjs/operators';
import { dataSubject } from './Visualizer';

export class BarView extends React.Component<{}, {}> {
  private canvas!: HTMLCanvasElement;

  public componentDidMount() {
    const { height, width } = this.canvas.getBoundingClientRect();
    const ctx = this.canvas.getContext('2d')!;
    console.log('→: BarView -> componentDidMount -> ctx', ctx);
    dataSubject
      .pipe(
        tap(data => {
          ctx.clearRect(0, 0, width, height);
          const gutter = 2;
          const barWidth = Math.ceil(width / data.length);
          console.log('→: BarView -> componentDidMount -> barWidth', barWidth);
          for (let i = 0; i < data.length; i++) {
            const volume = data[i];
            // console.log('→: BarView -> componentDidMount -> volume', volume);
            const r = volume + 25 * (i / data.length);
            const g = 250 * (i / data.length);
            const b = 50;
            // ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillStyle = 'red';
            ctx.fillRect(i * barWidth, height - volume, barWidth, volume);
          }
        })
      )
      .subscribe();
  }
  render() {
    return (
      <canvas
        style={{
          flex: 1
        }}
        ref={ref => {
          this.canvas = ref!;
        }}
      ></canvas>
    );
  }
}
