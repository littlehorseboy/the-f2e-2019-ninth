import React, { useState } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';

interface PropsI {
  editorState: EditorState;
  handleChangeEditorState: (internalEditorState: EditorState) => void;
}

export default function EditorLinkButton(props: PropsI): JSX.Element {
  const { editorState, handleChangeEditorState } = props;

  const [urlValue, setUrlValue] = useState('');

  const onURLChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUrlValue(event.target.value);
  };

  const [anchorLinkEl, setAnchorLinkEl] = React.useState<HTMLButtonElement | null>(null);

  const handleOpenLinkEl = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
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

      setAnchorLinkEl(event.currentTarget);
      setUrlValue(urlString);
    }
  };

  const handleCloseLinkEl = (): void => {
    setAnchorLinkEl(null);
  };

  const LinkElIsOpen = Boolean(anchorLinkEl);

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

    handleChangeEditorState(RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      entityKey,
    ));

    handleCloseLinkEl();
    setUrlValue('');
  };

  const onLinkInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.which === 13) {
      confirmLink(event);
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpenLinkEl}>
        <LinkIcon />
      </IconButton>

      <Popover
        open={LinkElIsOpen}
        anchorEl={anchorLinkEl}
        onClose={handleCloseLinkEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box ml={1} mr={1}>
          <input
            value={urlValue}
            onChange={onURLChange}
            onKeyDown={onLinkInputKeyDown}
          />
          <Button onClick={confirmLink}>Confirm</Button>
        </Box>
      </Popover>
    </>
  );
}
