import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Switch,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [autoSave, setAutoSave] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const toggleAutoSave = async (value: boolean) => {
    setAutoSave(value);
    await AsyncStorage.setItem('settings_autoSave', JSON.stringify(value));
  };

  const toggleHighQuality = async (value: boolean) => {
    setHighQuality(value);
    await AsyncStorage.setItem('settings_highQuality', JSON.stringify(value));
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          Generation Settings
        </Text>
        
        <View style={[styles.setting, { borderBottomColor: isDark ? '#333333' : '#E5E5E5' }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              High Quality Generation
            </Text>
            <Text style={[styles.settingDescription, { color: isDark ? '#888888' : '#999999' }]}>
              Generate higher quality images (slower)
            </Text>
          </View>
          <Switch
            value={highQuality}
            onValueChange={toggleHighQuality}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={highQuality ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <View style={[styles.setting, { borderBottomColor: isDark ? '#333333' : '#E5E5E5' }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Auto-save Generated Images
            </Text>
            <Text style={[styles.settingDescription, { color: isDark ? '#888888' : '#999999' }]}>
              Automatically save images to gallery
            </Text>
          </View>
          <Switch
            value={autoSave}
            onValueChange={toggleAutoSave}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={autoSave ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          About
        </Text>
        
        <TouchableOpacity style={[styles.setting, { borderBottomColor: isDark ? '#333333' : '#E5E5E5' }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Version
            </Text>
            <Text style={[styles.settingDescription, { color: isDark ? '#888888' : '#999999' }]}>
              1.0.0
            </Text>
          </View>
          {Platform.OS !== 'web' && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#888888' : '#999999'}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
  },
});