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
import {formatDateToString, addDayStringDateToDate} from "./components/FormatDate";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BigCalendar from './components/BigCalendar';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import { Button } from "@mui/material";

import {DATE_FORMAT, convertNumber} from "./components/Const";

import { useAtom } from 'jotai'
import { 
  recordDateAtom
  , inputsListAtomsAtom
  , temporaryDrawerAtom
  , tabValueAtom
  , initInputs
  , initTemporaryDrawer } from './components/Atoms'

const Today = new Date();

function App() {
  const [recordDate, setRecordDate] = useAtom(recordDateAtom);

  const [inputsList, setinputsList] = useAtom(inputsListAtomsAtom);

  //カレンダーオープンフラグ
  const [calendarOpen, setCalendarOpen] = useState(false);
  const bigCalendarRef = useRef();

  const [open, setOpen] = useState(false);

  const [inputs0, setinputs0] = useAtom(inputsList[0]);
  const [inputs1, setinputs1] = useAtom(inputsList[1]);
  const [inputs2, setinputs2] = useAtom(inputsList[2]);
  const [inputs3, setinputs3] = useAtom(inputsList[3]);
  const [inputs4, setinputs4] = useAtom(inputsList[4]);

  const [temporaryDrawer, setTemporaryDrawer] = useAtom(temporaryDrawerAtom);

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

  const dateChange = (selectedDate) => {
    //const formatDate = formatDateToString(selectedDate);
    setRecordDate(selectedDate);
    restorationFromStarage(formatDateToString(selectedDate));
  }

  const [tabValue, setTabValue] = useState(tabValueAtom);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [bottomNavValue, setBottomNavValue] = useState('save');

  const bottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
  };

  const executeSave = () => {
    const sozyosuiryo = calculateTotal();
    const key = "peritoneal-dialysis-day-record_" + formatDateToString(recordDate);
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

    setTimeout(() => {
      setOpen(false);
    }, "1500");
  };

  const restorationFromStarage = (_recordDate) => {
    //console.log(_recordDate);
    const key = "peritoneal-dialysis-day-record_" + _recordDate;
    let temporaryDrawerLS = JSON.parse(localStorage.getItem(key + "_temporaryDrawer"));
    temporaryDrawerLS = (temporaryDrawerLS == null) ? initTemporaryDrawer : temporaryDrawerLS ;
    setTemporaryDrawer(temporaryDrawerLS);

    let inputs0LS = JSON.parse(localStorage.getItem(key + "_inputs0"));
    inputs0LS = (inputs0LS == null) ? initInputs : inputs0LS ;
    setinputs0(inputs0LS);

    let inputs1LS = JSON.parse(localStorage.getItem(key + "_inputs1"));
    inputs1LS = (inputs1LS == null) ? initInputs : inputs1LS ;
    setinputs1(inputs1LS);

    let inputs2LS = JSON.parse(localStorage.getItem(key + "_inputs2"));
    inputs2LS = (inputs2LS == null) ? initInputs : inputs2LS ;
    setinputs2(inputs2LS);

    let inputs3LS = JSON.parse(localStorage.getItem(key + "_inputs3"));
    inputs3LS = (inputs3LS == null) ? initInputs : inputs3LS ;
    setinputs3(inputs3LS);

    let inputs4LS = JSON.parse(localStorage.getItem(key + "_inputs4"));
    inputs4LS = (inputs4LS == null) ? initInputs : inputs4LS ;
    setinputs4(inputs4LS);
    

    let tabValueLS = JSON.parse(localStorage.getItem(key + "_tabValue"));
    tabValueLS = (tabValueLS == null) ? '0' : tabValueLS ;
    setTabValue(tabValueLS);

  };

  const ArrowBackClick = () => {
    console.log("ArrowBackClick");
    const prevDay = addDayStringDateToDate(formatDateToString(recordDate), -1);
    setRecordDate(prevDay);
    restorationFromStarage(formatDateToString(prevDay));
  }

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
          <TabPanel value="0"><Inputs tab={0} inputs={inputsList[0]} calculateTotal={calculateTotal} /></TabPanel>
          <TabPanel value="1"><Inputs tab={1} inputs={inputsList[1]} calculateTotal={calculateTotal} /></TabPanel>
          <TabPanel value="2"><Inputs tab={2} inputs={inputsList[2]} calculateTotal={calculateTotal} /></TabPanel>
          <TabPanel value="3"><Inputs tab={3} inputs={inputsList[3]} calculateTotal={calculateTotal} /></TabPanel>
          <TabPanel value="4"><Inputs tab={4} inputs={inputsList[4]} calculateTotal={calculateTotal} /></TabPanel>
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
