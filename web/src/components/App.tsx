import React, {useState} from 'react';
import './App.css'
import {useNuiEvent} from "../hooks/useNuiEvent";
import {useExitListener} from "../hooks/useExitListener";
import Snackbar from '@mui/material/Snackbar';
import {BrowserRouter as Router, Switch, Route, useHistory} from 'react-router-dom';
import MainMenu from './Menus/MainMenu'
import PlayerManagement from './Menus/PlayerManagement'
import PlayerList from './Menus/PlayerList'
import Identifiers from './Misc/Identifiers'
import StaffCommands from './Menus/StaffCommands'
import Card from '@mui/material/Card';
import UtilityActions from './Menus/UtilityActions'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// This will set the NUI to visible if we are
// developing in browser
/**debugData([
  {
    action: 'setVisible',
    data: true,
  }
])*/

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
});

const App: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [playerCount, setPlayerCount] = useState(0)
  const [maxPlayerCount, setMaxPlayerCount] = useState(0)

  useNuiEvent<boolean>('setVisible', (data) => {
    setIsVisible(data)
  })

  useNuiEvent<number>('playerCount', (data) => {
    setPlayerCount(data)
  })

  useExitListener(setIsVisible)

  useNuiEvent<number>('maxPlayerCount', (data) => {
    setMaxPlayerCount(data)
  })

  let history = useHistory();

  const GoBack = () => {
    history.goBack();
  }

  const handleRefresh = () => {
    setRefresh(!refresh)
  }

  const [notification, setNotification] = useState(false)
	const [notificiationMessage, setNotificationMessage] = useState("")

  const setNotifMessage = (message: string) => {
		setNotificationMessage(message)
		setNotification(true)
	}

  const handleCloseNotif = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setNotification(false);
  };

  const goHome = () => {
    history.push("/");
  }

  return (
      <div className="App" >
         <Snackbar open={notification} autoHideDuration={2500} onClose={handleCloseNotif} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} >
          <Alert onClose={handleCloseNotif} variant="filled" severity="success" sx={{ width: '100%' }}>{notificiationMessage}</Alert>
        </Snackbar>
        <div style={{ display: isVisible ? '' : 'none' }}>
          <ThemeProvider theme={darkTheme}>
            <Identifiers />
            <Card sx={{ minWidth: 500, maxWidth: 500, maxHeight: 600, overflow: 'auto' }} >
              <AppBar position="static">
                <Toolbar>
                  <IconButton size="large" onClick={GoBack} edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}> EchoRP ACP ({playerCount}/{maxPlayerCount}) </Typography>
                  <Button color="inherit" onClick={goHome}>Home</Button>
                </Toolbar>
              </AppBar>
              <Switch>
                <Route path="/" exact render={() => <MainMenu />} />
                <Route path="/web/build/index.html" exact render={() => <MainMenu  />} />
                <Route path="/playermanagement" exact render={() => <PlayerManagement  playercount={playerCount} maxcount={maxPlayerCount} setNotifMessage={setNotifMessage}  />} />
                <Route path="/playerlist" exact render={() => <PlayerList  refresh={handleRefresh} setNotifMessage={setNotifMessage} />} />
                <Route path="/staffcommands" exact render={() => <StaffCommands  playercount={playerCount} maxcount={maxPlayerCount} setNotifMessage={setNotifMessage}  />} />
                <Route path="/utilityactions" exact render={() => <UtilityActions  playercount={playerCount} maxcount={maxPlayerCount} setNotifMessage={setNotifMessage}  />} />
              </Switch>
            </Card>
          </ThemeProvider>
        </div>
      </div>

  );
}

export default App;
