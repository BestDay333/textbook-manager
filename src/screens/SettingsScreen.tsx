import React from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setSetting } from '../store/settingsSlice';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const settings = useSelector((s: RootState) => s.settings);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Внешний вид</Text>
        {(['light', 'dark', 'system'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={styles.row}
            onPress={() => dispatch(setSetting({ key: 'theme', value: t }))}
          >
            <Text style={styles.label}>
              {{ light: '☀️ Светлая', dark: '🌙 Тёмная', system: '🔄 Системная' }[t]}
            </Text>
            {settings.theme === t && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Чтение</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Не гасить экран</Text>
          <Switch
            value={settings.keepScreenOn}
            onValueChange={(v) => dispatch(setSetting({ key: 'keepScreenOn', value: v }))}
            trackColor={{ true: '#1A73E8' }}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Размер шрифта: {settings.fontSize}pt</Text>
          <View style={styles.counter}>
            <TouchableOpacity
              onPress={() => dispatch(setSetting({ key: 'fontSize', value: Math.max(10, settings.fontSize - 1) }))}
              style={styles.btn}
            >
              <Text style={styles.btnText}>−</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => dispatch(setSetting({ key: 'fontSize', value: Math.min(28, settings.fontSize + 1) }))}
              style={styles.btn}
            >
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  section: { backgroundColor: '#fff', margin: 12, borderRadius: 12, overflow: 'hidden' },
  sectionTitle: { fontSize: 12, color: '#888', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  label: { fontSize: 15, color: '#333' },
  check: { fontSize: 18, color: '#1A73E8' },
  counter: { flexDirection: 'row', gap: 8 },
  btn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#E8F0FE', alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 20, color: '#1A73E8', lineHeight: 24 },
});
