import { useState, useEffect } from "react";
import bioData from "../../Data/tech_assesment_frontend_data.json";

const csvUrl =
  "https://gist.githubusercontent.com/curran/90240a6d88bdb1411467b21ea0769029/raw/7d4c3914cc6a29a7f5165f7d5d82b735d97bcfe4/week_temperature_sf.csv";

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // modify data
    const row = (d) => {
      d.tags = JSON.parse(d.tags);
      d.plotSource = {
        id: d.id,
        "Read Count": d.tags.airr["Read Count"],
        "J Score": d.tags["igx-profile"]["J Score"],
        "Receptor Average Quality":
          d.tags["igx-profile"]["Receptor Average Quality"],
        "Sequence Count": d.tags["igx-profile"]["Sequence Count"],
        "V Score": d.tags["igx-profile"]["V Score"],
      };
      return d;
    };

    // format data to an array of
    const dataArray = Object.values(bioData).slice(0, 100);
    dataArray.forEach(row);
    setData(dataArray)
    console.log(dataArray);
  }, []);

  return data;
};
