import React, {useState, useEffect} from 'react';
import '../App.css'

import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import AnnouncementIcon from '@mui/icons-material/Announcement';

import {fetchNui} from "../../utils/fetchNui";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';

import CloudIcon from '@mui/icons-material/Cloud';
import CarRentalIcon from '@mui/icons-material/CarRental';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';

import TextField from '@mui/material/TextField';

interface props {
	playercount: number,
	maxcount: number,
	setNotifMessage: any
}

interface message {
	message: string
}

const StaffCommands: React.FC<props> = (props) => {


	const [announcement, setAnnouncement] = useState(false)

	const handleAnnouncementOpen = () => {
		setAnnouncement(true)
	}

	const handleAnnouncementClose = () => {
		setAnnouncement(false)
	}

	const [announcementNessage, setAnnouncementMessage] = useState("")

	const updateAnnouncementMessage = (e: any) => {
		setAnnouncementMessage(e.target.value)
	}

	const handleAnnouncement = () => {
		if (announcementNessage === "") { 
			props.setNotifMessage("Please provide a valid announcement message") 
			return 
		}
		fetchNui<message>('announce', { message: announcementNessage }).then(resData => { 
			props.setNotifMessage("Announcement sent!")
			handleAnnouncementClose()
			setAnnouncementMessage("")
		})
	}

	const [spawnvehicle, setSpawnVehicle] = useState(false)

	const handleSpawnVehicleOpen = () => {
		setSpawnVehicle(true)
	}

	const handleSpawnVehicleClose = () => {
		setSpawnVehicle(false)
	}
	
	const [vehicleMessage, setVehicleMessage] = useState("")

	const updateVehicleMessage = (e: any) => {
		setVehicleMessage(e.target.value)
	}

	const handleVehicleMessage = () => {
		if (vehicleMessage === "") { 
			props.setNotifMessage("Please provide a valid car model") 
			return 
		}
		fetchNui<message>('spawnvehicle', { message: vehicleMessage }).then(resData => { 
			props.setNotifMessage("Vehicle spawn request sent!")
			handleSpawnVehicleClose()
			setVehicleMessage("")
		})
	}

	const [weather, setWeather] = useState(false)

	const handleWeatherOpen = () => {
		setWeather(true)
	}

	const handleWeatherClose = () => {
		setWeather(false)
	}

	const [currentWeather, setCurrentWeather] = useState({
		label: "Extra Sunny",
		value: 'extrasunny'
	})

	const updateCurrentWeather = (event, values) => {
		setCurrentWeather(values)
	}

	const handleWeatherChange = () => {
		fetchNui<message>('updateweather', { message: currentWeather.value }).then(resData => { 
			props.setNotifMessage("Weather change requested!")
			handleWeatherClose()
		})
	}

	const [tpcoords, setTpCoords] = useState(false)

	const handleTpCoordsOpen = () => {
		setTpCoords(true)
	}

	const handleTpCoordsClose = () => {
		setTpCoords(false)
	}

	const teleportWaypoint = () => {
		fetchNui('tpwaypoint').then(resData => { 
			props.setNotifMessage(resData)
		})
	}

	const [coordsMessage, setCoordsMessage] = useState("")

	const updateCoordsMessage = (e: any) => {
		setCoordsMessage(e.target.value)
	}

	const handleCoordsMessage = () => {
		if (coordsMessage === "") { 
			props.setNotifMessage("Please provide valid coordinates.") 
			return 
		}
		fetchNui<message>('tpcoords', { message: coordsMessage }).then(resData => { 
			handleTpCoordsClose()
			props.setNotifMessage(resData)
			setCoordsMessage("")
		})
	}

	useEffect(() => {
    // could ask for weather here and set the value of the weather box with it, if requested that is.
  }, []);

	const weatherOptions = [
		{ label: 'Extra Sunny', value: 'extrasunny' },
		{ label: 'Clear', value: 'clear' },
		{ label: 'Neutral', value: 'neutral' },
		{ label: 'Smog', value: 'smog' },
		{ label: 'Foggy', value: 'foggy' },
		{ label: 'Overcast', value: 'overcast' },
		{ label: 'Clouds', value: 'clouds' },
		{ label: 'Clearing', value: 'clearing' },
		{ label: 'Rain', value: 'rain' },
		{ label: 'Thunder', value: 'thunder' },
		{ label: 'Snow', value: 'snow' },
		{ label: 'Blizzard', value: 'blizzard' },
		{ label: 'Snowlight', value: 'snowlight' },
		{ label: 'XMAS', value: 'xmas' },
		{ label: 'Halloween', value: 'halloween' },
	];
	

	return (
		<div>
			
			<Dialog className="dialogBan" open={announcement} onClose={handleAnnouncementClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description2" >
				<DialogTitle id="alert-dialog-title"> {"Send Announcement"} </DialogTitle>
				<DialogContent>
				<TextField value={announcementNessage} onChange={updateAnnouncementMessage} label="Message" inputProps={{ spellCheck: true, lang: "English" }} multiline minRows={2} fullWidth sx={{marginBottom: '15px', marginTop:'5px' }} />
				<DialogContentText id="alert-dialog-description2">This will send a server-wide announcement, double check your message for errors, idiot. Oh, and keep in mind, the multi row thing doesn't work sadly, so everything will just be mashed up into one line when the announcement is sent :(</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleAnnouncementClose}>Cancel</Button>
					<Button onClick={handleAnnouncement} autoFocus>Announce</Button>
				</DialogActions>
			</Dialog>

			<Dialog className="dialogBan" open={spawnvehicle} onClose={handleSpawnVehicleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description2" >
				<DialogTitle id="alert-dialog-title"> {"Spawn Vehicle"} </DialogTitle>
				<DialogContent>
				<TextField value={vehicleMessage} onChange={updateVehicleMessage} label="Spawn Code" sx={{marginBottom: '15px', marginTop:'5px', width: 300 }} />
				<DialogContentText id="alert-dialog-description2">A vehicle with the model name you specified will spawn. You will be teleported inside.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSpawnVehicleClose}>Cancel</Button>
					<Button onClick={handleVehicleMessage} autoFocus>Spawn</Button>
				</DialogActions>
			</Dialog>

			<Dialog className="dialogBan" open={weather} onClose={handleWeatherClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description2" >
				<DialogTitle id="alert-dialog-title"> {"Set Weather"} </DialogTitle>
				<DialogContent>
				<Autocomplete value={currentWeather} onChange={updateCurrentWeather} id="combo-box-demo" options={weatherOptions} fullWidth sx={{marginTop: '5px', marginBottom: '15px'}} renderInput={(params) => <TextField {...params} label="Weather" />} />
				<DialogContentText id="alert-dialog-description2">Select an option from the auto complete form above to set the server-wide weather.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleWeatherClose}>Cancel</Button>
					<Button onClick={handleWeatherChange} autoFocus>Set Weather</Button>
				</DialogActions>
			</Dialog>

			<Dialog className="dialogBan" open={tpcoords} onClose={handleTpCoordsClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description2" >
				<DialogTitle id="alert-dialog-title"> {"Teleport to Coords"} </DialogTitle>
				<DialogContent>
				<TextField value={coordsMessage} onChange={updateCoordsMessage} label="Coordinates" sx={{marginBottom: '15px', marginTop:'5px', width: 300 }} />
				<DialogContentText id="alert-dialog-description2">Please provide a string in vector3 or vector4 format.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleTpCoordsClose}>Cancel</Button>
					<Button onClick={handleCoordsMessage} autoFocus>Teleport</Button>
				</DialogActions>
			</Dialog>

			<CardContent>
				<Grid container spacing={2} maxWidth={585}>
					<Grid item>
						<List dense={true}>
							<ListItemButton onClick={handleAnnouncementOpen}>
								<ListItemIcon>
									<AnnouncementIcon />
								</ListItemIcon>
								<ListItemText primary="Announce" secondary='Use this to announce a message to the whole server, please use wisely, no spelling/grammar mistakes!' />
							</ListItemButton>
							<ListItemButton onClick={handleSpawnVehicleOpen}>
								<ListItemIcon>
									<CarRentalIcon />
								</ListItemIcon>
								<ListItemText primary="Spawn Vehicle" secondary='Create a vehicle by specifying a spawn code, you will be automatically teleported inside.' />
							</ListItemButton>
							<ListItemButton onClick={handleWeatherOpen}>
								<ListItemIcon>
									<CloudIcon />
								</ListItemIcon>
								<ListItemText primary="Weather Options" secondary='Manage the weather, like Mother Nature!' />
							</ListItemButton>
							<ListItemButton onClick={teleportWaypoint}>
								<ListItemIcon>
									<LocationOnIcon />
								</ListItemIcon>
								<ListItemText primary="Teleport to Waypoint" secondary='Teleport to your currently set waypoint.' />
							</ListItemButton>
							<ListItemButton onClick={handleTpCoordsOpen}>
								<ListItemIcon>
									<MapIcon />
								</ListItemIcon>
								<ListItemText primary="Teleport to Coords" secondary='Input vector3 or vector4 coordinates to teleport to.' />
							</ListItemButton>
						</List>
					</Grid>
				</Grid>
			</CardContent>
		</div>
  );
}

export default StaffCommands;