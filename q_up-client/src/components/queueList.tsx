import React, { useState } from "react";
import QueueListRow from "./queueListRow";

export default function QueueList(props: any) {
  const [expandedPanel, setExpanded] = React.useState<string | false>(false);
  const [dataList, setDataList] = useState(props.dataList);

  const handleChange = (panel: string) => (event: any, isExpanded: boolean) => {
    if (event.target.name === "fav") {
      return;
    }
    setExpanded(isExpanded ? panel : false);
  };
  
  const removeRow = (key: number) => () => {
    setDataList(dataList.slice(0, key).concat(dataList.slice(key + 1)))
  };

  return (
    <>
      {dataList.map((q: any, key: any) => (
        <QueueListRow
          key={key}
          data={q}
          handleChange={handleChange("panel" + key)}
          isExpanded={expandedPanel === "panel" + key}
          remove={removeRow(key)}
          favList={props.favList}
        />
      ))}
    </>
  );
}
