import React, {useState} from 'react';
import './App.css';
import {members} from './membersData';
import {unitSongs} from './unitSongs';
import { Container, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

function App() {
  const [selectedSong, setSelectedSong] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [unitSongMembers, setUnitSongMembers] = useState(0);

  const handleSongChange = (event) => {
    const selectedSongName = event.target.value;
    setSelectedSong(selectedSongName);
    
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
    <Container className="App">
      <header>
        <h1>JKT48 Lineup</h1>
      </header>

      {/* buat selection unit song menggunakan material-ui */}
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
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
          {unitSongs.map((song) => (
            <MenuItem key={song.name} value={song.name}>{song.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {selectedSong && (
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
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
            {members.map((member) => (
              <MenuItem key={member.name} value={member.alias}>
                {member.alias}
              </MenuItem>
            ))}
          </Select>
          <Button variant="outlined" color="error" onClick={() => setSelectedMembers([])} style={{ marginTop: '20px' }}>Clear Members</Button>
        </FormControl>
      )}
     
    </Container>
  );
}

export default App;
