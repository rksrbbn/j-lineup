import React, {useState} from 'react';
import './App.css';
import {members} from './membersData';
import {unitSongs, setlist} from './unitSongs';
import { Container, FormControl, InputLabel, Select, MenuItem, Button, Avatar } from '@mui/material';
import HeaderApp from './components/HeaderApp';

function App() {
  const [selectedSetlist, setSelectedSetlist] = useState('');
  const [selectedSong, setSelectedSong] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [unitSongMembers, setUnitSongMembers] = useState(0);
  const [selectedCenter, setSelectedCenter] = useState('');

  const handleSongChange = (event) => {
    const selectedSongName = event.target.value;
    setSelectedSong(selectedSongName);
    setSelectedMembers([]);
    setSelectedCenter('');
    
    // Temukan unit song yang dipilih
    const selectedUnitSong = unitSongs.find(song => song.name === selectedSongName);

    if (selectedSongName !== '') {
      setUnitSongMembers(selectedUnitSong.total_member);
    }
    else
    {
      setUnitSongMembers(0);
    }
  };

  return (
    <div style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0 }}>
      <HeaderApp />
      <Container className="App">

        <FormControl fullWidth variant='filled' style={{ marginBottom: '30px', marginTop: '30px' }}>
          <InputLabel id="setlist-select-label">Pilih setlist</InputLabel>
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
          >
            <MenuItem value="">
              <em>Pilih setlist</em>
            </MenuItem>
            {setlist.map((setlistItem) => (
              <MenuItem key={setlistItem.name} value={setlistItem.name}>{setlistItem.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSetlist && (
          <FormControl fullWidth variant='filled' style={{ marginBottom: '30px' }}>
            <InputLabel id="song-select-label">Pilih lagu</InputLabel>
            <Select
              labelId="song-select-label"
              value={selectedSong}
              onChange={handleSongChange}
              displayEmpty
            >
              <MenuItem value="">
                <em>Pilih lagu</em>
              </MenuItem>
              {unitSongs.filter(song => song.setlist === selectedSetlist).map((filteredSong) => (
                <MenuItem key={filteredSong.name} value={filteredSong.name}>{filteredSong.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
        {selectedSetlist && selectedSong && (
          <FormControl fullWidth variant='filled' style={{ marginBottom: '30px' }}>
            <InputLabel id="member-multi-select-label">Pilih member</InputLabel>
            <Select
              labelId="member-multi-select-label"
              multiple
              value={selectedMembers}
              onChange={(event) => {
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
              }}
              renderValue={(selected) => selected.join(', ')}
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
                  <Avatar src={`${process.env.PUBLIC_URL}/${member.picture}`} alt={member.alias} />
                  {member.alias}
                </MenuItem>
              ))}
            </Select>

          </FormControl>
        )}

        {selectedSetlist && selectedSong && selectedMembers.length > 0 && (
          <FormControl fullWidth variant='filled'>
            <InputLabel id="center-member-select-label">Pilih Center</InputLabel>
            <Select
              labelId="center-member-select-label"
              value={selectedCenter || selectedMembers[0]}
              onChange={(event) => setSelectedCenter(event.target.value)}
              displayEmpty
            >
              {selectedMembers.map((memberAlias) => (
                <MenuItem key={memberAlias} value={memberAlias}>{memberAlias}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button variant="outlined" color="error" onClick={() => setSelectedMembers([])} style={{ marginTop: '30px' }}>Clear Members</Button>
       
      </Container>
    </div>
  );
}

export default App;
