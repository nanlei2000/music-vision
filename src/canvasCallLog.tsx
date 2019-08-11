function withHookBefore(originalFn: Function, hookFn: Function) {
  return function(this: any) {
    if (hookFn.apply(this, arguments) === false) {
      return;
    }
    return originalFn.apply(this, arguments);
  };
}
function withHookAfter(originalFn: Function, hookFn: Function) {
  return function(this: any) {
    var output = originalFn.apply(this, arguments);
    hookFn.apply(this, arguments);
    return output;
  };
}
export const canvasProperties = [
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

export const contextLog = (ctx: any, properties: string[]) => {
  let now = Date.now();
  const getTime = () => {
    const now_ = Date.now();
    const diff = now_ - now;
    now = now_;
    return `${diff}ms`;
  };
  properties.forEach(key => {
    if (typeof ctx[key] === 'function') {
      ctx[key] = withHookBefore(ctx[key], (...args: any[]) => {
        console.log(`call ${key}(${args.join()}) ${getTime()}`);
      });
    } else {
      const original = Object.getOwnPropertyDescriptor(ctx, key);
      const storeKey = Symbol('__storeKey__');
      Object.defineProperty(ctx, key, {
        ...original,
        get() {
          console.log(
            `get ${key} : ${JSON.stringify(this[storeKey])} ${getTime()}`
          );
          return Reflect.get(ctx, storeKey);
        },
        set(value) {
          console.log(`set ${key} = ${JSON.stringify(value)} ${getTime()}`);
          Reflect.set(ctx, storeKey, value);
        }
      });
    }
  });
};
