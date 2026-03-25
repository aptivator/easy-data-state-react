import {state, useGlobalState} from './_lib/state';

let styles = {padding: '10px', display: 'inline-block', userSelect: 'none'};

function Counter() {
  let counter = useGlobalState('counter', 0);

  return <div style = {styles}>
    <button onClick = {() => state.write('counter', (counter = 0) => ++counter)}>
      Increment {counter}
    </button>
  </div>;
}

export default function App() {
  return Array(1000).fill(0).map((v, i) => <Counter key={i} />);
}
