import { View, Text, Image } from "react-native";

export default function HeaderCollapsible() {
  return (
    <View style={{ padding: 20, backgroundColor: "#007AFF" }}>
      <Image
        source={require("@/assets/images/sut.png")}

        style={{ width: 100, height: 100, borderRadius: 50 }}
      />

      <Text style={{ color: "white", fontSize: 24, marginTop: 10 }}>
        Profile Name
      </Text>
    </View>
  );
};
