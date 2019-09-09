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
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PersonIcon from '@material-ui/icons/Person';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import ListIcon from '@material-ui/icons/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
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
    paddingRight: theme.spacing(5),
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
  rightContainer: {
    flexGrow: 1,
    '& > div:first-child': {
      borderBottom: '2px solid currentColor',
    },
  },
  headerArrowContainer: {
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerToolbarContainer: {
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(20),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  toggleButtonGroup: {
    backgroundColor: 'transparent',
    '& > button.MuiToggleButton-root': {
      color: 'currentColor',
      borderColor: 'currentColor',
      borderRadius: 0,
      '&.Mui-selected': {
        backgroundColor: '#616F99',
      },
    },
  },
}));

export default function Home(props: RouteComponentPropsI): JSX.Element {
  const classes = useStyles();

  const { routes } = props;

  const [noteOpen, setNoteOpen] = useState(true);

  const [folderOpen, setFolderOpen] = useState(true);

  const [viewMode, setViewMode] = useState('list');

  const handleChangeViewMode = (
    event: React.MouseEvent<HTMLElement, MouseEvent>, mode: string | null,
  ): void => {
    if (mode) {
      setViewMode(mode);
    }
  };

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
              onClick={(): void => setNoteOpen(!noteOpen)}
            >
              所有記事
              {noteOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={noteOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.listItem}
                  onClick={(): void => setFolderOpen(!folderOpen)}
                >
                  The F2E
                  {folderOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
                <Collapse in={folderOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem
                      button
                      component={Link}
                      to="/folder/graphicDesign"
                    >
                      Note
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to="/folder/uidesign"
                    >
                      Cloud drive
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to="/folder/illustration"
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
              {noteOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>

            <ListItem
              button
              className={classNames(classes.listItem, 'title')}
              component={Link}
              to="/star"
            >
              與我共享
              {noteOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>

            <ListItem
              button
              className={classNames(classes.listItem, 'title')}
              component={Link}
              to="/star"
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

      <div className={classes.rightContainer}>
        <div>
          <div className={classes.headerArrowContainer}>
            <IconButton color="inherit">
              <ArrowBackIcon />
            </IconButton>
            <IconButton color="inherit">
              <ArrowForwardIcon />
            </IconButton>
          </div>
          <div className={classes.headerToolbarContainer}>
            <IconButton color="inherit">
              <WbSunnyOutlinedIcon />
            </IconButton>
            <ToggleButtonGroup
              className={classes.toggleButtonGroup}
              value={viewMode}
              size="small"
              exclusive
              onChange={handleChangeViewMode}
            >
              <ToggleButton value="list">
                <ListIcon />
              </ToggleButton>
              <ToggleButton value="grid">
                <DashboardIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>

        <div>
          {/* 麵包屑 */}

          {routes && routes.map((route): JSX.Element => (
            <React.Fragment key={route.path}>
              <RouteWithSubRoutes route={route} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
