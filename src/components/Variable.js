import React, { useContext, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import '../App.css';
import { GlobalContext } from '../GlobalProvider';
import Operation from './Operation';
import Affect from './Affect';

function Variable() {

  const[selectedValue, setSelectedValue] = useState('');
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'variable',
    item: { type: 'variable', op: {} },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  const alphabets = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const [{ isOver: isOverVar }, dropVar] = useDrop(() => ({
    accept: ['operation',"affect"],
    drop: (item) => addToBoard(item),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));
  
  const [boardVar, setBoardVar] = useState([]);
  const addToBoard = (item) => {
    // setGlobalVariable((g) => g + item.op.selectedValue); // ajouter les donnes de variable a afficher
    setBoardVar((prevBoard) => [...prevBoard, item]);
  };
  useEffect(()=>{
    if (selectedValue!=''){
      setGlobalVariable((g)=>g+selectedValue + ' = ')
    }
    },[selectedValue])

  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);

  return (
    <div
      ref={drag}
      className="Board"
      style={{
        opacity: isDragging ? 0.5 : 1,
        height: 'auto',
        backgroundColor: 'teal',
        width: '245px',
        border: '2px solid black',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '8px',
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
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {
            <select className={'select'} value={selectedValue} onChange={(e)=>setSelectedValue(e.target.value)}>
              <option value=''></option>
              {alphabets.map((lettre) => (
                <option key={lettre} value={lettre}>
                  {lettre}
                </option>
              ))}
            </select>
          }
          =
        </div>

        <div
          ref={dropVar}
          style={{
            backgroundColor: isOverVar ? 'lightblue' : 'white',
            border: '2px dashed black',
            borderRadius: '4px',
            height: '50px',
            width: '160px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          {boardVar.map((item, index) => (
            item.type === 'operation'? (<Operation key={index} />)
            :<Affect key={index}/>)
          )}
        </div>
      </div>
    </div>
  );
}

export default Variable;
