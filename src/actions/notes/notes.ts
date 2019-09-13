export const SAVECONTENTSTATE = 'SAVECONTENTSTATE';

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

export type notesActionTypes = SaveContentStateI;
