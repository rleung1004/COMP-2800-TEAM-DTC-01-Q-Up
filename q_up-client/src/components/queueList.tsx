import React, { useState } from "react";
import QueueListRow from "./queueListRow";

/**
 * Render a list of queue rows 
 * @param props.dataList an array of queue objects, renders one row per each
 */
export default function QueueList(props: any) {  
  const [expandedPanel, setExpanded] = useState("panel");

  // Manage the queue list row expansion panels states so that only one is expanded at a time
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
