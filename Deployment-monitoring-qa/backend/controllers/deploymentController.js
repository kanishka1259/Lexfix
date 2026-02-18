const Deployment = require("../models/DeploymentStatus");
const awsConfig = require("../config/awsConfig");

exports.deployPlatform = async (req, res) => {

    const deployments = [];

    for (const zone of awsConfig.availabilityZones) {
        const record = await Deployment.create({
            zone,
            status: "Active"
        });
        deployments.push(record);
    }

    res.json({ message: "Platform deployed", deployments });
};

exports.getDisasterRecovery = (req, res) => {
    res.json(awsConfig.disasterRecovery);
};
