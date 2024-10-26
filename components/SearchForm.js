import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import {
  setAsteroidId,
  setAsteroidData,
  setError,
  setLoading,
  setImageUrl,
  addRecentSearch,
  setAsteroidImageData,
} from "../redux/asteroidSlice";
import { styles } from "../styles.js";
import { API_KEY } from "@env";

const SearchForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const { asteroidId, loading, recentSearches } = useSelector(
    (state) => state.asteroid
  );

  const fetchAsteroidImage = async (name) => {
    const getRandomDate = () => {
      const start = new Date(1995, 5, 16);
      const end = new Date();
      const randomTime =
        start.getTime() + Math.random() * (end.getTime() - start.getTime());
      const randomDate = new Date(randomTime);
      return `${randomDate.getFullYear()}-${String(
        randomDate.getMonth() + 1
      ).padStart(2, "0")}-${String(randomDate.getDate()).padStart(2, "0")}`;
    };

    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${getRandomDate()}`
      );

      if (!response.ok) throw new Error("Failed to fetch APOD");

      const data = await response.json();

      if (data.media_type === "image") {
        dispatch(setImageUrl(data.url));
        dispatch(
          setAsteroidImageData({
            title: data.title,
            explanation: data.explanation,
            date: data.date,
            copyright: data.copyright || "NASA",
          })
        );
      } else {
        dispatch(
          setImageUrl(`https://source.unsplash.com/featured/?asteroid,space`)
        );
      }
    } catch (error) {
      dispatch(
        setImageUrl(`https://source.unsplash.com/featured/?asteroid,space`)
      );
    }
  };

  const fetchAsteroidData = async (id) => {
    if (!id) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${API_KEY}`
      );

      if (!response.ok) throw new Error("Failed to fetch asteroid data");

      const data = await response.json();

      if (data.code) {
        dispatch(setError(data.error_message || "Asteroid not found"));
        dispatch(setAsteroidData(null));
      } else {
        dispatch(setAsteroidData(data));
        dispatch(addRecentSearch(id));
        await fetchAsteroidImage(data.name);
        navigation.navigate("Details");
      }
    } catch (error) {
      dispatch(setError("Error fetching data. Please try again."));
      dispatch(setAsteroidData(null));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRandomAsteroid = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`
      );

      if (!response.ok) throw new Error("Failed to fetch random asteroid");

      const data = await response.json();
      const randomAsteroid =
        data.near_earth_objects[
          Math.floor(Math.random() * data.near_earth_objects.length)
        ];

      dispatch(setAsteroidId(randomAsteroid.id));
      await fetchAsteroidData(randomAsteroid.id);
    } catch (error) {
      dispatch(setError("Error fetching random asteroid."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <LinearGradient
      colors={["#0A0A0F", "#1A1A2E", "#2A2A4E"]}
      style={{
        flex: 1,
        backgroundColor: "#0A0A0F",
        paddingTop: 200,
      }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>🌠 Asteroid Explorer</Text>

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Asteroid ID"
              placeholderTextColor="#9575CD"
              value={asteroidId}
              onChangeText={(text) => dispatch(setAsteroidId(text))}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => fetchAsteroidData(asteroidId)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Search</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleRandomAsteroid}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Random</Text>
            </TouchableOpacity>
          </View>

          {recentSearches.length > 0 && (
            <View style={styles.recentSearches}>
              <Text style={styles.recentTitle}>Recent searches:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.recentButtonsContainer}>
                  {recentSearches.map((id, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.recentButton}
                      onPress={() => {
                        dispatch(setAsteroidId(id));
                        fetchAsteroidData(id);
                      }}
                    >
                      <Text style={styles.recentButtonText}>{id}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SearchForm;
