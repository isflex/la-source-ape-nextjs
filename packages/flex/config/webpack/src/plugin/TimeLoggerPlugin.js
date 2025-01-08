/* eslint-disable no-console */

const PLUGIN_NAME = 'TimeLoggerPlugin'

class TimeLoggerPlugin {
  apply(compiler) {
    console.log(compiler.hooks.watchRun)

    compiler.hooks.watchRun.tap(PLUGIN_NAME, (compiler) => {
      const logger = compiler.getInfrastructureLogger(PLUGIN_NAME)
      logger.info(`[Message from ${PLUGIN_NAME}] Compilation Done ${new Date().toLocaleString()}`)
    })

    // you can access Logger from compiler
    const logger = compiler.getInfrastructureLogger(PLUGIN_NAME)
    logger.log('log from compiler')

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      // you can also access Logger from compilation
      const logger = compilation.getLogger(PLUGIN_NAME)
      logger.info('log from compilation')
    })
  }
}

module.exports = TimeLoggerPlugin
