import React, {useState, useEffect} from 'react';
import '../App.css'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import PaymentIcon from '@mui/icons-material/Payment';

import {fetchNui} from "../../utils/fetchNui";

interface props {
	playercount: number,
	maxcount: number,
	setNotifMessage: any
}

interface message {
	message: string
}

const UtilityActions: React.FC<props> = (props) => {

	const [plate, setPlate] = useState(false)

	const handlePlateOpen = () => {
		setPlate(true)
	}

	const handlePlateClose = () => {
		setPlate(false)
	}

	const [clear, setClear] = useState(false)

	const handleClearOpen = () => {
		setClear(true)
	}

	const handleClearClose = () => {
		setClear(false)
	}

	const noClip = () => {
		fetchNui('noclip')
	}
	
	const clearOptions = [
		{ label: '10 Radius', value: 10.0 },
		{ label: '25 Radius', value: 25.0 },
		{ label: '50 Radius', value: 50.0 },
		{ label: '75 Radius', value: 75.0 },
		{ label: '100 Radius', value: 100.0 },
		{ label: '125 Radius', value: 125.0 },
		{ label: '150 Radius', value: 150.0 },
		{ label: '175 Radius', value: 175.0 },
		{ label: '200 Radius', value: 200.0 },
		{ label: '250 Radius', value: 250.0 },
	];

	const repairVehicle = () => {
		fetchNui('repairvehicle')
		props.setNotifMessage("Vehicle should be repaired.")
	}

	const [plateMessage, setPlateMessage] = useState("")

	const updatePlateMessage = (e: any) => {
		setPlateMessage(e.target.value)
	}

	const handlePlateMessage = () => {
		if (plateMessage === "") { 
			props.setNotifMessage("Please provide a valid plate.") 
			return 
		}
		fetchNui<message>('changeplate', { message: plateMessage }).then(resData => { 
			props.setNotifMessage("Number plate changed.")
			handlePlateClose()
			setPlateMessage("")
		})
	}

	const [clearArea, setClearArea] = useState({ label: '100 Radius', value: 100.0 })

	const updateClearArea = (event, values) => {
		setClearArea(values)
	}

	const handleClearAreaChange = () => {
		fetchNui<message>('cleararea', { message: clearArea.value }).then(resData => { 
			props.setNotifMessage("Area cleared!")
			handleClearClose()
		})
	}

	const deleteVehicle = () => {
		fetchNui('deleteVehicle')
	}

	const deleteEntity = () => {
		fetchNui('deleteEntity')
	}

	const deletePed = () => {
		fetchNui('deletePed')
	}

	const deleteAllVehicles = () => {
		fetchNui('deleteAllVehicles')
	}

	const magicTrick = () => {
		fetchNui('magicTrick')
	}

	const playerNames = () => {
		fetchNui('playerNames')
	}

	return (
		<div>
			
			<Dialog className="dialogBan" open={clear} onClose={handleClearClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description2" >
				<DialogTitle id="alert-dialog-title"> {"Clear Area"} </DialogTitle>
				<DialogContent>
				<Autocomplete value={clearArea} onChange={updateClearArea} id="combo-box-demo" options={clearOptions} fullWidth sx={{marginTop: '5px', marginBottom: '15px'}} renderInput={(params) => <TextField {...params} label="Clear Area" />} />
				<DialogContentText id="alert-dialog-description2">Select an option from the auto complete form above to clear {clearArea.value} radius area around you.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClearClose}>Cancel</Button>
					<Button onClick={handleClearAreaChange} autoFocus>Clear Area</Button>
				</DialogActions>
			</Dialog>

			<Dialog className="dialogBan" open={plate} onClose={handlePlateClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description2" >
				<DialogTitle id="alert-dialog-title"> {"Change Plate"} </DialogTitle>
				<DialogContent>
				<TextField value={plateMessage} onChange={updatePlateMessage} label="Plate" sx={{marginBottom: '15px', marginTop:'5px', width: 300 }} />
				<DialogContentText id="alert-dialog-description2">Specify a vehicle plate for the vehicle you are currently sitting in.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handlePlateClose}>Cancel</Button>
					<Button onClick={handlePlateMessage} autoFocus>Set Plate</Button>
				</DialogActions>
			</Dialog>

			<CardContent>
				<Grid container spacing={2} maxWidth={585}>
					<Grid item>
						<List dense={true}>
							<ListItemButton onClick={repairVehicle}>
								<ListItemIcon>
									<HomeRepairServiceIcon />
								</ListItemIcon>
								<ListItemText primary="Repair Vehicle" secondary='Repair and clean the vehicle you are currently sitting in.' />
							</ListItemButton>
							<ListItemButton onClick={handlePlateOpen}>
								<ListItemIcon>
									<PaymentIcon />
								</ListItemIcon>
								<ListItemText primary="Change Plate" secondary='Change the plate of the vehicle you are sitting in, maximum 8 characters.' />
							</ListItemButton>
							<ListItemButton onClick={handleClearOpen}>
								<ListItemIcon>
									<ClearAllIcon />
								</ListItemIcon>
								<ListItemText primary="Clear Area" secondary='Clear the area of objects and abandoned NPC vehicles.' />
							</ListItemButton>
							<ListItemButton onClick={deleteVehicle}>
								<ListItemIcon>
									<DeleteForeverIcon />
								</ListItemIcon>
								<ListItemText primary="Delete Vehicle" secondary='This will delete the closest vehicle to you.' />
							</ListItemButton>
							<ListItemButton onClick={deleteEntity}>
								<ListItemIcon>
									<DeleteForeverIcon />
								</ListItemIcon>
								<ListItemText primary="Delete Entity" secondary='Delete the closest entity to you.' />
							</ListItemButton>
							<ListItemButton onClick={deletePed}>
								<ListItemIcon>
									<DeleteForeverIcon />
								</ListItemIcon>
								<ListItemText primary="Delete Ped" secondary='Delete the closest ped to you.' />
							</ListItemButton>
							<ListItemButton onClick={deleteAllVehicles}>
								<ListItemIcon>
									<DeleteSweepIcon />
								</ListItemIcon>
								<ListItemText primary="Delete All Vehicles" secondary='Careful with this, it will delete all the vehicles in the server.' />
							</ListItemButton>
							<ListItemButton onClick={noClip}>
								<ListItemIcon>
									<FlightTakeoffIcon />
								</ListItemIcon>
								<ListItemText primary="No Clip" secondary='Toggle no clip.' />
							</ListItemButton>
							<ListItemButton onClick={magicTrick}>
								<ListItemIcon>
									<VisibilityOffIcon />
								</ListItemIcon>
								<ListItemText primary="Magic Trick" secondary='Do a magic trick and set yourself invisible to others!' />
							</ListItemButton>
							<ListItemButton onClick={playerNames}>
								<ListItemIcon>
									<PermIdentityIcon />
								</ListItemIcon>
								<ListItemText primary="Show Player Names" secondary='Toggle overhead player names.' />
							</ListItemButton>
						</List>
					</Grid>
				</Grid>
			</CardContent>
		</div>
  );
}

export default UtilityActions;