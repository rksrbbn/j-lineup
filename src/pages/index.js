import { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HeaderApp from '../components/HeaderApp';
import FooterApp from '../components/FooterApp';
import { clearLineup, clearShow, clearShowSongs } from '../db';

function Pages()
{
    const navigate = useNavigate();

    useEffect(() => {
        clearLineup();
        clearShow();
        clearShowSongs();
    }, []);

    return (
        <div style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <HeaderApp />
            <Container className="App" maxWidth="sm" style={{ textAlign: 'center', marginTop: '30px' }}>
                <Typography variant='h6'>Welcome to JKT48 Lineup Creator V2</Typography>

                <div style={{ marginTop: '50px' }}>
                    <div style={{ marginBottom: '30px', cursor: 'pointer', backgroundColor: '#f50057', color: 'white', padding: '10px', borderRadius: '14px' }} onClick={() => navigate('/unit-song')}>
                        Create Unit Song Lineup
                    </div>
                    <div style={{ marginBottom: '30px', cursor: 'pointer', backgroundColor: '#f50057', color: 'white', padding: '10px', borderRadius: '14px' }} onClick={() => navigate('/show')}>
                        Create Custom Show Lineup (BETA)
                    </div>
                </div>
            </Container>
            <FooterApp />
        </div>
    )
}

export default Pages;