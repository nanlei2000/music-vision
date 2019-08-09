import React, { useEffect } from 'react';
import * as G2 from '@antv/g2';
export type ChartDatum = {
  index: number;
  volume: number;
};

export function Viewer({ data }: { data: ChartDatum[] }) {
  let chartContainer: HTMLDivElement = document.createElement('div');
  const chart = new G2.Chart({
    container: chartContainer,
    forceFit: true,
    height: window.innerHeight
  });
  chart.scale('sales', {
    tickInterval: 20
  });
  chart.interval().position('index*volume');
  useEffect(() => {
    chart.source(data);
    chart.render();
  });
  return (
    <div
      id="chart"
      style={{ width: '600px', height: '200px' }}
      ref={ref => {
        chartContainer = ref!;
      }}
    />
  );
}
