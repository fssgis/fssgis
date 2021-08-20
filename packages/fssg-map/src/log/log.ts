export function warn (target: unknown, msg: string, ...others: unknown[]) : void {
  console.warn(`[FssgMap]: ${msg}`, ...others, target)
}

export function error (target: unknown, msg: string, ...others: unknown[]) : void {
  console.error(`[FssgMap]: ${msg}`, ...others, target)
}
