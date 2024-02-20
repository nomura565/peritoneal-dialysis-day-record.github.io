import React, { useState, useImperativeHandle, forwardRef, useCallback } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from "@mui/material";
import { parseStringToDate, formatDateToYM, addDayStringDateToString, parseStringToYM } from "./FormatDate";

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAtom } from 'jotai';
import { 
  temporaryDrawerAtom 
} from './Atoms';
import {LS_KEY} from "./Const";
  

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer

/** メッセージ */
const MESSAGE = {
  CLOSE_BUTTON: "閉じる",
}

const BigCalendar = (props, ref) => {
  //YM
  let currentDateYm = formatDateToYM(props.fromDate);
  //YYYYMMDD
  const [dateYmd, setDateYmd] = useState(parseStringToDate(props.fromDate));
  //席ID
  let tmpCalendarList = [];
  const [calendarList, setCalendarList] = useState(tmpCalendarList);

  const [temporaryDrawer, setTemporaryDrawer] = useAtom(temporaryDrawerAtom);

  //日付変更時コールバック
  const onNavigate = useCallback((newDate) => {
    getCalendarList(newDate);
  }, [currentDateYm]);

  //呼び出し元からの参照
  useImperativeHandle(ref, () => ({
    //カレンダー一覧を取得する
    onClickCalendarButton: (_fromDate) => {
      getCalendarList(_fromDate);
    },
  }))

  /** カレンダー一覧を取得する。 */
  const getCalendarList = (_fromDate) => {
    setCalendarList([]);
    let _calendarList = [];

    const yyyymm = formatDateToYM(_fromDate);
    let outputDay = yyyymm + "/01";
    let monthFlg = true;
    while(monthFlg){
      //console.log(outputDay);
      const key = LS_KEY + outputDay;
      let temporaryDrawerLS = JSON.parse(localStorage.getItem(key + "_temporaryDrawer"));

      if(temporaryDrawerLS !== null){
        let sozyosuiryo = temporaryDrawerLS.sozyosuiryo;
        if(sozyosuiryo === ""){
          sozyosuiryo = "0";
        }
        let _addCalendar = {
          title: sozyosuiryo + "g",
          start: parseStringToDate(outputDay),
          end: parseStringToDate(outputDay),
          allDay: true
        }
        _calendarList.push(_addCalendar);
    }

      outputDay = addDayStringDateToString(outputDay, 1);
      let outputDayYyyymm = parseStringToYM(outputDay);
      if(yyyymm !== outputDayYyyymm) monthFlg = false;
    }

    setCalendarList(_calendarList);

  }

  return (
    <div className="myCustomHeight">
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            maxWidth: '600px',
            boxShadow: 'none',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" className='big-calendar-title'>
          {"1日の総除水量"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Calendar
              localizer={localizer}
              views={['month']}
              events={calendarList}
              startAccessor="start"
              endAccessor="end"
              style={{ width: 500, height: 400 }}
              onNavigate={onNavigate}
              defaultDate={dateYmd}
              Date={dateYmd}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} autoFocus>
            {MESSAGE.CLOSE_BUTTON}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default forwardRef(BigCalendar);