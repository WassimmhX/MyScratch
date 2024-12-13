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
  const [submittedValue, setSubmittedValue] = useState('');
  const handleBlur = (e) => {
    setSubmittedValue(e.target.value); // Save the value when focus is lost
  };
  useEffect(()=>{
    setGlobalVariable((g)=>g+submittedValue+"\t")
  },[submittedValue])
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
      <input value={line} onChange={(e)=>{setLine(e.target.value)}} onBlur={handleBlur} style={{
        width: '100px',
      }}/> )
    </div>
  );
}

export default Cmp;
