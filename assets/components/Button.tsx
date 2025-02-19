import { TouchableOpacity, Text, StyleSheet } from "react-native";

type ButtonProps = {
  text: string;
  onClick: () => void;
  style?: object;
};

const Button = ({ text, onClick, style }: ButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onClick}
      style={[styles.container, style]}
    >
      <Text
        style={{
          textAlign: "center",
          flexWrap: "wrap",
          fontSize: 17,
          color: "white",
          fontWeight: 700,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    minHeight: 50,
    backgroundColor: "rgb(100, 100, 199)",
    borderRadius: 8,
    justifyContent: "center",
  },
});
export default Button;
