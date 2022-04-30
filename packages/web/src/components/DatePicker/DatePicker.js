import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { Box } from '@chakra-ui/react';

import 'react-datepicker/dist/react-datepicker.css';
import './date-picker.css';

export function DatePicker({ selected, onChange, isClearable = false, showPopperArrow = false, ...props }) {
  return (
    <Box className="light-theme-original" {...props}>
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        isClearable={isClearable}
        showPopperArrow={showPopperArrow}
        className="react-datapicker__input-text" //input is white by default and there is no already defined class for it so I created a new one
        {...props}
      />
    </Box>
  );
}
