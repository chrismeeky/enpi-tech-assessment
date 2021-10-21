import React, { useState, useEffect, useRef } from "react";
import { scaleLinear, extent, brushX, select, format } from "d3";
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
  const [tagColumns, setTagColumns] = useState([]);
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
    // set axis labels
    if (data) {
      const firstRow = { ...data[0].plotSource };
      delete firstRow.id;
      const keys = Object.keys(firstRow);
      // set default axis labels

      setAxisLabels({
        xAxisLabel: keys[1],
        yAxisLabel: keys[2],
      });
      setTagColumns(keys);

      console.log("source", keys);
    }
  }, [data]);

  useEffect(() => {
    const brush = brushX().extent([
      [0, 0],
      [innerWidth, innerHeight],
    ]);
    brush(select(brushRef.current));
    brush.on("end", (event) => {
      if (event.selection) {
        const invertedScale = event.selection.map(xScale.invert);

        console.log("filtered", invertedScale);

        setBrushExtent(event.selection && event.selection.map(xScale.invert));
      }
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

  const siFormat = format(".2s");

  const xAxisTickFormat = siFormat;

  const AxisSelect = ({ tagColumns, handleAxisChange, name, value }) => (
    <select
      key={name}
      onChange={(event) => handleAxisChange(name, event.target.value)}
      value={value}
    >
      {tagColumns.map((label) => (
        <option key={label}>{label}</option>
      ))}
    </select>
  );

  const handleAxisChange = (name, value) => {
    setAxisLabels({
      ...axisLabels,
      [name]: value,
    });
  };

  return (
    <>
      <div className="dropdowns">
        <AxisSelect
          name="xAxisLabel"
          tagColumns={tagColumns}
          handleAxisChange={handleAxisChange}
          value={axisLabels.xAxisLabel}
        />
        <span>VS</span>
        <AxisSelect
          name="yAxisLabel"
          tagColumns={tagColumns}
          handleAxisChange={handleAxisChange}
          value={axisLabels.yAxisLabel}
        />
      </div>
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
            tickFormat={xAxisTickFormat}
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

      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">CDR3</th>
          </tr>
        </thead>
        <tbody>
          {data.map(
            (d) =>
              xValue(d) >= brushExtent[0] &&
              xValue(d) <= brushExtent[1] && (
                <tr>
                  <td>{d.id}</td>
                  <td>{d.tags.airr["CDR3 Nucleotides"]}</td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </>
  );
};