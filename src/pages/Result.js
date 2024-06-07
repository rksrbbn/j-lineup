import React, { useState, useEffect } from 'react';
import { getLineup, clearLineup } from '../db';
import { Container, Button, Avatar, Typography, Grid, Badge } from '@mui/material';
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
        <div style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0, display: 'flex', flexDirection: 'column' }}>
            <HeaderApp />
            <Container className="App" maxWidth="sm">

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '50px'}}>
                    <img src={setlistData?.picture} alt="Setlist Image" style={{ width: '100px', height: '100px' }} />
                </div>

                <Typography variant="h5" align="center" style={{ marginBottom: '2px', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                    {lineup?.[0]?.unitSongName}
                </Typography>
                {/* <p style={{ textAlign: 'center', margin: '0', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>from</p>
                <Typography variant="h6" align="center" style={{ marginTop: '2px', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                    {lineup?.[0]?.unitSongSetlist}
                </Typography> */}
                <Grid container spacing={{ xs: 4, sm: 3, md: 2, lg: 1 }} justifyContent="center" style={{ marginTop: '20px', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                    {memberList.map((item) => (
                        <Grid item xs={4} sm={4} md={4} key={item.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            <Badge
                                badgeContent="C"
                                color="error" // Ubah warna menjadi merah
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                invisible={item.alias !== lineup?.[0]?.center}
                            >
                                <Avatar
                                    src={item.picture}
                                    alt={item.alias}
                                    style={{ marginBottom: '20px' }}
                                    sx={{
                                        width: { xs: 65, sm: 70, md: 75, lg: 80 },
                                        height: { xs: 65, sm: 70, md: 75, lg: 80 }
                                    }}
                                />
                            </Badge>
                            <div style={{ textAlign: 'center', width: '100%' }}>
                                <Typography variant="h6" component="div" style={{ fontWeight: 'lighter', color: '#db5198' }}>
                                    {item.alias}
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

