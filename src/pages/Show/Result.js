import { useState, useEffect } from "react";
import { Container, Typography, Divider, Grid, Avatar, Badge, Tooltip, Box, Button, Modal } from "@mui/material";
import HeaderApp from "../../components/HeaderApp";
import FooterApp from "../../components/FooterApp";
import { getShow, getShowSongs } from "../../db";
import { useNavigate } from "react-router-dom";
import { members } from "../../membersData";
import { PieChart, pieArcLabelClasses  } from "@mui/x-charts";


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
                const songsData = await getShowSongs(); // Pastikan id adalah string
                setSongs(songsData);
            }
            else {
                navigate('/');
            }
        };
        fetchData();
    }, []);

    // DATA FOR CHART
    const countMembersByRole = (memberList) => {
        return memberList.reduce((acc, member) => {
            if (member.trainee === true) {
                acc.trainee += 1;
            } else {
                acc.nonTrainee += 1;
            }
            return acc;
        }, { trainee: 0, nonTrainee: 0 });
    };

    const memberCountsByRole = countMembersByRole(memberList);

    const chartData = [
        { id: 0, value: memberCountsByRole.trainee, label: 'Trainee' },
        { id: 1, value: memberCountsByRole.nonTrainee, label: 'Active' }
    ];

    const countMembersByGeneration = (members) => {
        return members.reduce((acc, member) => {
            const generation = member.generation;
            if (!acc[generation]) {
                acc[generation] = 0;
            }
            acc[generation] += 1;
            return acc;
        }, {});
    };

    const memberCountsByGeneration = countMembersByGeneration(memberList);
    const chartData2 = Object.keys(memberCountsByGeneration).map((generation, index) => ({
        id: index,
        value: memberCountsByGeneration[generation],
        label: `Gen ${generation}`
    }));

    const [showStats, setShowStats] = useState(false)

    return (
        <div style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <HeaderApp/>
            <Container className="App" maxWidth="md">
                <div style={{ marginBottom: '50px', textAlign: 'center' }}>
                    <Typography variant="h4" style={{ marginTop: '50px', color: '#c4317a', background: 'linear-gradient(to right, red, purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{show.name}</Typography>
                    <small style={{ color: '#c4317a' }}>
                        {show.date && show.location ? `${show.date} | ${show.location}` : show.date ? show.date : show.location}
                    </small>
                </div>

                <div style={{ marginBottom: '50px', textAlign: 'center' }}>
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
                    key={index}
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


                {showStats && (
                    <div style={{marginTop:'50px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center'}}>
                        <Divider style={{ width: '100%' }}><Typography variant="h6" color="#c4317a">Lineup Stats</Typography></Divider>
                        <PieChart
                        margin={{ top: 100, bottom: 100, left: 100, right:100 }}
                        series={[
                            {
                                arcLabel: (item) => `${item.value}`,
                                // arcLabelMinAngle: 45,
                                data: chartData,
                                outerRadius:80,
                                cx: '50%',
                                cy: '50%',
                            },
                        ]}
                        slotProps={{
                            legend: {
                              labelStyle: {
                                fontSize: 14,
                                fill: '#c4317a',
                            },
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'middle' },
                            padding: 0,
                            },
                          }}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                                fill: 'white',
                                fontWeight: 'light',
                            },
                            }}
                        height={300}
                        />

                        <PieChart
                         margin={{ top: 100, bottom: 100, left: 100, right:100 }}
                        series={[
                            {
                                arcLabel: (item) => `${item.value}`,
                                // arcLabelMinAngle: 45,
                                data: chartData2,
                                outerRadius:80,
                                cx: '50%',
                                cy: '50%'
                            },
                        ]}
                        slotProps={{
                            legend: {
                              labelStyle: {
                                fontSize: 14,
                                fill: '#c4317a',
                              },
                              direction: 'row',
                                position: { vertical: 'bottom', horizontal: 'middle' },
                                padding: 0,
                            },
                          }}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                                fill: 'white',
                                fontWeight: 'light',
                            },
                            }}
                        height={300}
                        />
                    </div>
                )}

                <div style={{ marginTop: '50px', textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
                    <Button size="small" variant="outlined" color="error" onClick={() => navigate('/show')}>CREATE NEW SHOW</Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => setShowStats(!showStats)}>{!showStats ? 'SHOW STATS' : 'HIDE STATS'}</Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => navigate('/')}>BACK TO HOME</Button>
                </div>
                        
                            
            </Container>
            <FooterApp/>
        </div>
    )
}

export default ResultShow;