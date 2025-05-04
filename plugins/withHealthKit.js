const { withEntitlementsPlist, withInfoPlist } = require("@expo/config-plugins");

const withHealthKit = (config) => {
  // Add HealthKit entitlement
  config = withEntitlementsPlist(config, (mod) => {
    mod.modResults["com.apple.developer.healthkit"] = true;
    mod.modResults["com.apple.developer.healthkit.access"] = ["health-records"];
    return mod;
  });

  // Add NSHealthShareUsageDescription and NSHealthUpdateUsageDescription to Info.plist
  config = withInfoPlist(config, (mod) => {
    mod.modResults.NSHealthShareUsageDescription =
      "Allow Marathon Tracker to read your health data for workout and activity information";
    mod.modResults.NSHealthUpdateUsageDescription =
      "Allow Marathon Tracker to write workout data to your Health app";
    return mod;
  });

  return config;
};

module.exports = withHealthKit;