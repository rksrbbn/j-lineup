import { useState, useEffect } from "react";
import { Container, Typography, Divider, Grid, Avatar, Badge, Tooltip, Box, Button } from "@mui/material";
import HeaderApp from "../../components/HeaderApp";
import FooterApp from "../../components/FooterApp";
import { getShow, getShowSongs } from "../../db";
import { useNavigate } from "react-router-dom";
import { members } from "../../membersData";


function ResultShow() {
    const [show, setShow] = useState([]);
    const [songs, setSongs] = useState([]);
    const [memberList, setMemberList] = useState([]);

    const navigate = useNavigate();

    const searchMemberDataByAlias = (alias) => {
        return members.find(member => member.alias === alias);
    };

    useEffect(() => {
        const fetchData = async () => {
            const showData = await getShow();
            if (showData.length > 0) {
                const firstShow = showData[0];
                setShow(firstShow);
                const memberObjects = firstShow.members.map(alias => {
                    const memberData = searchMemberDataByAlias(alias.trim()); // Trim alias untuk menghapus spasi ekstra
                    return memberData ? memberData : { alias: alias, name: "Unknown", role: "Unknown" };
                });
                setMemberList(memberObjects);
                const songsData = await getShowSongs(firstShow.id);
                setSongs(songsData);
            }
            else {
                navigate('/');
            }
        };
        fetchData();
    }, []);


    return (
        <div style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <HeaderApp/>
            <Container className="App" maxWidth="md">
                <div style={{ marginBottom: '50px', textAlign: 'center' }}>
                    <Typography variant="h4" style={{ marginTop: '50px', color: '#c4317a'}}>{show.name}</Typography>
                    <small style={{ color: '#c4317a' }}>
                        {show.date && show.location ? `${show.date} | ${show.location}` : show.date ? show.date : show.location}
                    </small>
                </div>

                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <Divider><Typography variant='h6' color='#c4317a'>LINEUP</Typography></Divider>
                </div>  

                <Grid container rowSpacing={0} columnSpacing={0} justifyContent="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
                    {memberList.map((member, index) => (
                        <Grid item xs={2} sm={1} md={1} key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Tooltip title={member.alias} placement="top" arrow>
                                <Badge
                                    badgeContent="C"
                                    color="error" // Ubah warna menjadi merah
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    invisible={member.alias !== show.center}
                                >
                                    <Avatar
                                        src={member.picture}
                                        alt={member.alias}
                                        style={{ marginBottom: '10px', border: '2px solid #db5198' }}
                                        sx={{
                                            width: { xs: 40, sm: 40, md: 50, lg: 55 },
                                            height: { xs: 40, sm: 40, md: 50, lg: 55 }
                                        }}
                                    />
                                </Badge>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>

                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <Divider><Typography variant='h6' color='#c4317a'>SETLIST</Typography></Divider>
                </div>  

                {/* SETLIST OF SELECTED SONGS */}
                {songs.map((song, index) => (
                    <Box
                        sx={{
                            color: '#c4317a',
                            fontSize: {
                                xs: '12px',
                                sm: '12px',
                                md: '14px',
                                lg: '14px',
                            },
                            fontWeight: 'light',
                            textAlign: 'center',
                        }}
                    >
                        M{(index + 1).toString().padStart(2, '0')}. {song.songName}
                    </Box>
                ))}
                <div style={{ marginTop: '50px', textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outlined" color="error" onClick={() => navigate('/show')}>CREATE NEW SHOW</Button>
                    <Button variant="outlined" color="error" onClick={() => navigate('/')}>BACK TO HOME</Button>
                </div>
            </Container>
            <FooterApp/>
        </div>
    )
}

export default ResultShow;