import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux';
import { setIdentifiers } from '../../redux/actions/identifiers'

export default function Identifiers() {
  const [open, setOpen] = React.useState(false);

  const identifiersState = useSelector((state: RootStateOrAny) => state.identifiers);
  const identifiers = identifiersState.currentIdentifiers
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (identifiers.show) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [identifiersState]); 
  
  const handleClose = () => {
    setOpen(false);
    dispatch(setIdentifiers({
			steam: identifiers.steam,
			discord: identifiers.discord,
			fivem: identifiers.fivem,
			show: false,
      name: identifiers.name
		}))
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Player Identifiers"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">You can find a list of <b>{identifiers.name}</b>'s identifiers below!<br /><br />Steam: <b>{identifiers.steam}</b><br />Discord: <b>{identifiers.discord}</b><br />FiveM: <b>{identifiers.fivem}</b><br /></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}