import { useState } from 'react';
import {
  Button, FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import NoteItem from '../components/NoteItem';
import { useNotes } from '../viewmodels/useNotes';
import type { Filter, Sort } from '../models';

export default function HomeScreen() {
  const {
    visible, filter, sort, edit,
    setFilter, setSort,
    add, toggleStar, remove,
    beginEdit, changeEditText, commitEdit, cancelEdit,
  } = useNotes();

  const [draft, setDraft] = useState('');

  const onAdd = () => {
    add(draft);
    setDraft('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 한 줄 ✍️ (TS 연습)</Text>

      {/* 입력 박스 */}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="한 줄 메모를 입력하세요"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={onAdd}
          returnKeyType="done"
        />
        <Button title="추가" onPress={onAdd} />
      </View>

      {/* 필터/정렬 - 유니온 타입을 쓰므로 자동완성/안전성↑ */}
      <View style={styles.toolbar}>
        <Segmented<Filter>
          value={filter}
          options={[
            { label: '전체', value: 'all' },
            { label: '즐겨찾기', value: 'starred' },
            { label: '미즐겨', value: 'unstarred' },
          ]}
          onChange={setFilter}
        />
        <Segmented<Sort>
          value={sort}
          options={[
            { label: '최신', value: 'newest' },
            { label: '오래된', value: 'oldest' },
          ]}
          onChange={setSort}
        />
      </View>

      {/* 편집 영역(디스크리미네이티드 유니온으로 분기) */}
      {edit.kind === 'editing' && (
        <View style={styles.editBox}>
          <Text style={styles.editTitle}>수정하기</Text>
          <TextInput
            style={styles.input}
            value={edit.text}
            onChangeText={changeEditText}
            autoFocus
          />
          <View style={styles.row}>
            <Button title="취소" onPress={cancelEdit} />
            <Button title="완료" onPress={commitEdit} />
          </View>
        </View>
      )}

      {/* 리스트 */}
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10, paddingTop: 12, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onToggleStar={toggleStar}
            onDelete={remove}
            onEdit={beginEdit}
          />
        )}
      />
    </View>
  );
}

/** 제네릭 Segmented 컴포넌트: 유니온 타입에도 안전하게 동작 */
type SegmentedOption<T extends string> = { label: string; value: T };
type SegmentedProps<T extends string> = {
  value: T;
  options: ReadonlyArray<SegmentedOption<T>>;
  onChange: (v: T) => void;
};

function Segmented<T extends string>({ value, options, onChange }: SegmentedProps<T>) {
  return (
    <View style={styles.segmented}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <TouchableOpacity
            key={String(opt.value)}
            style={[styles.segBtn, active && styles.segActive]}
            onPress={() => onChange(opt.value)}
          >
            <Text style={[styles.segText, active && styles.segTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 64, paddingHorizontal: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  toolbar: { flexDirection: 'row', gap: 8, marginTop: 12 },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  segActive: { backgroundColor: '#222' },
  segText: { color: '#333' },
  segTextActive: { color: '#fff' },
  editBox: { marginTop: 12, gap: 8, padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 12 },
  editTitle: { fontWeight: '600' },
});
