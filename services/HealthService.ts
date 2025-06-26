import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
  HealthValue,
  AnchoredQueryResults,
  HKErrorResponse,
} from "react-native-health";
import { Platform } from "react-native";

// Define custom interfaces
export interface WorkoutRoute {
  date: string;
  latitude: number;
  longitude: number;
  altitude: number;
}

// Define the workout type interface
export interface WorkoutData {
  id: string;
  startDate: string;
  endDate: string;
  activityName: string;
  activityId: number;
  calories: number;
  distance: number; // stored in miles
  duration: number;
  hasRoute?: boolean;
  route?: WorkoutRoute[];
}

// Define return type for getWorkoutStats
export interface WorkoutStats {
  totalWorkouts: number;
  totalDistance: number; // in miles
  totalDuration: number; // in seconds
  totalCalories: number;
  avgPace: number; // in minutes per mile
  longestDistance: number; // in miles
  fastestPace: number; // in minutes per mile
}

// Define the permission scopes required by the app
const PERMISSIONS = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Workout,
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.DistanceCycling,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.HeartRate,
    ],
    write: [AppleHealthKit.Constants.Permissions.Workout],
  },
} as HealthKitPermissions;

class HealthService {
  /**
   * Initialize the HealthKit service and request permissions
   */
  initialize(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Only available on iOS
      if (Platform.OS !== "ios") {
        reject(new Error("HealthKit is only available on iOS"));
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
    return Platform.OS === "ios";
  }

  /**
   * Get all running workouts from HealthKit
   * @param options Optional parameters for querying workouts
   */
  getRunningWorkouts(
    options: Partial<HealthInputOptions> = {}
  ): Promise<WorkoutData[]> {
    return new Promise((resolve, reject) => {
      if (!this.isHealthDataAvailable()) {
        reject(new Error("HealthKit is not available"));
        return;
      }

      AppleHealthKit.getAnchoredWorkouts(
        {
          ascending: false, // Most recent first
          type: AppleHealthKit.Constants.Activities.Running, // Only running workouts
          ...options,
        } as HealthInputOptions,
        (err: HKErrorResponse, results: AnchoredQueryResults) => {
          if (err) {
            reject(new Error(err.message || "Unknown error occurred"));
            return;
          }

          // Check if results is valid and contains data array
          if (!results || !results.data) {
            resolve([]);
            return;
          }

          // Filter and map workout data to only include running activities
          const workouts = results.data
            .filter((workout: any) => {
              // Filter for running activities only
              const activityName = (workout.activityName || "").toLowerCase();
              return activityName.includes("running") || activityName.includes("run");
            })
            .map((workout: any) => {
              // Validate and normalize numeric values
              const distanceInMiles = this.validateNumber(workout.distance, 0);
              const duration = this.validateNumber(workout.duration, 0);
              const calories = this.validateNumber(workout.calories, 0);
              
              // Parse dates properly - HealthKit uses 'start' and 'end' field names
              const startDate = this.parseHealthKitDate(workout.start);
              const endDate = this.parseHealthKitDate(workout.end);
              
              return {
                id: workout.id || String(startDate),
                startDate,
                endDate,
                activityName: workout.activityName || "Running",
                activityId: this.validateNumber(workout.activityId, 0),
                calories,
                distance: distanceInMiles, // stored in miles as received from HealthKit
                duration, // in seconds
                hasRoute: Boolean(workout.route),
                route: Array.isArray(workout.route) ? workout.route : undefined,
              };
            });

          resolve(workouts);
        }
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
        reject(new Error("HealthKit is not available"));
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
    const totalDistance = workouts.reduce(
      (sum, workout) => sum + workout.distance,
      0
    );
    const totalDuration = workouts.reduce(
      (sum, workout) => sum + workout.duration,
      0
    );
    const totalCalories = workouts.reduce(
      (sum, workout) => sum + workout.calories,
      0
    );

    // Calculate average pace (min/mile) from total duration and distance
    const avgPace =
      totalDistance > 0 ? totalDuration / 60 / totalDistance : 0;

    // Find the longest workout by distance
    const longestDistance = Math.max(...workouts.map((w) => w.distance));

    // Find the fastest pace
    let fastestPace = Infinity;
    workouts.forEach((workout) => {
      if (workout.distance > 0) {
        const pace = workout.duration / 60 / workout.distance;
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
   * Validate and sanitize numeric values from HealthKit
   * @param value The value to validate
   * @param defaultValue Default value if validation fails
   */
  private validateNumber(value: any, defaultValue: number = 0): number {
    const num = Number(value);
    return !isNaN(num) && isFinite(num) && num >= 0 ? num : defaultValue;
  }

  /**
   * Parse HealthKit date format to ISO string
   * @param dateValue The date value from HealthKit
   */
  private parseHealthKitDate(dateValue: any): string {
    if (!dateValue) return new Date().toISOString();
    
    // Try parsing as-is first
    let date = new Date(dateValue);
    
    // If invalid, try treating as timestamp
    if (isNaN(date.getTime())) {
      const timestamp = Number(dateValue);
      if (!isNaN(timestamp)) {
        date = new Date(timestamp);
      }
    }
    
    // If still invalid, return current date
    if (isNaN(date.getTime())) {
      console.warn('Invalid date from HealthKit:', dateValue);
      return new Date().toISOString();
    }
    
    return date.toISOString();
  }

  /**
   * Convert distance between miles and kilometers
   * @param distance Distance value
   * @param fromUnit Current unit ('miles' or 'km')
   * @param toUnit Target unit ('miles' or 'km')
   */
  convertDistance(distance: number, fromUnit: 'miles' | 'km', toUnit: 'miles' | 'km'): number {
    if (fromUnit === toUnit) return distance;
    
    if (fromUnit === 'miles' && toUnit === 'km') {
      return distance * 1.609344;
    } else if (fromUnit === 'km' && toUnit === 'miles') {
      return distance / 1.609344;
    }
    
    return distance;
  }

  /**
   * Format pace to display format (MM:SS)
   * @param pace Pace in minutes per unit
   * @param unit The unit ('miles' or 'km')
   */
  formatPace(pace: number, unit: 'miles' | 'km' = 'miles'): string {
    if (!pace || pace === 0 || pace === Infinity) return "--:--";

    const minutes = Math.floor(pace);
    const seconds = Math.floor((pace - minutes) * 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}

export default new HealthService();
