import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Button from "@/assets/components/Button";

const index = () => {
  const router = useRouter();
  const goToLogin = () => {
    router.push("/auth/logIn");
  };
  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("@/assets/images/welcomeImage.jpg")}
        style={{ width: "100%", height: 550 }}
      />
      <View style={{ flex: 1, backgroundColor: "white", // Optional, to ensure content has a background
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      overflow: "hidden", // Prevent overflow beyond rounded corners
      marginTop:-22,
      flexDirection:"column", padding: 20,justifyContent:"space-evenly"
      }}>
        
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              flexWrap: "wrap",
              fontWeight: 700,
            }}
          >
            Welcome to the Ai App Click Below to Continue
          </Text>
          <Button
            text={"Continue"}
            onClick={goToLogin}
            
          />
          <Text
            style={{
              fontSize: 13,
              textAlign: "center",
              flexWrap: "wrap",
              color: "gray",
            }}
          >
            Unleash the experience
          </Text>
        
      </View>
    
    </View>
  );
};

export default index;
