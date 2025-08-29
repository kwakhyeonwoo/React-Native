import { mkId, removeById, updateById } from "../lib/utils";
import { useMemo, useState } from 'react'
import { EditState, Filter, Note, NoteId, Sort } from "../models";

//ViewModel 역할: 상태 + 비즈니스 로직(추가/삭제/토글/정렬/필터)
export function useNotes(){
    //seed 데이터(런타임 메모리만 사용)
    const [notes, setNotes] = useState<Note[]>([
        {id: mkId(), text: 'React Native + TS 시작!', starred: true, createdAt: Date.now() - 80000},
        {id: mkId(), text: '한 줄 메모를 추가해보세요', starred: false, createdAt: Date.now() - 40000},
    ]);

    const [filter, setFilter] = useState<Filter>('all');
    const [sort, setSort] = useState<Sort>('newest');
    const [edit, setEdit] = useState<EditState>({ kind: 'idle' });

    //파싱 데이터
    const visible = useMemo(() => {
        let list = notes;
        if(filter === 'starred') list = list.filter((n) => n.starred);
        if(filter === 'unstarred') list = list.filter((n) => !n.starred);
        if(sort === 'newest') list = [...list].sort((a, b) => b.createdAt - a.createdAt);
        if(sort === 'oldest') list = [...list].sort((a, b) => a.createdAt - b.createdAt);
        return list;
    }, [notes, filter, sort]);

    //액션들
    const add = (text: string) => {
        const t = text.trim();
        if(!t) return;
        const now = Date.now();
        setNotes((prev) => [{ id: mkId(), text: t, starred: false, createdAt: now}, ...prev]);
    };

    const toggleStar = (id: NoteId) => {
        setNotes((prev) => 
            updateById(prev, id, (n) => ({ ...n, starred: !n.starred, updatedAt: Date.now() }))
        );
    };

    const remove = (id: NoteId) => {
        setNotes((prev) => removeById(prev, id));
        if(edit.kind === 'editing' && edit.id === id) setEdit({kind: 'idle'});
    };

    const beginEdit = (id: NoteId, currentText: string) => {
        setEdit({ kind: 'editing', id, text: currentText });
    };

    const changeEditText = (text: string) => {
        if(edit.kind !== 'editing') return;
        setEdit({ ...edit, text });
    };

    const commitEdit = () => {
        if (edit.kind !== 'editing') return;
        const t = edit.text.trim();
        if (!t) {
            setEdit({ kind: 'idle'});
            return;
        }
        setNotes((prev) => 
            updateById(prev, edit.id, (n) => ({ ...n, text: t, updatedAt: Date.now() }))
        );
        setEdit({ kind: 'idle'});
    };

    const cancelEdit = () => setEdit({ kind: 'idle' });

    return {
        //state
        notes,
        visible,
        filter,
        sort,
        edit,
        //actions
        setFilter,
        setSort,
        add,
        toggleStar,
        remove,
        beginEdit,
        changeEditText,
        commitEdit,
        cancelEdit,
    };
}