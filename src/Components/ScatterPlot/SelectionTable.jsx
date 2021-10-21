export const SelectionTable = ({ highlightedPoints }) => (
  <table class="table">
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">CDR3</th>
      </tr>
    </thead>
    <tbody>
      {highlightedPoints.map((d) => (
        <tr>
          <td>{d.id}</td>
          <td>{d.tags.airr["CDR3 Nucleotides"]}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
