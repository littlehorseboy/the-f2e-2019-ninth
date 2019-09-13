import { notesActionTypes, SAVECONTENTSTATE } from '../../actions/notes/notes';

export interface NoteI {
  id: number;
  name: string;
  folderName: string;
  isStar: boolean;
  contentState: string;
}

interface NotesI {
  notes: NoteI[];
}

const initState: NotesI = {
  notes: [
    {
      id: 1,
      name: 'Note',
      folderName: 'The F2E',
      isStar: false,
      contentState: '{"blocks":[{"key":"ceh2b","text":"User story","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"836b1","text":"∙ 筆記服務請挑選任一操作載體來設計，例：桌面版、網頁版、Mobile APP","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"fp4lu","text":"∙ 我可以新增一個筆記，填寫文章內容","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"ecarf","text":"∙ 我可以將筆記打星號，以方便快速搜尋","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"a6dj7","text":"∙ 我的筆記擁有日/夜間瀏覽模式","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"aa1vb","text":"∙ 若您挑選的是 deksop、網頁版筆記服務，在筆記列表上，至少要有兩種以上檢","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3r4j8","text":"  視.筆記方式，例如卡片檢視、摘要檢視、純文字列表檢視等等","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"d7k6o","text":"∙ 我可以在筆記裡，將文字變成粗體、斜體、下底線等基本樣式，並且載入連結","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5t2mh","text":"∙ 我可以在筆記裡插入圖片、檔案","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7ddi7","text":"∙ 其他","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    },
    {
      id: 2,
      name: 'Cloud drive',
      folderName: 'The F2E',
      isStar: false,
      contentState: '{"blocks":[{"key":"ceh2b","text":"User story","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"c8tke","text":"∙ 我可以在檔案管理區新增資料夾","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"d85mu","text":"∙ 我可以上傳任何檔案，例如圖片、","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"87dsj","text":"   word、pdf、mp4","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7j51o","text":"∙ 我可以在資料夾裡面新增檔案，進行","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3n92p","text":"   分類","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"33eh8","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    },
    {
      id: 3,
      name: 'Chatting room',
      folderName: 'The F2E',
      isStar: false,
      contentState: '{"blocks":[{"key":"ceh2b","text":"User story","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3u1gs","text":"∙ 我可以填寫暱稱或匿名形式，不需進","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"ccd3h","text":"  行註冊，便可進入聊天室","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7rk3l","text":"∙ 聊天方式不限，可用大廳模式、一對","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    },
  ],
};

const reducer = (state = initState, action: notesActionTypes): NotesI => {
  switch (action.type) {
    case SAVECONTENTSTATE:
      return {
        notes: state.notes.map((note): NoteI => {
          if (note.id === action.payload.id) {
            return {
              ...note,
              contentState: action.payload.contentState,
            };
          }
          return note;
        }),
      };
    default:
      return state;
  }
};

export default reducer;
