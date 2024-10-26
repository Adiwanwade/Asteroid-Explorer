import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { styles } from '../styles.js';
const DetailsScreen = () => {
  const { asteroidData, imageUrl, asteroidImageData } = useSelector(state => state.asteroid);
  const bounceValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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
  }, []);

  if (!asteroidData) return null;

  return (
    <LinearGradient
      colors={['#0A0A0F', '#1A1A2E', '#2A2A4E']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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
      </ScrollView>
    </LinearGradient>
  );
};

export default DetailsScreen;






