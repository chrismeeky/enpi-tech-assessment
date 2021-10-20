import React, { useState, useEffect, useRef } from "react";
import { scaleLinear, extent, brushX, select } from "d3";
import { useData } from "./useData";
import { AxisBottom } from "./AxisBottom";
import { AxisLeft } from "./AxisLeft";
import { Marks } from "./Marks";
import "./styles.css";

const width = 960;
const height = 500;
const margin = {
  top: 20,
  right: 40,
  bottom: 70,
  left: 100,
};

export const ScatterPlot = () => {
  const data = useData();
  const [brushExtent, setBrushExtent] = useState([]);
  const [axisLabels, setAxisLabels] = useState({
    xAxisLabel: "J Score",
    yAxisLabel: "Receptor Average Quality",
  });
  const brushRef = useRef();

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;
  const tickOffset = 10;

  const xAxisLabelOffset = 55;
  const yAxisLabelOffset = 55;

  const xValue = (d) => d.plotSource[axisLabels.xAxisLabel];

  const yValue = (d) => d.plotSource[axisLabels.yAxisLabel];

  useEffect(() => {
    const brush = brushX().extent([
      [0, 0],
      [innerWidth, innerHeight],
    ]);
    brush(select(brushRef.current));
    brush.on("end", (event) => {
      console.log("ddddd", event.selection.map(xScale.invert));
      setBrushExtent(event.selection && event.selection.map(xScale.invert));
    });
  }, [innerWidth, innerHeight, data]);

  if (!data) {
    return <pre>Loading...</pre>;
  }

  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  const xAxisTickFormat = (value) => value;

  return (
    <svg
      style={{ margin: "auto", display: "block" }}
      width={width}
      height={height}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        <AxisBottom
          xScale={xScale}
          innerHeight={innerHeight}
          tickFormat={xAxisTickFormat}
          tickOffset={tickOffset}
        />
        <text
          className="axis-label"
          textAnchor="middle"
          x={innerWidth / 2}
          y={innerHeight + xAxisLabelOffset}
        >
          {axisLabels.xAxisLabel}
        </text>

        <text
          className="axis-label"
          textAnchor="middle"
          transform={`translate(${-yAxisLabelOffset}, ${
            innerHeight / 2
          }) rotate(-90 )`}
        >
          {axisLabels.yAxisLabel}
        </text>
        <AxisLeft
          yScale={yScale}
          innerWidth={innerWidth}
          tickOffset={tickOffset}
        />
        <Marks
          data={data}
          xScale={xScale}
          yScale={yScale}
          xValue={xValue}
          yValue={yValue}
          toolTipFormat={xAxisTickFormat}
          circleRadius={4}
          brushExtent={brushExtent}
        />
        <g ref={brushRef} />
      </g>
    </svg>
  );
};
