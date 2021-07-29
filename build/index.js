const path =  require('path')
const fs =  require('fs/promises')

const pathResolve = (...args) => path.resolve(...args)
const encoding = 'utf-8'

execBuild()

async function execBuild () {

  const packagePaths = (
    await fs.readdir(pathResolve('packages'), { encoding })
  ).map(n => pathResolve('packages', n))

  await buildPackage(packagePaths[0])

}

async function buildPackage (packagePath) {
  const packageJSON = JSON.parse(
    await fs.readFile(pathResolve(packagePath, 'package.json'), { encoding })
  )
  console.log(packageJSON)
}

