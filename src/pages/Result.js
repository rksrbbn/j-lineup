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
            if (data.length > 0) {
                setLineup(data);
                const firstData = data[0];
                const membersToArray = firstData.members.split(',');
                const memberObjects = membersToArray.map(alias => {
                  const memberData = searchMemberDataByAlias(alias.trim()); // Trim alias untuk menghapus spasi ekstra
                  return memberData ? memberData : { alias: alias, name: "Unknown", role: "Unknown" };
                });
                setMemberList(memberObjects);
                const setlistData = searchSetlist(firstData.unitSongSetlist);
                setSetlistData(setlistData);
            } else {
              navigate('/');
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
                    <img src={setlistData?.picture} alt="Setlist Image" style={{ width: '100px', height: '100px', border:'2px solid #c4317a' }} />
                </div>

                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <p style={{ color: '#c4317a', borderRadius: '2px', padding: '2px', width: '50%', margin: 'auto', fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '24px', xl: '26px' }  }}>
                        {lineup?.[0]?.unitSongName}
                    </p>
                    {lineup?.[0]?.creatorName != '' && (
                        <p style={{ color: '#c4317a', fontSize: '12px' }}>Lineup by {lineup?.[0]?.creatorName}</p>
                    )}
                </div>
                
                <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                    {memberList.map((item) => (
                        <Grid item xs={3} sm={3} md={3} lg={3} key={item.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
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
                                    style={{ marginBottom: '20px', border: '2px solid #db5198' }} // Menambahkan border
                                    sx={{
                                        width: { xs: 60, sm: 65, md: 75, lg: 80 },
                                        height: { xs: 60, sm: 65, md: 75, lg: 80 }
                                    }}
                                />
                            </Badge>
                            <div style={{ textAlign: 'center', width: '100%'}}>
                                <Typography component="div" style={{ color: '#db5198',  backgroundColor: '#fff', borderRadius: '4px', padding: '2px', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                                    {item.alias}
                                </Typography>
                            </div>
                        </Grid>
                    ))}
                </Grid>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                    <Button fullWidth variant='outlined' color='error' onClick={backToHome}>CREATE NEW LINEUP</Button>
                </div>
                
            </Container>
            <FooterApp />
        </div>
    );
}

export default Result;

