import ImageGenerator from '@/assets/components/ImageGenerator';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function CreateScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ImageGenerator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});