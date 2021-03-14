import React from 'react';
import clsx from 'clsx';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemText,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles((theme) => ({
  root: {},
  viewButton: {
    marginLeft: theme.spacing(2)
  },
  avatar: {
    marginRight: theme.spacing(1)
  }
}));

const NewsItem = ({ className, item, ...rest }) => {
  const classes = useStyles();

  return (
    <ListItem
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Avatar src={item.image} className={classes.avatar} />
      <ListItemText
        primary={item.headline}
        primaryTypographyProps={{ variant: 'h6', noWrap: true }}
        secondary={`${item.source} - ${new Date(item.datetime).toDateString()}`}
      />
      <Tooltip title="View Story">
        <IconButton className={classes.viewButton} onClick={() => window.open(item.url, '_blank')}>
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
};

export default NewsItem;
