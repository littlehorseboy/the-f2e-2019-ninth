import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { RouteComponentPropsI, RouteWithSubRoutes } from '../../router/Router';

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
  },
  listItem: {
    '& + .MuiCollapse-container': {
      paddingLeft: theme.spacing(2),
    },
  },
}));

export default function Home(props: RouteComponentPropsI): JSX.Element {
  const classes = useStyles();

  const { routes } = props;

  const [myCloudDriveOpen, setMyCloudDriveOpen] = useState(true);

  const [folderOpen, setFolderOpen] = useState(true);

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <Button>新增筆記</Button>

        <div>
          <List component="nav">
            <ListItem
              button
              className={classes.listItem}
              onClick={(): void => setMyCloudDriveOpen(!myCloudDriveOpen)}
            >
              所有記事
              {myCloudDriveOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
            </ListItem>
            <Collapse in={myCloudDriveOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.listItem}
                  onClick={(): void => setFolderOpen(!folderOpen)}
                >
                  The F2E
                  {myCloudDriveOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
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
              component={Link}
              to="/star"
            >
              已加星號
              {myCloudDriveOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/star"
            >
              與我共享
              {myCloudDriveOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/star"
            >
              垃圾桶
            </ListItem>
          </List>
        </div>

        <Button>所有記事</Button>
      </div>

      <div>

        {routes && routes.map((route): JSX.Element => (
          <React.Fragment key={route.path}>
            <RouteWithSubRoutes route={route} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
