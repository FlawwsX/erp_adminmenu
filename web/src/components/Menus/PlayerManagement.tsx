import React, {useState, useEffect} from 'react';
import '../App.css'

import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import ListIcon from '@mui/icons-material/List';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import GavelIcon from '@mui/icons-material/Gavel'
import {fetchNui} from "../../utils/fetchNui";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import { Link } from 'react-router-dom'

import TextField from '@mui/material/TextField';

interface props {
	playercount: number,
	maxcount: number,
	setNotifMessage: any
}

interface OfflineBanData {
	time: number,
	name: string,
	reason: string,
	fivem: string,
	steam: string,
	discord: string,
	license: string,
	ip: string
}

interface UnbanData { id: number }

const PlayerManagement: React.FC<props> = (props) => {

	const navStyle = {
		color: 'white',
		textDecoration: 'none'
	}

	const [offlineBan, setOfflineBan] = useState(false)

	const handleOfflineBanOpen = () => {
		setOfflineBan(true)
	}

	const handleOfflineBanClose = () => {
		setOfflineBan(false)
	}

	const [unban, setUnban] = useState(false)

	const handleUnbanOpen = () => {
		setUnban(true)
	}

	const handleUnbanClose = () => {
		setUnban(false)
	}

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

	const [banLength, setBanLength] = useState({
		label: "1 Hour",
		time: 3600
	})

	const updateBanLength = (event, values) => {
		setBanLength(values)
	}

	const [name, setName] = useState("")
	
	const updateName = (e: any) => {
		setName(e.target.value)
	}

	const [banReason, setBanReason] = useState("")
	
	const updateBanReason = (e: any) => {
		setBanReason(e.target.value)
	}

	const [fivemIdentifier, setFivemIdentifier] = useState("")
	
	const updateFivemIdentifier = (e: any) => {
		setFivemIdentifier(e.target.value)
	}

	const [steamIdentifier, setSteamIdentifier] = useState("")
	
	const updateSteamIdentifier = (e: any) => {
		setSteamIdentifier(e.target.value)
	}

	const [discordIdentifier, setDiscordIdentifier] = useState("")
	
	const updateDiscordIdentifier = (e: any) => {
		setDiscordIdentifier(e.target.value)
	}

	const [licenseIdentifier, setLicenseIdentifier] = useState("")
	
	const updateLicenseIdentifier = (e: any) => {
		setLicenseIdentifier(e.target.value)
	}

	const [ipIdentifier, setIpIdentifier] = useState("")
	
	const updateIpIdentifier = (e: any) => {
		setIpIdentifier(e.target.value)
	}

	const handleOfflineBan = () => {
		const Name = name || "Invalid"
		const BanReason = banReason || "Invalid"
		const FiveM = fivemIdentifier || "Invalid"
		const Steam = steamIdentifier || "Invalid"
		const Discord = discordIdentifier || "Invalid"
		const License = licenseIdentifier || "Invalid"
		const IP = ipIdentifier || "Invalid"
		fetchNui<OfflineBanData>('offlineBanPlayer', { time: banLength.time, name: Name, reason: BanReason, fivem: FiveM, steam: Steam, discord: Discord, license: License, ip: IP}).then(resData => { 
			props.setNotifMessage("This player has been banned!")
			handleOfflineBanClose()
			setBanReason("")
		})
	}

	const [unbanText, setUnbanText] = useState("")
	
	const updateUnbanText = (e: any) => {
		setUnbanText(e.target.value)
	}

	const handleUnban = () => {
		if (unbanText === "") { 
			props.setNotifMessage("Please provide a valid ban ID") 
			return 
		}
		fetchNui<UnbanData>('unbanId', { id: unbanText }).then(resData => { 
			props.setNotifMessage("This player has been unbanned!")
			handleUnbanClose()
			setUnbanText("")
		})
	}

	return (
		<div>
			
			<Dialog className="dialogBan" open={offlineBan} onClose={handleOfflineBanClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description2" >
				<DialogTitle id="alert-dialog-title"> {"Offline Ban"} </DialogTitle>
				<DialogContent>
				<Grid container spacing={2} sx={{ marginTop:'0.1px' }} className="banDialog" >
					<Grid item xs={6}>
						<Autocomplete value={banLength} onChange={updateBanLength} id="combo-box-demo" options={banOptions} sx={{ width: 260 }} renderInput={(params) => <TextField {...params} label="Ban Length" />} />
					</Grid>
					<Grid item xs={6}>
						<TextField value={name} onChange={updateName} label="Name" sx={{ width: 267}} />
					</Grid>
				</Grid>
				<TextField value={banReason} onChange={updateBanReason} label="Ban Reason" sx={{marginBottom: '15px'}} fullWidth />

				<Grid container spacing={2} className="banDialog" >
					<Grid item xs={6}>
						<TextField value={fivemIdentifier} onChange={updateFivemIdentifier} label="FiveM" sx={{ width: 265}} />
					</Grid>
					<Grid item xs={6}>
					<TextField value={steamIdentifier} onChange={updateSteamIdentifier} label="Steam" sx={{width: 268}} />
					</Grid>
				</Grid>
				<Grid container spacing={2} className="banDialog" >
					<Grid item xs={6}>
						<TextField value={discordIdentifier} onChange={updateDiscordIdentifier} label="Discord" sx={{ width: 265}} />
					</Grid>
					<Grid item xs={6}>
						<TextField value={licenseIdentifier} onChange={updateLicenseIdentifier} label="License" sx={{width: 268}} />
					</Grid>
				</Grid>
				<TextField value={ipIdentifier} onChange={updateIpIdentifier} label="IP" sx={{marginBottom: '15px', width: 300}} />
				<DialogContentText id="alert-dialog-description2">You are about to offline ban a player, do you wish to continue?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleOfflineBanClose}>No</Button>
					<Button onClick={handleOfflineBan} autoFocus>Yes</Button>
				</DialogActions>
			</Dialog>

			<Dialog className="dialogBan" open={unban} onClose={handleUnbanClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description2" >
				<DialogTitle id="alert-dialog-title"> {"Unban Player"} </DialogTitle>
				<DialogContent>
				<TextField label="Ban ID" value={unbanText} onChange={updateUnbanText} sx={{marginBottom: '15px', marginTop:'5px', width: 300}} />
				<DialogContentText id="alert-dialog-description2">Are you sure you want to unban this player? I guarentee you will regret it in a week.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleUnbanClose}>Let them rot</Button>
					<Button onClick={handleUnban} autoFocus>I'll take the chance</Button>
				</DialogActions>
			</Dialog>

			<CardContent>
				<Grid container spacing={2} maxWidth={585}>
					<Grid item>
						<List dense={true}>
							<Link style={navStyle} to='/playerlist'>
								<ListItemButton>
									<ListItemIcon>
										<ListIcon />
									</ListItemIcon>
									<ListItemText primary="Player List" secondary={`Browse through a list of players where you can ban, kick, spectate, screenshot, etc... a specific player.`} />
								</ListItemButton>
							</Link>
							<ListItemButton onClick={handleOfflineBanOpen} >
								<ListItemIcon>
									<GavelIcon />
								</ListItemIcon>
								<ListItemText primary="Force Ban" secondary='Offline ban a player by providing their identifiers and nickname.' />
							</ListItemButton>
							<ListItemButton onClick={handleUnbanOpen}>
								<ListItemIcon>
									<LockOpenIcon />
								</ListItemIcon>
								<ListItemText primary="Pardon Player" secondary='Unban a player, allowing them to join the server.' />
							</ListItemButton>
						</List>
					</Grid>
				</Grid>
			</CardContent>
		</div>
  );
}

export default PlayerManagement;