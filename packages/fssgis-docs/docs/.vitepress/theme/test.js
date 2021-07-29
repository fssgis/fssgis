const path =  require('path')
const fs =  require('fs/promises')

const pathResolve = (...args) => path.resolve(...args)
const encoding = 'utf-8'

execBuild()

async function execBuild () {

  const result = await findVueFiles(pathResolve('..', '..', 'components'))

  console.log(result)

}

async function findVueFiles (dir) {
  const names = await fs.readdir(pathResolve(dir), { encoding })
  const ret = []

  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    if (name.includes('.vue')) {
      ret.push({ name: name.split('.')[0], path: pathResolve(dir, name)})
    } else {
      ret.push(...(await findVueFiles(pathResolve(dir, name))))
    }
  }

  return ret

}
