import {useEffect, useState} from 'react';
import {state}               from 'easy-data-state';

export function generateEasyDataStateHook(state) {
  return function(addresses, defaultValue, configs = {}, returnState) {
    return useEasyDataState(state, addresses, defaultValue, configs, returnState);
  }
}

export function useEasyDataState(state, addresses, defaultValue, configs = {}, returnState = false) {
  let [value, setValue] = useState(defaultValue);
  
  useEffect(() => state.subscribe(addresses, setValue, configs), []);

  if(returnState) {
    return [value, state];
  }

  return value;
}

export const useGlobalState = generateEasyDataStateHook(state);

export {state};
