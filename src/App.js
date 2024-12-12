import './App.css';
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Block from './components/Block';
import Workspace from './components/Workspace';

const App = () => {
  const [workspaceBlocks, setWorkspaceBlocks] = useState([]);

  // Handle block drop
  const handleDrop = (block) => {
    setWorkspaceBlocks((prevBlocks) => [...prevBlocks, block]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', padding: '20px' }}>
        {/* Left Sidebar with blocks */}
        <div style={{ width: '200px', paddingRight: '20px' }}>
          <h3>Control</h3>
          <Block id="wait" type="control">
            Wait <input type="number"></input>{' '}
          </Block>
          <Block id="repeat" type="control">
            Repeat <input type="number"></input>{' '}
          </Block>
          <Block id="forever" type="control">
            Repeat Forever
          </Block>
          <Block id="if" type="control">
            If <input type="text"></input> then <input type="text"></input>{' '}
          </Block>
          <Block id="if-else" type="control">
            If <input type="text"></input> then <input type="text"></input> else{' '}
            <input type="text"></input>
          </Block>
          <Block id="wait-until" type="control">
            Wait until <input type="text"></input>{' '}
          </Block>
          <Block id="repeat-until" type="control">
            Repeat until <input type="text"></input>{' '}
          </Block>
        </div>

        {/* Workspace Area */}
        <Workspace onDrop={handleDrop} />

        {/* Display dropped blocks */}
        <div style={{ marginLeft: '20px', width: '200px' }}>
          <h3>Workspace Blocks</h3>
          {workspaceBlocks.map((block, index) => (
            <div
              key={index}
              style={{
                padding: '10px',
                backgroundColor: '#FFB347',
                margin: '5px',
              }}
            >
              {block.id}
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
