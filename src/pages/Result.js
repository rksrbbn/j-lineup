import React, { useState, useEffect } from 'react';
import { getLineup, clearLineup } from '../db';
import { Container, Button, Avatar, Typography, Grid } from '@mui/material';
import HeaderApp from '../components/HeaderApp';
import FooterApp from '../components/FooterApp';
import { useNavigate } from 'react-router-dom';
import { members } from '../membersData';
import { setlist } from '../unitSongs';

function Result() {

    const [lineup, setLineup] = useState([]);
    const [memberList, setMemberList] = useState([]);
    const [setlistData, setSetlistData] = useState([]);
    const navigate = useNavigate();

    const backToHome = () => {
        clearLineup();
        navigate('/');
    };

    const searchMemberDataByAlias = (alias) => {
        return members.find(member => member.alias === alias);
    };

    const searchSetlist = (name) => {
        return setlist.find(setlist => setlist.name === name);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getLineup();
            setLineup(data);
            if (data.length > 0) {
              const firstData = data[0];
              const membersToArray = firstData.members.split(',');
              const memberObjects = membersToArray.map(alias => {
                  const memberData = searchMemberDataByAlias(alias.trim()); // Trim alias untuk menghapus spasi ekstra
                  return memberData ? memberData : { alias: alias, name: "Unknown", role: "Unknown" };
                });
                setMemberList(memberObjects);
                const setlistData = searchSetlist(firstData.unitSongSetlist);
                setSetlistData(setlistData);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchData();
    }, []);

    return (
        <div style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0 }}>
            <HeaderApp />
            <Container className="App" maxWidth="sm">

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '20px'}}>
                    <img src={setlistData?.picture} alt="Setlist Image" style={{ width: '100px', height: '100px' }} />
                </div>

                <Typography variant="h5" align="center">
                    {lineup?.[0]?.unitSongName}
                </Typography>
                
                <Typography variant="h6" align="center">
                    {lineup?.[0]?.unitSongSetlist}
                </Typography>
                <Grid container spacing={4} justifyContent="center" style={{ marginTop: '20px' }}>
                    {memberList.map((item) => (
                        <Grid item xs={4} sm={4} md={4} lg={3} key={item.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            {item.alias === lineup?.[0]?.center && (
                                <div style={{ position: 'absolute', top: 15, right: 0, backgroundColor: 'salmon', padding: '2px 5px', borderRadius: '5px', color: 'white', fontWeight: 'bold', zIndex: 1 }}>
                                    Center
                                </div>
                            )}
                            <Avatar
                                src={item.picture}
                                alt={item.alias}
                                style={{ width: '80px', height: '80px', marginBottom: '20px' }}
                                sx={{
                                    width: { xs: 50, sm: 60, md: 70, lg: 80 },
                                    height: { xs: 50, sm: 60, md: 70, lg: 80 }
                                }}
                            />
                            <div style={{ textAlign: 'center', width: '100%' }}>
                                <Typography variant="h5" component="div">
                                    {item.alias}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Generasi: {item.generation}
                                </Typography>
                            </div>
                        </Grid>
                    ))}
                </Grid>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                    <Button fullWidth variant='outlined' onClick={backToHome}>back</Button>
                </div>
                
            </Container>
            <FooterApp />
        </div>
    );
}

export default Result;

