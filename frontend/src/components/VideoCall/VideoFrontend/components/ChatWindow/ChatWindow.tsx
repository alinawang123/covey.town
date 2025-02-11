import { Alert, Stack } from '@chakra-ui/react';
import { Snackbar } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import ChatInput from './ChatInput/ChatInput';
import ChatWindowHeader from './ChatWindowHeader/ChatWindowHeader';
import MessageList from './MessageList/MessageList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chatWindowContainer: {
      background: '#FFFFFF',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid #E4E7E9',
      [theme.breakpoints.down('sm')]: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
      },
      position: 'fixed',
      bottom: 0,
      left: 0,
      top: 0,
      'max-width': '250px'
    },
    hide: {
      display: 'none',
    },
  })
);

// In this component, we are toggling the visibility of the ChatWindow with CSS instead of
// conditionally rendering the component in the DOM. This is done so that the ChatWindow is
// not unmounted while a file upload is in progress.

export default function ChatWindow() {
  const classes = useStyles();
  const { isChatWindowOpen, messages, conversation,open ,setOpen,errorMsg} = useChatContext();


  // const handleClick = () => {
  //   setOpen(true);
  // };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <aside className={clsx(classes.chatWindowContainer, { [classes.hide]: !isChatWindowOpen })}>
            {/* <Button variant="outlined" >
        Open success snackbar
      </Button> */}
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert  severity="error" sx={{ width: '100%' }} onClose={handleClose}>
            {errorMsg}
          </Alert>
        </Snackbar>
      </Stack>

      <ChatWindowHeader />
      <MessageList messages={messages} />
      <ChatInput conversation={conversation!} isChatWindowOpen={isChatWindowOpen} />
    </aside>
  );
}
