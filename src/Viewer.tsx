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
        // forceFit: true,
        height: 400,
        width: 1200,
        padding: ['50%', 0, 0] as any
      });
      chart.source(data);
      chart.axis(false);
      chart.legend(false);
      chart.tooltip(false);
      chart.interval().position('index*volume');
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
      style={{ width: '1200px', height: '400px' }}
      ref={ref => {
        chartContainer = ref!;
      }}
    />
  );
}
