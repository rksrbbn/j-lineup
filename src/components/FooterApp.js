import React from 'react';
import { Typography, Link } from '@mui/material';

function FooterApp() {
  return (
    <footer style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '2rem 0', marginTop: 'auto' }}>
      <Typography variant="caption" style={{ textAlign: 'center', fontSize: '12px', color: '#db5198' }}>
        Made With ❤️ by <Link href="https://twitter.com/rksrbbn" target="_blank" rel="noopener noreferrer">KX</Link>
      </Typography>
    </footer>
  );
}

export default FooterApp;

