import {EasyDataState}             from '@easy-data-state/core';
import {expect}                    from 'chai';
import React                       from 'react';
import {act}                       from 'react';
import {createRoot}                from 'react-dom/client';
import {generateEasyDataStateHook} from '../src/easy-data-state-react';
import {useEasyDataState}          from '../src/easy-data-state-react';
import {rootContainer}             from './_lib/test-dom';

global.IS_REACT_ACT_ENVIRONMENT = true

describe(`EasyDataState's React Bindings`, () => {
  let root = createRoot(rootContainer);
  let state;

  beforeEach(() => {
    state = new EasyDataState();
    act(() => root.render());
  });

  describe('generateEasyDataStateHook()', () => {
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
        state.write('message', message);
      });

      expect(document.getElementById('test').textContent).to.equal(message);
      message = 'another message';
      act(() => state.write('message', message));
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
