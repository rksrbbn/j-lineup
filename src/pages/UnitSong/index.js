import React, {useState, useEffect} from 'react';
import {members} from '../../membersData';
import {unitSongs, setlist} from '../../unitSongs';
import { Container, FormControl, InputLabel, Select, MenuItem, Button, Avatar, Alert, Typography, TextField, Switch, FormControlLabel } from '@mui/material';
import { pink } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';
import HeaderApp from '../../components/HeaderApp';
import FooterApp from '../../components/FooterApp';
import { addLineup, clearLineup } from '../../db';
import { useNavigate } from 'react-router-dom';

function UnitSong() {
  const [selectedSetlist, setSelectedSetlist] = useState('');
  const [selectedSong, setSelectedSong] = useState('');
  const [selectedUnitSong, setSelectedUnitSong] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedBackDancers, setSelectedBackDancers] = useState([]);
  const [unitSongMembers, setUnitSongMembers] = useState(0);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [showSetlist, setshowSetlist] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  // panggil fungsi clearlineup ketika berada di halaman ini
  useEffect(() => {
    clearLineup();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSongChange = (event) => {
    const selectedSongName = event.target.value;
    setSelectedSong(selectedSongName);
    setSelectedMembers([]);
    setSelectedCenter('');
    
    // Temukan unit song yang dipilih
    const selectedUnitSong = unitSongs.find(song => song.name === selectedSongName);
    setSelectedUnitSong(selectedUnitSong);
    if (selectedSongName !== '') {
      setUnitSongMembers(selectedUnitSong.total_member);
    }
    else
    {
      setUnitSongMembers(0);
    }
  };

  const generateRandomMembers = () => {
    const randomMembers = members.sort(() => Math.random() - 0.5).slice(0, unitSongMembers);
    const memberNames = randomMembers.map(member => member.alias);
    setSelectedMembers(memberNames);
    setSelectedCenter(memberNames[0]);
  };

  const createLineup = () => {

    // Jika jumlah selectedMembers kurang dari unitsong.total_member, tampilkan pesan error
    if (selectedMembers.length < unitSongMembers) {
      setError(true);
      setErrorMessage('Jumlah member tidak boleh kurang dari ' + unitSongMembers + '.')
      return;
    }
    
    // Jika jumlah back dancer lebih dari nol dan kurang dari back_dancer
    if (selectedBackDancers.length > 0 && selectedBackDancers.length < selectedUnitSong.back_dancer)
    {
      setError(true);
      setErrorMessage('Jumlah back dancer tidak boleh kurang dari ' + selectedUnitSong.back_dancer + '. Kosongkan member jika tidak ingin mengisi back dancer.')
      return;
    }
    
    // Jika Back dancer termasuk ke member utama unit song
    if (selectedBackDancers.some(value => selectedMembers.includes(value)))
    {
      setError(true);
      setErrorMessage('Back dancer tidak boleh mengandung member utama unit song.')
      return;
    }

    const lineup = {
      unitSongName: selectedSong,
      unitSongSetlist: selectedSetlist,
      members: selectedMembers.join(', '),
      center: selectedCenter,
      creatorName: creatorName,
      showSetlist: showSetlist,
      backDancers: selectedBackDancers
    };
    addLineup(lineup);
    navigate('/result');
  };

  const PinkSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: pink[600],
      '&:hover': {
        backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: pink[600],
    },
  }));

  const handleSwitch = () => {
    setshowSetlist(!showSetlist)
  }

  return (
    <div style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0, display: 'flex', flexDirection: 'column' }}>
      <HeaderApp />
      <Container className="App" maxWidth="sm">

        <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: '20px', textAlign: 'center', fontFamily: 'Poppins', background: 'linear-gradient(to right, red, purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Unit Song Lineup Creator
        </Typography>

        {error && (
                    <Alert severity="error" variant='filled' style={{ 
                        position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 ,
                        fontSize: { xs: '8px', sm: '10px', md: '12px', lg: '14px' }
                        }}>
                        {errorMessage}
                    </Alert>
                )}

        <p style={{ textDecoration: 'underline', cursor: 'pointer', color: '#f50057', fontSize: '12px', textAlign: 'left' }} onClick={() => navigate('/')}>Back to Home</p>

        <FormControlLabel control={
          <PinkSwitch 
            color='default' checked={showSetlist}
            onChange={handleSwitch} 
          />
        } label="Show Setlist Image" />

        <FormControl fullWidth variant='filled' style={{ marginBottom: '30px' }}>
          <InputLabel id="setlist-select-label" sx={{ fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>Setlist</InputLabel>
          <Select
            labelId="setlist-select-label"
            value={selectedSetlist}
            onChange={(event) => {
              setSelectedSetlist(event.target.value);
              setSelectedSong('');
              setSelectedMembers([]);
              setSelectedCenter('');
            }}
            displayEmpty
            renderValue={(selected) => selected}
          >
            
            {setlist.map((setlistItem) => (
              <MenuItem key={setlistItem.name} value={setlistItem.name}>
                <Avatar src={setlistItem.picture} alt={setlistItem.name} style={{ marginRight: '10px' }} />
                <small>{setlistItem.name}</small>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
          
        {selectedSetlist && (
          
          <FormControl fullWidth variant='filled' style={{ marginBottom: '30px' }}>
            <InputLabel id="song-select-label" sx={{ fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>Unit Song</InputLabel>
            <Select
              labelId="song-select-label"
              value={selectedSong}
              onChange={handleSongChange}
              displayEmpty
            >
              {unitSongs.filter(song => song.setlist === selectedSetlist).sort((a, b) => a.name.localeCompare(b.name)).map((filteredSong) => (
                <MenuItem key={filteredSong.name} value={filteredSong.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>{filteredSong.name}</span>
                    {/* <span style={{ fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>({filteredSong.total_member} member)</span> */}
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
        {selectedSetlist && selectedSong && (
          <div style={{ marginBottom: '30px' }}>
            <small data-testid="WarningIcon" style={{ color: 'red' }}>*Anda harus memilih {unitSongMembers} member untuk lagu ini.</small>
          
            <FormControl fullWidth variant='filled'>
                <InputLabel id="member-multi-select-label" sx={{ fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>Members</InputLabel>
                <Select
                  labelId="member-multi-select-label"
                  multiple
                  value={selectedMembers}
                  onChange={(event) => {
                    // setSelectedCenter menjadi member pertama
                    setSelectedCenter(selectedMembers[0]);

                    const {
                      target: { value },
                    } = event;
                    // Batasi jumlah member yang dipilih sesuai dengan unitSongMembers
                    const selected = typeof value === 'string' ? value.split(',') : value;
                    if (selected.length <= unitSongMembers) {
                      setSelectedMembers(selected);
                    } else {
                      // Jika melebihi, potong array untuk membatasi jumlahnya
                      setSelectedMembers(selected.slice(0, unitSongMembers));
                    }
                  } }
                  renderValue={(selected) => (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {selected.map((value) => (
                        <div key={value} style={{ paddingRight: '5px', paddingLeft: '5px', backgroundColor: '#f50057', borderRadius: '15px', color: 'white', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                          {value}
                        </div>
                      ))}
                    </div>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                      },
                    },
                  }}
                >
                  {members.sort((a, b) => a.alias.localeCompare(b.alias)).map((member) => (
                    <MenuItem key={member.name} value={member.alias}>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={member.picture} alt={member.alias} />
                          <p style={{ marginLeft: '10px' }}>{member.alias}</p>
                        </div>
                        {member.trainee ? <img src="assets/icons/trainee_icon.png" alt="Trainee" style={{ width: '48px' }} /> : <img src="assets/icons/member_icon.png" alt="Member" style={{ width: '48px' }} />}
                      </div>

                    </MenuItem>
                  ))}
                </Select>

              </FormControl>

              {selectedMembers.length < 1 && (
                <p style={{ color: 'red', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }} onClick={generateRandomMembers}>
                  Generate Random Members
                </p>
              )}

          </div>
        )}

        {selectedSetlist && selectedSong && selectedMembers.length > 0 && (
          <FormControl fullWidth variant='filled' style={{ marginBottom: '30px' }}>
            <InputLabel id="center-member-select-label" sx={{ fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>Center</InputLabel>
            <Select
              labelId="center-member-select-label"
              value={selectedCenter || selectedMembers[0]}
              onChange={(event) => setSelectedCenter(event.target.value)}
              renderValue={(selected) => (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Pastikan selected adalah array sebelum memanggil .map */}
                  {Array.isArray(selected) ? selected.map((value) => (
                    <div key={value} style={{ paddingRight: '5px', paddingLeft:'5px', backgroundColor: '#f50057', borderRadius: '15px', color: 'white', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                      {value}
                    </div>
                  )) : <div style={{ paddingRight: '5px', paddingLeft:'5px', backgroundColor: '#f50057', borderRadius: '15px', color: 'white', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                      {selected}
                    </div>}
                </div>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: 250,
                  },
                },
              }}
              displayEmpty
            >
              {selectedMembers.map((memberAlias) => (
                <MenuItem key={memberAlias} value={memberAlias}>{memberAlias}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

      {/* Back Dancer */}
        {selectedMembers.length > 0 && selectedUnitSong.back_dancer ? (
          selectedUnitSong.back_dancer > 0 && (
            <div style={{ marginBottom: '30px' }}>
            <small data-testid="WarningIcon" style={{ color: 'red' }}>*Anda harus memilih {selectedUnitSong.back_dancer} member untuk lagu ini (Opsional).</small>
          
            <FormControl fullWidth variant='filled'>
                <InputLabel id="backdancer-multi-select-label" sx={{ fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>Back Dancers (Optional)</InputLabel>
                <Select
                  labelId="backdancer-multi-select-label"
                  multiple
                  value={selectedBackDancers}
                  onChange={(event) => {
                    const {
                      target: { value },
                    } = event;
                    // Batasi jumlah member yang dipilih sesuai dengan Back Dancer
                    const selected = typeof value === 'string' ? value.split(',') : value;
                    if (selected.length <= selectedUnitSong.back_dancer) {
                      setSelectedBackDancers(selected);
                    } else {
                      // Jika melebihi, potong array untuk membatasi jumlahnya
                      setSelectedBackDancers(selected.slice(0, selectedUnitSong.back_dancer));
                    }
                  } }
                  renderValue={(selected) => (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {selected.map((value) => (
                        <div key={value} style={{ paddingRight: '5px', paddingLeft: '5px', backgroundColor: '#f50057', borderRadius: '15px', color: 'white', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                          {value}
                        </div>
                      ))}
                    </div>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                      },
                    },
                  }}
                >
                  {members.sort((a, b) => a.alias.localeCompare(b.alias)).map((member) => (
                    <MenuItem key={member.name} value={member.alias}>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={member.picture} alt={member.alias} />
                          <p style={{ marginLeft: '10px' }}>{member.alias}</p>
                        </div>
                        {member.trainee ? <img src="assets/icons/trainee_icon.png" alt="Trainee" style={{ width: '48px' }} /> : <img src="assets/icons/member_icon.png" alt="Member" style={{ width: '48px' }} />}
                      </div>

                    </MenuItem>
                  ))}
                </Select>

              </FormControl>
          </div>
          )
        ) : null}

        {selectedSetlist && selectedSong && selectedMembers.length > 0 && (
          <FormControl fullWidth variant='filled' style={{ marginBottom: '30px' }}>
            <TextField id="filled-basic" label="Creator Name (Optional)" variant="filled" onChange={(event) => setCreatorName(event.target.value)} />
          </FormControl>
        )}
        
        {selectedMembers.length > 0 && (
          <Button variant="outlined" color="success" onClick={createLineup} style={{ marginTop: '30px', marginRight: '10px'}}>Create Lineup</Button>
        )}

        {selectedMembers.length > 0 && (
          <Button variant="outlined" color="error" onClick={() => setSelectedMembers([])} style={{ marginTop: '30px' }}>Clear Members</Button>
        )}
       
      </Container>
      <FooterApp />
    </div>
  );
}

export default UnitSong;
