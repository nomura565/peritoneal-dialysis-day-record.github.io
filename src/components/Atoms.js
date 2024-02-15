import { atom } from 'jotai'
import {formatDateToString} from "./FormatDate";
import dayjs from 'dayjs';
import { splitAtom } from 'jotai/utils'

export const INPUTS_COUNT = 5;

/* App */
export const recordDateAtom = atom(formatDateToString(new Date()));

/* Inputs */
const initDays = dayjs('2024-01-01T12:00');

export const initInputs = {
  choryuzikanFrom: initDays
  , choryuzikanTo: initDays
  , choryuzikanFrom2: initDays
  , choryuzikanTo2: initDays
  , tosekiekinodo: ''
  , haiekiryo: ''
  , chuekiryo: ''
  , zyosuiryo: ''
  , haiekizikan: ''
  , haiekikakunin: ''
};

let inputsList = [];

for (let i = 0; i < INPUTS_COUNT; i++) {
  inputsList.push(initInputs);
}

const inputsListAtom = atom(inputsList);

export const inputsListAtomsAtom = splitAtom(inputsListAtom);

/* TemporaryDrawer */
export const initTemporaryDrawer = {
  sozyosuiryo: ''
  , weight: ''
  , nyoryo: ''
  , haiben: ''
  , insuiryo: ''
  , ketsuatsu: ''
  , deguchibu: ''
  , biko: ''
};
export const temporaryDrawerAtom = atom(initTemporaryDrawer);