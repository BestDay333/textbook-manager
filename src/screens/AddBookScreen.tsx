import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { addTextbook } from '../store/librarySlice';
import { addDownload, setStatus, updateProgress } from '../store/downloadsSlice';
import { Textbook, BookFormat, DownloadItem } from '../types';

export default function AddBookScreen() {
  const dispatch = useDispatch();
  const nav = useNavigation();

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/epub+zip'],
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    const id = Date.now().toString();
    const book: Textbook = {
      id,
      title: title || asset.name.replace(/\.[^.]+$/, ''),
      author: author || 'Неизвестен',
      subject: subject || 'Общее',
      grade: grade ? parseInt(grade) : undefined,
      format: (asset.name.endsWith('.epub') ? 'epub' : 'pdf') as BookFormat,
      fileUri: asset.uri,
      fileSize: asset.size ?? 0,
      downloadedAt: new Date().toISOString(),
      tags: [],
    };
    dispatch(addTextbook(book));
    Alert.alert('Готово', `"${book.title}" добавлен в библиотеку`);
    nav.goBack();
  };

  const downloadUrl = async () => {
    if (!url.trim()) return Alert.alert('Введите URL файла');
    setLoading(true);
    const id = Date.now().toString();
    const fileName = url.split('/').pop() ?? `book_${id}.pdf`;
    const destUri = FileSystem.documentDirectory + 'textbooks/' + fileName;
    const item: DownloadItem = { id, textbookId: id, url, progress: 0, status: 'downloading' };
    dispatch(addDownload(item));
    try {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + 'textbooks/', { intermediates: true }
      );
      const dl = FileSystem.createDownloadResumable(url, destUri, {}, (p) => {
        const prog = p.totalBytesExpectedToWrite > 0
          ? p.totalBytesWritten / p.totalBytesExpectedToWrite : 0;
        dispatch(updateProgress({ id, progress: prog }));
      });
      const res = await dl.downloadAsync();
      if (!res) throw new Error('Загрузка не удалась');
      const info = await FileSystem.getInfoAsync(res.uri, { size: true });
      const book: Textbook = {
        id,
        title: title || fileName.replace(/\.[^.]+$/, ''),
        author: author || 'Неизвестен',
        subject: subject || 'Общее',
        grade: grade ? parseInt(grade) : undefined,
        format: fileName.endsWith('.epub') ? 'epub' : 'pdf',
        fileUri: res.uri,
        fileSize: (info as any).size ?? 0,
        downloadedAt: new Date().toISOString(),
        tags: [],
      };
      dispatch(addTextbook(book));
      dispatch(setStatus({ id, status: 'done' }));
      Alert.alert('Готово', `"${book.title}" загружен`);
      nav.goBack();
    } catch (e: any) {
      dispatch(setStatus({ id, status: 'error', error: e.message }));
      Alert.alert('Ошибка', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Информация</Text>
        {[
          { label: 'Название', value: title, setter: setTitle, placeholder: 'Алгебра 9 класс' },
          { label: 'Автор', value: author, setter: setAuthor, placeholder: 'Иванов И.И.' },
          { label: 'Предмет', value: subject, setter: setSubject, placeholder: 'Математика' },
          { label: 'Класс', value: grade, setter: setGrade, placeholder: '9', keyboard: 'numeric' },
        ].map(({ label, value, setter, placeholder, keyboard }) => (
          <View key={label} style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={setter}
              placeholder={placeholder}
              keyboardType={(keyboard as any) ?? 'default'}
            />
          </View>
        ))}

        <Text style={styles.sectionTitle}>Добавить файл</Text>

        <TouchableOpacity style={styles.pickBtn} onPress={pickFile}>
          <Text style={styles.pickBtnText}>📁 Выбрать файл с устройства</Text>
        </TouchableOpacity>

        <Text style={styles.or}>— или скачать по ссылке —</Text>

        <View style={styles.field}>
          <Text style={styles.label}>URL (PDF / EPUB)</Text>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder="https://example.com/book.pdf"
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>
        <TouchableOpacity
          style={[styles.dlBtn, loading && styles.dlBtnDisabled]}
          onPress={downloadUrl}
          disabled={loading}
        >
          <Text style={styles.dlBtnText}>{loading ? 'Загрузка...' : '⬇ Скачать'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 16 },
  sectionTitle: { fontSize: 12, color: '#888', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 },
  field: { marginBottom: 12 },
  label: { fontSize: 13, color: '#555', marginBottom: 4 },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', padding: 12, fontSize: 15 },
  pickBtn: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1A73E8', marginBottom: 12 },
  pickBtnText: { fontSize: 15, color: '#1A73E8', fontWeight: '600' },
  or: { textAlign: 'center', color: '#888', marginVertical: 8 },
  dlBtn: { backgroundColor: '#1A73E8', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  dlBtnDisabled: { backgroundColor: '#93BAF5' },
  dlBtnText: { fontSize: 15, color: '#fff', fontWeight: '600' },
});
