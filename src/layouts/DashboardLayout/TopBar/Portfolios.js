import React, {
  useState,
  useRef
} from 'react';
import {
  Box,
  Button,
  Popover,
  Tooltip,
  Typography,
  makeStyles,
  FormControl,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Divider,
  useTheme
} from '@material-ui/core';
import { WorkOutline } from '@material-ui/icons'
import useData from 'src/hooks/useData';

const useStyles = makeStyles((theme) => ({
  popover: {
    width: 320,
    padding: theme.spacing(2)
  },
  button: {
    marginRight: theme.spacing(1)
  },
  formControl: {
    display: 'flex'
  }
}));

export default () => {
  const ref = useRef(null);
  const theme = useTheme();
  const classes = useStyles();
  const { portfolios, loading, selectedPortfolios, setSelectedPortfolios, getSelectedPortfoliosLength } = useData();
  const [isOpen, setOpen] = useState(false);
  const [noPortfoliosSelected, setNoPortfoliosSelected] = React.useState(false);
  const [allPortfoliosSelected, setAllPortfoliosSelected] = React.useState(true);
  const [tempSelectedPortfolios, tempSetSelectedPortfolios] = React.useState({});

  React.useEffect(() => {
    let allSelected = true;
    for (const key in tempSelectedPortfolios) {
      if (!tempSelectedPortfolios[key]) {
        allSelected = false;
      }
    }
    setAllPortfoliosSelected(allSelected);
    setNoPortfoliosSelected(Object.entries(tempSelectedPortfolios).map(([_, value]) => value).every(e => !e))
  }, [tempSelectedPortfolios]);

  const handleOpen = () => {
    tempSetSelectedPortfolios(selectedPortfolios);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onClickSave = () => {
    setSelectedPortfolios(tempSelectedPortfolios);
    setOpen(false);
    localStorage.setItem('selectedPortfolios', JSON.stringify(tempSelectedPortfolios));
  };

  const handleChange = (event) => {
    if (!portfolios.length) {
      return;
    }

    if (event.target.name === 'all' && event.target.checked) {
      for (const key in tempSelectedPortfolios) {
        tempSetSelectedPortfolios(s => ({ ...s, [key]: true }));
      }
    } else if (event.target.name === 'all' && !event.target.checked) {
      for (const key in tempSelectedPortfolios) {
        tempSetSelectedPortfolios(s => ({ ...s, [key]: false, default: true }));
      }
    } else if (false) {
      // else if all is not selected an nothing else is selected, select default only
    } else {
      tempSetSelectedPortfolios(s => ({ ...s, [event.target.name]: event.target.checked }));
    }

  };

  return (
    <>
      <Tooltip title="Selected Portfolios">
        <span>
          <Button
            // variant="outlined"
            onClick={handleOpen}
            ref={ref}
            disabled={loading}
            className={classes.button}
            startIcon={<WorkOutline />}
            color='inherit'
            size='large'
            style={{ color: getSelectedPortfoliosLength() !== 0 && getSelectedPortfoliosLength() !== 'All' && theme.palette.error.main }}
          >
            {`Portfolios (${getSelectedPortfoliosLength()})`}
          </Button>
        </span>
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
        <Typography
          variant="h4"
          color="textPrimary"
        >
          Selected Portfolios
        </Typography>
        <Box mt={2}>
          <FormControl component="fieldset" className={classes.formControl}>
            {/* <FormControl component="fieldset" className={classes.formControl}> */}
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={allPortfoliosSelected} onChange={handleChange} name="all" />}
                label="View All"
              />
              <Divider />
              {portfolios.sort((a, b) => a.name.localeCompare(b.name)).map(e => (
                <FormControlLabel
                  key={e.id}
                  control={<Checkbox checked={tempSelectedPortfolios[e.id]} onChange={handleChange} name={e.id} />}
                  label={e.name}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>
        <Box mt={2}>
          <Typography
            variant='subtitle2'
            color={noPortfoliosSelected ? 'error' : 'textPrimary'}
          >
            {noPortfoliosSelected ? 'You must select at least one portfolio.' : 'You can create new Portfolios on the Portfolios page.'}
          </Typography>
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={onClickSave}
            disabled={noPortfoliosSelected}
          >
            Save Selection
          </Button>
        </Box>
      </Popover>
    </>
  );
}

