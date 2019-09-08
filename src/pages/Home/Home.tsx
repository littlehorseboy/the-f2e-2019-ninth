import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { RouteComponentPropsI, RouteWithSubRoutes } from '../../router/Router';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles((theme) => createStyles({

}));

export default function Home(props: RouteComponentPropsI): JSX.Element {
  const classes = useStyles();

  return (
    <>
      123
    </>
  );
}
