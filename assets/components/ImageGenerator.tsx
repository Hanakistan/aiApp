import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Text,
  useColorScheme,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Replicate from 'replicate';

const MAX_PROMPT_LENGTH = 500;

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const token = process.env.EXPO_PUBLIC_REPLICATE_AUTH_TOKEN


  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      console.log(token)
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,  // Replace YOUR_API_KEY with your Replicate token
        },
        body: JSON.stringify({
          version: '5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637',  // Model version ID
          input: {
            width: 1024,
            height: 1024,
            prompt: prompt,
            scheduler: 'K_EULER',
            num_outputs: 1,
            guidance_scale: 0,
            negative_prompt: 'worst quality, low quality',
            num_inference_steps: 4,
            disable_safety_checker: true
          },
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create prediction');
      }
  
      const data = await response.json();
  
      // Now, get the prediction id and poll until the prediction is ready
      const predictionId = data.id;
  
      let predictionResult = null;
  
      while (!predictionResult || predictionResult.status !== 'succeeded') {
        const resultResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
          headers: {
            Authorization: `Token ${token}`,  // Replace YOUR_API_KEY with your Replicate token
          },
        });
  
        const resultData = await resultResponse.json();
        predictionResult = resultData;
  
        if (predictionResult.status === 'failed') {
          throw new Error('Prediction failed');
        }
  
        // Optionally, add a delay between polling attempts
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
  
      // Get the image URL from the result
      const imageUrl = predictionResult.output[0];
  
      console.log('Generated Image URL:', imageUrl);
      setImage(imageUrl);
  
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const saveImage = async () => {
    if (!image)  return console.log("no Image");

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        const filename = `${FileSystem.documentDirectory}image-${Date.now()}.png`;
        await FileSystem.writeAsStringAsync(filename, image.split(',')[1], {
          encoding: FileSystem.EncodingType.Base64,
        });

        await MediaLibrary.saveToLibraryAsync(filename);
        alert('Image saved to gallery!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save image');
    }
  };

  const shareImage = async () => {
    if (!image) return;

    try {
      const filename = `${FileSystem.documentDirectory}share-${Date.now()}.png`;
      await FileSystem.writeAsStringAsync(filename, image.split(',')[1], {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (Platform.OS === 'web') {
        const blob = await (await fetch(image)).blob();
        const file = new File([blob], 'image.png', { type: 'image/png' });
        await navigator.share({ files: [file] });
      } else {
        await Sharing.shareAsync(filename);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to share image');
    }
  };

  return (
    <ScrollView  style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? '#FFFFFF' : '#000000',
              backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5',
            },
          ]}
          placeholder="Enter your image prompt..."
          placeholderTextColor={isDark ? '#888888' : '#999999'}
          value={prompt}
          onChangeText={setPrompt}
          multiline
          maxLength={MAX_PROMPT_LENGTH}
        />
        <Text style={[styles.charCount, { color: isDark ? '#888888' : '#999999' }]}>
          {prompt.length}/{MAX_PROMPT_LENGTH}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.generateButton, { opacity: loading ? 0.7 : 1 }]}
        onPress={generateImage}
        disabled={loading}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.generateButtonText}>Generate Image</Text>}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.generatedImage} />
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.actionButton} onPress={saveImage}>
              <Ionicons name="save-outline" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={shareImage}>
              <Ionicons name="share-outline" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:15
    
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderRadius: 12,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  charCount: {
    textAlign: 'right',
    marginTop: 5,
    fontSize: 12,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  generatedImage: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionButton: {
    padding: 10,
    marginHorizontal: 10,
  },
});
