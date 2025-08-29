// 도메인 타입들을 한 곳에 모아 관리
export type NoteId = string;

export type Note = {
  id: NoteId;
  text: string;
  starred: boolean;
  createdAt: number;
  updatedAt?: number; 
};

export type Filter = 'all' | 'starred' | 'unstarred'; // 상태값 제한
export type Sort = 'newest' | 'oldest'; // 상태값 제한

// 로딩/편집 상태를 유니온으로 명확히 표현(디스크리미네이티드 유니온)
export type EditState =
  | { kind: 'idle' }
  | { kind: 'editing'; id: NoteId; text: string };
