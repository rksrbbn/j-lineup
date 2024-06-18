import { useState, useEffect } from 'react';
import { Container, Typography, Modal, Box } from '@mui/material';
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


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <HeaderApp />
            <Container className="App" maxWidth="sm" style={{ textAlign: 'center', marginTop: '30px' }}>
                <Typography variant='h6' style={{ background: 'linear-gradient(to right, red, purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome to JKT48 Lineup Creator V2</Typography>

                <div style={{ marginTop: '50px' }}>
                    <div style={{ marginBottom: '30px', cursor: 'pointer', backgroundColor: '#f50057', color: 'white', padding: '10px', borderRadius: '14px' }} onClick={() => navigate('/unit-song')}>
                        Create Unit Song Lineup
                    </div>
                    <div style={{ marginBottom: '30px', cursor: 'pointer', backgroundColor: '#f50057', color: 'white', padding: '10px', borderRadius: '14px' }} onClick={() => navigate('/show')}>
                        Create Custom Show Lineup (BETA)
                    </div>
                    <div style={{ marginBottom: '30px', cursor: 'pointer', backgroundColor: '#f50057', color: 'white', padding: '10px', borderRadius: '14px' }} onClick={handleOpen}>
                        Information
                    </div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: {xs: '250px', md:'300px', lg:'400px'}, // Default width for smaller screens
                            height:'250px',
                            overflowY:'scroll',
                            bgcolor: 'background.paper',
                            color: '#c4317a',
                            boxShadow: 24,
                            borderRadius: '10px',
                            border: 'none', // Remove border
                            outline: 'none', // Remove outline
                            p: 4
                        }}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                [Updates]
                            </Typography>
                            <ul>
                                <li>
                                <small id="modal-modal-description" sx={{ mt: 2 }}>
                                    [18/06/2024 11:33AM] User can now choose to not display setlist image at unit song creator.
                                </small>
                                </li>
                                <li>
                                <small id="modal-modal-description" sx={{ mt: 2 }}>
                                    [18/06/2024 11:07AM] Revive Past Setlist at Unit Song Creator.
                                </small>
                                </li>
                                <li>
                                <small id="modal-modal-description" sx={{ mt: 2 }}>
                                    [17/06/2024 11:47PM] New Songs added (From B.E.L.I.E.V.E Team J & K3) 
                                </small>
                                </li>
                                <li>
                                <small id="modal-modal-description" sx={{ mt: 2 }}>
                                    [17/06/2024 3:40PM] Fixed member's alias (Lulu), thanks to @doodlyz1 for the report.
                                </small>
                                </li>
                                <li>
                                <small id="modal-modal-description" sx={{ mt: 2 }}>
                                    [17/06/2024 8:30AM] New Songs added (include unit songs, 320+ total songs) 
                                </small>
                                </li>
                            </ul>

                            <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginTop:'5px'}}>
                                [Information]
                            </Typography>
                            <small>For bugs report, advice and songs request, feel free to mention or DM me at <a href='https://x.com/rksrbbn'>here.</a></small>
                        </Box>
                    </Modal>
                    <a href="https://j-roulette.vercel.app/" target="_blank" style={{ color: 'white', textDecoration: 'none' }}>
                        <div style={{ marginBottom: '30px', cursor: 'pointer', backgroundColor: '#f50057', color: 'white', padding: '10px', borderRadius: '14px' }}>
                            J-Roulette
                        </div>
                    </a>
                </div>
            </Container>
            <FooterApp />
        </div>
    )
}

export default Pages;
