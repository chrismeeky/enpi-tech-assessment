export const AxisBottom = ({ xScale, innerHeight, tickFormat, tickOffset }) =>
  xScale.ticks().map((tickValue) => (
    <g
      key={tickValue}
      transform={`translate(${xScale(tickValue)}, ${0})`}
      className="tick"
    >
      <line y2={innerHeight} />

      <text
        style={{ textAnchor: "middle" }}
        y={innerHeight + tickOffset}
        dy={"0.71em"}
      >
        {tickFormat(tickValue)}
      </text>
    </g>
  ));
