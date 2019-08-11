function withHookBefore(originalFn: Function, hookFn: Function) {
  return function(this: any) {
    if (hookFn.apply(this, arguments) === false) {
      return;
    }
    return originalFn.apply(this, arguments);
  };
}
const properties = [
  'canvas',
  'globalAlpha',
  'globalCompositeOperation',
  'filter',
  'imageSmoothingEnabled',
  'imageSmoothingQuality',
  'strokeStyle',
  'fillStyle',
  'shadowOffsetX',
  'shadowOffsetY',
  'shadowBlur',
  'shadowColor',
  'lineWidth',
  'lineCap',
  'lineJoin',
  'miterLimit',
  'lineDashOffset',
  'font',
  'textAlign',
  'textBaseline',
  'save',
  'restore',
  'scale',
  'rotate',
  'translate',
  'transform',
  'setTransform',
  'getTransform',
  'resetTransform',
  'createLinearGradient',
  'createRadialGradient',
  'createPattern',
  'clearRect',
  'fillRect',
  'strokeRect',
  'beginPath',
  'fill',
  'stroke',
  'drawFocusIfNeeded',
  'clip',
  'isPointInPath',
  'isPointInStroke',
  'fillText',
  'strokeText',
  'measureText',
  'drawImage',
  'getImageData',
  'putImageData',
  'createImageData',
  'getContextAttributes',
  'setLineDash',
  'getLineDash',
  'closePath',
  'moveTo',
  'lineTo',
  'quadraticCurveTo',
  'bezierCurveTo',
  'arcTo',
  'rect',
  'arc',
  'ellipse',
  'direction',
  'scrollPathIntoView',
  'addHitRegion',
  'removeHitRegion',
  'clearHitRegions',
  'isContextLost'
];

export function canvasCallLog(ctx: any) {
  properties.forEach(key => {
    if (typeof ctx[key] === 'function') {
      ctx[key] = withHookBefore(ctx[key], (...args: any[]) => {
        console.log(`${key}(${args.join()})`);
      });
    }
  });
}
