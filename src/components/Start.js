import { useDrop } from 'react-dnd';
import React, { useContext, useEffect, useState } from 'react';
import Cmp from './Cmp';
import BlockIf from './BlockIf';
import BlockIfElse from './BlockIfElse';
import BlockFor from './BlockFor';
import { GlobalContext } from '../GlobalProvider';
import Variable from './Variable';

function Start({ color, cmpList }) {
  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);

  const [board, setBoard] = useState([]);
  const [nbImg, setNbImg] = useState(0);
  const [nbVar, setNbVar] = useState(0);
  const [boardHeight, setBoardHeight] = useState(29);
  const [nbIf, setNbIf] = useState(0);
  const [nbIfElse, setNbIfElse] = useState(0);
  const [nbFor, setNbFor] = useState(0)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: [
      'image',
      'BlockIf',
      'BlockIfElse',
      'BlockFor',
      'variable',
    ],
    drop: (item) => handleDrop(item),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  const handleDrop = (item) => {
    if (item.type === 'operaion') {
      addOpToBoard(item);
    } else if (item.type === 'BlockIf') {
      setGlobalVariable((code) => code + '\n' + 'if');
      setNbIf((n) => n + 1);
      addBlockIfToBoard(item);
    } else if (item.type === 'BlockIfElse') {
      setGlobalVariable((code) => code + '\n' + 'if');
      setNbIfElse((n) => n + 1);
      addBlockIfToBoard(item);
    } else if (item.type === 'BlockFor') {
      setGlobalVariable((code) => code + '\n' + 'for');
      setNbFor((n) => n + 1);
      addBlockIfToBoard(item);
    } else if (item.type === 'image') {
      setNbImg((nbImg) => nbImg + 1);
      addImageToBoard(item);
    } else if (item.type === 'variable') {
      setNbVar((nbVar) => nbVar + 1);
      addVariableToBoard(item);
    }
  };

  const addVariableToBoard = (item) => {
    setBoard((prevBoard) => [...prevBoard, item]);
  };
  const addImageToBoard = (item) => {
    setBoard((prevBoard) => [...prevBoard, item]);
  };
  const addOpToBoard = (op) => {
    setBoard((prevBoard) => [...prevBoard, op]);
  };
  const addBlockIfToBoard = (item) => {
    setBoard((prevBoard) => [...prevBoard, item]);
  };
  useEffect(() => {
    if (nbIf + nbIfElse + nbFor + nbImg + nbVar != 0) {
      setBoardHeight(
        nbIf * 120 + nbIfElse * 180 + nbFor * 102 + nbImg * 29 + nbVar * 73
      );
    }
    console.log(nbIf, nbIfElse, nbFor, nbImg, boardHeight, nbVar);
  }, [nbIf, nbIfElse, nbFor, nbImg, nbVar]);

  useEffect(() => {
    console.log(globalVariable);
  }, [globalVariable]);
  return (
    <div
      className="Board"
      style={{
        height: `${boardHeight + 50}px`,
        backgroundColor: color,
        width: '400px',
        border: '2px solid black',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          padding: '8px',
        }}
      >
        Start
      </div>
      <div
        style={{
          height: `${boardHeight}px`,
          backgroundColor: isOver ? 'lightblue' : 'white',
          width: '350px',
          position: 'absolute',
          top: '50%',
          right: '0',
          transform: 'translateY(-50%)',
          border: '2px solid black',
          borderRadius: '8px',
        }}
      >
        {board.map((item, index) =>
          item.type === 'BlockIf' ? (
            <BlockIf
              key={index}
              nbImgStart={() => {
                setNbImg((n) => n + 1);
              }}
              nbVarStart={() => {
                setNbVar((n) => n + 1);
              }}
            />
          ) : item.type === 'BlockIfElse' ? (
            <BlockIfElse
              key={index}
              nbImgStart={() => {
                setNbImg((n) => n + 1);
              }}
              nbIfStart={() => {
                setNbIf((n) => n + 1);
              }}
              nbIfElseStart={() => {
                setNbIfElse((n) => n + 1);
              }}
              nbVarStart={() => {
                setNbVar((n) => n + 1);
              }}
            />
          ) : item.type === 'BlockFor' ? (
            <BlockFor
              key={index}
              nbIfStart={() => {
                setNbIf((n) => n + 1);
              }}
              nbIfElseStart={() => {
                setNbIfElse((n) => n + 1);
              }}
              nbImgStart={() => {
                setNbImg((n) => n + 1);
              }}
              nbForStart={() => {
                setNbFor((n) => n + 1);
              }}
            />
          ) : item.type === 'image' ? (
            <Cmp key={index} />
          ) : item.type === 'variable' ? (
            <Variable
              key={index}
              nbVarStart={() => {
                setNbVar((n) => n + 1);
              }}
            />
          ) : (
            <div></div>
          )
        )}
        <div ref={drop} style={{ height: '29px' }}></div>
      </div>
    </div>
  );
}

export default Start;
