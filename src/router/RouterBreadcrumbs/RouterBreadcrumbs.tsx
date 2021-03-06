import React from 'react';
import uuidv4 from 'uuid/v4';
import { Link as RouterLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { routes, RouteI } from '../Router';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles((theme) => createStyles({
  root: {
    marginTop: theme.spacing(0.5),
  },
  breadcrumbs: {
    color: '#FFFFFF',
    '& > ol > li > *': {
      fontSize: '0.9rem',
    },
  },
}));

function RouterBreadcrumbs(props: RouteComponentProps): JSX.Element {
  const classes = useStyles();

  const { match } = props;

  const matchPathName = match.path.slice(-1) === '/' ? match.path.slice(0, -1) : match.path;

  const splitMatchPathName = matchPathName.split('/')
    .map((str, index): string => matchPathName.split('/').slice(0, index + 1).join('/'))
    .map((str): string => {
      if (str) {
        return str;
      }
      return '/';
    });

  const flatRoutes: RouteI[] = [];
  function flatRoutesFunc(internalRoutes: RouteI[]): void {
    internalRoutes.forEach((route): void => {
      flatRoutes.push(route);
      if (route.routes) {
        flatRoutesFunc(route.routes);
      }
    });
  }
  flatRoutesFunc(routes);

  let pathNameBreadcrumbs = splitMatchPathName
    .map((pathName): RouteI | undefined => flatRoutes
      .find((route): boolean => route.path === pathName));

  pathNameBreadcrumbs = pathNameBreadcrumbs.filter((route): boolean => route !== undefined && route.breadcrumbName !== '');

  return (
    <div className={classes.root}>
      <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
        {pathNameBreadcrumbs
          .map((route, index): JSX.Element => (
            <React.Fragment key={uuidv4()}>
              {route && (
                pathNameBreadcrumbs.length === index + 1
                  ? (
                    <Typography>
                      {route.breadcrumbName}
                    </Typography>
                  )
                  : (
                    <Link color="inherit" component={RouterLink} to={route.path}>
                      {route.breadcrumbName}
                    </Link>
                  )
              )}
            </React.Fragment>
          ))}
      </Breadcrumbs>
    </div>
  );
}

export default withRouter(RouterBreadcrumbs);
