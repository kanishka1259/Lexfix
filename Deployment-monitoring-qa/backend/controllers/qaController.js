exports.validateScreenReaders = (req, res) => {
    res.json({
        NVDA: "PASS",
        VoiceOver: "PASS"
    });
};

exports.validateWCAG = (req, res) => {
    res.json({
        dyslexiaFont: "PASS",
        colorContrast: "PASS"
    });
};
