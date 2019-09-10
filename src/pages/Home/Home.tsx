import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PersonIcon from '@material-ui/icons/Person';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { RouteComponentPropsI, RouteWithSubRoutes } from '../../router/Router';
import CustomButton from '../../components/UI/CustomButton/CustomButton';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const separateDarkImg = require('../../assets/images/separate_dark.png');

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles((theme) => createStyles({
  root: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#2F3956',
    color: '#FFFFFF',
    display: 'flex',
  },
  sidebar: {
    width: 300,
    paddingBottom: 30,
  },
  newNoteButtonContainer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  listContainer: {
    height: 'calc(100% - 48px - 104px)',
  },
  listItem: {
    '&.title': {
      fontSize: '1.1rem',
      '&:not(:first-child)': {
        marginTop: theme.spacing(2),
      },
    },
    '& + .MuiCollapse-container': {
      paddingLeft: theme.spacing(3),
    },
  },
  userContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(6),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > div:first-child': {
      display: 'flex',
      alignItems: 'center',
      '& > span': {
        paddingLeft: theme.spacing(2),
      },
    },
  },
  separateImgDiv: {
    backgroundImage: `url(${separateDarkImg})`,
    position: 'absolute',
    top: 0,
    left: 'calc(300px - 42.5px)',
    width: 85,
    height: '100%',
  },
}));

export default function Home(props: RouteComponentPropsI): JSX.Element {
  const classes = useStyles();

  const { routes } = props;

  const [noteOpen, setNoteOpen] = useState(true);

  const [folderOpen, setFolderOpen] = useState(true);

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <Grid container justify="center" className={classes.newNoteButtonContainer}>
          <CustomButton>新增筆記</CustomButton>
        </Grid>

        <div className={classes.listContainer}>
          <List component="nav">
            <ListItem
              button
              className={classNames(classes.listItem, 'title')}
              component={Link}
              to="/note"
            >
              所有記事
              <IconButton
                color="inherit"
                size="small"
                onClick={(e): void => {
                  e.stopPropagation();
                  e.preventDefault();
                  setNoteOpen(!noteOpen);
                }}
              >
                {noteOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </ListItem>
            <Collapse in={noteOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.listItem}
                  component={Link}
                  to="/note?folder=The F2E"
                >
                  The F2E
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={(e): void => {
                      e.stopPropagation();
                      e.preventDefault();
                      setFolderOpen(!folderOpen);
                    }}
                  >
                    {folderOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </ListItem>
                <Collapse in={folderOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem
                      button
                      component={Link}
                      to="/note?folder=The F2E&note=Note"
                    >
                      Note
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to="/note?folder=The F2E&note=Cloud drive"
                    >
                      Cloud drive
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to="/note?folder=The F2E&note=Chatting room"
                    >
                      Chatting room
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </Collapse>

            <ListItem
              button
              className={classNames(classes.listItem, 'title')}
              component={Link}
              to="/star"
            >
              已加星號
            </ListItem>

            <ListItem
              button
              className={classNames(classes.listItem, 'title')}
              component={Link}
              to="/share"
            >
              與我共享
            </ListItem>

            <ListItem
              button
              className={classNames(classes.listItem, 'title')}
              component={Link}
              to="/trashCan"
            >
              垃圾桶
            </ListItem>
          </List>
        </div>

        <div className={classes.userContainer}>
          <div>
            <Avatar>
              <PersonIcon />
            </Avatar>
            <span>HORSE</span>
          </div>
          <div>
            <IconButton color="inherit">
              <SettingsOutlinedIcon />
            </IconButton>
          </div>
        </div>

        <div className={classes.separateImgDiv} />
        {/* <img src={separateDarkImg} alt="" /> */}
      </div>

      {routes && routes.map((route): JSX.Element => (
        <React.Fragment key={route.path}>
          <RouteWithSubRoutes route={route} />
        </React.Fragment>
      ))}
    </div>
  );
}
