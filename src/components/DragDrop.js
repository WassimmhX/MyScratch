import React, { useContext, useEffect, useRef, useState } from 'react';
import Cmp from './Cmp';
import '../App.css';
import Start from './Start';
import Operation from './Operation';
import BlockIf from './BlockIf';
import BlockIfElse from './BlockIfElse';
import BlockFor from './BlockFor';
import Variable from './Variable';
import axios from 'axios';
import { GlobalContext } from '../GlobalProvider';
import Affect from './Affect';

const filePath="../src/result.txt"
const pythonPath="../src/main.py"

function DragDrop() {
  const [fileContent,setFileContent] = useState("")
  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
  const boxRef = useRef(null);
  const containerRef = useRef(null);
  const isClicked = useRef(false);
  
  const coords = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });

  
  const btnSave = async () => {
    try {
      const response = await axios.post('http://localhost:5000/update-file', {
        filePath,
        newContent:globalVariable,
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error fetching file:', error);
      setFileContent('Error reading file. Please check the path.');
    }
  };
  const compile = async () => {
    try {
      const response = await axios.post('http://localhost:5000/run-python', { filePath:pythonPath });
      console.log(response.data.output);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    if (!boxRef.current || !containerRef.current) return;
    const box = boxRef.current;
    const container = containerRef.current;
    const onMouseDown = (e) => {
      isClicked.current = true;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
    };
    const onMouseUp = (e) => {
      isClicked.current = false;
      coords.current.lastX = box.offsetLeft;
      coords.current.lastY = box.offsetTop;
    };
    const onMouseMove = (e) => {
      if (!isClicked.current) return;
      const nextX = e.clientX - coords.current.startX + coords.current.lastX;
      const nextY = e.clientY - coords.current.startY + coords.current.lastY;
      box.style.top = nextY + 'px';
      box.style.left = nextX + 'px';
    };
    box.addEventListener('mousedown', onMouseDown);
    box.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    const cleanup = () => {
      box.removeEventListener('mousedown', onMouseDown);
      box.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
    };
    return cleanup;
  }, []);


  return (
    <main>
      <div className="container" ref={containerRef}>
        <div ref={boxRef} className="box" >
          <Start color="red" />
        </div>
      </div>
      <div
        className="Pictures"
        style={{
          marginTop: '20px',
          gap: '20px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Cmp />
        <BlockIf help={0} />
        <BlockIfElse help={0} />
        <BlockFor/>
        <Operation/>
        <Variable/>
        <Affect/>
        <button onClick={btnSave}>Save</button>
        <button onClick={compile}>Compile</button>
      </div>
      <div style={{padding:'10px',}}>
        {}
      </div>
    </main>
  );
}

export default DragDrop;
