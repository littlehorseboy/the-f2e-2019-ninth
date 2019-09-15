import React, { useState, useRef } from 'react';
import {
  AtomicBlockUtils,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  DraftHandleValue,
  ContentBlock,
  ContentState,
} from 'draft-js';

const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    padding: 20,
    width: 600,
  },
  buttons: {
    marginBottom: 10,
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
  },
  media: {
    width: '100%',
  },
};

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
      <audio controls src={src} style={styles.media}>
        <track kind="captions" srcLang="en" label="english_captions" />
      </audio>
    );
  } else if (type === 'image') {
    media = <img src={src} alt="editorImg" style={styles.media} />;
  } else if (type === 'video') {
    media = (
      <video controls src={src} style={styles.media}>
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

export default function MediaEditorExample(): JSX.Element {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onChange = (internalEditorState: EditorState): void => setEditorState(internalEditorState);

  const [urlValue, setUrlValue] = useState('');

  const onURLChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUrlValue(event.target.value);
  };

  const [showURLInput, setShowURLInput] = useState(false);


  const [url, setUrl] = useState('');

  const [urlType, setUrlType] = useState('');

  const editor = useRef<Editor | null>(null);

  const fileInput = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(event.target.files);
  };

  const focus = (): void => {
    if (editor.current) {
      editor.current.focus();
    }
  };

  const logState = (): void => {
    const content = editorState.getCurrentContent();
    console.log(convertToRaw(content));
  };

  const handleKeyCommand = (
    command: string,
    internalEditorState: EditorState,
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(internalEditorState, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const confirmMedia = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    event.preventDefault();
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      urlType,
      'IMMUTABLE',
      { src: urlValue },
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity },
    );

    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' ',
      ),
    );
    setShowURLInput(false);
    setUrlValue('');
  };

  const onURLInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.which === 13) {
      confirmMedia(event);
    }
  };

  const promptForMedia = (type: string): void => {
    setShowURLInput(true);
    setUrlValue('');
    setUrlType(type);
  };

  const addAudio = (): void => {
    promptForMedia('audio');
  };

  const addImage = (): void => {
    promptForMedia('image');
  };

  const addVideo = (): void => {
    promptForMedia('video');
  };

  return (
    <div style={styles.root}>
      <div style={{ marginBottom: 10 }}>
        <ul>
          <li>media.mp3</li>
          <li>images/Bitmap.png</li>
          <li>media.mp4</li>
        </ul>
      </div>
      <div style={styles.buttons}>
        <button type="button" onClick={addAudio} style={{ marginRight: 10 }}>
          Add Audio
        </button>
        <button type="button" onClick={addImage} style={{ marginRight: 10 }}>
          Add Image
        </button>
        <button type="button" onClick={addVideo} style={{ marginRight: 10 }}>
          Add Video
        </button>
        <input ref={fileInput} type="file" onChange={handleFileChange} />
      </div>

      {showURLInput && (
        <div style={styles.urlInputContainer}>
          <input
            onChange={onURLChange}
            style={styles.urlInput}
            type="text"
            value={urlValue}
            onKeyDown={onURLInputKeyDown}
          />
          <button type="button" onClick={confirmMedia}>
            Confirm
          </button>
        </div>
      )}

      <div role="presentation" style={styles.editor} onClick={focus}>
        <Editor
          blockRendererFn={mediaBlockRenderer}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={onChange}
          placeholder="Enter some text..."
          ref={editor}
        />
      </div>
      <button
        type="button"
        style={styles.button}
        onClick={logState}
      >
        Log State
      </button>
    </div>
  );
}
