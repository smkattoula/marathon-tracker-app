import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
  HealthValue,
  HealthResults,
  WorkoutOptions,
  WorkoutRoute,
} from 'react-native-health';
import { Platform } from 'react-native';

// Define the workout type interface
export interface WorkoutData {
  id: string;
  startDate: string;
  endDate: string;
  activityName: string;
  activityId: number;
  calories: number;
  distance: number;
  duration: number;
  hasRoute?: boolean;
  route?: WorkoutRoute[];
}

// Define return type for getWorkoutStats
export interface WorkoutStats {
  totalWorkouts: number;
  totalDistance: number; // in meters
  totalDuration: number; // in seconds
  totalCalories: number;
  avgPace: number; // in minutes per kilometer
  longestDistance: number; // in meters
  fastestPace: number; // in minutes per kilometer
}

// Define the permission scopes required by the app
const PERMISSIONS = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Workout,
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.DistanceWalking,
      AppleHealthKit.Constants.Permissions.DistanceRunning,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.DistanceCycling,
      AppleHealthKit.Constants.Permissions.RouteSamples,
    ],
    write: [
      AppleHealthKit.Constants.Permissions.Workout,
    ],
  },
};

class HealthService {
  /**
   * Initialize the HealthKit service and request permissions
   */
  initialize(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Only available on iOS
      if (Platform.OS !== 'ios') {
        reject(new Error('HealthKit is only available on iOS'));
        return;
      }

      AppleHealthKit.initHealthKit(PERMISSIONS, (error: string) => {
        if (error) {
          reject(new Error(error));
          return;
        }
        resolve(true);
      });
    });
  }

  /**
   * Check if HealthKit is available
   */
  isHealthDataAvailable(): boolean {
    return Platform.OS === 'ios';
  }

  /**
   * Get all running workouts from HealthKit
   * @param options Optional parameters for querying workouts
   */
  getRunningWorkouts(options: Partial<WorkoutOptions> = {}): Promise<WorkoutData[]> {
    return new Promise((resolve, reject) => {
      if (!this.isHealthDataAvailable()) {
        reject(new Error('HealthKit is not available'));
        return;
      }

      AppleHealthKit.getWorkoutsByType(
        {
          type: 'Running', // Filter for running workouts only
          limit: 0, // No limit
          ascending: false, // Most recent first
          ...options,
        },
        (err: string, results: HealthResults) => {
          if (err) {
            reject(new Error(err));
            return;
          }
          
          // Cast to workout data array and normalize the data
          const workouts = results.map((workout: any) => ({
            id: workout.id || String(workout.startDate),
            startDate: workout.startDate,
            endDate: workout.endDate,
            activityName: workout.activityName || 'Running',
            activityId: workout.activityId || 0,
            calories: workout.calories || 0,
            distance: workout.distance || 0, // in meters
            duration: workout.duration || 0, // in seconds
            hasRoute: !!workout.route,
            route: workout.route,
          }));
          
          resolve(workouts);
        },
      );
    });
  }

  /**
   * Get route data for a specific workout
   * @param workoutId The ID of the workout to get route data for
   */
  getWorkoutRoute(workoutId: string): Promise<WorkoutRoute[]> {
    return new Promise((resolve, reject) => {
      if (!this.isHealthDataAvailable()) {
        reject(new Error('HealthKit is not available'));
        return;
      }

      // Implementation will depend on how workout routes are stored
      // This is placeholder for now
      resolve([]);
    });
  }

  /**
   * Calculate statistics for all running workouts
   * @param workouts Array of workout data
   */
  getWorkoutStats(workouts: WorkoutData[]): WorkoutStats {
    if (!workouts || workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalDistance: 0,
        totalDuration: 0,
        totalCalories: 0,
        avgPace: 0,
        longestDistance: 0,
        fastestPace: Infinity,
      };
    }

    const totalWorkouts = workouts.length;
    const totalDistance = workouts.reduce((sum, workout) => sum + workout.distance, 0);
    const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
    const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0);
    
    // Calculate average pace (min/km) from total duration and distance
    const avgPace = totalDistance > 0 ? (totalDuration / 60) / (totalDistance / 1000) : 0;
    
    // Find the longest workout by distance
    const longestDistance = Math.max(...workouts.map(w => w.distance));
    
    // Find the fastest pace
    let fastestPace = Infinity;
    workouts.forEach(workout => {
      if (workout.distance > 0) {
        const pace = (workout.duration / 60) / (workout.distance / 1000);
        if (pace < fastestPace) {
          fastestPace = pace;
        }
      }
    });

    return {
      totalWorkouts,
      totalDistance,
      totalDuration,
      totalCalories,
      avgPace,
      longestDistance,
      fastestPace: fastestPace === Infinity ? 0 : fastestPace,
    };
  }

  /**
   * Format pace from minutes per kilometer to display format (MM:SS)
   * @param pace Pace in minutes per kilometer
   */
  formatPace(pace: number): string {
    if (!pace || pace === 0 || pace === Infinity) return '--:--';
    
    const minutes = Math.floor(pace);
    const seconds = Math.floor((pace - minutes) * 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

export default new HealthService();