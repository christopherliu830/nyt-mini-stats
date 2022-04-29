require('dotenv').config();
const execSync = require('child_process').execSync;
const output = execSync(`scp -r build/* ${process.env.DEPLOY_DIRECTORY}`, { encoding: 'utf-8', stdio: 'inherit' });
console.log(output);

