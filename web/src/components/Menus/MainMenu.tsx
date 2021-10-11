import React, {useState, useEffect} from 'react';
import '../App.css'

import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import PeopleIcon from '@mui/icons-material/People';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SettingsIcon from '@mui/icons-material/Settings';

import { Link } from 'react-router-dom'

interface props {
}

const MainMenu: React.FC<props> = (props) => {

	const navStyle = {
		color: 'white',
		textDecoration: 'none'
	}

	return (
    <CardContent>
			<Grid container spacing={2} width={485}>
				<Grid item>
					<List dense={true}>
						<Link style={navStyle} to='/playermanagement'>
							<ListItemButton>
								<ListItemIcon>
									<PeopleIcon />
								</ListItemIcon>
								<ListItemText primary="Player Management" secondary='View a list of player management options where you can execute bans, unbans, spectate and much more.' />
							</ListItemButton>
						</Link>
						<Link style={navStyle} to='/staffcommands'>
							<ListItemButton>
								<ListItemIcon>
									<KeyboardIcon />
								</ListItemIcon>
								<ListItemText primary="Staff Commands" secondary='Access a list of quick admin commands, including announcements, vehicle spawning and teleportation.' />
							</ListItemButton>
						</Link>
						<Link style={navStyle} to='/utilityactions'>
							<ListItemButton>
								<ListItemIcon>
									<SettingsIcon />
								</ListItemIcon>
								<ListItemText primary="Utility" secondary='Misc. actions such as vehicle repair, entity removal and plate management!' />
							</ListItemButton>
						</Link>
					</List>
				</Grid>
			</Grid>
		</CardContent>
  );
}

export default MainMenu;