export const AxisSelect = ({ tagColumns, handleAxisChange, name, value }) => (
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