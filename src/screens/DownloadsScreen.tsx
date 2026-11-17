import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeDownload } from '../store/downloadsSlice';
import { DownloadItem } from '../types';

export default function DownloadsScreen() {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => Object.values(s.downloads.items));

  const statusLabel = (s: DownloadItem['status']) => ({
    queued: 'В очереди', downloading: 'Загрузка...', done: 'Готово', error: 'Ошибка',
  }[s]);

  const statusColor = (s: DownloadItem['status']) => ({
    queued: '#888', downloading: '#1A73E8', done: '#34A853', error: '#EA4335',
  }[s]);

  const renderItem = ({ item }: { item: DownloadItem }) => (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.url} numberOfLines={1}>{item.url}</Text>
        <Text style={[styles.status, { color: statusColor(item.status) }]}>
          {statusLabel(item.status)}
          {item.status === 'downloading' ? ` — ${Math.round(item.progress * 100)}%` : ''}
        </Text>
        {item.status === 'downloading' && (
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${item.progress * 100}%` as any }]} />
          </View>
        )}
        {item.error && <Text style={styles.error}>{item.error}</Text>}
      </View>
      {(item.status === 'done' || item.status === 'error') && (
        <TouchableOpacity onPress={() => dispatch(removeDownload(item.id))}>
          <Text style={styles.remove}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Нет активных загрузок</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  list: { padding: 12 },
  item: {
    backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', elevation: 1,
  },
  info: { flex: 1 },
  url: { fontSize: 13, color: '#333', marginBottom: 4 },
  status: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  progressBg: { height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: '#1A73E8', borderRadius: 2 },
  error: { fontSize: 12, color: '#EA4335', marginTop: 4 },
  remove: { fontSize: 18, color: '#888', paddingLeft: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: '#888' },
});
