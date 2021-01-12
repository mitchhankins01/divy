import React, {
  useRef,
  useState
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  SvgIcon,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  Bell as BellIcon,
  Package as PackageIcon,
  MessageCircle as MessageIcon,
  Truck as TruckIcon
} from 'react-feather';

const iconsMap = {
  order_placed: PackageIcon,
  new_message: MessageIcon,
  item_shipped: TruckIcon
};

const useStyles = makeStyles((theme) => ({
  popover: {
    width: 320
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  },
  badge: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 5
  },
  badgeHide: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 5,
    display: 'none',
  }
}));

const Notifications = () => {
  const classes = useStyles();
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [notifications, setNotifications] = React.useState([
    { title: 'Test Notification 0', description: 'Test Notification 0 Description', id: 0, type: 'order_placed' },
    { title: 'Test Notification 1', description: 'Test Notification 1 Description', id: 1, type: 'new_message' },
    { title: 'Test Notification 2', description: 'Test Notification 2 Description', id: 2, type: 'item_shipped' },
  ]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   dispatch(getNotifications());
  // }, [dispatch]);

  return (
    <>
      <Tooltip title="Settings">
        <Badge
          color="secondary"
          variant="dot"
          classes={{ badge: notifications.length !== 0 ? classes.badge : classes.badgeHide }}
        >
          <IconButton
            color="inherit"
            ref={ref}
            onClick={handleOpen}
          >
            <SvgIcon>
              <BellIcon />
            </SvgIcon>
          </IconButton>
        </Badge>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        classes={{ paper: classes.popover }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <Box p={2}>
          <Typography
            variant="h5"
            color="textPrimary"
          >
            Notifications
          </Typography>
        </Box>
        {notifications.length === 0 ? (
          <Box p={2}>
            <Typography
              variant="h6"
              color="textPrimary"
            >
              There are no notifications
            </Typography>
          </Box>
        ) : (
            <>
              <List disablePadding>
                {notifications.map((notification) => {
                  const Icon = iconsMap[notification.type];

                  return (
                    <ListItem
                      component={RouterLink}
                      divider
                      key={notification.id}
                      to="#"
                    >
                      <ListItemAvatar>
                        <Avatar
                          className={classes.icon}
                        >
                          <SvgIcon fontSize="small">
                            <Icon />
                          </SvgIcon>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.title}
                        primaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
                        secondary={notification.description}
                      />
                    </ListItem>
                  );
                })}
              </List>
              <Box
                p={1}
                display="flex"
                justifyContent="center"
              >
                <Button
                  component={RouterLink}
                  size="small"
                  to="#"
                  onClick={() => setNotifications([])}
                >
                  Mark all as read
              </Button>
              </Box>
            </>
          )}
      </Popover>
    </>
  );
};

export default Notifications;
