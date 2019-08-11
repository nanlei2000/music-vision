import React, { Component } from 'react';
import { canvasCallLog } from './canvasCallLog';
export class Draw extends Component {
  canvas: HTMLCanvasElement = document.createElement('canvas');
  ctx!: CanvasRenderingContext2D;
  constructor(props: any) {
    super(props);
  }
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d')!;
    canvasCallLog.call(this, this.ctx);
    console.log = function() {
      console.log.apply(this, [[].slice.call(arguments)]);
    };
    console.log(1, 2, 3, 3, 3);
    this.draw4();
  }
  draw1() {
    console.log(this.ctx);
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 3; j++) {
        this.ctx.beginPath();
        var x = 25 + j * 50; // x 坐标值
        var y = 25 + i * 50; // y 坐标值
        var radius = 20; // 圆弧半径
        var startAngle = 0; // 开始点
        var endAngle = Math.PI + (Math.PI * j) / 2; // 结束点
        var anticlockwise = i % 2 == 0 ? false : true; // 顺时针或逆时针

        this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

        if (i > 1) {
          this.ctx.fill();
          this.ctx.closePath();
        } else {
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    }
  }
  draw2() {
    // 问号
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(75, 25);
    ctx.quadraticCurveTo(25, 25, 25, 62.5);
    ctx.quadraticCurveTo(25, 100, 50, 100);
    ctx.quadraticCurveTo(50, 120, 30, 125);
    ctx.quadraticCurveTo(60, 120, 65, 100);
    ctx.quadraticCurveTo(125, 100, 125, 62.5);
    ctx.quadraticCurveTo(125, 25, 75, 25);
    ctx.stroke();
  }
  draw3() {
    // 心形
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(75, 40);
    ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
    ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
    ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
    ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
    ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
    ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
    ctx.fillStyle = 'deeppink';
    ctx.fill();
  }
  draw4() {
    roundedRect(this.ctx, 12, 12, 150, 150, 15);
  }
  render() {
    return (
      <canvas
        ref={ref => {
          this.canvas = ref!;
        }}
        width={600}
        height={400}
      />
    );
  }
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
  ctx.stroke();
}
