export const Marks = ({
  data,
  yScale,
  xScale,
  xValue,
  yValue,
  toolTipFormat,
  circleRadius = 10,
  brushExtent,
}) => (
  <g className="mark">
    {data.map((d) => {
      return (
        <circle
          cx={xScale(xValue(d))}
          cy={yScale(yValue(d))}
          r={circleRadius}
          fill={brushExtent.includes(xValue(d)) && "red"}
          key={d.id}
        >
          <title>{toolTipFormat(xValue(d))}</title>
        </circle>
      );
    })}
  </g>
);
