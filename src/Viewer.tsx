import React, { useEffect, useState } from 'react';
import G2 from '@antv/g2';
export type ChartDatum = {
  index: number;
  volume: number;
};

export function Viewer({ data }: { data: ChartDatum[] }) {
  let chartContainer: HTMLDivElement = document.createElement('div');
  const [isMounted, setIsMounted] = useState(false);
  const [chart, setChart] = useState(undefined as undefined | G2.Chart);
  useEffect(() => {
    if (!isMounted) {
      console.log(`once`);
      const chart = new G2.Chart({
        container: chartContainer,
        forceFit: true,
        height: 400,
        // width: 1200,
        padding: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0
        }
      });
      chart.source(data);
      chart.axis(false);
      chart.legend(false);
      chart.tooltip(false);
      chart
        .line()
        .position('index*volume')
        .color('#000');
      chart.render();
      setChart(chart);
      setIsMounted(true);
    }
    if (chart && isMounted) {
      chart.changeData(data);
    }
    return () => {};
  });
  return (
    <div
      id="chart"
      ref={ref => {
        chartContainer = ref!;
      }}
    />
  );
}
