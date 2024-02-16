import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import { TextField , InputAdornment, FormControl, InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useAtom } from 'jotai'
import { temporaryDrawerAtom } from './Atoms'

const TemporaryDrawer = (props) => {
  const [temporaryDrawer, setTemporaryDrawer] = useAtom(temporaryDrawerAtom);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const formSx = { m: 1, width:'95%' };

  /* 1日の総除水量 */
  const sozyosuiryoChange = (event) => {
    setTemporaryDrawer((oldValue) => ({ ...oldValue, sozyosuiryo: event.target.value }));
  };

  /* 体重 */
  const weightChange = (event) => {
    setTemporaryDrawer((oldValue) => ({ ...oldValue, weight: event.target.value }));
  };

  /* 尿量 */
  const nyoryoChange = (event) => {
    setTemporaryDrawer((oldValue) => ({ ...oldValue, nyoryo: event.target.value }));
  };

  /* 排便 */
  const haibenChange = (event) => {
    setTemporaryDrawer((oldValue) => ({ ...oldValue, haiben: event.target.value }));
  };

  /* 飲水量 */
  const insuiryoChange = (event) => {
    setTemporaryDrawer((oldValue) => ({ ...oldValue, insuiryo: event.target.value }));
  };

  /* 血圧 */
  const ketsuatsuChange = (event) => {
    setTemporaryDrawer((oldValue) => ({ ...oldValue, ketsuatsu: event.target.value }));
  };

  /* 出口部の状態 */
  const deguchibuChange = (event) => {
    setTemporaryDrawer((oldValue) => ({ ...oldValue, deguchibu: event.target.value }));
  };

  /* 備考 */
  const bikoChange = (event) => {
    setTemporaryDrawer((oldValue) => ({ ...oldValue, biko: event.target.value }));
  };

  /** メニューの開閉 */
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    props.calculateTotal();
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '100%' }}
      role="presentation"
    >
      <Divider />
      <FormControl sx={formSx}>
        <TextField 
          id="input-sozyosuiryo"
          InputProps={{
            endAdornment:<InputAdornment position="end">g</InputAdornment>
          }}
          aria-describedby="outlined-weight-helper-text"
          label="1日の総除水量"
          value={temporaryDrawer.sozyosuiryo}
          onChange={sozyosuiryoChange}
          type="number"
        />
      </FormControl>
      <FormControl sx={formSx}>
        <TextField 
          id="input-weight"
          InputProps={{
            endAdornment:<InputAdornment position="end">kg</InputAdornment>
          }}
          aria-describedby="outlined-weight-helper-text"
          label="体重"
          value={temporaryDrawer.weight}
          onChange={weightChange}
          type="number"
        />
      </FormControl>
      <FormControl sx={formSx}>
        <TextField 
          id="input-nyoryo"
          InputProps={{
            endAdornment:<InputAdornment position="end">ml</InputAdornment>
          }}
          aria-describedby="outlined-weight-helper-text"
          label="尿量"
          value={temporaryDrawer.nyoryo}
          onChange={nyoryoChange}
          type="number"
        />
      </FormControl>
      <FormControl sx={formSx}>
        <TextField 
          id="input-haiben"
          InputProps={{
            endAdornment:<InputAdornment position="end">回</InputAdornment>
          }}
          aria-describedby="outlined-weight-helper-text"
          label="排便"
          value={temporaryDrawer.haiben}
          onChange={haibenChange}
          type="number"
        />
      </FormControl>
      <FormControl sx={formSx}>
        <TextField 
          id="input-insuiryo"
          InputProps={{
            endAdornment:<InputAdornment position="end">ml</InputAdornment>
          }}
          aria-describedby="outlined-weight-helper-text"
          label="飲水量"
          value={temporaryDrawer.insuiryo}
          onChange={insuiryoChange}
          type="number"
        />
      </FormControl>
      <FormControl sx={formSx}>
        <TextField 
          id="input-ketsuatsu"
          InputProps={{
            endAdornment:<InputAdornment position="end">mmHg</InputAdornment>
          }}
          aria-describedby="outlined-weight-helper-text"
          label="血圧"
          value={temporaryDrawer.ketsuatsu}
          onChange={ketsuatsuChange}
        />
      </FormControl>
      <FormControl sx={formSx}>
        <InputLabel id="select-deguchibu-label">出口部の状態</InputLabel>
        <Select
          labelId="select-deguchibu-label"
          id="select-deguchibu"
          value={temporaryDrawer.deguchibu}
          label="出口部の状態"
          onChange={deguchibuChange}
        >
          <MenuItem value={10}>正常</MenuItem>
          <MenuItem value={20}>赤み</MenuItem>
          <MenuItem value={30}>痛み</MenuItem>
          <MenuItem value={40}>腫れ</MenuItem>
          <MenuItem value={50}>かさぶた</MenuItem>
          <MenuItem value={60}>じゅくじゅく</MenuItem>
          <MenuItem value={70}>出血</MenuItem>
          <MenuItem value={80}>膿</MenuItem>
          <MenuItem value={90}>その他</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={formSx}>
        <TextField 
          id="input-biko"
          aria-describedby="outlined-weight-helper-text"
          label="備考"
          value={temporaryDrawer.biko}
          onChange={bikoChange}
          multiline
          maxRows={2}
          rows={2}
        />
      </FormControl>
    </Box>
  );

  const anchor = "top";

  return (
    <div>
      <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(anchor, true)}
            sx={{ mr: 1 }}
            size="small"
          ><MenuIcon />
      </IconButton>
      <Drawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
      >
        {list(anchor)}
      </Drawer>
    </div>
  );
}

export default TemporaryDrawer;