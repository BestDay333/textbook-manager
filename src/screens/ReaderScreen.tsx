import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute, RouteProp } from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import { RootState } from '../store';
import { markOpened, updateTextbook } from '../store/librarySlice';
import { RootStackParamList } from '../types';

type Route = RouteProp<RootStackParamList, 'Reader'>;

export default function ReaderScreen() {
  const route = useRoute<Route>();
  const dispatch = useDispatch();
  const book = useSelector((s: RootState) => s.library.textbooks[route.params.textbookId]);

  useEffect(() => {
    if (book) dispatch(markOpened(book.id));
  }, []);

  if (!book) return (
    <View style={styles.center}>
      <Text style={styles.error}>Книга не найдена</Text>
    </View>
  );

  if (book.format !== 'pdf') return (
    <View style={styles.center}>
      <Text style={styles.info}>Формат {book.format.toUpperCase()} откроется во внешнем приложении.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: book.fileUri }}
        style={styles.pdf}
        renderActivityIndicator={() => <ActivityIndicator size="large" color="#1A73E8" />}
        onLoadComplete={(pages) =>
          dispatch(updateTextbook({ id: book.id, totalPages: pages }))
        }
        onPageChanged={(page) =>
          dispatch(updateTextbook({ id: book.id, currentPage: page }))
        }
        onError={(err) => console.warn('PDF error', err)}
        page={book.currentPage ?? 1}
        enablePaging
        horizontal={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  pdf: { flex: 1, width: '100%', height: '100%' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  error: { fontSize: 16, color: '#EA4335' },
  info: { fontSize: 16, color: '#333', textAlign: 'center' },
});
