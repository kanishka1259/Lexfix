module.exports = {
    availabilityZones: ["ap-south-1a", "ap-south-1b", "ap-south-1c"],

    disasterRecovery: {
        backupStorage: "AWS S3",
        backupFrequency: "6 hours",
        restoreTimeObjective: "15 minutes"
    }
};
