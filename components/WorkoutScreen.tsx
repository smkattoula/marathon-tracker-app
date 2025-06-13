import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import healthService, { WorkoutData } from "@/services/HealthService";

interface WorkoutStats {
  totalWorkouts: number;
  totalDistanceMi: number;
  avgPaceSecPerMi: number;
  fastestPaceSecPerMi: number;
  longestDistanceMi: number;
  totalCalories: number;
}

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [healthAvailable, setHealthAvailable] = useState<boolean>(false);

  useEffect(() => {
    const isAvailable = healthService.isHealthDataAvailable();
    setHealthAvailable(isAvailable);

    if (!isAvailable) {
      setError("HealthKit is only available on iOS devices");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        await healthService.initialize();
        await loadWorkouts();
      } catch (e) {
        console.error(e);
        setError(
          "Failed to initialize HealthKit. Please check your permissions."
        );
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (workouts.length > 0) {
      setStats(calculateStats(workouts));
    }
  }, [workouts]);

  const loadWorkouts = useCallback(async () => {
    setLoading(true);
    try {
      const workoutData = await healthService.getRunningWorkouts();
      const sortedWorkouts = workoutData.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      setWorkouts(sortedWorkouts);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load workouts");
    } finally {
      setLoading(false);
    }
  }, []);

  const formatPace = (paceSecondsPerMi: number): string => {
    if (!paceSecondsPerMi || isNaN(paceSecondsPerMi) || paceSecondsPerMi <= 0) {
      return "--:--";
    }
    const totalSec = Math.round(paceSecondsPerMi);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatDistance = (distanceMi: number): string => {
    return (distanceMi ?? 0).toFixed(2) + " mi";
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  function calculateStats(data: WorkoutData[]): WorkoutStats {
    let totalWorkouts = data.length;
    let totalDistanceMi = 0;
    let totalDurationSec = 0;
    let longestDistanceMi = 0;
    let totalCalories = 0;
    let fastestPaceSecPerMi = Number.POSITIVE_INFINITY;

    data.forEach((w) => {
      const distMi = w.distance;
      const durSec = w.duration;
      const cals = w.calories ?? 0;

      totalDistanceMi += distMi;
      totalDurationSec += durSec;
      totalCalories += cals;

      if (distMi > longestDistanceMi) {
        longestDistanceMi = distMi;
      }

      if (distMi > 0) {
        const runPaceSecPerMi = durSec / distMi;
        if (runPaceSecPerMi < fastestPaceSecPerMi) {
          fastestPaceSecPerMi = runPaceSecPerMi;
        }
      }
    });

    if (!isFinite(fastestPaceSecPerMi)) {
      fastestPaceSecPerMi = 0;
    }

    const avgPaceSecPerMi =
      totalDistanceMi > 0 ? totalDurationSec / totalDistanceMi : 0;

    return {
      totalWorkouts,
      totalDistanceMi,
      avgPaceSecPerMi,
      fastestPaceSecPerMi,
      longestDistanceMi,
      totalCalories,
    };
  }

  const renderWorkoutItem = ({ item }: { item: WorkoutData }) => {
    const rawMi = item.distance ?? 0;
    const rawSec = item.duration ?? 0;

    const singlePaceSecPerMi = rawMi > 0 ? rawSec / rawMi : 0;
    const formattedPace = formatPace(singlePaceSecPerMi);

    return (
      <Card style={styles.workoutCard}>
        <VStack space="md">
          <Heading size="sm">
            {item.startDate
              ? new Date(item.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Unknown Date"}
          </Heading>

          <HStack style={{ justifyContent: "space-between" }}>
            <VStack>
              <Text size="xs" style={{ opacity: 0.7 }}>
                Distance
              </Text>
              <Text size="md" bold>
                {formatDistance(rawMi)}
              </Text>
            </VStack>

            <VStack>
              <Text size="xs" style={{ opacity: 0.7 }}>
                Duration
              </Text>
              <Text size="md" bold>
                {formatDuration(rawSec)}
              </Text>
            </VStack>

            <VStack>
              <Text size="xs" style={{ opacity: 0.7 }}>
                Pace
              </Text>
              <Text size="md" bold>
                {rawMi > 0 ? formattedPace : "--:--"}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Card>
    );
  };

  if (!healthAvailable) {
    return (
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
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 20 }}>Loading your workouts...</Text>
      </View>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
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
                    {stats.totalWorkouts ?? 0}
                  </Text>
                </VStack>

                <VStack style={styles.statItem}>
                  <Text size="xs" style={{ opacity: 0.7 }}>
                    Total Distance
                  </Text>
                  <Text size="lg" bold>
                    {(stats.totalDistanceMi ?? 0).toFixed(2)} mi
                  </Text>
                </VStack>
              </HStack>

              <HStack space="xl" style={styles.statsRow}>
                <VStack style={styles.statItem}>
                  <Text size="xs" style={{ opacity: 0.7 }}>
                    Avg Pace
                  </Text>
                  <Text size="lg" bold>
                    {formatPace(stats.avgPaceSecPerMi ?? 0)}
                  </Text>
                </VStack>

                <VStack style={styles.statItem}>
                  <Text size="xs" style={{ opacity: 0.7 }}>
                    Fastest Pace
                  </Text>
                  <Text size="lg" bold>
                    {formatPace(stats.fastestPaceSecPerMi ?? 0)}
                  </Text>
                </VStack>
              </HStack>

              <HStack space="xl" style={styles.statsRow}>
                <VStack style={styles.statItem}>
                  <Text size="xs" style={{ opacity: 0.7 }}>
                    Longest Run
                  </Text>
                  <Text size="lg" bold>
                    {(stats.longestDistanceMi ?? 0).toFixed(2)} mi
                  </Text>
                </VStack>

                <VStack style={styles.statItem}>
                  <Text size="xs" style={{ opacity: 0.7 }}>
                    Total Calories
                  </Text>
                  <Text size="lg" bold>
                    {Math.round(stats.totalCalories ?? 0)} kcal
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
                Complete a run with your Apple Watch or iPhone to see your data
                here
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
