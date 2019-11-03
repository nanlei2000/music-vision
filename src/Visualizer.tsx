import * as Rx from 'rxjs';
import { tap, filter } from 'rxjs/operators';
interface VisualizeParams {
  src: ArrayBuffer;
  size: number;
  volume: number;
}

export interface VisualizerContext {
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  dispose: () => Promise<void>;
  subject: Rx.Subject<Uint8Array>;
}
// export const dataSubject = new Rx.Subject<Uint8Array>();

export class Analyser {
  private readonly audioContext: AudioContext;
  private isPause: boolean = false;
  private readonly dataSubject: Rx.Subject<Uint8Array>;
  private sub: Rx.Subscription = Rx.Subscription.EMPTY;
  gainNode: GainNode;
  bufferSource: AudioBufferSourceNode;
  analyser: AnalyserNode;
  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.dataSubject = new Rx.Subject<Uint8Array>();
    this.gainNode = this.audioContext.createGain();
    this.bufferSource = this.audioContext.createBufferSource();
    this.analyser = this.audioContext.createAnalyser();
  }
  public getContext(): VisualizerContext {
    return {
      pause: () => {
        return this.audioContext.suspend().then(() => {
          this.isPause = true;
        });
      },
      resume: () => {
        return this.audioContext.resume().then(() => {
          this.isPause = false;
        });
      },
      dispose: () => {
        this.sub.unsubscribe();
        this.dataSubject.complete();
        return this.audioContext.close();
      },
      subject: this.dataSubject
    };
  }
  public async run({ src, volume, size }: VisualizeParams): Promise<void> {
    const { dataSubject } = this;
    // gainNode 增益
    this.gainNode.gain.value = volume;
    this.gainNode.connect(this.audioContext.destination);
    // analyser 分析
    this.analyser.fftSize = size * 2;
    this.analyser.connect(this.gainNode);
    // draw
    const analyse = (buffer: AudioBuffer): void => {
      const bufferSource = this.audioContext.createBufferSource();

      bufferSource.buffer = buffer;
      bufferSource.loop = true;
      bufferSource.connect(this.analyser);
      bufferSource.start(0);
      const arr = new Uint8Array(this.analyser.frequencyBinCount);
      // 状态恢复
      // this.isPause = false;
      this.sub.unsubscribe();
      this.sub = Rx.interval(0, Rx.animationFrameScheduler)
        .pipe(
          filter(() => !this.isPause),
          tap(() => {
            this.analyser.getByteFrequencyData(arr);
            dataSubject.next(arr);
          })
        )
        .subscribe();
    };
    // await this.getContext().pause();
    const buffer = await this.audioContext.decodeAudioData(src);
    analyse(buffer);
    // await this.getContext().resume();
  }
}

// export async function Visualizer({
//   src,
//   volume,
//   size
// }: VisualizeParams): Promise<VisualizerContext> {
//   const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   // gainNode 增益
//   const gainNode = audioContext.createGain();
//   gainNode.gain.value = volume;
//   gainNode.connect(audioContext.destination);
//   // analyser 分析
//   const analyser = audioContext.createAnalyser();
//   analyser.fftSize = size * 2;
//   analyser.connect(gainNode);
//   // draw
//   const analyse = (buffer: AudioBuffer): VisualizerContext => {
//     const bufferSource = audioContext.createBufferSource();
//     bufferSource.buffer = buffer;
//     bufferSource.loop = true;
//     bufferSource.connect(analyser);
//     bufferSource.start(0);
//     const arr = new Uint8Array(analyser.frequencyBinCount);
//     let isPause: boolean = false;
//     const sub = Rx.interval(0, Rx.animationFrameScheduler)
//       .pipe(
//         filter(() => !isPause),
//         tap(() => {
//           analyser.getByteFrequencyData(arr);
//           dataSubject.next(arr);
//         })
//       )
//       .subscribe();
//     return {
//       pause: () => {
//         return audioContext.suspend().then(() => ((isPause = true), undefined));
//       },
//       resume: () => {
//         return audioContext.resume().then(() => ((isPause = false), undefined));
//       },
//       close: () => {
//         sub.unsubscribe();
//         return audioContext.close();
//       },
//       subject: arr
//     };
//   };
//   const buffer = await audioContext.decodeAudioData(src);
//   return analyse(buffer);
// }
