import {EasyDataState}             from 'easy-data-state';
import {generateEasyDataStateHook} from 'easy-data-state-react';

export const state = new EasyDataState();
export const useGlobalState = generateEasyDataStateHook(state);
