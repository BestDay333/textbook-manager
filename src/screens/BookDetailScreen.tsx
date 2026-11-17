import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { RootState } from '../store';
import { removeTextbook, markOpened } from '../store/librarySlice';
import { RootStackParamList } from '../types';

type Route = RouteProp<RootStackParamList, 'BookDetail'>;
type Nav = StackNavigationProp<RootStackParamList>;

export default function BookDetailScreen() {
  const route = useRoute<Route>();
  const nav = useNavigation<Nav>();
  const dispatch = useDispatch();
  const book = useSelector((s: RootState) => s.library.textbooks[route.params.textbookId]);

  if (!book) return <View style={styles.container}><Text>Книга не найдена</Text></View>;

  const fmtSize = (b: number) =>
    b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} МБ` : `${(b / 1024).toFixed(0)} КБ`;

  const handleDelete = () =>
    Alert.alert('Удалить?', `"${book.title}" будет удалён из библиотеки`, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить', style: 'destructive',
        onPress: async () => {
          try { await FileSystem.deleteAsync(book.fileUri, { idempotent: true }); } catch {}
          dispatch(removeTextbook(book.id));
          nav.goBack();
        },
      },
    ]);

  const handleShare = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(book.fileUri);
    } else {
      Alert.alert('Поделиться недоступно на этом устройстве');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>

        {[
          ['Предмет', book.subject],
          ['Класс', book.grade ? `${book.grade} класс` : '—'],
          ['Год', book.year?.toString() ?? '—'],
          ['Формат', book.format.toUpperCase()],
          ['Размер', fmtSize(book.fileSize)],
          ['Добавлено', new Date(book.downloadedAt).toLocaleDateString('ru-RU')],
          ['Последнее открытие', book.lastOpenedAt
            ? new Date(book.lastOpenedAt).toLocaleDateString('ru-RU') : '—'],
          ['Прогресс', book.totalPages
            ? `${book.currentPage ?? 0} / ${book.totalPages} стр.` : '—'],
        ].map(([k, v]) => (
          <View key={k} style={styles.row}>
            <Text style={styles.key}>{k}</Text>
            <Text style={styles.val}>{v}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.openBtn}
          onPress={() => { dispatch(markOpened(book.id)); nav.navigate('Reader', { textbookId: book.id }); }}
        >
          <Text style={styles.openBtnText}>📖 Открыть</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>📤 Поделиться</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>🗑 Удалить из библиотеки</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 6 },
  author: { fontSize: 15, color: '#555', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  key: { fontSize: 14, color: '#888' },
  val: { fontSize: 14, color: '#333', fontWeight: '500' },
  openBtn: { marginTop: 24, backgroundColor: '#1A73E8', borderRadius: 12, padding: 16, alignItems: 'center' },
  openBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  shareBtn: { marginTop: 10, backgroundColor: '#fff', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#1A73E8' },
  shareBtnText: { color: '#1A73E8', fontSize: 15, fontWeight: '600' },
  deleteBtn: { marginTop: 10, borderRadius: 12, padding: 14, alignItems: 'center' },
  deleteBtnText: { color: '#EA4335', fontSize: 15 },
});
