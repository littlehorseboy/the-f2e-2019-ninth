import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Editor, EditorState, RichUtils, DraftHandleValue, convertToRaw, convertFromRaw,
} from 'draft-js';
import classNames from 'classnames';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import ListIcon from '@material-ui/icons/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { RouteComponentPropsI } from '../../router/Router';
import CustomButton from '../../components/UI/CustomButton/CustomButton';
import { storeTypes } from '../../reducers/configureStore';
import { NoteI } from '../../reducers/notes/notes';
import { saveContentState } from '../../actions/notes/notes';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles((theme) => createStyles({
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
  main: {
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    color: '#FFFFFF',
  },
  breadcrumbs: {
    color: '#FFFFFF',
  },
  gridContainer: {
    paddingTop: theme.spacing(2),
  },
}));

export default function Note(props: RouteComponentPropsI): JSX.Element {
  const classes = useStyles();

  const { routeComponentProps } = props;

  const [viewMode, setViewMode] = useState('list');

  const handleChangeViewMode = (
    event: React.MouseEvent<HTMLElement, MouseEvent>, mode: string | null,
  ): void => {
    if (mode) {
      setViewMode(mode);
    }
  };

  const notes = useSelector((
    state: storeTypes,
  ): NoteI[] => state.notesReducer.notes);

  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(routeComponentProps.location.search);

  const folderSearchParam = searchParams.get('folder');

  const noteSearchParam = searchParams.get('note');

  const foundNote = notes.find((note): boolean => note.name === noteSearchParam);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleChangeEditorState = (internalEditorState: EditorState): void => {
    setEditorState(internalEditorState);
    if (foundNote && internalEditorState.getCurrentContent() !== editorState.getCurrentContent()) {
      dispatch(saveContentState(
        foundNote.id,
        JSON.stringify(convertToRaw(
          internalEditorState.getCurrentContent(),
        )),
      ));
    }
  };

  useEffect((): void => {
    const currentEditorState = foundNote
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(foundNote.contentState)))
      : EditorState.createEmpty();

    setEditorState(currentEditorState);
  }, [folderSearchParam, noteSearchParam]);

  const handleKeyCommand = (
    command: string,
    internalEditorState: EditorState,
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(internalEditorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleBoldClick = (): void => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const handleSubmit = (): void => {
    console.log(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
  };

  return (
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
          <Button color="secondary" onClick={handleBoldClick}>Bold</Button>
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

      <div className={classes.main}>
        <Container maxWidth={false}>
          <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
            <Link color="inherit" component={RouterLink} to="/note">
              所有記事
            </Link>
            {folderSearchParam && (
              <>
                {noteSearchParam ? (
                  <Link color="inherit" component={RouterLink} to={`/note?folder=${folderSearchParam}`}>
                    {folderSearchParam}
                  </Link>
                ) : (
                  <Typography>{folderSearchParam}</Typography>
                )}
              </>
            )}
            {noteSearchParam && (
              <Typography>{noteSearchParam}</Typography>
            )}
          </Breadcrumbs>

          {folderSearchParam && !noteSearchParam && (
            <Grid container spacing={3} className={classes.gridContainer}>
              <Grid item xs={6}>
                <Paper>
                  <Typography>123</Typography>
                  <CustomButton>more</CustomButton>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <Typography>123</Typography>
                  <CustomButton>more</CustomButton>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <Typography>123</Typography>
                  <CustomButton>more</CustomButton>
                </Paper>
              </Grid>
            </Grid>
          )}

          {noteSearchParam && (
            <>
              <Typography>
                Note
                <IconButton color="inherit">
                  <StarBorderIcon />
                </IconButton>
              </Typography>

              <Editor
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                onChange={handleChangeEditorState}
                placeholder="請在此輸入文章內容"
              />

              <Button onClick={handleSubmit}>get</Button>
            </>
          )}
        </Container>
      </div>
    </div>
  );
}
