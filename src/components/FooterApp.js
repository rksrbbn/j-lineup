import React from 'react';
import { Typography, Link } from '@mui/material';

function FooterApp() {
  return (
    <footer style={{ position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: '2rem' }}>
      <Typography variant="caption" style={{ textAlign: 'center', fontSize: '12px' }}>
        Made With ❤️ by <Link href="https://twitter.com/rksrbbn" target="_blank" rel="noopener noreferrer">KX</Link>
      </Typography>
    </footer>
  );
}

export default FooterApp;

