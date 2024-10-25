import React, { useState, useEffect, useCallback, useRef } from "react";
import  {API_KEY}  from '@env';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
 
// const API_KEY = API_KEY // Replace with your NASA API key
const { width } = Dimensions.get("window");

export default function App() {
  // State management
  const [asteroidId, setAsteroidId] = useState("");
  const [asteroidData, setAsteroidData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [asteroidImageData, setAsteroidImageData] = useState(null);
  
  // Animation refs and values
  const bounceValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mounted = useRef(false);

  // Initialize component
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Reset animations when new data arrives
  const resetAnimations = useCallback(() => {
    bounceValue.setValue(0);
    fadeAnim.setValue(0);
  }, [bounceValue, fadeAnim]);

  // Start animations
  const startAnimations = useCallback(() => {
    Animated.parallel([
      Animated.spring(bounceValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bounceValue, fadeAnim]);

  // Handle data updates
  const updateData = useCallback((data) => {
    if (mounted.current) {
      resetAnimations();
      setAsteroidData(data);
      // Use a small timeout to ensure state is updated before animation
      setTimeout(startAnimations, 50);
    }
  }, [resetAnimations, startAnimations]);

  const fetchAsteroidImage = useCallback(async (name) => {
    if (!mounted.current) return;

    const getRandomDate = () => {
      const start = new Date(1995, 5, 16);
      const end = new Date();
      const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
      const randomDate = new Date(randomTime);
      return `${randomDate.getFullYear()}-${String(randomDate.getMonth() + 1).padStart(2, '0')}-${String(randomDate.getDate()).padStart(2, '0')}`;
    };

    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${getRandomDate()}`
      );

      if (!response.ok) throw new Error("Failed to fetch APOD");

      const data = await response.json();
      
      if (mounted.current) {
        if (data.media_type === "image") {
          setImageUrl(data.url);
          setAsteroidImageData({
            title: data.title,
            explanation: data.explanation,
            date: data.date,
            copyright: data.copyright || "NASA",
          });
        } else {
          setImageUrl(`https://source.unsplash.com/featured/?asteroid,space`);
        }
      }
    } catch (error) {
      if (mounted.current) {
        setImageUrl(`https://source.unsplash.com/featured/?asteroid,space`);
      }
    }
  }, []);

  const fetchAsteroidData = useCallback(async (id) => {
    if (!id || !mounted.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${API_KEY}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch asteroid data');

      const data = await response.json();

      if (mounted.current) {
        if (data.code) {
          setError(data.error_message || "Asteroid not found");
          setAsteroidData(null);
        } else {
          updateData(data);
          setRecentSearches(prev => [...new Set([id, ...prev.slice(0, 4)])]);
          await fetchAsteroidImage(data.name);
        }
      }
    } catch (error) {
      if (mounted.current) {
        setError("Error fetching data. Please try again.");
        setAsteroidData(null);
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [updateData, fetchAsteroidImage]);

  const handleSubmit = useCallback(() => {
    const trimmedId = asteroidId.trim();
    if (!trimmedId) {
      Alert.alert("Error", "Asteroid ID cannot be empty!");
      return;
    }
    
    // Reset any existing data and animations
    setAsteroidData(null);
    resetAnimations();
    
    // Fetch new data
    fetchAsteroidData(trimmedId);
  }, [asteroidId, fetchAsteroidData, resetAnimations]);

  const handleRandomAsteroid = useCallback(async () => {
    if (!mounted.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch random asteroid');

      const data = await response.json();
      const randomAsteroid = data.near_earth_objects[
        Math.floor(Math.random() * data.near_earth_objects.length)
      ];
      
      if (mounted.current) {
        setAsteroidId(randomAsteroid.id);
        await fetchAsteroidData(randomAsteroid.id);
      }
    } catch (error) {
      if (mounted.current) {
        setError("Error fetching random asteroid.");
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [fetchAsteroidData]);

  // Handle recent search click
  const handleRecentSearch = useCallback((id) => {
    setAsteroidId(id);
    fetchAsteroidData(id);
  }, [fetchAsteroidData]);

  return (
    <LinearGradient
  colors={['#0A0A0F', '#1A1A2E', '#2A2A4E']}
  style={styles.container}
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
              onChangeText={setAsteroidId}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}
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
                        setAsteroidId(id);
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

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {asteroidData && (
          <Animated.View
            style={[
              styles.resultCard,
              {
                transform: [
                  {
                    scale: bounceValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.asteroidName}>{asteroidData.name}</Text>

            <View style={styles.hazardContainer}>
              <Text
                style={[
                  styles.hazardText,
                  {
                    color: asteroidData.is_potentially_hazardous_asteroid
                      ? "#D32F2F"
                      : "#388E3C",
                  },
                ]}
              >
                {asteroidData.is_potentially_hazardous_asteroid
                  ? "⚠️ Potentially Hazardous"
                  : "✅ Not Hazardous"}
              </Text>
            </View>

            {imageUrl && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.asteroidImage}
                  resizeMode="cover"
                />
                {asteroidImageData && (
                  <View style={styles.imageInfo}>
                    <Text style={styles.imageTitle}>
                      {asteroidImageData.title}
                    </Text>
                    <Text style={styles.imageDate}>
                      {new Date(asteroidImageData.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.imageCopyright}>
                      © {asteroidImageData.copyright}
                    </Text>
                    <Text
                      style={styles.imageDescription}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {asteroidImageData.explanation}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.detailsContainer}>
              {asteroidData.estimated_diameter && (
                <Text style={styles.detailText}>
                  Diameter:{" "}
                  {asteroidData.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
                    2
                  )}{" "}
                  -{" "}
                  {asteroidData.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
                    2
                  )}{" "}
                  km
                </Text>
              )}

              {asteroidData.close_approach_data && (
                <>
                  {(() => {
                    const currentDate = new Date();
                    const formatDate = (dateString) => {
                      const date = new Date(dateString);
                      return new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZoneName: "short",
                      }).format(date);
                    };

                    const nextApproach = asteroidData.close_approach_data.find(
                      (approach) => {
                        const approachDate = new Date(
                          approach.close_approach_date
                        );
                        return approachDate > currentDate;
                      }
                    );

                    if (nextApproach) {
                      const approachDate = new Date(
                        nextApproach.close_approach_date
                      );
                      const daysUntil = Math.ceil(
                        (approachDate - currentDate) / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <>
                          <Text style={styles.approachTitle}>
                            Next Approach
                          </Text>
                          <Text style={styles.detailText}>
                            Date: {formatDate(nextApproach.close_approach_date)}
                          </Text>
                          <Text style={styles.detailText}>
                            Days Until Approach: {daysUntil} days
                          </Text>
                          <Text style={styles.detailText}>
                            Miss Distance:{" "}
                            {Number(
                              nextApproach.miss_distance.kilometers
                            ).toLocaleString()}{" "}
                            km
                          </Text>
                          <Text style={styles.detailText}>
                            Relative Velocity:{" "}
                            {Number(
                              nextApproach.relative_velocity.kilometers_per_hour
                            ).toLocaleString()}{" "}
                            km/h
                          </Text>
                        </>
                      );
                    } else {
                      const lastApproach =
                        asteroidData.close_approach_data[
                          asteroidData.close_approach_data.length - 1
                        ];
                      return (
                        <>
                          <Text style={styles.approachTitle}>
                            Last Known Approach
                          </Text>
                          <Text style={styles.detailText}>
                            Date: {formatDate(lastApproach.close_approach_date)}
                          </Text>
                          <Text style={styles.detailText}>
                            Miss Distance:{" "}
                            {Number(
                              lastApproach.miss_distance.kilometers
                            ).toLocaleString()}{" "}
                            km
                          </Text>
                          <Text style={styles.detailText}>
                            Relative Velocity:{" "}
                            {Number(
                              lastApproach.relative_velocity.kilometers_per_hour
                            ).toLocaleString()}{" "}
                            km/h
                          </Text>
                        </>
                      );
                    }
                  })()}
                </>
              )}
            </View>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                // It's good practice to check if the URL can be opened
                Linking.canOpenURL(asteroidData.nasa_jpl_url).then(
                  (supported) => {
                    if (supported) {
                      Linking.openURL(asteroidData.nasa_jpl_url);
                    } else {
                      console.log(
                        "Don't know how to open URI: " +
                          asteroidData.nasa_jpl_url
                      );
                    }
                  }
                );
              }}
            >
              <Text style={styles.linkButtonText}>View on NASA JPL →</Text>     
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F', // Deep space black
  },
  scrollContainer: { 
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#00FF9D', // Bright neon green
    textShadowColor: 'rgba(0, 255, 157, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  card: {
    backgroundColor: '#1A1A2E', // Deep navy blue
    borderRadius: 15,
    padding: 20,
    width: '100%',
    elevation: 10,
    marginBottom: 20,
    shadowColor: '#00FF9D',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A4E',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    height: 50,
    backgroundColor: '#2A2A4E', // Darker navy for input
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3D3D6B',
    shadowColor: '#00FF9D',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    flex: 0.48,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: '#00FF9D', // Neon green primary button
    shadowColor: '#00FF9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  secondaryButton: {
    backgroundColor: '#FF00E5', // Neon pink secondary button
    shadowColor: '#FF00E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#0A0A0F', // Dark text on light button
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#FFFFFF', // Light text on dark button
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentSearches: {
    marginTop: 20,
  },
  recentTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#00FF9D',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 255, 157, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  recentButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#2A2A4E',
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3D3D6B',
    shadowColor: '#00FF9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  recentButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#3D1818', // Dark red for errors
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#FF4444',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  errorText: {
    color: '#FF4444',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#1A1A2E',
    padding: 20,
    borderRadius: 15,
    elevation: 12,
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#2A2A4E',
    shadowColor: '#00FF9D',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  asteroidName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FF9D',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 255, 157, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  hazardContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  hazardText: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  asteroidImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginVertical: 15,
    shadowColor: '#00FF9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  detailsContainer: {
    marginTop: 10,
    backgroundColor: '#2A2A4E',
    padding: 15,
    borderRadius: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  linkButton: {
    backgroundColor: '#FF00E5', // Neon pink
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#FF00E5',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  linkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginVertical: 15,
  },
  imageInfo: {
    padding: 15,
    backgroundColor: '#2A2A4E',
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#3D3D6B',
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00FF9D',
    marginBottom: 5,
  },
  imageDate: {
    fontSize: 14,
    color: '#BBBBBB',
    marginBottom: 3,
  },
  imageCopyright: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  imageDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  approachTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FF9D',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 255, 157, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 