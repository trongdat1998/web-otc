const exec = require('child_process').exec
const path = require('path')
const AWS_ACCESS_KEY_ID = process.env.WEB_AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.WEB_AWS_SECRET_ACCESS_KEY

const upload = [
  `AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}`,
  `AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}`,
  'aws s3 sync',
  path.join(__dirname, 'build/static'),
  's3://static.bhpc.com/static/ --cache-control max-age=31536000 --region ap-northeast-1',
].join(' ')
console.log(path.join(__dirname, 'build/static'))
exec(upload, (error, stdout, stderr) => {
  console.log('stdout: ' + stdout, '+++++++++++', 'stderr: ' + stderr)
  if (error !== null) {
    console.log('execSync error: ' + error)
  }
})
