import React, { useContext, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Operation from './Operation';
import Cmp from './Cmp';
import BlockIf from './BlockIf';
import { GlobalContext } from '../GlobalProvider';
import Variable from './Variable';

function BlockIfElse({ nbImgStart, nbIfStart, nbIfElseStart, nbVarStart }) {
  const [boardIf, setBoardIf] = useState([]);
  const [boardThen, setBoardThen] = useState([]);
  const [boardElse, setBoardElse] = useState([]);

  const [nbImgIf, setNbImgIf] = useState(0);
  const [nbImgElse, setNbImgElse] = useState(0);
  const [nbIfElse, setNbIfElse] = useState(0);
  const [nbVarIf, setNbVarIf] = useState(0);
  const [nbVarElse, setNbVarElse] = useState(0);

  const [nbIf, setNbIf] = useState(0);

  const [nbThen, setNbThen] = useState(0);
  const [nbElse, setNbElse] = useState(0);
  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);

  const [{ isOver: isOverIf }, dropIf] = useDrop(() => ({
    accept: ['operation'],
    drop: (item) => addToBoard(item, 'if'),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));
  const [{ isOver: isOverThen }, dropThen] = useDrop(() => ({
    accept: ['image','variable'],
    drop: (item) => addToBoard(item, 'then'),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));
  const [{ isOver: isOverElse }, dropElse] = useDrop(() => ({
    accept: ['image', 'BlockIf', 'BlockIfElse','variable'],
    drop: (item) => addToBoard(item, 'else'),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  const addToBoard = (item, boardType) => {
    if (boardType === 'if') {
      setGlobalVariable((g) => g + '(');
      setBoardIf((prevBoard) => [...prevBoard, item]);
      // setNbIf((nb) => nb + 1);
    } else if (boardType === 'then') {
      if (item.type === 'variable') {
        nbVarStart();
        setNbVarIf((nb)=>nb+1)
        setGlobalVariable((g) => g + 'then:\n\t');
      } else {
        setNbImgIf((nb)=>nb+1)
        setGlobalVariable((g) => g + 'then\n\tprint:');
      }
      setBoardThen((prevBoard) => [...prevBoard, item]);
      setNbThen((nb) => nb + 1);
    } 
    else if (boardType === 'else') {
      if (item.type === 'image') {
        setGlobalVariable((g) => g + '\nelse:\n\tprint:');
        setNbImgElse((n) => n + 1);
      } 
      else if(item.type=="variable"){
        nbVarStart();
        setNbVarElse((nb)=>nb+1)
        setGlobalVariable((g) => g + 'else:\n\t');
      }
      else {
        setGlobalVariable((g) => g + '\nelse: if:');
        if (item.type === 'BlockIf') {
          setNbIf((nb) => nb + 1);
          nbIfStart();
        } else if (item.type === 'BlockIfElse') {
          setNbIfElse((nb) => nb + 1);
          nbIfElseStart();
        }
      }
      setBoardElse((prevBoard) => [...prevBoard, item]);
      setNbElse((nb) => nb + 1);
    }
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BlockIfElse',
    item: { type: 'BlockIfElse' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  useEffect(()=>{
    if(nbImgElse>1){
      nbImgStart()
    }
  },[nbImgElse])
  useEffect(()=>{
    if(nbImgIf>1){
      nbImgStart()
    }
  },[nbImgIf])
  const boardHeightIf = boardIf.length === 0 ? 48 : boardIf.length * 48;
  const boardHeightThen = boardThen.length === 0 ? 29 : nbImgIf * 29 + nbVarIf * 75;
  const boardHeightElse =boardElse.length === 0 ? 29 : nbImgElse * 29 + nbIf * 120 + nbIfElse * 180 + nbVarElse * 75;
  return (
    <div
      ref={drag}
      className="Board"
      style={{
        opacity: isDragging ? 0.5 : 1,
        height: `${boardHeightIf + boardHeightThen + boardHeightElse + 50}px`,
        backgroundColor: 'lightgreen',
        width: '290px',
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
          marginTop: 5,
        }}
      >
        {boardThen.map((item, index) => (
          item.type==='variable'?<Variable key={index} />: <Cmp key={index} />
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            color: 'white',
            position: 'relative',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          else
        </div>

        <div
          ref={dropElse}
          style={{
            height: `${boardHeightElse}px`,
            backgroundColor: isOverElse ? 'lightblue' : 'white',
            width: '170px',
            border: '2px dashed black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 5,
          }}
        >
          {boardElse.map((item, index) =>
             item.type === 'BlockIf' ? (<BlockIf key={index} />) 
            :item.type === 'BlockIfElse' ? (<BlockIfElse key={index} />) 
            :item.type === 'variable' ? (<Variable key={index} />) 
            : (<Cmp key={index} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default BlockIfElse;
