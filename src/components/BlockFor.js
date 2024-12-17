import React, { useContext, useEffect, useState } from 'react';
import BlockIf from './BlockIf';
import BlockIfElse from './BlockIfElse';
import Cmp from './Cmp';
import { useDrag, useDrop } from 'react-dnd';
import { GlobalContext } from '../GlobalProvider';
import Variable from './Variable';

function BlockFor({ nbIfStart, nbIfElseStart, nbImgStart, nbForStart, nbVarStart }) {
  const alphabets = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const [iterator, setIterator] = useState('');
  const [boardFor, setBoardFor] = useState([]);
  const [nbFor, setNbFor] = useState(0);
  const [nbIf, setNbIf] = useState(0);
  const [nbImg, setNbImg] = useState(0);
  const [nbIfElse, setNbIfElse] = useState(0);
  const [nbVar, setNbVar] = useState(0);
  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
  const [n1, setN1] = useState('');
  const [n2, setN2] = useState('');
  const [submittedValue1, setSubmittedValue1] = useState('');
  const handleBlur1 = (e) => {
    setSubmittedValue1(e.target.value); // Save the value when focus is lost
  };
  const [submittedValue2, setSubmittedValue2] = useState('');
  const handleBlur2 = (e) => {
    setSubmittedValue2(e.target.value); // Save the value when focus is lost
  };
  const [boardHeightFor, setBoardHeightFor] = useState(29);
  const [{ isOver: isOverFor }, dropFor] = useDrop(() => ({
    accept: ['image', 'BlockIf', 'BlockFor', 'BlockIfElse', 'variable'],
    drop: (item) => addToBoard(item),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));
  const addToBoard = (item) => {
    if (item.type === 'BlockIf') {
      setGlobalVariable((g) => g + '\n\tif');
      setNbIf((nb) => nb + 1);
      nbIfStart();
    } else if (item.type === 'BlockIfElse') {
      setGlobalVariable((g) => g + '\n\tif');
      setNbIfElse((nb) => nb + 1);
      nbIfElseStart();
    } else if (item.type === 'BlockFor') {
      setGlobalVariable((g) => g + '\n\for');
      setNbFor((nb) => nb + 1);
      nbForStart();
    } else if (item.type === 'image') {
      setNbImg((nb) => nb + 1);
      nbImgStart();
    }else if (item.type === 'variable') {
      setNbVar((nb) => nb + 1);
      nbVarStart();
    }
    setBoardFor((prevBoard) => [...prevBoard, item]);
  };
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BlockFor',
    item: { type: 'BlockFor' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  useEffect(() => {
    if (nbIf + nbIfElse + nbFor + nbImg + nbVar !== 0) {
      setBoardHeightFor(nbIf * 120 + nbIfElse * 180 + nbFor * 105 + nbImg * 63 + nbVar * 80);
    }
  }, [nbIf, nbIfElse, nbFor, nbImg, nbVar]);
  useEffect(() => {
    if (n1 != '') {
      setGlobalVariable((g) => g + ' (' + submittedValue1 + ',');
    }
  }, [submittedValue1]);
  useEffect(() => {
    if (n2 != '') {
      setGlobalVariable((g) => g + submittedValue2 + ')');
    }
  }, [submittedValue2]);
  useEffect(() => {
    if (iterator != '') {
      setGlobalVariable((g) => g +  iterator + ' in');
    }
  }, [iterator]);
  useEffect(() => {
      if (nbImg + nbVar + nbIfElse + nbIf + nbFor === 1) {
        setGlobalVariable((g) => g + 'do:\n\t');
      }
      }, [nbImg, nbVar, nbIfElse, nbIf, nbFor]);
  return (
    <div
      ref={drag}
      className="Board"
      style={{
        opacity: isDragging ? 0.5 : 1,
        height: `${boardHeightFor + 50}px`,
        backgroundColor: 'SlateBlue',
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
          for{' '}
          {
            <select
              className={'select'}
              value={iterator}
              onChange={(e) => setIterator(e.target.value)}
            >
              <option value={''}></option>
              {alphabets.map((lettre) => (
                <option key={lettre} value={lettre}>
                  {lettre}
                </option>
              ))}
            </select>
          }{' '}
          in {'('}
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
            onChange={(e) => {
              setN1(e.target.value);
            }}
            onBlur={handleBlur1}
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
            onChange={(e) => {
              setN2(e.target.value);
            }}
            onBlur={handleBlur2}
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
          item.type === 'BlockIf' ? (<BlockIf key={index} nbImgStart={nbImgStart} nbVarStart={nbVarStart}/>) 
            : item.type === 'BlockIfElse' ? (<BlockIfElse key={index} />) 
            : item.type === 'BlockFor' ? (<BlockFor key={index} />) 
            : item.type === 'variable' ? (<Variable key={index} />) 
            : <Cmp key={index} text={item.text} id={item.id} type="image" />
          
        )}
        <div ref={dropFor} style={{ height: '29px', width: '150px',color:'purple'}}>'</div>
      </div>
    </div>
  );
}

export default BlockFor;
