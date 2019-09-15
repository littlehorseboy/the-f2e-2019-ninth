import React from 'react';
import { EditorState, RichUtils } from 'draft-js';
import IconButton from '@material-ui/core/IconButton';
import LinkOffIcon from '@material-ui/icons/LinkOff';

interface PropsI {
  editorState: EditorState;
  handleChangeEditorState: (internalEditorState: EditorState) => void;
}

export default function EditorLinkOffButton(props: PropsI): JSX.Element {
  const { editorState, handleChangeEditorState } = props;

  const removeLink = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      handleChangeEditorState(RichUtils.toggleLink(editorState, selection, null));
    }
  };

  return (
    <IconButton color="inherit" onClick={removeLink}>
      <LinkOffIcon />
    </IconButton>
  );
}
