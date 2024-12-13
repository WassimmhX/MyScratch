import React, { useEffect, useRef, useState } from 'react';
import Cmp from './Cmp';
import '../App.css';
import DropBox from './DropBox';
import Start from './Start';
import { useDrag } from 'react-dnd';
import Operation from './Operation';
import BlockIf from './BlockIf';
import BlockIfElse from './BlockIfElse';
import BlockFor from './BlockFor';
import Variable from './Variable';

const CmpList = [
  { id: 1, text: 'print' },
];

function DragDrop() {
  const boxRef = useRef(null);
  const containerRef = useRef(null);
  const isClicked = useRef(false);
  const coords = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });

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
          <Start color="red" cmpList={CmpList} />
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
      </div>
    </main>
  );
}

export default DragDrop;
