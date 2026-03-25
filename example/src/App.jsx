import {customState, useCustomState} from './_lib/state';

let styles = {padding: '10px', display: 'inline-block', userSelect: 'none'};

function Counter() {
  let counter = useCustomState('counter', 0);

  return <div style = {styles}>
    <button onClick = {() => customState.write('counter', (counter = 0) => ++counter)}>
      Increment {counter}
    </button>
  </div>;
}

export default function App() {
  return Array(100).fill(0).map((v, i) => <Counter key={i} />);
}
