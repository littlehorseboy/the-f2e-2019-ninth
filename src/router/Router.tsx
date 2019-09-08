import React from 'react';
import { HashRouter, Route, RouteComponentProps } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import IsLoading from '../components/IsLoading/IsLoading';
import Home from '../pages/Home/Home';

interface RouteWithSubRoutesPropsI {
  route: RouteI;
}

export function RouteWithSubRoutes(props: RouteWithSubRoutesPropsI): JSX.Element {
  const { route } = props;

  return (
    <Route
      path={route.path}
      render={(renderProps): JSX.Element => (
        <route.Component routeComponentProps={renderProps} routes={route.routes} />
      )}
    />
  );
}

export interface RouteComponentPropsI {
  routeComponentProps: RouteComponentProps;
  routes?: RouteI[];
}

export interface RouteI {
  path: string;
  name: string;
  Component: (props: RouteComponentPropsI) => JSX.Element;
  breadcrumbName: string;
  routes?: RouteI[];
}

export const routes: RouteI[] = [
  {
    path: '/',
    name: 'home',
    Component: Home,
    breadcrumbName: '',
    routes: [
      {
        path: '/note',
        name: 'note',
        Component: Home,
        breadcrumbName: '所有記事',
        routes: [
          {
            path: '/note/TheF2E/:note',
            name: 'TheF2E',
            Component: Home,
            breadcrumbName: 'The F2E',
          },
        ],
      },
      {
        path: '/star',
        name: 'star',
        Component: Home,
        breadcrumbName: '已加星號',
      },
      {
        path: '/share',
        name: 'share',
        Component: Home,
        breadcrumbName: '與我共享',
      },
      {
        path: '/trashCan',
        name: 'trashCan',
        Component: Home,
        breadcrumbName: '垃圾桶',
      },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles(() => createStyles({
  root: {
    fontFamily: 'system-ui, -apple-system, "Roboto", "Helvetica", "Arial", sans-serif',
    minHeight: '100vh',
  },
}));

export default function Router(): JSX.Element {
  const classes = useStyles();

  return (
    <HashRouter>
      <div className={classes.root}>
        {routes.map((route): JSX.Element => (
          <React.Fragment key={route.path}>
            <RouteWithSubRoutes route={route} />
          </React.Fragment>
        ))}

        <IsLoading />
      </div>
    </HashRouter>
  );
}
