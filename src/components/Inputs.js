import React from 'react';
import { InputLabel, TextField , InputAdornment, FormControl } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useAtom } from 'jotai'
import dayjs from 'dayjs';
import {convertNumber, calcDiffMinutes} from "./Const";
import {formatDateToString} from "./FormatDate";
import { 
  recordDateAtom
} from './Atoms'

const Inputs = (props) => {
  const formSx = { m: 1 };

  const [inputs, setInputs] = useAtom(props.inputs);
  const [recordDate, setRecordDate] = useAtom(recordDateAtom);

  /* 貯留時間From（排液時間） */
  const choryuzikanFromChange = (value) => {
    setInputs((oldValue) => ({ ...oldValue, choryuzikanFrom: value }));
    props.calcHaiekizikan(props.tab, calcDiffMinutes(inputs.choryuzikanTo ,value));
  };

  /* 貯留時間To（排液時間） */
  const choryuzikanToChange = (value) => {
    //console.log(value);
    setInputs((oldValue) => ({ ...oldValue, choryuzikanTo: value }));
    props.calcHaiekizikan(props.tab, calcDiffMinutes(value, inputs.choryuzikanFrom));
  };

  /* 貯留時間From（注液時間） */
  const choryuzikanFrom2Change = (value) => {
    setInputs((oldValue) => ({ ...oldValue, choryuzikanFrom2: value }));
  };

  /* 貯留時間To（注液時間） */
  const choryuzikanTo2Change = (value) => {
    setInputs((oldValue) => ({ ...oldValue, choryuzikanTo2: value }));
  };

  /* 透析液濃度 */
  const tosekiekinodoChange = (event) => {
    setInputs((oldValue) => ({ ...oldValue, tosekiekinodo: event.target.value }));
  };

  /* 排液量 */
  const haiekiryoChange = (event) => {
    setInputs((oldValue) => ({ ...oldValue, haiekiryo: event.target.value }));
    zyosuiCalc(event.target.value, inputs.chuekiryo);
  };

  /* 注液量 */
  const chuekiryoChange = (event) => {
    setInputs((oldValue) => ({ ...oldValue, chuekiryo: event.target.value }));
    zyosuiCalc(inputs.haiekiryo, event.target.value);
  };

  /* 除水量 */
  const zyosuiryoChange = (event) => {
    //setInputs((oldValue) => ({ ...oldValue, zyosuiryo: event.target.value }));
    props.calculateTotal();
  };

  /* 排液時間 */
  const haiekizikanChange = (event) => {
    setInputs((oldValue) => ({ ...oldValue, haiekizikan: event.target.value }));
  };

  /* 排液の確認 */
  const haiekikakuninChange = (event) => {
    setInputs((oldValue) => ({ ...oldValue, haiekikakunin: event.target.value }));
  };

  const getRecordDateNowTime = () => {
    const nowTime = dayjs(new Date()).format('HH:mm:ss');
    //console.log(nowTime);
    //console.log(recordDate);
    return dayjs(formatDateToString(recordDate) + " " + nowTime);
  }

  /* 現在時間をセット */
  const choryuzikanFromOpen = () => {
    setInputs((oldValue) => ({ ...oldValue, choryuzikanFrom: getRecordDateNowTime() }));
  };
  const choryuzikanToOpen = () => {
    setInputs((oldValue) => ({ ...oldValue, choryuzikanTo: getRecordDateNowTime() }));
  };
  const choryuzikanFrom2Open = () => {
    setInputs((oldValue) => ({ ...oldValue, choryuzikanFrom2: getRecordDateNowTime() }));
  };
  const choryuzikanTo2Open = () => {
    setInputs((oldValue) => ({ ...oldValue, choryuzikanTo2: getRecordDateNowTime() }));
  };

  /* 除水量の計算 */
  const zyosuiCalc = (_haiekiryo, _chuekiryo) => {
    const _convHaiekiryo = convertNumber(_haiekiryo);
    const _convChuekiryo = convertNumber(_chuekiryo);
    const _total = _convHaiekiryo - _convChuekiryo;
    setInputs((oldValue) => ({ ...oldValue, zyosuiryo: _total }));
    props.calculateTotal();
  };
  
  return (
    <div>
      <div className='date-picker-area'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['TimePicker']}>
          <TimePicker 
          label="排液時間"
          value={inputs.choryuzikanFrom}
          defaultValue={inputs.choryuzikanFrom}
          onChange={choryuzikanFromChange}
          className='date-picker'
          onOpen={choryuzikanFromOpen}
          />
        </DemoContainer>
      </LocalizationProvider>
      ～
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['TimePicker']}>
          <TimePicker 
          label="排液時間"
          value={inputs.choryuzikanTo}
          defaultValue={inputs.choryuzikanTo}
          onChange={choryuzikanToChange}
          className='date-picker'
          onOpen={choryuzikanToOpen}
          />
        </DemoContainer>
      </LocalizationProvider>
      </div>

      <div className='date-picker-area'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['TimePicker']}>
          <TimePicker 
          label="注液時間"
          value={inputs.choryuzikanFrom2}
          defaultValue={inputs.choryuzikanFrom2}
          onChange={choryuzikanFrom2Change}
          className='date-picker'
          onOpen={choryuzikanFrom2Open}
          />
        </DemoContainer>
      </LocalizationProvider>
      ～
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['TimePicker']}>
          <TimePicker 
          label="注液時間"
          value={inputs.choryuzikanTo2}
          defaultValue={inputs.choryuzikanTo2}
          onChange={choryuzikanTo2Change}
          className='date-picker'
          onOpen={choryuzikanTo2Open}
          />
        </DemoContainer>
      </LocalizationProvider>
      </div>
      <FormControl fullWidth sx={formSx}>
        <InputLabel id="select-tosekiekinodo-label">透析液濃度</InputLabel>
        <Select
          labelId="select-tosekiekinodo-label"
          id="select-tosekiekinodo"
          value={inputs.tosekiekinodo}
          label="透析液濃度"
          onChange={tosekiekinodoChange}
        >
          <MenuItem value={10}>レ1.5</MenuItem>
          <MenuItem value={20}>レ2.5</MenuItem>
          <MenuItem value={30}>レ4.25</MenuItem>
          <MenuItem value={40}>ダ1.5</MenuItem>
          <MenuItem value={50}>ダ2.5</MenuItem>
          <MenuItem value={60}>ダ4.25</MenuItem>
          <MenuItem value={70}>エ</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={formSx}>
        <TextField 
          id="input-haiekiryo"
          InputProps={{
            endAdornment:<InputAdornment position="end">g</InputAdornment>
          }}
          aria-describedby="outlined-weight-helper-text"
          label="排液量"
          value={inputs.haiekiryo}
          onChange={haiekiryoChange}
          type="number"
        />
      </FormControl>
      <FormControl fullWidth sx={formSx}>
        <TextField 
          id="input-chuekiryo"
          InputProps={{
            endAdornment:<InputAdornment position="end">g</InputAdornment>
          }}
          aria-describedby="outlined-weight-helper-text"
          label="注液量"
          value={inputs.chuekiryo}
          onChange={chuekiryoChange}
          type="number"
        />
      </FormControl>
      <FormControl fullWidth sx={formSx}>
        <TextField 
          id="input-zyosuiryo"
          InputProps={{
            endAdornment:<InputAdornment position="end">g</InputAdornment>
            , readOnly: true,
          }}
          aria-describedby="outlined-weight-helper-text"
          label="除水量"
          value={inputs.zyosuiryo}
          onChange={zyosuiryoChange}
          type="number"
        />
      </FormControl>
      <FormControl fullWidth sx={formSx}>
        <TextField 
          id="input-haiekizikan"
          InputProps={{
            endAdornment:<InputAdornment position="end">分</InputAdornment>
          }}
          aria-describedby="outlined-weight-helper-text"
          label="排液時間"
          value={inputs.haiekizikan}
          onChange={haiekizikanChange}
          type="number"
        />
      </FormControl>
      <FormControl fullWidth sx={formSx}>
        <InputLabel id="select-haiekikakunin-label">排液の確認</InputLabel>
        <Select
          labelId="select-haiekikakunin-label"
          id="select-haiekikakunin"
          value={inputs.haiekikakunin}
          label="排液の確認"
          onChange={haiekikakuninChange}
        >
          <MenuItem value={10}>正常</MenuItem>
          <MenuItem value={20}>フィブリン</MenuItem>
          <MenuItem value={30}>混濁</MenuItem>
          <MenuItem value={40}>他</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default Inputs;