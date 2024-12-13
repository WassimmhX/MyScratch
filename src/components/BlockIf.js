import React, { useContext, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Operation from './Operation';
import Cmp from './Cmp';
import BlockIfElse from './BlockIfElse';
import { GlobalContext } from '../GlobalProvider';
import Variable from './Variable';

function BlockIf({ addCode, nbImgStart, nbVarStart }) {
  const [boardIf, setBoardIf] = useState([]);
  const [boardThen, setBoardThen] = useState([]);
  const [nbIf, setNbIf] = useState(0);
  const [nbImg, setNbImg] = useState(0);
  const [nbVar, setNbVar] = useState(0);
  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);

  const [{ isOver: isOverIf }, dropIf] = useDrop(() => ({
    accept: ['operation'],
    drop: (item) => addOpToBoard(item, 'condition'),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));
  const [{ isOver: isOverThen }, dropThen] = useDrop(() => ({
    accept: ['image', 'variable'],
    drop: (item) => addOpToBoard(item, 'then'),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));
  const addOpToBoard = (item, boardType) => {
    if (boardType === 'condition') {
      setGlobalVariable((g) => g + '(');
      setBoardIf((prevBoard) => [...prevBoard, item]);
      setNbIf((nb) => nb + 1);
    } else if (boardType === 'then') {
      if (item.type === 'image') {
        nbImgStart();
        setGlobalVariable((g) => g + ' then:\n' + '\tprint:');
        setNbImg((nb) => nb + 1);
      } else if (item.type === 'variable') {
        nbVarStart();
        setGlobalVariable((g) => g + ' then:\n' + '\tprint:');
        setNbVar((nb) => nb + 1);

      }
      setBoardThen((prevBoard) => [...prevBoard, item]);
    }
  };
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BlockIf',
    item: { type: 'BlockIf' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const boardHeightIf = boardIf.length === 0 ? 48 : boardIf.length * 48;
  const boardHeightThen = boardThen.length === 0 ? 29 : nbImg * 29 + nbVar * 75;

  return (
    <div
      ref={drag}
      className="Board"
      style={{
        opacity: isDragging ? 0.5 : 1,
        height: `${boardHeightIf + boardHeightThen + 20}px`,
        backgroundColor: 'green',
        width: '280px',
        border: '2px solid black',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            position: 'relative',
            padding: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          if
        </div>

        <div
          ref={dropIf}
          style={{
            height: `${boardHeightIf}px`,
            backgroundColor: isOverIf ? 'lightblue' : 'white',
            width: '156px',
            border: '2px dashed black',
            display: 'flex',
            alignItems: 'center',
            margin: '5px',
            justifyContent: 'center',
          }}
        >
          {boardIf.map((picture, index) => (
            <Operation key={index} />
          ))}
        </div>

        <div
          style={{
            color: 'white',
            position: 'relative',
            padding: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          then
        </div>
      </div>

      <div
        ref={dropThen}
        style={{
          height: `${boardHeightThen}px`,
          backgroundColor: isOverThen ? 'lightblue' : 'white',
          width: '170px',
          border: '2px dashed black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {boardThen.map((item, index) =>
          item.type === 'variable' ? (
            <Variable key={index} />
          ) : (
            <Cmp key={index} />
          )
        )}
      </div>
    </div>
  );
}

export default BlockIf;
