import React, { useContext, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd';
import Operation from './Operation';
import Cmp from './Cmp';
import BlockIf from './BlockIf';
import { GlobalContext } from '../GlobalProvider';

function BlockIfElse() {
    const [boardIf, setBoardIf] = useState([]);
    const [boardThen, setBoardThen] = useState([]);
    const [boardElse, setBoardElse] = useState([]);

    const [nbIf, setNbIf] = useState(0);
    const [nbThen, setNbThen] = useState(0);
    const [nbElse, setNbElse] = useState(0);
    const { globalVariable, setGlobalVariable } = useContext(GlobalContext);

    const [{ isOver: isOverIf }, dropIf] = useDrop(() => ({
        accept: ['operation'],
        drop: (item) => addToBoard(item, 'if'),
        collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    }));
    const [{ isOver: isOverThen }, dropThen] = useDrop(() => ({
        accept: 'image',
        drop: (item) => addToBoard(item.id, 'then'),
        collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    }));
    const [{ isOver: isOverElse }, dropElse] = useDrop(() => ({
        accept: ['image','BlockIf','BlockIfElse'],
        drop: (item) => addToBoard(item, 'else'),
        collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    }));
    
    const addToBoard = (item, boardType) => {
    if (boardType === 'if') {
        setGlobalVariable((g)=>g+'\ncondition:\n')
        setBoardIf((prevBoard) => [...prevBoard, item]);
        setNbIf((nb) => nb + 1);
    }
    else if (boardType === 'then') {
        setGlobalVariable((g)=>g+'\nthen\nprint:')
        setBoardThen((prevBoard) => [...prevBoard, item]);
        setNbThen((nb) => nb + 1);
    }
    else if (boardType === 'else') {
        setGlobalVariable((g)=>g+'\nelse\nprint:')
        setBoardElse((prevBoard) => [...prevBoard, item]);
        setNbElse((nb) => nb + 1);
    }
    }

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'BlockIfElse',
        item: { type: 'BlockIfElse'},
        collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
        }),
    }));

    const boardHeightIf = boardIf.length === 0 ? 48 : boardIf.length * 48;
    const boardHeightThen =boardThen.length === 0 ? 29 :  (boardThen.length) * 29;
    const boardHeightElse =boardElse.length === 0 ? 29 :  (boardElse.length) * 29;
    return (
        <div
            ref={drag}
            className="Board"
            style={{
            opacity: isDragging ? 0.5 : 1,
            height: `${boardHeightIf + boardHeightThen + boardHeightElse + 50}px`,
            backgroundColor: "lightgreen",
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
            {boardThen.map((picture,index) => (
                <Cmp key={index} />
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
                {boardElse.map((item,index) => (
                     item.type==="BlockIf"? (<BlockIf key={index} />)
                    :item.type==="BlockIfElse"?  <BlockIfElse key={index}/>
                    :<Cmp key={item.id} text={item.text} id={item.id} />
                ))}
            </div>
            </div>
        </div>
    );
}

export default BlockIfElse