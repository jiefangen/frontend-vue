const { run } = require('runjs')
const chalk = require('chalk')
const config = require('../vue.config.js')
const rawArgv = process.argv.slice(2)
const args = rawArgv.join(' ')

if (process.env.npm_config_preview || rawArgv.includes('--preview')) {
  const buildMode = rawArgv.slice(' ')[1]
  if (buildMode) {
    const buildCommand = `vue-cli-service build --mode ${buildMode}`
    run(buildCommand)
  } else {
    run(`vue-cli-service build ${args}`)
  }

  const port = 9000
  const publicPath = config.publicPath

  var connect = require('connect')
  var serveStatic = require('serve-static')
  const app = connect()

  app.use(
    publicPath,
    serveStatic('./dist', {
      index: ['index.html', '/']
    })
  )

  const report = rawArgv.includes('--report')
  app.listen(port, function () {
    console.log(chalk.green(`> Preview at  http://127.0.0.1:${port}${publicPath}`))
    if (report) {
      console.log(chalk.green(`> Report at  http://127.0.0.1:${port}${publicPath}report.html`))
    }

  })
} else {
  run(`vue-cli-service build ${args}`)
}
