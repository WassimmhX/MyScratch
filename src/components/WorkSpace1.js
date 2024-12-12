import React, { useState } from "react";
import { useDrop } from "react-dnd";
import Block1 from "./Block1";

function Workspace1({ blocks }) {
  const [workspaceBlocks, setWorkspaceBlocks] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["if", "variable", "condition", "action"],
    drop: (item) => addBlockToWorkspace(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addBlockToWorkspace = (id) => {
    setWorkspaceBlocks((prev) => [...prev, id]);
  };

  return (
    <div
      ref={drop}
      style={{
        width: "500px",
        height: "500px",
        border: "2px dashed gray",
        backgroundColor: isOver ? "lightgreen" : "white",
        position: "relative",
      }}
    >
      {workspaceBlocks.map((blockId) => (
        <Block1 key={blockId} block={blocks.find((b) => b.id === blockId)} />
      ))}
    </div>
  );
}

export default Workspace1;