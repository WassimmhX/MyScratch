import React, { useContext, useEffect, useState } from 'react'
import BlockIf from './BlockIf';
import BlockIfElse from './BlockIfElse';
import Cmp from './Cmp';
import { useDrag, useDrop } from 'react-dnd';
import { GlobalContext } from '../GlobalProvider';

function BlockFor({nbIfStart, nbIfElseStart, nbImgStart, nbForStart}) {
  const alphabets = Array.from({ length: 26}, (_, i) => String.fromCharCode(65 + i));

    const [boardFor, setBoardFor] = useState([]);
    const [nbFor, setNbFor] = useState(0);
    const [nbIf, setNbIf] = useState(0);
    const [nbImg, setNbImg] = useState(0);
    const [nbIfElse, setNbIfElse] = useState(0);
    const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
    const[n1,setN1]=useState('')
    const[n2,setN2]=useState('')
    const[boardHeightFor, setBoardHeightFor] = useState(29)
    const [{ isOver: isOverFor }, dropFor] = useDrop(() => ({
        accept: ['image','BlockIf','BlockFor','BlockIfElse'],
        drop: (item) => addToBoard(item),
        collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    }));
    const addToBoard = (item) => {
        setGlobalVariable((g)=>g+'do:\n')
    if(item.type==='BlockIf'){
        setGlobalVariable((g)=>g+'\tif')
        setNbIf((nb) => nb + 1);
        nbIfStart()
    }
    else if(item.type==='BlockIfElse'){
        setGlobalVariable((g)=>g+'if\n')
        setNbIfElse((nb) => nb + 1);
        nbIfElseStart()
    }
    else if(item.type==='BlockFor'){
        setGlobalVariable((g)=>g+'for\n')
        setNbFor((nb) => nb + 1);
        nbForStart()
    }
    else if(item.type==='image'){
        setGlobalVariable((g)=>g+'print:\n')
        setNbImg((nb) => nb + 1);
        nbImgStart()
    }
        setBoardFor((prevBoard) => [...prevBoard, item]);
    }
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'BlockFor',
        item: { type: 'BlockFor'},
        collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
        }),
    }));
    useEffect(()=>{
        if(nbIf+nbIfElse+nbFor+nbImg!=0){
        setBoardHeightFor(nbIf*120+nbIfElse*180+nbFor*102+nbImg*29);
        }
    },[nbIf,nbIfElse,nbFor,nbImg])
    useEffect(()=>{
        if(n1!=""){
        setGlobalVariable((g)=>g+" ("+n1+",")
        }
        },[n1])
    useEffect(()=>{
        if(n2!=""){
        setGlobalVariable((g)=>g+n2+")")
        }
    },[n2])
      return (
        <div
          ref={drag}
          className="Board"
          style={{
            opacity: isDragging ? 0.5 : 1,
            height: `${ boardHeightFor + 50}px`,
            backgroundColor: "blue",
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
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              for {
                <select
                className={'select'}
              >
                {
                  alphabets.map(lettre => (
                    <option key={lettre} value={lettre}>{lettre}</option>
                  ))
                }
                
              </select>
              } in {'('}
            </div>
  
            <div
              style={{
                height: `${29}px`,
                width: '30px',
                border: '2px dashed black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
            >
              <input
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                }}
                onChange={(e)=>{setN1(e.target.value)}}

              />
            </div>
  
            <div
              style={{
                color: 'white',
                position: 'relative',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              ,
            </div>
            <div
              style={{
                height: `${29}px`,
                width: '30px',
                border: '2px dashed black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
            >
              <input
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                }}
                onChange={(e)=>{setN2(e.target.value)}}
              />
            </div>
            <div
              style={{
                color: 'white',
                position: 'relative',
                padding: '1px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {')'} do :
            </div>
          </div>
  
          <div
            style={{
              height: `${boardHeightFor}px`,
              backgroundColor: isOverFor ? 'lightblue' : 'white',
              width: '170px',
              border: '2px dashed black',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {boardFor.map((item, index) =>
            item.type==="BlockIf"? (<BlockIf key={index} />)
            : item.type==="BlockIfElse"?  <BlockIfElse key={index}/>
            : item.type==="BlockFor"?  <BlockFor key={index}/>
            : <Cmp key={index} text={item.text} id={item.id} type="image" />
            )}
            <div ref={dropFor} style={{height:"29px",width:"150px"}}></div>
          </div>
          
        </div>
      );
}

export default BlockFor