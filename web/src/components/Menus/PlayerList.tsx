import React, {useState, useEffect} from 'react';
import '../App.css'

import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import {useNuiEvent} from "../../hooks/useNuiEvent";

import {fetchNui} from "../../utils/fetchNui";

import { setIdentifiers } from '../../redux/actions/identifiers'

import { useDispatch } from 'react-redux';

import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import PlayerItem from './PlayerList/PlayerItem'

import InputAdornment from '@mui/material/InputAdornment';

interface props {
	refresh: any,
	setNotifMessage: any
}

interface IBanInfo {
	id: number,
	name: string
}

interface ReturnData {
  name: string,
  id: number,
  steam: string,
  fivem: string,
  discord: string,
  note: string,
	online: boolean
}

interface KickData {
	id: number,
	reason: string
}

interface BanData {
	id: number,
	time: number,
	reason: string
}

const PlayerList: React.FC<props> = (props) => {

	const [players, setPlayers] = useState([
		{name: "", id: 1, steam: "", fivem: "", discord: "", note: "", online: true  }
	])

	useNuiEvent<any>('playerList', (data: any) => {
    setPlayers(data)
  })

	useEffect(() => {
		fetchNui<ReturnData>('playerList', { name: "", id: 1, steam: "", fivem: "", discord: "", note: "", online: true}).then(resData => { 
			
		})
  }, []);

	const [banOpen, setBanOpen] = useState(false);
	const [kickOpen, setKickOpen] = useState(false);

	const [search, setSearch] = useState("")

	const [currentInfo, setCurrentInfo] = useState<IBanInfo | { id: 1, name: "Example" }>({ id: 1, name: "Example" })

	const handleClose = () => {
		setBanOpen(false);
		setKickOpen(false)
	};

	

	const banOptions = [
		{ label: '1 Hour', time:  3600 },
		{ label: '6 Hours', time:  21600 },
		{ label: '12 Hours', time:  43200 },
		{ label: '1 Day', time: 86400 },
		{ label: '2 Days', time:  172800 },
		{ label: '3 Days', time:  259200 },
		{ label: '5 Days', time:  432000 },
		{ label: '1 Week', time:  604800 },
		{ label: '2 Weeks', time: 1209600 },
		{ label: 'Permanent', time: 69 },
	];

	const banPlayerPrompt = (id: number, name: string) => {
		setCurrentInfo({
			id: id,
			name: name
		})
		setBanOpen(true)
	};

	const kickPlayerPrompt = (id: number, name: string) => {
		setCurrentInfo({
			id: id,
			name: name
		})
		setKickOpen(true)
	};

  

	const dispatch = useDispatch();

	const setIdentifier = (steam: string, discord: string, fivem: string, name: string) => {
		dispatch(setIdentifiers({
			steam: steam,
			discord: discord,
			fivem: fivem,
			show: true,
			name: name
		}))
		props.refresh()
	}

	const searchChange = (e: any) => {
		const value = e.target.value
		setSearch(value)
	}

	const [banLength, setBanLength] = useState({
		label: "1 Hour",
		time: 3600
	})

	const updateBanLength = (event, values) => {
		setBanLength(values)
	}

	const [banReason, setBanReason] = useState("")

	const updateBanReason = (e: any) => {
		setBanReason(e.target.value)
	}



	const handleBan = () => {
		if (banReason === "") { 
			props.setNotifMessage("Please provide a valid ban reason") 
			return 
		}
		fetchNui<BanData>('banPlayer', { id: currentInfo.id, time: banLength.time, reason: banReason }).then(resData => { 
			props.setNotifMessage("This player has been banned!")
			handleClose()
			setBanReason("")
		})
	}

	const [kickReason, setKickReason] = useState("")

	const updateKickReason = (e: any) => {
		setKickReason(e.target.value)
	}


	const handleKick = () => {
		if (kickReason === "") { 
			props.setNotifMessage("Please provide a valid kick reason") 
			return 
		}
		fetchNui<KickData>('kickPlayer', { id: currentInfo.id, reason: kickReason }).then(resData => { 
			props.setNotifMessage("This player has been kicked!")
			handleClose()
			setKickReason("")
		})
	}

	const OrderedList = players.sort(function(a, b) {
    return (a.id - b.id);
	});

	return (
		<div>
			<Dialog className="dialogBan" open={banOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description2" >
				<DialogTitle id="alert-dialog-title">
					{"Ban Player"}
				</DialogTitle>
				<DialogContent>
				<Autocomplete className="banDialog" value={banLength} onChange={updateBanLength} id="combo-box-demo" options={banOptions} sx={{ width: 300 }} renderInput={(params) => <TextField {...params} label="Ban Length" />} />
				<TextField value={banReason} onChange={updateBanReason} label="Ban Reason" sx={{marginBottom: '15px', width: 300}} />
				<DialogContentText id="alert-dialog-description2">You are about to ban <b>{currentInfo.name}</b>, are you sure you want to do this?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>No</Button>
					<Button onClick={handleBan} autoFocus>Yes</Button>
				</DialogActions>
			</Dialog>
			<Dialog className="dialogBan" open={kickOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description2" >
				<DialogTitle id="alert-dialog-title">
					{"Kick Player"}
				</DialogTitle>
				<DialogContent>
				<TextField value={kickReason} onChange={updateKickReason} label="Kick Reason" sx={{marginBottom: '15px', marginTop: '5px', width: 300}} />
				<DialogContentText id="alert-dialog-description2">You are about to kick <b>{currentInfo.name}</b>, are you sure you want to do this?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>No</Button>
					<Button onClick={handleKick} autoFocus>Yes</Button>
				</DialogActions>
			</Dialog>
			<CardContent>

				<FormControl fullWidth variant="standard">
					<InputLabel htmlFor="input-with-icon-adornment">Player Search</InputLabel>
					<Input value={search} onChange={searchChange} id="input-with-icon-adornment" startAdornment={ <InputAdornment position="start"> <PersonSearchIcon /> </InputAdornment> } />
				</FormControl>
				<Grid container spacing={2} maxWidth={750}>
					<Grid item sx={{ width: '100%' }}>
						<List dense={true}>
							{OrderedList.filter(player => (player.name.toLowerCase().includes(search.toLowerCase()) || player.fivem.toLowerCase().includes(search.toLowerCase()) || player.discord.toLowerCase().includes(search.toLowerCase())) ).map(filteredPerson => (
								<PlayerItem banPlayerPrompt={banPlayerPrompt} online={filteredPerson.online} kickPlayerPrompt={kickPlayerPrompt} setNotifMessage={props.setNotifMessage} id={filteredPerson.id} steam={filteredPerson.steam} discord={filteredPerson.discord} fivem={filteredPerson.fivem} name={filteredPerson.name} note={filteredPerson.note} setIdentifier={setIdentifier} />
							))}
						</List>
					</Grid>
				</Grid>
			</CardContent>
		</div>
  );
}

export default PlayerList;