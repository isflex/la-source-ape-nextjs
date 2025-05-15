import { existsSync, writeFile } from 'fs'

// Skip Husky install in production and CI
if (process.env.FLEX_MODE === 'production' || process.env.NODE_ENV === 'production' || process.env.CI === 'true') {
  process.exit(0)
}
const husky = (await import('husky')).default
console.log(husky())

const path = `${process.env.FLEX_PROJ_ROOT}/apps/gateway/amplify_outputs.json`
try {
  if (!existsSync(path)) {
    console.log('⚠️ Pensez à créer vos identifiants de connexion à AWS Amplify')
    // https://stackoverflow.com/a/72432465
    writeFile(`${process.env.FLEX_PROJ_ROOT}/apps/gateway/amplify_outputs.json`, JSON.stringify({}), (err) => err && console.error(err))
  }
} catch(err) {
  console.error(err)
}
