import {EasyDataState}             from '@easy-data-state/core';
import {generateEasyDataStateHook} from '../../src/easy-data-state-react';

let state = new EasyDataState();
let useGlobalState = generateEasyDataStateHook(state);
let styles = {padding: '10px', display: 'inline-block', userSelect: 'none'};

function Counter() {
  let counter = useGlobalState('counter', 0);

  return counter !== undefined ? <div style = {styles}>
    <button onClick = {() => state.write('counter', (counter = 0) => counter + 1)}>
      Increment {counter}
    </button>
  </div> : null;
}

export default function App() {
  for(var i = 0, counters = []; i < 100; i++) {
    counters.push(<Counter key={i} />);
  }

  return counters;
}
