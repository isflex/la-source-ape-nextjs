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
    writeFile('amplify_outputs.json', JSON.stringify({}))
  }
} catch(err) {
  console.error(err)
}
