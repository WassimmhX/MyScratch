import { useDrop } from 'react-dnd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Cmp from './Cmp';
import Operation from './Operation';
import BlockIf from './BlockIf';
import BlockIfElse from './BlockIfElse';
import BlockFor from './BlockFor';
import { GlobalContext } from '../GlobalProvider';

function Start({ color, cmpList }) {
  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);

  const [board, setBoard] = useState([]);
  const [nbImg, setNbImg] = useState(0);
  const [nbDropBox, setnbDropBox] = useState(0);
  const [boardHeight, setBoardHeight] = useState(29);
  const[nbIf, setNbIf] = useState(0)
  const[nbIfElse, setNbIfElse] = useState(0)
  const[nbFor, setNbFor] = useState(0)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['image', 'operation','BlockIf','BlockIfElse','BlockFor'],
    drop: (item) => handleDrop(item),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  const handleDrop = (item) => {
    if(item.type==='operaion') {
      addOpToBoard(item);
    }else if(item.type==='BlockIf') {
      setGlobalVariable((code) =>code+'\n'+'if')
      setNbIf((n)=>n+1)
      addBlockIfToBoard(item);
    }else if(item.type==='BlockIfElse') {
      setGlobalVariable((code) =>code+'\n'+'if')
      setNbIfElse((n)=>n+1)
      addBlockIfToBoard(item);
    }else if(item.type==='BlockFor') {
      setGlobalVariable((code) =>code+'\n'+'for i in')
      setNbFor((n)=>n+1)
      addBlockIfToBoard(item);
    }else  {
      setNbImg((nbImg) => nbImg + 1);
      addImageToBoard(item);
    }
  };

  const addImageToBoard = (item) => {
    setBoard((prevBoard) => [...prevBoard, item]);
  };

  const addDropBoxToBoard = (dropbox) => {
    setBoard((prevBoard) => [...prevBoard, dropbox]);
  };
  const addOpToBoard = (op) => {
    setBoard((prevBoard) => [...prevBoard, op]);
  };
  const addBlockIfToBoard = (item) => {
    setBoard((prevBoard) => [...prevBoard, item]);
  };
  useEffect(()=>{
    if(nbIf+nbIfElse+nbFor+nbImg!=0){
      setBoardHeight(nbIf*120+nbIfElse*180+nbFor*102+nbImg*29);
    }
    console.log(nbIf,nbIfElse,nbFor,nbImg,boardHeight)
  },[nbIf,nbIfElse,nbFor,nbImg])

  useEffect(()=>{
    console.log(globalVariable)
  },[globalVariable])
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
          
              item.type==="BlockIf"? (<BlockIf key={index}/>)
            : item.type==="BlockIfElse"?  <BlockIfElse key={index}/>
            : item.type==="BlockFor"?  <BlockFor key={index} nbIfStart={()=>{setNbIf((n)=>n+1);}} nbIfElseStart={()=>{setNbIfElse((n)=>n+1);}} />
            : (<Cmp key={index} />)
        )}
        <div ref={drop} style={{height:"29px"}}></div>
      </div>
    </div>
  );
}

export default Start;
