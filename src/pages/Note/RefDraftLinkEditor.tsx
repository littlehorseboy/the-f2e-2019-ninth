import React, { useState, useRef } from 'react';
import {
  CompositeDecorator,
  Editor,
  EditorState,
  RichUtils,
  ContentState,
  ContentBlock,
} from 'draft-js';

const styles = {
  buttons: {
    marginBottom: 10,
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    marginRight: 10,
    padding: 3,
  },
  editor: {
    border: '1px solid #ccc',
    minHeight: 80,
    padding: 10,
  },
  link: {
    color: '#3b5998',
    textDecoration: 'underline',
  },
};

function findLinkEntities(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState,
): void {
  contentBlock.findEntityRanges(
    (character): boolean => {
      const entityKey = character.getEntity();
      return entityKey !== null
        && contentState.getEntity(entityKey).getType() === 'LINK';
    },
    callback,
  );
}

interface LinkProps {
  contentState: ContentState;
  entityKey: string;
  children: React.ReactChild;
}

const Link = (props: LinkProps): JSX.Element => {
  const { contentState, entityKey, children } = props;
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a href={url} style={styles.link}>
      {children}
    </a>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

export default function LinkEditorExample(): JSX.Element {
  const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));

  const handleEditroStateChange = (internalEditorState: EditorState): void => {
    setEditorState(internalEditorState);
  };

  const [showURLInput, setShowURLInput] = useState(false);

  const [urlValue, setUrlValue] = useState('');

  const onURLChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUrlValue(event.target.value);
  };

  const editor = useRef<Editor | null>(null);
  const url = useRef(null);

  const editorFocus = (): void => {
    if (editor.current) {
      editor.current.focus();
    }
  };

  const promptForLink = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = selection.getStartKey();
      const startOffset = selection.getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let urlString = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        urlString = linkInstance.getData().url;
      }

      setShowURLInput(true);
      setUrlValue(urlString);
    }
  };

  const confirmLink = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    event.preventDefault();
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: urlValue },
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

    setEditorState(RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      entityKey,
    ));

    setShowURLInput(false);
    setUrlValue('');
  };

  const onLinkInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.which === 13) {
      confirmLink(event);
    }
  };

  return (
    <div>
      <div style={styles.buttons}>
        <button
          type="button"
          onMouseDown={promptForLink}
        >
          Add Link
        </button>
      </div>

      {showURLInput && (
        <div style={styles.urlInputContainer}>
          <input
            onChange={onURLChange}
            ref={url}
            style={styles.urlInput}
            type="text"
            value={urlValue}
            onKeyDown={onLinkInputKeyDown}
          />
          <button type="button" onMouseDown={confirmLink}>
            Confirm
          </button>
        </div>
      )}

      <div role="presentation" style={styles.editor} onClick={editorFocus}>
        <Editor
          editorState={editorState}
          onChange={handleEditroStateChange}
          placeholder="Enter some text..."
          ref={editor}
        />
      </div>
    </div>
  );
}
