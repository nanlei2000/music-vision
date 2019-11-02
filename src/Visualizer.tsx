import * as Rx from 'rxjs';
import { tap, filter } from 'rxjs/operators';
interface VisualizeParams {
  src: ArrayBuffer;
  size: number;
  volume: number;
}

export interface VisualizerContext {
  pause: () => void;
  resume: () => void;
  close: () => void;
  data: Uint8Array;
}
export const dataSubject = new Rx.Subject<Uint8Array>();
export async function Visualizer({
  src,
  volume,
  size
}: VisualizeParams): Promise<VisualizerContext> {
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
  const analyse = (buffer: AudioBuffer): VisualizerContext => {
    const bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.loop = true;
    bufferSource.connect(analyser);
    bufferSource.start(0);
    const arr = new Uint8Array(analyser.frequencyBinCount);
    let isPause: boolean = false;
    const sub = Rx.interval(0, Rx.animationFrameScheduler)
      .pipe(
        filter(() => !isPause),
        tap(() => {
          analyser.getByteFrequencyData(arr);
          dataSubject.next(arr);
        })
      )
      .subscribe();
    return {
      pause: () => {
        audioContext.suspend().then(() => (isPause = true));
      },
      resume: () => {
        audioContext.resume().then(() => (isPause = false));
      },
      close: () => {
        audioContext.close();
        sub.unsubscribe();
      },
      data: arr
    };
  };
  const buffer = await audioContext.decodeAudioData(src);
  return analyse(buffer);
}
