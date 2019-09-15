import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Editor, EditorState, RichUtils, DraftHandleValue, convertToRaw, convertFromRaw,
  ContentBlock, ContentState, CompositeDecorator, AtomicBlockUtils,
} from 'draft-js';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import ListIcon from '@material-ui/icons/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import PhotoSizeSelectActualOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActualOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { RouteComponentPropsI } from '../../router/Router';
import CustomButton from '../../components/UI/CustomButton/CustomButton';
import { storeTypes } from '../../reducers/configureStore';
import { NoteI } from '../../reducers/notes/notes';
import { saveContentState } from '../../actions/notes/notes';
import EditorLinkButton from '../../components/Note/EditorLinkButton/EditorLinkButton';
import EditorLinkOffButton from '../../components/Note/EditorLinkOffButton/EditorLinkOffButton';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const img = require('../../assets/images/Bitmap.png');

const fontFamilyStyleMap = {
  微軟正黑體: { fontFamily: 'Microsoft JhengHei' },
  新細明體: { fontFamily: 'PMingLiU' },
};

const fontSizeStyleMap = {
  8: { fontSize: 8 },
  9: { fontSize: 9 },
  10: { fontSize: 10 },
  11: { fontSize: 11 },
  12: { fontSize: 12 },
  14: { fontSize: 14 },
  16: { fontSize: 16 },
  18: { fontSize: 18 },
  24: { fontSize: 24 },
  30: { fontSize: 30 },
  36: { fontSize: 36 },
  48: { fontSize: 48 },
};

const customStyleMap = {
  ...fontFamilyStyleMap,
  ...fontSizeStyleMap,
};

const findLinkEntities = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState,
): void => {
  contentBlock.findEntityRanges(
    (character): boolean => {
      const entityKey = character.getEntity();
      return entityKey !== null
        && contentState.getEntity(entityKey).getType() === 'LINK';
    },
    callback,
  );
};

interface EditorLinkPropsI {
  contentState: ContentState;
  entityKey: string;
  children: React.ReactChild;
}

const EditorLink = (props: EditorLinkPropsI): JSX.Element => {
  const { contentState, entityKey, children } = props;
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a href={url} style={{ color: 'rgb(146, 165, 205)' }}>
      {children}
    </a>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: EditorLink,
  },
]);

const Media = (
  props: { contentState: ContentState; block: ContentBlock },
): JSX.Element | undefined => {
  const { contentState, block } = props;

  const entity = contentState.getEntity(
    block.getEntityAt(0),
  );
  const { src } = entity.getData();
  const type = entity.getType();

  let media;
  if (type === 'audio') {
    media = (
      <audio controls src={src}>
        <track kind="captions" srcLang="en" label="english_captions" />
      </audio>
    );
  } else if (type === 'image') {
    media = <img src={src} alt="editorImg" />;
  } else if (type === 'video') {
    media = (
      <video controls src={src}>
        <track kind="captions" srcLang="en" label="english_captions" />
      </video>
    );
  }

  return media;
};

const mediaBlockRenderer = (block: ContentBlock): {
  component: (props: {
    contentState: ContentState; block: ContentBlock;
  }) => JSX.Element | undefined;
  editable: boolean;
} | null => {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    };
  }

  return null;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles((theme) => createStyles({
  rightContainer: {
    flexGrow: 1,
    flexBasis: 0,
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
  editorTools: {
    paddingRight: theme.spacing(5),
    display: 'flex',
    alignItems: 'center',
  },
  textField: {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    '& .MuiSelect-root': {
      color: '#FFFFFF',
      '& option': {
        color: 'rgba(0, 0, 0, 0.87)',
      },
    },
    '& svg': {
      color: '#FFFFFF',
    },
    '& .MuiInput-underline:before': {
      border: 'none',
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
  notePaperContainer: {
    backgroundColor: '#616F99',
    color: '#FFFFFF',
    padding: theme.spacing(2),
  },
  notePaperTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  editorContainer: {
    paddingTop: theme.spacing(2),
  },
  editorTitleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  draftEditorContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '& ul': {
      paddingLeft: 20,
    },
    '& .public-DraftEditorPlaceholder-root': {
      color: 'rgb(145, 151, 163)',
      position: 'absolute',
      zIndex: 1,
    },
  },
}));

export default function TrashCan(props: RouteComponentPropsI): JSX.Element {
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

  const filteredFolderNotes = notes
    .filter((note): boolean => note.folderName === folderSearchParam);

  const foundNote = notes.find((note): boolean => note.name === noteSearchParam);

  const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));

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

  const handleChangeEditorStateDefault = (internalEditorState: EditorState): void => {
    setEditorState(internalEditorState);
  };

  useEffect((): void => {
    const currentEditorState = foundNote
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(foundNote.contentState)), decorator)
      : EditorState.createEmpty(decorator);

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

  const handleToggleInlineStyleClick = (inlineStyle: string): void => {
    handleChangeEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const handleToggleBlockTypeClick = (inlineStyle: string): void => {
    handleChangeEditorState(RichUtils.toggleBlockType(editorState, inlineStyle));
  };

  const handleToggleFontFamilyInlineStyleClick = (inlineStyle: string): void => {
    Object.keys(fontFamilyStyleMap).forEach((key): void => {
      if (editorState.getCurrentInlineStyle().has(key)) {
        handleChangeEditorStateDefault(RichUtils.toggleInlineStyle(editorState, key));
      }
    });
    if (!editorState.getCurrentInlineStyle().has(inlineStyle)) {
      handleChangeEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    }
  };

  const handleToggleFontSizeInlineStyleClick = (inlineStyle: string): void => {
    Object.keys(fontSizeStyleMap).forEach((key): void => {
      if (editorState.getCurrentInlineStyle().has(key)) {
        handleChangeEditorStateDefault(RichUtils.toggleInlineStyle(editorState, key));
      }
    });
    if (!editorState.getCurrentInlineStyle().has(inlineStyle)) {
      handleChangeEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    }
  };

  const [fontFamilySelected, setFontFamilySelected] = useState('');

  const handleChangeFontFamilySelected = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFontFamilySelected(event.target.value);
    handleToggleFontFamilyInlineStyleClick(event.target.value);
  };

  const [fontSizeSelected, setFontSizeSelected] = useState('');

  const handleChangeFontSizeSelected = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFontSizeSelected(event.target.value);
    handleToggleFontSizeInlineStyleClick(event.target.value);
  };

  // horseTODO: insert 一張固定的圖片
  const insertImage = (): void => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      { src: 'images/Bitmap.png' },
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity },
    );

    handleChangeEditorState(
      AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' ',
      ),
    );
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
          <div className={classes.editorTools}>
            <TextField
              select
              className={classes.textField}
              value={fontFamilySelected}
              onChange={handleChangeFontFamilySelected}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">font-family</option>
              {Object.keys(fontFamilyStyleMap).map((key): JSX.Element => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </TextField>
            <TextField
              select
              className={classes.textField}
              value={fontSizeSelected}
              onChange={handleChangeFontSizeSelected}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">font-size</option>
              {Object.keys(fontSizeStyleMap).map((key): JSX.Element => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </TextField>
            <IconButton color="inherit" onClick={(): void => handleToggleInlineStyleClick('BOLD')}>
              <FormatBoldIcon />
            </IconButton>
            <IconButton color="inherit" onClick={(): void => handleToggleInlineStyleClick('ITALIC')}>
              <FormatItalicIcon />
            </IconButton>
            <IconButton color="inherit" onClick={(): void => handleToggleInlineStyleClick('UNDERLINE')}>
              <FormatUnderlinedIcon />
            </IconButton>

            <EditorLinkButton
              editorState={editorState}
              handleChangeEditorState={handleChangeEditorState}
            />

            <EditorLinkOffButton
              editorState={editorState}
              handleChangeEditorState={handleChangeEditorState}
            />

            <IconButton color="inherit" onClick={(): void => handleToggleBlockTypeClick('unordered-list-item')}>
              <FormatListBulletedIcon />
            </IconButton>
            <Button color="inherit" onClick={insertImage}>
              <PhotoSizeSelectActualOutlinedIcon />
              插入圖片
            </Button>
            <Button color="inherit" onClick={(): void => alert('尚未實裝此功能')}>
              <DescriptionOutlinedIcon />
              插入檔案
            </Button>
          </div>

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
              垃圾桶 (無內容)
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
              {filteredFolderNotes.map((note): JSX.Element => (
                <Grid key={note.id} item xs={6}>
                  <Paper className={classes.notePaperContainer}>
                    <div className={classes.notePaperTitle}>
                      <Typography variant="h4">
                        {note.name}
                      </Typography>
                      <IconButton color="inherit">
                        {note.isStar
                          ? <StarIcon />
                          : <StarBorderIcon />}
                      </IconButton>
                    </div>

                    <div className={classes.draftEditorContainer}>
                      <Editor
                        editorState={EditorState.createWithContent(
                          convertFromRaw(JSON.parse(note.contentState)),
                        )}
                        readOnly
                        onChange={(): void => {}}
                      />
                    </div>

                    <CustomButton
                      to={`/note?folder=${note.folderName}&note=${note.name}`}
                    >
                      more
                    </CustomButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

          {noteSearchParam && (
            <div className={classes.editorContainer}>
              {foundNote && (
                <div className={classes.editorTitleContainer}>
                  <Typography variant="h4">
                    {foundNote.name}
                  </Typography>
                  <IconButton color="inherit">
                    {foundNote.isStar
                      ? <StarIcon />
                      : <StarBorderIcon />}
                  </IconButton>
                </div>
              )}

              <div className={classes.draftEditorContainer}>
                <Editor
                  editorState={editorState}
                  customStyleMap={customStyleMap}
                  blockRendererFn={mediaBlockRenderer}
                  handleKeyCommand={handleKeyCommand}
                  onChange={handleChangeEditorState}
                  placeholder="請在此輸入文章內容"
                />
              </div>

              <Button onClick={handleSubmit} style={{ display: 'none' }}>Log State</Button>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
