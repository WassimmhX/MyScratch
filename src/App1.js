import './App.css';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import DragDrop from './components/DragDrop';
function App1() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
      <DragDrop/>
      </div>
    </DndProvider>
    
  );
}

export default App1;