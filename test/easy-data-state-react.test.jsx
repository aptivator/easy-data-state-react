import {expect}                                   from 'chai';
import {EasyDataState, state as initializedState} from 'easy-data-state';
import React                                      from 'react';
import {act}                                      from 'react';
import {createRoot}                               from 'react-dom/client';
import {generateEasyDataStateHook}                from '../src/easy-data-state-react';
import {useEasyDataState, useGlobalState}         from '../src/easy-data-state-react';
import {rootContainer}                            from './_lib/test-dom';

global.IS_REACT_ACT_ENVIRONMENT = true

describe(`EasyDataState's React Bindings`, () => {
  let root = createRoot(rootContainer);
  let state;

  beforeEach(() => {
    state = new EasyDataState();
    act(() => root.render());
  });

  describe('pre-initialized state and its hook', () => {
    it('uses already initialized state instance and its React hook', () => {
      let data = 'some data';

      function Component() {
        let data = useGlobalState('data');
        return <div id='data'>{data}</div>;
      }

      act(() => {
        root.render(<Component />);
        initializedState.write({data});
      });

      expect(document.getElementById('data').textContent).to.equal(data);
    });
  });

  describe('generateEasyDataStateHook()', () => {
    describe('generating an EasyDataState-bound hook with default settings', () => {
      let useGlobalState;

      beforeEach(() => useGlobalState = generateEasyDataStateHook(state));
  
      it('links a React component state to an EasyDataState value(s)', () => {
        function App() {
          let message = useGlobalState('message');
          return <div id='test'>{message}</div>;
        }
  
        let message = 'message';
  
        act(() => {
          root.render(<App />);
          state.write(message, message);
        });
  
        expect(document.getElementById('test').textContent).to.equal(message);
        message = 'another message';
        act(() => state.write({message}));
        expect(document.getElementById('test').textContent).to.equal(message);
      });
  
      it('accepts default value and configurations', () => {
        let address = 'message';
        let message = 'message';
  
        function App() {
          let defaultValue = {};
          let configs = {asObject: true};
          let {message} = useGlobalState(address, defaultValue, configs);
          return <div id='test'>{message}</div>;
        }
  
        act(() => {
          root.render(<App />);
          state.write(address, message);
        });
  
        expect(document.getElementById('test').textContent).to.equal(message);
      });
  
      it('can return EasyDataState instance along with subscribed-to data', () => {
        let writing = 'message';
  
        function App() {
          let returnState = true;
          let [{message}, state] = useGlobalState('message', {}, {asObject: true}, returnState);
          state.write('message', writing);
          return <div id='test'>{message}</div>;
        }
  
        act(() => root.render(<App />));
        expect(document.getElementById('test').textContent).to.equal(writing);
      });
    });

    describe('generating an EasyDataState-bound hook with custom settings', () => {
      let useGlobalStateArray; 
      let useGlobalStateObject;

      before(() => {
        useGlobalStateArray = generateEasyDataStateHook(state, {asArray: true});
        useGlobalStateObject = generateEasyDataStateHook(state, {asObject: true});
      });

      it('produces a hook configured to return values as an array', () => {
        function App() {
          let [message] = useGlobalStateArray('message');
          return <div id='test'>{message}</div>;
        }
  
        let message = 'message';
  
        act(() => {
          root.render(<App />);
          state.write(message, message);
        });

        expect(document.getElementById('test').textContent).to.equal(message);
      });

      it('generates a hook configured to output values as an object', () => {
        function App() {
          let {message} = useGlobalStateObject('message');
          return <div id='test'>{message}</div>;
        }
  
        let message = 'message';
  
        act(() => {
          root.render(<App />);
          state.write(message, message);
        });

        expect(document.getElementById('test').textContent).to.equal(message);
      });

      it('replaces a non-array default value with an empty array ([]) when results are set to be returned as an array', () => {
        let data = [];
        
        function App() {
          let result = useGlobalStateArray('message', 'default');
          data.push(result);
          return <div id='test'>{result[0]}</div>;
        }
  
        let message = 'message';
  
        act(() => {
          root.render(<App />);
          state.write(message, message);
        });

        expect(data.length).to.be.greaterThan(0);
        expect(data[0]).to.eql([]);
      });

      it('replaces a non-object default value with an empty object ({}) when results are set to be returned as an object', () => {
        let data = [];
        
        function App() {
          let result = useGlobalStateObject('message', 'default');
          data.push(result);
          return <div id='test'>{result.message}</div>;
        }
  
        let message = 'message';
  
        act(() => {
          root.render(<App />);
          state.write(message, message);
        });

        expect(data.length).to.be.greaterThan(0);
        expect(data[0]).to.eql({});
      });
    });
  });

  describe('useEasyDataState()', () => {
    it(`connects a component's state to an EasyDataState's instance`, () => {
      function App() {
        let message = useEasyDataState(state, 'message');
        return <div id='test'>{message}</div>;
      }

      let message = 'hi there';
      act(() => {
        root.render(<App />);
        state.write('message', message);
      });

      expect(document.getElementById('test').textContent).to.equal(message);
    });

    it(`accepts default value and configurations`, () => {
      function App() {
        let addresses = [['permissions.collection', ['name', 'status']], 'info'];
        let configs = {asArray: true};
        let defaultValue = [];
        let [name = '', status = '', info = ''] = useEasyDataState(state, addresses, defaultValue, configs);
        return <div id='test'>{name+status+info}</div>;
      }

      let name = 'admin';
      let status = 'valid';
      let info = 'info';

      act(() => {
        root.render(<App />);
        state.write({permissions: {collection: {name, status}}, info});
      });

      expect(document.getElementById('test').textContent).to.equal(name+status+info);
    }); 
  });
});
