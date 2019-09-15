import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles((theme) => createStyles({
  buttonBase: {
    minWidth: 125,
    minHeight: 40,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    border: '2px solid currentColor',
    '&:hover': {
      zIndex: 1,
      '& $backdrop': {
        opacity: 0.15,
      },
    },
  },
  leftRightBorder: {
    width: '85%',
    height: '100%',
    position: 'absolute',
    borderLeft: '2px solid currentColor',
    borderRight: '2px solid currentColor',
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0,
    transition: theme.transitions.create('opacity'),
  },
}));

interface PropsI {
  children: React.ReactChild;
  to?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function ButtonBases(props: PropsI): JSX.Element {
  const classes = useStyles();

  const { children, to, onClick } = props;

  return (
    to
      ? (
        <ButtonBase
          focusRipple
          className={classes.buttonBase}
          component={Link}
          to={to}
        >
          <Typography>{children}</Typography>
          <span className={classes.leftRightBorder} />
          <span className={classes.backdrop} />
        </ButtonBase>
      )
      : (
        <ButtonBase
          focusRipple
          className={classes.buttonBase}
          onClick={onClick}
        >
          <Typography>{children}</Typography>
          <span className={classes.leftRightBorder} />
          <span className={classes.backdrop} />
        </ButtonBase>
      )
  );
}
