console.log(`MARP -> BUILD_RUNNING : ${process.env.BUILD_RUNNING}`)

export default {
  allowLocalFiles: true,
  html: true,
  inputDir: `${process.env.FLEX_PROJ_ROOT}/apps/gateway/src/slides/`,
  output: `${process.env.FLEX_PROJ_ROOT}/apps/gateway/public/slides`,
  watch: process.env.FLEX_MODE === 'development' && process.env.BUILD_RUNNING !== 'true',
  url: process.env.FLEX_MODE === 'development'
    ? `${process.env.FLEX_GATEWAY_HOST}`
    : `${process.env.FLEX_GATEWAY_DEPLOYED_REMOTE_HOSTNAME}`,
}
