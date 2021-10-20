export const AxisLeft = ({ yScale, innerWidth, tickOffset }) =>
  yScale.ticks().map((tickValue, index) => (
    <g key={index} className="tick" transform={`translate(0, ${yScale(tickValue)})`}>
      <line x2={innerWidth} />
      <text
        key={tickValue}
        style={{ textAnchor: "end" }}
        dy=".32em"
        x={-tickOffset}
        y={yScale(tickValue)}
      >
        {tickValue}
      </text>
    </g>
  ));
