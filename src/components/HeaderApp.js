import React from 'react';

function HeaderApp() {
  return (
    <header style={{ 
        width: '100%', 
        backgroundColor: '#f50057', 
        padding: '20px 0', 
        textAlign: 'center', 
        color: 'white', 
        fontSize: '18px', // Ukuran font diubah menjadi lebih kecil
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        margin: '0 auto' // Menambahkan margin x untuk memusatkan teks lebih baik
        }}>
      JKT48 LINEUP CREATOR
    </header>
  );
}

export default HeaderApp;

