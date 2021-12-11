const scanner = require('sonarqube-scanner');
const packageJson = require('./package.json')

scanner(
    {
        serverUrl: 'http://srvimsvc01:9000',
        token: "c4b94217648b49cc91f3d6e4ac80408b2ae1feb7",
        options: {
            'sonar.projectName': packageJson.name,
            // 'sonar.projectDescription': 'Description for "My App" project...',
            'sonar.sources': 'src',
        }
    },
    () => process.exit()
)