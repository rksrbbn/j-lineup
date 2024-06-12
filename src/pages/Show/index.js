import { Container, Typography, FormControl, TextField, Select, MenuItem, InputLabel, Avatar, Autocomplete, Button, Alert } from '@mui/material';
import HeaderApp from '../../components/HeaderApp';
import FooterApp from '../../components/FooterApp';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { clearShow, addShow, addShowSongs, clearShowSongs } from '../../db';
import { members } from '../../membersData';
import { songs } from '../../songs';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';

function Show() {
    const navigate = useNavigate();

    const [showName, setShowName] = useState('');
    const [showDate, setShowDate] = useState('');
    const [showLocation, setShowLocation] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedCenter, setSelectedCenter] = useState(null);
    // const [selectedSong, setSelectedSong] = useState([]);
    const [songInputs, setSongInputs] = useState([{ id: 1, value: '' }]);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddSongInput = () => {
        setSongInputs([...songInputs, { id: songInputs.length + 1, value: '' }]);
    };

    const handleSongInputChange = (id, newValue) => {
        setSongInputs(songInputs.map(input => input.id === id ? { ...input, value: newValue } : input));
    };
    const handleRemoveSongInput = (index) => {
        if (songInputs.length > 1) {
            setSongInputs(songInputs.filter((_, i) => i !== index));
        }
    };
    useEffect(() => {
        clearShow();
        clearShowSongs();
    }, []);
    useEffect(() => {
        if (error) {
          const timer = setTimeout(() => {
            setError(false);
          }, 5000);
          return () => clearTimeout(timer);
        }
      }, [error]);

    const generateRandomMembers = () => {
        const randomMembers = members.sort(() => Math.random() - 0.5).slice(0, 12);
        const memberNames = randomMembers.map(member => member.alias);
        setSelectedMembers(memberNames);
        setSelectedCenter(memberNames[0]);
      };

    const createShow = () => {

        if (showName == '' || showName == null) {
            setError(true);
            setErrorMessage('Show Name tidak boleh kosong.');
            return;
        }
        
        if(selectedMembers.length < 12){
            setError(true);
            setErrorMessage('Pastikan Anda memilih minimal 12 member untuk show.');
            return;
        }

        if(selectedMembers.length > 16){
            setError(true);
            setErrorMessage('Pastikan Anda memilih maksimal 16 member untuk show.');
            return;
        }

        const showSongs = songInputs.map((input) => input.value);
    
        // Cek semua input song tidak kosong atau null
        if (showSongs.some(song => song == '' || song == null)) {
            setError(true);
            setErrorMessage('Pastikan semua input song tidak kosong.');
            return;
        }
        addShow({ name: showName, date: showDate, location: showLocation, members: selectedMembers, center: selectedCenter, songs: showSongs })
        .then((showId) => {
            addShowSongs(showId, showSongs);
        });
        navigate('/result-show');
    }

    return (
        <div style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <HeaderApp />
            <Container className="App" maxWidth="sm" style={{ textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: '20px', textAlign: 'center', fontFamily: 'Poppins' }}>
                    Custom Show Lineup Creator
                </Typography>
                
                {error && (
                    <Alert severity="error" variant='filled' style={{ 
                        position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 ,
                        fontSize: { xs: '8px', sm: '10px', md: '12px', lg: '14px' }, width: '90%'
                        }}>
                        {errorMessage}
                    </Alert>
                )}
                <p style={{ textDecoration: 'underline', cursor: 'pointer', color: '#f50057', fontSize: '12px', textAlign: 'left' }} onClick={() => navigate('/')}>Back to Home</p>

                <FormControl fullWidth variant='filled' style={{ marginBottom: '30px' }}>
                    <TextField id="filled-basic" label="Show Name" variant="filled" onChange={(event) => setShowName(event.target.value)} required />
                </FormControl>
                <FormControl fullWidth variant='filled' style={{ marginBottom: '30px' }}>
                    <TextField
                        id="date-picker"
                        label="Show Date (Optional)"
                        type="date"
                        variant="filled"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(event) => setShowDate(event.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth variant='filled' style={{ marginBottom: '30px' }}>
                    <TextField id="filled-basic" label="Show Location (Optional)" variant="filled" onChange={(event) => setShowLocation(event.target.value)} />
                </FormControl>

                <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                    <small data-testid="WarningIcon" style={{ color: 'red' }}>*Anda harus memilih 12 s/d 16 member untuk show.</small>
                
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
                            if(selected.length > 16){
                                setError(true);
                                setErrorMessage('Pastikan Anda memilih maksimal 16 member untuk show.');
                                return;
                            }
                            setSelectedMembers(selected);
                        }}
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
                    {selectedMembers.length > 1 && (
                        <p style={{ color: 'red', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setSelectedMembers([])}>
                        Clear All Selected Members
                        </p>
                    )}
                </div>
                
                    <FormControl fullWidth variant='filled' style={{ marginBottom: '30px' }}>
                        <InputLabel id="center-member-select-label" sx={{ fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                            Select Global Center
                        </InputLabel>
                        <Select
                            labelId="center-member-select-label"
                            value={selectedMembers.length > 0 ? (selectedCenter || selectedMembers[0]) : ''}
                            onChange={(event) => setSelectedCenter(event.target.value)}
                            renderValue={(selected) => (
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <div key={selected} style={{ paddingRight: '5px', paddingLeft: '5px', backgroundColor: '#f50057', borderRadius: '15px', color: 'white', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                                        {selected}
                                    </div>
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
                            {selectedMembers.map((memberAlias) => (
                                <MenuItem key={memberAlias} value={memberAlias}>{memberAlias}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                <FormControl fullWidth variant='filled' style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <IconButton onClick={handleAddSongInput} color="success" aria-label="add song">
                            <AddIcon /> 
                        </IconButton>
                    
                        <IconButton onClick={() => handleRemoveSongInput(songInputs.length - 1)} color="error" aria-label="remove song">
                            <RemoveIcon />
                        </IconButton>
                    </div>
                    {songInputs.map((input, index) => (
                        <FormControl key={input.id} fullWidth variant='filled' style={{ marginBottom: '30px', display: 'flex'}}>
                            <Autocomplete
                                id={`song-autocomplete-${input.id}`}
                                options={songs.map((song) => song.name).sort()}
                                value={input.value}
                                onChange={(event, newValue) => handleSongInputChange(input.id, newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={`Select Song - M${input.id.toString().padStart(2, '0')}`}
                                        variant="filled"
                                    />
                                )}
                                getOptionLabel={(option) => option}
                                filterOptions={(options, { inputValue }) => {
                                    return options.filter(option => option.toLowerCase().includes(inputValue.toLowerCase()));
                                }}
                                isOptionEqualToValue={(option, value) => option === value}
                                required
                            />
                           
                        </FormControl>
                    ))}
                   
                </FormControl>

                <Button fullWidth variant='outlined' color='success' onClick={createShow}>
                    Create Show
                </Button>

            </Container>
            <FooterApp />
        </div>
    );
}

export default Show;


