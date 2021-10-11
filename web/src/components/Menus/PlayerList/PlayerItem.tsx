import React, {useState, useEffect} from 'react';
import '../../App.css'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScreenshotIcon from '@mui/icons-material/Screenshot';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ListItemIcon from '@mui/material/ListItemIcon';
import GavelIcon from '@mui/icons-material/Gavel';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import {fetchNui} from "../../../utils/fetchNui";
import InfoIcon from '@mui/icons-material/Info';
import ExploreIcon from '@mui/icons-material/Explore';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import HealingIcon from '@mui/icons-material/Healing';

interface props {
	banPlayerPrompt: any,
	kickPlayerPrompt: any,
	setNotifMessage: any,
	id: number,
	steam: string,
	discord: string,
	fivem: string,
	name: string,
	note: string,
	setIdentifier: any,
	online: boolean
}

interface IdInterface {
	id: number
}

const PlayerItem: React.FC<props> = (props) => {

	const [open, setOpen] = useState(false);
	const [banOpen, setBanOpen] = useState(false);

	const handleClick = () => {
		setOpen(!open)
	}

	const handleClickOpen = () => {
		setBanOpen(true);
	};

	const handleClose = () => {
		setBanOpen(false);
	};

	const setIdentifier = (steam: string, discord: string, fivem: string, name: string) => {
		props.setIdentifier(steam, discord, fivem, name)
	}

	const banPlayer = () => {
		props.banPlayerPrompt(props.id, props.name)
	}

	const kickPlayer = () => {
		props.kickPlayerPrompt(props.id, props.name)
	}

	const spectatePlayer = () => {
		fetchNui<IdInterface>('spectatePlayer', { id: props.id }).then(resData => { 
			props.setNotifMessage(`Spectate toggled`)
		})
	}

	const teleportPlayer = () => {
		fetchNui<IdInterface>('gotoPlayer', { id: props.id }).then(resData => { 
			props.setNotifMessage(`You teleported to ${props.name}`)
		})
	}

	const screenshotPlayer = () => {
		fetchNui<IdInterface>('screenshotPlayer', { id: props.id }).then(resData => { 
			props.setNotifMessage(`A screenshot request for ${props.name} has been sent!`)
		})
		
	}

	const summonPlayer = () => {
		fetchNui<IdInterface>('tomePlayer', { id: props.id }).then(resData => { 
			props.setNotifMessage(`You brought ${props.name} to you`)
		})
	}

	const cloakPlayer = () => {
		fetchNui<IdInterface>('cloakPlayer', { id: props.id }).then(resData => { 
			props.setNotifMessage(`Cloak toggled for ${props.name}!`)
		})		
	}

	const infoPlayer = () => {
		fetchNui<IdInterface>('infoPlayer', { id: props.id }).then(resData => { 
			props.setNotifMessage(`Information for this ${props.name} has been requested.`)
		})
	}

	const healPlayer = () => {
		fetchNui<IdInterface>('healPlayer', { id: props.id }).then(resData => { 
			props.setNotifMessage(`You successfully healed ${props.name}`)
		})
	}


	return (<div>
		<Tooltip title={props.id} placement="left" arrow>
		<ListItemButton divider onClick={ () => /**setIdentifier(props.steam, props.discord, props.fivem, props.name)*/ handleClick() } className="playerItem" alignItems="flex-start" >
			<ListItemText primary={`${props.name}`} secondary={ (props.note !== "") ? props.note : "" } />
			<Stack direction="row" spacing={0.5}>
				<Chip label={ (props.online === true) ? "Online" : "Offline" } variant={"outlined"} size={"small"} color={ (props.online === true) ? "success" : "error" } />
				<Chip label={props.fivem} size={"small"} />
			</Stack>
			{open ? <ExpandLess /> : <ExpandMore />}
		</ListItemButton>
		</Tooltip><Collapse className="rowAlign" in={open} timeout="auto" unmountOnExit>
        <List component="div" dense={true} disablePadding>
					{/* Player Information */}
          <ListItemButton onClick={ () => setIdentifier(props.steam, props.discord, props.fivem, props.name) } sx={{ pl: 4 }}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="Player Info" />
          </ListItemButton>
					{/* Ban Player */}
          <ListItemButton onClick={banPlayer} sx={{ pl: 4 }}>
            <ListItemIcon>
              <GavelIcon />
            </ListItemIcon>
            <ListItemText primary="Ban Player" />
          </ListItemButton>
					{/* Kick Player */}
          <ListItemButton onClick={kickPlayer} sx={{ pl: 4 }}>
            <ListItemIcon>
              <PersonRemoveIcon />
            </ListItemIcon>
            <ListItemText primary="Kick Player" />
          </ListItemButton>
						{/* Spectate Player */}
						<ListItemButton onClick={spectatePlayer} sx={{ pl: 4 }}>
            <ListItemIcon>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText primary="Spectate Player" />
          </ListItemButton>
						{/* Teleport to Player */}
						<ListItemButton onClick={teleportPlayer} sx={{ pl: 4 }}>
            <ListItemIcon>
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText primary="Teleport to Player" />
          </ListItemButton>
					{/* Screenshot Player */}
					<ListItemButton onClick={screenshotPlayer} sx={{ pl: 4 }}>
            <ListItemIcon>
              <ScreenshotIcon />
            </ListItemIcon>
            <ListItemText primary="Screenshot Player" />
          </ListItemButton>
					{/* Summon Player */}
					<ListItemButton onClick={summonPlayer} sx={{ pl: 4 }}>
            <ListItemIcon>
              <AutoFixHighIcon />
            </ListItemIcon>
            <ListItemText primary="Summon Player" />
          </ListItemButton>
					{/* Cloak Player */}
					<ListItemButton onClick={cloakPlayer} sx={{ pl: 4 }}>
            <ListItemIcon>
              <VisibilityOffIcon />
            </ListItemIcon>
            <ListItemText primary="Cloak Player" />
          </ListItemButton>
					{/* Info Player */}
					<ListItemButton onClick={infoPlayer} sx={{ pl: 4 }}>
            <ListItemIcon>
              <ChromeReaderModeIcon />
            </ListItemIcon>
            <ListItemText primary="Modification Check" />
          </ListItemButton>
					{/* Heal Player */}
					<ListItemButton onClick={healPlayer} sx={{ pl: 4 }}>
            <ListItemIcon>
              <HealingIcon />
            </ListItemIcon>
            <ListItemText primary="Heal Player" />
          </ListItemButton>
        </List>
    </Collapse></div>);
}

export default PlayerItem;