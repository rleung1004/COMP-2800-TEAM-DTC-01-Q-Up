import React, { useState } from "react";
import QueueListRow from "./queueListRow";

export default function QueueList(props: any) {  
  const [expandedPanel, setExpanded] = useState("panel");

  const handleChange = (panel: string) => (event: any, isExpanded: boolean) => {
    if (event.target.name === "fav") {
      return;
    }
    setExpanded(isExpanded ? panel : "panel");
  };

  return (
    <>
      {props.dataList.map((q: any, key: any) => 
        <QueueListRow
          key={key}
          data={q}
          handleChange={handleChange("panel" + key)}
          isExpanded={expandedPanel === "panel" + key}
        />
      )}
    </>
  );
}
