import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <Typography variant="h3" component="div" align="center">
      {time.toLocaleTimeString()}
    </Typography>
  );
};

export default Clock;