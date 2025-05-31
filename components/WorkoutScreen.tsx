import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import ThemeAwareScreen from "@/components/ui/theme-aware-screen";
import healthService, {
  WorkoutData,
  WorkoutStats,
} from "@/services/HealthService";
import { router } from "expo-router";

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [healthAvailable, setHealthAvailable] = useState(false);

  useEffect(() => {
    const isAvailable = healthService.isHealthDataAvailable();
    setHealthAvailable(isAvailable);

    if (!isAvailable) {
      setError("HealthKit is only available on iOS devices");
      setLoading(false);
      return;
    }

    const initializeHealthKit = async () => {
      try {
        await healthService.initialize();
        loadWorkouts();
      } catch (error) {
        setError(
          "Failed to initialize HealthKit. Please check your permissions."
        );
        setLoading(false);
      }
    };

    initializeHealthKit();
  }, []);

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      const workoutData = await healthService.getRunningWorkouts();
      setWorkouts(workoutData);
      setStats(healthService.getWorkoutStats(workoutData));
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format distance to display in km with 2 decimal places
  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2) + " km";
  };

  // Format duration to display in HH:MM:SS format
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Render each workout item
  const renderWorkoutItem = ({ item }: { item: WorkoutData }) => (
    <Card style={styles.workoutCard}>
      <VStack space="md">
        <Heading size="sm">{formatDate(item.startDate)}</Heading>
        <HStack space="lg" style={styles.workoutStatsContainer}>
          <VStack>
            <Text size="xs" style={{ opacity: 0.7 }}>
              Distance
            </Text>
            <Text size="md" bold>
              {formatDistance(item.distance)}
            </Text>
          </VStack>
          <VStack>
            <Text size="xs" style={{ opacity: 0.7 }}>
              Duration
            </Text>
            <Text size="md" bold>
              {formatDuration(item.duration)}
            </Text>
          </VStack>
          <VStack>
            <Text size="xs" style={{ opacity: 0.7 }}>
              Pace
            </Text>
            <Text size="md" bold>
              {item.distance > 0
                ? healthService.formatPace(
                    item.duration / 60 / (item.distance / 1000)
                  )
                : "--:--"}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  );

  if (!healthAvailable) {
    return (
      <ThemeAwareScreen>
        <View style={styles.container}>
          <Card style={styles.errorCard}>
            <Text size="lg" bold>
              HealthKit Not Available
            </Text>
            <Text>
              HealthKit is only available on iOS devices. This feature cannot be
              used on your current device.
            </Text>
          </Card>
        </View>
      </ThemeAwareScreen>
    );
  }

  if (loading) {
    return (
      <ThemeAwareScreen>
        <View style={styles.container}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 20 }}>Loading your workouts...</Text>
        </View>
      </ThemeAwareScreen>
    );
  }

  if (error) {
    return (
      <ThemeAwareScreen>
        <View style={styles.container}>
          <Card style={styles.errorCard}>
            <Text size="lg" bold>
              Error Loading Workouts
            </Text>
            <Text>{error}</Text>
            <Button onPress={loadWorkouts} style={{ marginTop: 20 }}>
              <ButtonText>Retry</ButtonText>
            </Button>
          </Card>
        </View>
      </ThemeAwareScreen>
    );
  }

  return (
    <ThemeAwareScreen>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Heading size="xl" style={styles.pageTitle}>
            Running History
          </Heading>

          {stats && (
            <Card style={styles.statsCard}>
              <VStack space="md">
                <Heading size="md">Summary Statistics</Heading>
                <Divider />

                <HStack space="xl" style={styles.statsRow}>
                  <VStack style={styles.statItem}>
                    <Text size="xs" style={{ opacity: 0.7 }}>
                      Total Runs
                    </Text>
                    <Text size="lg" bold>
                      {stats.totalWorkouts}
                    </Text>
                  </VStack>

                  <VStack style={styles.statItem}>
                    <Text size="xs" style={{ opacity: 0.7 }}>
                      Total Distance
                    </Text>
                    <Text size="lg" bold>
                      {formatDistance(stats.totalDistance)}
                    </Text>
                  </VStack>
                </HStack>

                <HStack space="xl" style={styles.statsRow}>
                  <VStack style={styles.statItem}>
                    <Text size="xs" style={{ opacity: 0.7 }}>
                      Avg Pace
                    </Text>
                    <Text size="lg" bold>
                      {healthService.formatPace(stats.avgPace)}
                    </Text>
                  </VStack>

                  <VStack style={styles.statItem}>
                    <Text size="xs" style={{ opacity: 0.7 }}>
                      Fastest Pace
                    </Text>
                    <Text size="lg" bold>
                      {healthService.formatPace(stats.fastestPace)}
                    </Text>
                  </VStack>
                </HStack>

                <HStack space="xl" style={styles.statsRow}>
                  <VStack style={styles.statItem}>
                    <Text size="xs" style={{ opacity: 0.7 }}>
                      Longest Run
                    </Text>
                    <Text size="lg" bold>
                      {formatDistance(stats.longestDistance)}
                    </Text>
                  </VStack>

                  <VStack style={styles.statItem}>
                    <Text size="xs" style={{ opacity: 0.7 }}>
                      Total Calories
                    </Text>
                    <Text size="lg" bold>
                      {Math.round(stats.totalCalories)} kcal
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </Card>
          )}

          <View style={styles.workoutsContainer}>
            <Heading size="md" style={styles.sectionTitle}>
              Recent Workouts
            </Heading>

            {workouts.length === 0 ? (
              <Card style={styles.emptyStateCard}>
                <Text size="md" style={{ textAlign: "center" }}>
                  No running workouts found in Health app
                </Text>
                <Text
                  size="sm"
                  style={{ textAlign: "center", marginTop: 10, opacity: 0.7 }}
                >
                  Complete a run with your Apple Watch or iPhone to see your
                  data here
                </Text>
                <Button onPress={loadWorkouts} style={{ marginTop: 20 }}>
                  <ButtonText>Refresh</ButtonText>
                </Button>
              </Card>
            ) : (
              <FlatList
                data={workouts}
                renderItem={renderWorkoutItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.workoutList}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </ThemeAwareScreen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    marginBottom: 20,
    textAlign: "center",
  },
  statsCard: {
    marginBottom: 20,
    padding: 16,
  },
  statsRow: {
    justifyContent: "space-between",
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  workoutsContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  workoutList: {
    paddingBottom: 20,
  },
  workoutCard: {
    marginBottom: 12,
    padding: 16,
  },
  workoutStatsContainer: {
    justifyContent: "space-between",
  },
  errorCard: {
    padding: 20,
    alignItems: "center",
  },
  emptyStateCard: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
