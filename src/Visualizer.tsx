import * as Rx from 'rxjs';
interface VisualizeParams {
  src: ArrayBuffer;
  drawMethod: (arr: Uint8Array) => any;
  size: number;
  volume: number;
}
export function Visualizer({ src, drawMethod, volume, size }: VisualizeParams) {
  const audioContext = new AudioContext();
  // gainNode
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume;
  gainNode.connect(audioContext.destination);
  // analyser
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = size * 2;
  analyser.connect(gainNode);
  // draw
  let drawObservableSub = Rx.Subscription.EMPTY;
  const visualize = () => {
    const arr = new Uint8Array(analyser.frequencyBinCount);
    drawObservableSub = Rx.interval(0, Rx.animationFrameScheduler).subscribe(() => {
      analyser.getByteFrequencyData(arr);
      drawMethod(arr);
    });
  };

  const decodeCallback = (buffer: AudioBuffer) => {
    const bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.loop = true;
    bufferSource.connect(analyser);
    bufferSource.start(0);
    visualize();
  };
  audioContext.decodeAudioData(src, decodeCallback);
  return {
    pause: () => {
      audioContext.suspend();
      drawObservableSub.unsubscribe();
    },
    resume: () => {
      audioContext.resume();
      visualize();
    }
  };
}
