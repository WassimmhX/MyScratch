import React, { useContext, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { GlobalContext } from '../GlobalProvider';


function Cmp() {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'image',
    item: { type:'image' },
     collect: (monitor) => ({
       isDragging: !!monitor.isDragging(),
     }),
  }));
  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
  const[line,setLine]=useState("")
  useEffect(()=>{
    setGlobalVariable((g)=>g+line+"\n")
  },[line])
  return (
    <div
      ref={drag}
      style={{
        display: 'flex',
        border: isDragging ? '5px solid pink' : '2px solid black',
        width: 'fit-content',
        height: '25px',
        textAlign: 'center',
      }}
    >
      print (
      <input value={line} onChange={(e)=>{setLine(e.target.value)}} style={{
        width: '100px',
      }}/> )
    </div>
  );
}

export default Cmp;
