import { Button, StyleSheet, Text, View } from 'react-native';
import type { Note } from '../models';

type NoteItemProps = {
  note: Note;
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, currentText: string) => void;
};

export default function NoteItem({ note, onToggleStar, onDelete, onEdit }: NoteItemProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{note.text}</Text>

      <View style={styles.row}>
        <Button
          title={note.starred ? '★ 즐겨찾기' : '☆ 즐겨찾기'}
          onPress={() => onToggleStar(note.id)}
        />
        <Button title="수정" onPress={() => onEdit(note.id, note.text)} />
        <Button color="#c44" title="삭제" onPress={() => onDelete(note.id)} />
      </View>

      <Text style={styles.meta}>
        {new Date(note.createdAt).toLocaleString()} {note.updatedAt ? '(수정됨)' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, backgroundColor: '#fafafa',
    gap: 8,
  },
  text: { fontSize: 16 },
  meta: { fontSize: 12, color: '#666' },
  row: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
});
