import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const Login = () => {
  const router = useRouter();
  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <TouchableOpacity
        onPress={() => {
          //@ts-ignore
          router.push("/(tabs)");
        }}
       
      >
        <Text>this is login screen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
