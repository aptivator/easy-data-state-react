import {EasyDataState}             from 'easy-data-state';
import {generateEasyDataStateHook} from 'easy-data-state-react';

export const customState = new EasyDataState();
export const useCustomState = generateEasyDataStateHook(customState);
