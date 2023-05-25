import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function DropdownList({ label, value, setValue, allValues}) {
//   const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 50 }} style={{ marginTop: '1rem', marginBottom: '1rem'}}>
      <FormControl fullWidth size="small">
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label= {label}
          onChange={handleChange}
        >
            {
                allValues.map((item, key) =>{
                    return <MenuItem value={item.value} key={key}>{item.label}</MenuItem>
                })
            }
        </Select>
      </FormControl>
    </Box>
  );
}