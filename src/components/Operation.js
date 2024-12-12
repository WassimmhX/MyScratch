import React, { useContext, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import '../App.css';
import { GlobalContext } from '../GlobalProvider';

function Operation() {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'operation',
    item: { type:'operation' },
     collect: (monitor) => ({
       isDragging: !!monitor.isDragging(),
     }),
  }));
  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
  const[n1,setN1]=useState('')
  const[n2,setN2]=useState('')
  useEffect(()=>{
    if(n1!=""){
      setGlobalVariable((g)=>g+n1+"\n")
    }
    },[n1])
  useEffect(()=>{
    if(n2!=""){
      setGlobalVariable((g)=>g+n2+"\n")
    }
    },[n2])
  return (
    <div ref={drag} className='Board' style={{padding:5}}>
      <input
        onChange={(e)=>setN1(e.target.value)} className={'input'}
      />
      <select
        className={'select'}
      >
        <option value="+">+</option>
        <option value="-">-</option>
        <option value="*">*</option>
        <option value="/">/</option>
        <option value=">">{'>'}</option>
        <option value=">=">{'>='}</option>
        <option value="<">{'<'}</option>
        <option value="<=">{'<='}</option>
        <option value="==">{'=='}</option>
        <option value="!=">{'!='}</option>
      </select>
      <input
        onChange={(e)=>setN2(e.target.value)} className={'input'}
      />
    </div>
  );
}

export default Operation;
