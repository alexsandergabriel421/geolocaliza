import { Platform } from "react-native";
import * as Location from "expo-location";
import { LatLng } from "./distance";

export async function getCurrentLocation(): Promise<LatLng | null> {
  if (Platform.OS === "web") {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
      } else resolve(null);
    });
  } else {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;
    const locData = await Location.getCurrentPositionAsync({});
    return { lat: locData.coords.latitude, lng: locData.coords.longitude };
  }
}
