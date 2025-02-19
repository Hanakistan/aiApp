import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface HistoryItem {
  prompt: string;
  image: string;
  timestamp: string;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('generationHistory');
      if (historyData) {
        setHistory(JSON.parse(historyData));
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.setItem('generationHistory', JSON.stringify([]));
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={[styles.historyItem, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}>
      <Image
        source={{ uri: `data:image/png;base64,${item.image}` }}
        style={styles.thumbnail}
      />
      <View style={styles.itemDetails}>
        <Text
          style={[styles.prompt, { color: isDark ? '#FFFFFF' : '#000000' }]}
          numberOfLines={2}>
          {item.prompt}
        </Text>
        <Text style={[styles.timestamp, { color: isDark ? '#888888' : '#999999' }]}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      {history.length > 0 ? (
        <>
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            <Text style={styles.clearButtonText}>Clear History</Text>
          </TouchableOpacity>
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item.timestamp}
            contentContainerStyle={styles.list}
          />
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="images-outline"
            size={64}
            color={isDark ? '#333333' : '#CCCCCC'}
          />
          <Text style={[styles.emptyText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            No generated images yet
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 20,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 80,
    height: 80,
  },
  itemDetails: {
    flex: 1,
    padding: 10,
  },
  prompt: {
    fontSize: 16,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCCCCC',
  },
  clearButtonText: {
    color: '#FF3B30',
    marginLeft: 10,
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
  },
});