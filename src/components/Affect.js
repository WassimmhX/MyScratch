import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../GlobalProvider';
import { useDrag } from 'react-dnd';

export default function Affect() {
  const[selectedValue, setSelectedValue] = useState('');
    const [submittedValue1, setSubmittedValue1] = useState('');
    
    const handleBlur1 = (e) => {
      setSubmittedValue1(e.target.value); // Save the value when focus is lost
    };
    const [submittedValue2, setSubmittedValue2] = useState('');
    const handleBlur2 = (e) => {
      setSubmittedValue2(e.target.value); // Save the value when focus is lost
    };
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'affect',
      item: { type:'    affect' ,op:{selectedValue} },
       collect: (monitor) => ({
         isDragging: !!monitor.isDragging(),
       }),
    }));
  
    const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
    const[n1,setN1]=useState('')
    useEffect(()=>{
      if(submittedValue1!=""){
        setGlobalVariable((g)=>g+'('+submittedValue1)
      }
      },[submittedValue1])
    useEffect(()=>{
      if(submittedValue2!=""){
        setGlobalVariable((g)=>g+submittedValue2+") ")
      }
      },[submittedValue2])
    useEffect(()=>{
      if (n1!=""){
        setGlobalVariable((g)=>g+selectedValue)
      }
    },[selectedValue])
    return (
      <div ref={drag} className='Board' style={{padding:5, backgroundColor:'deepSkyBlue'}}>
        <input
          onChange={(e)=>setN1(e.target.value)} className={'input'} onBlur={handleBlur1}
        />
      </div>
    );
}
