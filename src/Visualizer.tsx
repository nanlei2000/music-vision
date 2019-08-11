import * as Rx from 'rxjs';
import { tap, map, multicast, refCount } from 'rxjs/operators';
interface VisualizeParams {
  src: ArrayBuffer;
  size: number;
  volume: number;
}

export interface VisualizerContext {
  pause: () => void;
  resume: () => void;
  close: () => void;
  subject: Rx.Observable<Uint8Array>;
}
export const defaultObservable = Rx.of(new Uint8Array());
export function Visualizer({
  src,
  volume,
  size
}: VisualizeParams): Promise<VisualizerContext> {
  let frequency$ = defaultObservable;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  // gainNode 增益
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume;
  gainNode.connect(audioContext.destination);
  // analyser 分析
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = size * 2;
  analyser.connect(gainNode);
  // draw
  const decodeCallback = (buffer: AudioBuffer): VisualizerContext => {
    const bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.loop = true;
    bufferSource.connect(analyser);
    bufferSource.start(0);
    const arr = new Uint8Array(analyser.frequencyBinCount);
    const sub = new Rx.BehaviorSubject(arr);
    frequency$ = Rx.interval(0, Rx.animationFrameScheduler).pipe(
      tap(() => {
        console.log(1);
        analyser.getByteFrequencyData(arr);
      }),
      map(() => {
        return arr;
      }),
      multicast(sub),
      refCount()
    );
    // Rx.interval(0, Rx.animationFrameScheduler).subscribe(() => {
    //   analyser.getByteFrequencyData(arr);
    //   // console.log(arr);
    //   sub.next(arr);
    // });
    return {
      pause: () => {
        audioContext.suspend();
      },
      resume: () => {
        audioContext.resume();
      },
      close: () => {
        audioContext.close();
        sub.unsubscribe();
      },
      subject: frequency$
    };
  };
  return audioContext.decodeAudioData(src).then(decodeCallback);
}
