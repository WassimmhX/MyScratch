import { useDrag, useDrop } from 'react-dnd';
import React, { useEffect, useState } from 'react';
import Cmp from './Cmp';
import Operation from './Operation';

function DropBox({ color = 'blue', cmpList, title, children }) {
  const [boardIf, setBoardIf] = useState([]);
  const [boardThen, setBoardThen] = useState([]);
  const [boardElse, setBoardElse] = useState([]);
  const [boardFor, setBoardFor] = useState([]);
  const [nbIf, setNbIf] = useState(0);
  const [nbThen, setNbThen] = useState(0);
  const [nbElse, setNbElse] = useState(0);
  const [nbFor, setNbFor] = useState(0);

  const [{ isOver: isOverIf }, dropIf] = useDrop(() => ({
    accept: ['operation'],
    drop: (item) => addOpToBoard(item, 'if'),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));
  const [{ isOver: isOverThen }, dropThen] = useDrop(() => ({
    accept: 'image',
    drop: (item) => addImageToBoard(item.id, 'then'),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));
  const [{ isOver: isOverElse }, dropElse] = useDrop(() => ({
    accept: 'image',
    drop: (item) => addImageToBoard(item.id, 'else'),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));
  const [{ isOver: isOverFor }, dropFor] = useDrop(() => ({
    accept: ['image', 'dropbox'],
    drop: (item) => handleDropFor(item, 'for'),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));
  const handleDropFor = (item, type) => {
    if (item.type === 'dropbox') {
      setBoardFor((prevBoard) => [...prevBoard, item]);
    }else  {
      addImageToBoard(item.id,type);
    }
    console.log(boardFor,item)
  }
  const addImageToBoard = (id, boardType) => {
    const filteredCmp = cmpList.filter((cmp) => id === cmp.id);
    if (filteredCmp.length > 0) {
      if (boardType === 'if') {
        setBoardIf((prevBoard) => [...prevBoard, filteredCmp[0]]);
        setNbIf((nb) => nb + 1);
      } else if (boardType === 'then') {
        setBoardThen((prevBoard) => [...prevBoard, filteredCmp[0]]);
        setNbThen((nb) => nb + 1);
      } else if (boardType === 'else') {
        setBoardElse((prevBoard) => [...prevBoard, filteredCmp[0]]);
        setNbElse((nb) => nb + 1);
      } else if (boardType === 'for') {
        setBoardFor((prevBoard) => [...prevBoard, filteredCmp[0]]);
        setNbFor((nb) => nb + 1);
      }
    }
  };
  const addOpToBoard = (item, boardType) => {
    if (boardType === 'if') {
      console.log(item);
      setBoardIf((prevBoard) => [...prevBoard, item]);
    }
  };

  useEffect(() => {
    if (boardIf.length > 1) {
      children();
    }
  }, [boardIf]);
  useEffect(() => {
    if (boardThen.length > 1) {
      children();
    }
  }, [boardThen]);
  useEffect(() => {
    if (boardElse.length > 1) {
      children();
    }
  }, [boardElse]);
  useEffect(() => {
    if (boardFor.length > 1) {
      children();
    }
  }, [boardFor]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'dropbox',
    item: { type: 'dropbox', color, cmpList, title },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const boardHeightIf = boardIf.length === 0 ? 48 : boardIf.length * 48;
  const boardHeightThen =boardThen.length === 0 ? 29 : 29 + (boardThen.length - 1) * 29;
  const boardHeightElse =
    boardElse.length === 0 ? 29 : 29 + (boardElse.length - 1) * 29;

  if (title === 'if') {
    return (
      <div
        ref={drag}
        className="Board"
        style={{
          opacity: isDragging ? 0.5 : 1,
          height: `${Math.max(boardHeightIf, boardHeightThen) + 50}px`,
          backgroundColor: color,
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
              padding: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            if
          </div>

          <div
            ref={dropIf}
            style={{
              height: `${boardHeightIf}px`,
              backgroundColor: isOverIf ? 'lightblue' : 'white',
              width: '156px',
              border: '2px dashed black',
              display: 'flex',
              alignItems: 'center',
              margin: '5px',
              justifyContent: 'center',
            }}
          >
            {boardIf.map((picture, index) => (
              <Operation key={index} />
            ))}
          </div>

          <div
            style={{
              color: 'white',
              position: 'relative',
              padding: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            then
          </div>
        </div>

        <div
          ref={dropThen}
          style={{
            height: `${boardHeightThen}px`,
            backgroundColor: isOverThen ? 'lightblue' : 'white',
            width: '170px',
            border: '2px dashed black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {boardThen.map((picture) => (
            <Cmp key={picture.id} text={picture.text} id={picture.id} />
          ))}
        </div>
      </div>
    );
  }
  if (title === 'ifelse') {
    return (
      <div
        ref={drag}
        className="Board"
        style={{
          opacity: isDragging ? 0.5 : 1,
          height: `${boardHeightIf + boardHeightThen + boardHeightElse + 50}px`,
          backgroundColor: color,
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
              padding: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            if
          </div>

          <div
            ref={dropIf}
            style={{
              height: `${boardHeightIf}px`,
              backgroundColor: isOverIf ? 'lightblue' : 'white',
              width: '156px',
              border: '2px dashed black',
              display: 'flex',
              alignItems: 'center',
              margin: '5px',
              justifyContent: 'center',
            }}
          >
            {boardIf.map((picture, index) => (
              <Operation key={index} />
            ))}
          </div>

          <div
            style={{
              color: 'white',
              position: 'relative',
              padding: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            then
          </div>
        </div>

        <div
          ref={dropThen}
          style={{
            height: `${boardHeightThen}px`,
            backgroundColor: isOverThen ? 'lightblue' : 'white',
            width: '170px',
            border: '2px dashed black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 5,
          }}
        >
          {boardThen.map((picture) => (
            <Cmp key={picture.id} text={picture.text} id={picture.id} />
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
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
            else
          </div>

          <div
            ref={dropElse}
            style={{
              height: `${boardHeightElse}px`,
              backgroundColor: isOverElse ? 'lightblue' : 'white',
              width: '170px',
              border: '2px dashed black',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginTop: 5,
            }}
          >
            {boardElse.map((picture) => (
              <Cmp key={picture.id} text={picture.text} id={picture.id} />
            ))}
          </div>
        </div>
      </div>
    );
  } else if (title === 'for') {
    return (
      <div
        ref={drag}
        className="Board"
        style={{
          opacity: isDragging ? 0.5 : 1,
          height: `${Math.max(29, boardHeightThen) + 50}px`,
          backgroundColor: color,
          width: '220px',
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
            for i in {'('}
          </div>

          <div
            style={{
              height: `${29}px`,
              backgroundColor: isOverIf ? 'lightblue' : 'white',
              width: '30px',
              border: '2px dashed black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
              backgroundColor: isOverIf ? 'lightblue' : 'white',
              width: '30px',
              border: '2px dashed black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
          ref={dropFor}
          style={{
            height: `${boardHeightThen}px`,
            backgroundColor: isOverThen ? 'lightblue' : 'white',
            width: '170px',
            border: '2px dashed black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {boardThen.map((item, index) =>
            item.type === 'dropbox' ? (
              <DropBox
                key={index}
                cmpList={cmpList}
                title={item.title}
                children={() => {
                  setNbFor((nbImg) => nbImg + 1);
                }}
              />
            ) : (
              <Cmp key={index} text={item.text} id={item.id} type="image" />
            )
          )}
        </div>
      </div>
    );
  }
}
export default DropBox;
