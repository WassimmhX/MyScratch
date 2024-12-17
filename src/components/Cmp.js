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
    if(submittedValue!=''){
      setGlobalVariable((g)=>g+'print('+submittedValue+')')
    }
  },[submittedValue])
  return (
    <div ref={drag} className="Board"
    style={{
      opacity: isDragging ? 0.5 : 1,
      height: '50px',
      backgroundColor: 'pink',
      width: '280px',
      border: '2px solid black',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingTop:"10px"
    }}>    
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            print(
          </div>

          <input value={line} onChange={(e)=>{setLine(e.target.value)}} onBlur={handleBlur} className={'input'} style={{width:"180px"}}/> 

          <div
            style={{
              color: 'white',
              position: 'relative',
              padding: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            )
          </div>
        </div>
    </div>
  );
}

export default Cmp;
