import {useEffect, useState} from 'react';
import {state}               from 'easy-data-state';

export function generateEasyDataStateHook(state, baseConfigs = {}) {
  return function(addresses, defaultValue, configs = {}, returnState) {
    configs = Object.assign({...baseConfigs}, configs);

    if(configs.asArray && !Array.isArray(defaultValue)) {
      defaultValue = [];
    } else if(configs.asObject && defaultValue?.constructor !== Object) {
      defaultValue = {};
    }

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
