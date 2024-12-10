// /!\ A list of nextjs page routes is present in build/prerender-manifest.json
const checkIsRoute = (path: string) => {
  // console.log(`req path : ${path}`)
  // if (process.env.DEBUG === 'true') console.log(`req path : ${path}`)
  if (path === '/') return true
  return !path.match(/_next|api|\.(.*)$/)
}

export { checkIsRoute }
