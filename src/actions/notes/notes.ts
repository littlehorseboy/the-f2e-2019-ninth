export const SAVECONTENTSTATE = 'SAVECONTENTSTATE';
export const CHANGENOTESTAR = 'CHANGENOTESTAR';

export interface SaveContentStateI {
  type: typeof SAVECONTENTSTATE;
  payload: {
    id: number;
    contentState: string;
  };
}

export const saveContentState = (id: number, contentState: string): SaveContentStateI => ({
  type: SAVECONTENTSTATE,
  payload: {
    id,
    contentState,
  },
});

export interface ChangeNoteStarI {
  type: typeof CHANGENOTESTAR;
  payload: {
    id: number;
  };
}

export const changeNoteStar = (id: number): ChangeNoteStarI => ({
  type: CHANGENOTESTAR,
  payload: {
    id,
  },
});

export type notesActionTypes = SaveContentStateI | ChangeNoteStarI;
