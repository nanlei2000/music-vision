import React from 'react';
import { tap, throttleTime } from 'rxjs/operators';
import { dataSubject } from './Visualizer';
import { Subscription } from 'rxjs';
export class BarView extends React.Component<{}, {}> {
  private canvas!: HTMLCanvasElement;
  private subList: Subscription[] = [];
  public componentDidMount() {
    const { height, width } = this.canvas.getBoundingClientRect();
    this.canvas.width = width;
    this.canvas.height = height;
    const ctx = this.canvas.getContext('2d')!;
    const sub = dataSubject
      .pipe(
        tap(data => {
          ctx.clearRect(0, 0, width, height);
          const gutter = 2;
          const barWidth = Math.floor(width / data.length);
          for (let i = 0; i < data.length; i++) {
            const volume = data[i];
            const r = volume + 25 * (i / data.length);
            const g = 250 * (i / data.length);
            const b = 50;
            const barHeight = ((volume / 256) * height) / 2;
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            const base = 4;
            // base
            ctx.fillRect(i * barWidth, height - base, barWidth - gutter, base);
            // 柱子
            ctx.fillRect(
              i * barWidth,
              height - barHeight,
              barWidth - gutter,
              barHeight - base
            );
            // 帽子
            const capHeight = 4;
            const capDistance =
              volume > 0 ? Math.min(barHeight + 20, height - capHeight) : 0;
            volume > 0 &&
              ctx.fillRect(
                i * barWidth,
                height - (capDistance + capHeight),
                barWidth - gutter,
                capHeight
              );
          }
        }),
        throttleTime(2000),
        tap(data => {
          console.log(data);
        })
      )
      .subscribe();
    this.subList.push(sub);
  }
  public componentWillUnmount() {
    this.subList.forEach(sub => sub.unsubscribe());
  }
  render() {
    return (
      <canvas
        id={'canvas'}
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
