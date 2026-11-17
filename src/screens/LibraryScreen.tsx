import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  TextInput, StyleSheet, SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootState } from '../store';
import { Textbook, RootStackParamList } from '../types';

type Nav = StackNavigationProp<RootStackParamList>;

export default function LibraryScreen() {
  const dispatch = useDispatch();
  const nav = useNavigation<Nav>();
  const textbooks = useSelector((s: RootState) => Object.values(s.library.textbooks));
  const [query, setQuery] = useState('');

  const filtered = textbooks.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase()) ||
      b.subject.toLowerCase().includes(query.toLowerCase()),
  );

  const renderItem = ({ item }: { item: Textbook }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => nav.navigate('Reader', { textbookId: item.id })}
      onLongPress={() => nav.navigate('BookDetail', { textbookId: item.id })}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <View style={styles.row}>
          <Text style={styles.tag}>{item.subject}</Text>
          {item.grade && <Text style={styles.tag}>{item.grade} класс</Text>}
          <Text style={styles.format}>{item.format.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Поиск по названию, автору, предмету..."
        value={query}
        onChangeText={setQuery}
      />
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Библиотека пуста</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => nav.navigate('AddBook')}>
            <Text style={styles.addBtnText}>+ Добавить учебник</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => nav.navigate('AddBook')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  search: {
    margin: 12, padding: 10, backgroundColor: '#fff',
    borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', fontSize: 15,
  },
  list: { paddingHorizontal: 12, paddingBottom: 80 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 10,
    padding: 14, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  cardInfo: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#1A1A2E', marginBottom: 4 },
  author: { fontSize: 13, color: '#555', marginBottom: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: '#E8F0FE', color: '#1A73E8',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontSize: 12,
  },
  format: {
    backgroundColor: '#FFF3E0', color: '#E65100',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontSize: 12,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: '#888', marginBottom: 16 },
  addBtn: { backgroundColor: '#1A73E8', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  fab: {
    position: 'absolute', right: 20, bottom: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#1A73E8', alignItems: 'center', justifyContent: 'center',
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
});
