import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SaveIcon from '@mui/icons-material/Save';
import Paper from '@mui/material/Paper';
import Inputs from './components/Inputs';
import TemporaryDrawer from './components/TemporaryDrawer';
import {formatDateToString, addDayStringDateToDate, addDayStringDateToString} from "./components/FormatDate";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BigCalendar from './components/BigCalendar';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import { Button } from "@mui/material";
import dayjs from 'dayjs';

import {DATE_FORMAT, LS_KEY, convertNumber, calcDiffMinutes} from "./components/Const";

import { useAtom } from 'jotai'
import { 
  recordDateAtom
  , inputsListAtomsAtom
  , temporaryDrawerAtom
  , tabValueAtom
  , initInputs
  , initTemporaryDrawer
  , initDays } from './components/Atoms'

const Today = new Date();

function App() {
  const [recordDate, setRecordDate] = useAtom(recordDateAtom);

  const [inputsList, setInputsList] = useAtom(inputsListAtomsAtom);

  //カレンダーオープンフラグ
  const [calendarOpen, setCalendarOpen] = useState(false);
  const bigCalendarRef = useRef();

  const [open, setOpen] = useState(false);

  const [inputs0, setInputs0] = useAtom(inputsList[0]);
  const [inputs1, setInputs1] = useAtom(inputsList[1]);
  const [inputs2, setInputs2] = useAtom(inputsList[2]);
  const [inputs3, setInputs3] = useAtom(inputsList[3]);
  const [inputs4, setInputs4] = useAtom(inputsList[4]);

  const [temporaryDrawer, setTemporaryDrawer] = useAtom(temporaryDrawerAtom);

  /** 一日の総除水量を計算してセットする */
  const calculateTotal = () => {
    const zyosuiryo0 = convertNumber(inputs0.zyosuiryo);
    const zyosuiryo1 = convertNumber(inputs1.zyosuiryo);
    const zyosuiryo2 = convertNumber(inputs2.zyosuiryo);
    const zyosuiryo3 = convertNumber(inputs3.zyosuiryo);
    const zyosuiryo4 = convertNumber(inputs4.zyosuiryo);
    const totalItemCount = zyosuiryo0 + zyosuiryo1 + zyosuiryo2 + zyosuiryo3 + zyosuiryo4;
    setTemporaryDrawer((oldValue) => ({ ...oldValue, sozyosuiryo: totalItemCount }));
    return totalItemCount;
  };

  /** 日付変更イベント */
  const dateChange = (selectedDate) => {
    //const formatDate = formatDateToString(selectedDate);
    setRecordDate(selectedDate);
    restorationFromStarage(formatDateToString(selectedDate));
  }

  const [tabValue, setTabValue] = useState(tabValueAtom);

  /** 指定のタブの排液時間を取得する */
  const getHaiekizikanFromCertainTab = (certainTabValue) => {
    let minutes = 0;
    switch(certainTabValue){
      case 0:
        minutes = calcDiffMinutes(inputs0.choryuzikanTo, inputs0.choryuzikanFrom);
        break;
      case 1:
        minutes = calcDiffMinutes(inputs1.choryuzikanTo, inputs1.choryuzikanFrom);
        break;
      case 2:
        minutes = calcDiffMinutes(inputs2.choryuzikanTo, inputs2.choryuzikanFrom);
        break;
      case 3:
        minutes = calcDiffMinutes(inputs3.choryuzikanTo, inputs3.choryuzikanFrom);
        break;
      case 4:
        //console.log("choryuzikanTo:"+inputs4.choryuzikanTo);
        //console.log("choryuzikanFrom:"+inputs4.choryuzikanFrom);
        minutes = calcDiffMinutes(inputs4.choryuzikanTo, inputs4.choryuzikanFrom);
        //console.log("minutes:"+minutes);
        break;
    }
    return minutes;
  }

  /** 現在のタブの排液時間から次のタブの排液時間を計算しセットする */
  const setHaiekizikanForCurrentTab = () => {
    //なぜかtabValueは文字列で保存されてるので数値に変換
    const _tabValue = Number(tabValue);
    const minutes = getHaiekizikanFromCertainTab(_tabValue);
    calcHaiekizikan(_tabValue, minutes);
  }

  /** タブ変更イベント */
  const tabChange = (event, newValue) => {
    setHaiekizikanForCurrentTab();
    setTabValue(newValue);
  };

  const [bottomNavValue, setBottomNavValue] = useState('save');

  const bottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
  };

  /** 排液時間が初期値かの判定 */
  const isInitHaiekizikan = (_checkVal) => {
    return (_checkVal === "" || _checkVal === "0" || _checkVal === 0)
  }

  /** 保存された最大のタブ数取得 */
  const getMaxSavedTab = () => {
    //貯留時間To（排液時間）が初期値でないものを保存されたMAXのタブと判断する
    let maxSavedTab = 0;
    if(!isInitDays(inputs1.choryuzikanTo)){
      maxSavedTab = 1;
    }
    if(!isInitDays(inputs2.choryuzikanTo)){
      maxSavedTab = 2;
    }
    if(!isInitDays(inputs3.choryuzikanTo)){
      maxSavedTab = 3;
    }
    if(!isInitDays(inputs4.choryuzikanTo)){
      //console.log("recordDate"+dayjs(recordDate).format('YYYY-MM-DD 12:00:00'));
      //console.log("recordDate"+dayjs(inputs4.choryuzikanTo).format('YYYY-MM-DD HH:mm:ss'));
      maxSavedTab = 4;
    }
    return maxSavedTab;
  }

  /** 保存イベント */
  const executeSave = () => {
    setHaiekizikanForCurrentTab();
    const sozyosuiryo = calculateTotal();
    const key = LS_KEY + formatDateToString(recordDate);
    //Usestateの更新が遅いので最新の値で上書き保存
    let _temporaryDrawer = temporaryDrawer;
    _temporaryDrawer.sozyosuiryo = sozyosuiryo;
    localStorage.setItem(key + "_temporaryDrawer", JSON.stringify(_temporaryDrawer));

    localStorage.setItem(key + "_inputs0", JSON.stringify(inputs0));
    localStorage.setItem(key + "_inputs1", JSON.stringify(inputs1));
    localStorage.setItem(key + "_inputs2", JSON.stringify(inputs2));
    localStorage.setItem(key + "_inputs3", JSON.stringify(inputs3));
    localStorage.setItem(key + "_inputs4", JSON.stringify(inputs4));

    localStorage.setItem(key + "_tabValue", JSON.stringify(tabValue));

    setOpen(true);

    executeSaveNextDay();

    setTimeout(() => {
      setOpen(false);
    }, "1500");
  };

  /** 次の日の排液時間を保存する */
  const executeSaveNextDay = () => {
    
    const maxSavedTab = getMaxSavedTab();
    console.log("getMaxSavedTab:"+maxSavedTab);

    const key = LS_KEY + addDayStringDateToString(formatDateToString(recordDate), 1);
    const minutes = getHaiekizikanFromCertainTab(maxSavedTab);
    console.log("minutes:"+minutes);
    let inputs0LS = JSON.parse(localStorage.getItem(key + "_inputs0"));
    inputs0LS = (inputs0LS == null) ? initInputs : inputs0LS ;
    inputs0LS.haiekizikan = minutes;

    localStorage.setItem(key + "_inputs0", JSON.stringify(inputs0LS));
  }

  /** 日付が初期値かの判定 */
  const isInitDays = (_checkDay) => {
    if(initDays.format('YYYY-MM-DD HH:mm:ss') === dayjs(_checkDay).format('YYYY-MM-DD HH:mm:ss')){
      return true;
    }
    if(dayjs(recordDate).format('YYYY-MM-DD 12:00:00') === dayjs(_checkDay).format('YYYY-MM-DD HH:mm:ss')){
      return true;
    }

    return false;
  }

  /** 初期値をrecordDateの12時に更新する */
  const setTodayInitDay = (_inputsLS) => {
    const todayInitDay = dayjs(dayjs(recordDate).format('YYYY-MM-DD 12:00:00'));
    let _tmpInputsLS = _inputsLS;
    if(isInitDays(_tmpInputsLS.choryuzikanFrom)){
      _tmpInputsLS.choryuzikanFrom = todayInitDay;
    }
    if(isInitDays(_tmpInputsLS.choryuzikanTo)){
      _tmpInputsLS.choryuzikanTo = todayInitDay;
    }
    if(isInitDays(_tmpInputsLS.choryuzikanFrom2)){
      _tmpInputsLS.choryuzikanFrom2 = todayInitDay;
    }
    if(isInitDays(_tmpInputsLS.choryuzikanTo2)){
      _tmpInputsLS.choryuzikanTo2 = todayInitDay;
    }
    return _tmpInputsLS;
  }

  /** localStaregeから値を復元する */
  const restorationFromStarage = (_recordDate) => {
    //console.log(_recordDate);
    const key = LS_KEY + _recordDate;
    let temporaryDrawerLS = JSON.parse(localStorage.getItem(key + "_temporaryDrawer"));
    temporaryDrawerLS = (temporaryDrawerLS == null) ? initTemporaryDrawer : temporaryDrawerLS ;
    
    setTemporaryDrawer(temporaryDrawerLS);

    let inputs0LS = JSON.parse(localStorage.getItem(key + "_inputs0"));
    inputs0LS = (inputs0LS == null) ? initInputs : inputs0LS ;
    inputs0LS = setTodayInitDay(inputs0LS);
    setInputs0(inputs0LS);

    let inputs1LS = JSON.parse(localStorage.getItem(key + "_inputs1"));
    inputs1LS = (inputs1LS == null) ? initInputs : inputs1LS ;
    inputs1LS = setTodayInitDay(inputs1LS);
    setInputs1(inputs1LS);

    let inputs2LS = JSON.parse(localStorage.getItem(key + "_inputs2"));
    inputs2LS = (inputs2LS == null) ? initInputs : inputs2LS ;
    inputs2LS = setTodayInitDay(inputs2LS);
    setInputs2(inputs2LS);

    let inputs3LS = JSON.parse(localStorage.getItem(key + "_inputs3"));
    inputs3LS = (inputs3LS == null) ? initInputs : inputs3LS ;
    inputs3LS = setTodayInitDay(inputs3LS);
    setInputs3(inputs3LS);

    let inputs4LS = JSON.parse(localStorage.getItem(key + "_inputs4"));
    inputs4LS = (inputs4LS == null) ? initInputs : inputs4LS ;
    inputs4LS = setTodayInitDay(inputs4LS);
    setInputs4(inputs4LS);

    let tabValueLS = JSON.parse(localStorage.getItem(key + "_tabValue"));
    tabValueLS = (tabValueLS == null) ? '0' : tabValueLS ;
    setTabValue(tabValueLS);

  };

  /** 日付進むイベント */
  const ArrowBackClick = () => {
    console.log("ArrowBackClick");
    const prevDay = addDayStringDateToDate(formatDateToString(recordDate), -1);
    setRecordDate(prevDay);
    restorationFromStarage(formatDateToString(prevDay));
  }

  /** 日付戻るイベント */
  const ArrowForwardClick = () => {
    console.log("ArrowForwardClick");
    const nextDay = addDayStringDateToDate(formatDateToString(recordDate), 1);
    setRecordDate(nextDay);
    restorationFromStarage(formatDateToString(nextDay));
  }

  /**カレンダーオープンボタン */
  const onClickCalendarButton = () => {
    setCalendarOpen(true);
    bigCalendarRef.current.onClickCalendarButton(recordDate);
  }
  /**カレンダークローズボタン */
  const calendarClose = () => {
    setCalendarOpen(false);
  }

  /**排液時間計算 */
  const calcHaiekizikan = (tab, minutes) => {

    switch(tab){
      case 0:
        setInputs1((oldValue) => ({ ...oldValue, haiekizikan: minutes }));
        break;
      case 1:
        setInputs2((oldValue) => ({ ...oldValue, haiekizikan: minutes }));
        break;
      case 2:
        setInputs3((oldValue) => ({ ...oldValue, haiekizikan: minutes }));
        break;
      case 3:
        setInputs4((oldValue) => ({ ...oldValue, haiekizikan: minutes }));
        break;
      case 4:
        //次の日の排液時間を更新すべきだが、ここでは更新せず保存ボタン押下時に更新する
        break;
    }
  }

  useEffect(() => {
    //読み込み時
    restorationFromStarage(formatDateToString(recordDate));
  }, [])


  return (
    <div className="App">
      <TemporaryDrawer
        calculateTotal={calculateTotal}
      />
      <Button className="calendar-button" onClick={onClickCalendarButton}>
        <CalendarMonthTwoToneIcon />
      </Button>
      <BigCalendar 
        ref={bigCalendarRef}
        open={calendarOpen}
        handleClose={calendarClose}
        fromDate={formatDateToString(recordDate)}
      />
      <div className="date">
        <IconButton aria-label="prev" onClick={ArrowBackClick}>
          <ArrowBackIosIcon />
        </IconButton>
        <Datetime
          locale='ja'
          inputProps={
            {"className":"date-input",
              "readOnly":"readOnly"}
          }
          dateFormat={DATE_FORMAT}
          timeFormat={false}
          initialValue={Today}
          closeOnSelect={true}
          value={recordDate}
          onChange={selectedDate => {dateChange(selectedDate || Today)}}
        />
        <IconButton aria-label="next" onClick={ArrowForwardClick}>
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
      <Box sx={{ width: '100%', pb: 7, typography: 'body1' }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={tabChange} aria-label="lab API tabs example">
              <Tab label="1回目" value="0" />
              <Tab label="2回目" value="1" />
              <Tab label="3回目" value="2" />
              <Tab label="4回目" value="3" />
              <Tab label="5回目" value="4" />
            </TabList>
          </Box>
          <TabPanel value="0"><Inputs tab={0} inputs={inputsList[0]} calculateTotal={calculateTotal} calcHaiekizikan={calcHaiekizikan} /></TabPanel>
          <TabPanel value="1"><Inputs tab={1} inputs={inputsList[1]} calculateTotal={calculateTotal} calcHaiekizikan={calcHaiekizikan} /></TabPanel>
          <TabPanel value="2"><Inputs tab={2} inputs={inputsList[2]} calculateTotal={calculateTotal} calcHaiekizikan={calcHaiekizikan} /></TabPanel>
          <TabPanel value="3"><Inputs tab={3} inputs={inputsList[3]} calculateTotal={calculateTotal} calcHaiekizikan={calcHaiekizikan} /></TabPanel>
          <TabPanel value="4"><Inputs tab={4} inputs={inputsList[4]} calculateTotal={calculateTotal} calcHaiekizikan={calcHaiekizikan} /></TabPanel>
        </TabContext>
        <Paper sx={
            { 
              /*position: 'fixed'
              , bottom: 0
              , left: 0
              , right: 0 
              , top:'auto'*/
            }
          } elevation={3}>
          <Tooltip title="保存しました" 
            arrow 
            open={open} 
            placement="top"
            className='tooltip'
          ></Tooltip>
          <BottomNavigation 
            value={bottomNavValue} onChange={bottomNavChange}>
            <BottomNavigationAction
              label="保存"
              value="save"
              icon={<SaveIcon />}
              onClick={executeSave}
            />
          </BottomNavigation>
        </Paper>
      </Box>
      
    </div>
  );
}

export default App;
