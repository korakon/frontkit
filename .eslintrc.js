module.exports = {
    "rules": {
        "indent": [
            2,
            4
        ],
        "quotes": [
            2,
            "single"
        ],
        "linebreak-style": [
            2,
            "unix"
        ],
        "semi": [
            2,
            "always"
        ],
        "no-multiple-empty-lines": [
            2,
            {max: 2}
        ]
    },
    "ecmaFeatures": { "modules": true },
    "env": {
        "es6": true,
        "node": true,
        "browser": true
    },
    "extends": "eslint:recommended"
};