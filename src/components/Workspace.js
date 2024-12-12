import React from 'react';
import { useDrop } from 'react-dnd';

const ItemType = {
    BLOCK: 'block',
  };
const Workspace = ({ onDrop }) => {
    const [{ isOver }, drop] = useDrop({
      accept: ItemType.BLOCK,
      drop: (item) => onDrop(item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });
  
    return (
      <div ref={drop} style={{ flex: 1, padding: '10px', backgroundColor: isOver ? '#f0f0f0' : '#ffffff', minHeight: '400px' }}>
        Drop blocks here
      </div>
    );
  };

export default Workspace