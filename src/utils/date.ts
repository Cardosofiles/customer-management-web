const TIME_ZONE = 'America/Sao_Paulo'

function getOffsetMinutes(date: Date, timeZone: string): number {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const v = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]))
  const asUtc = Date.UTC(+v.year, +v.month - 1, +v.day, +v.hour, +v.minute, +v.second)
  return (asUtc - date.getTime()) / 60000
}

function getMonthStart(year: number, month: number, timeZone: string): Date {
  const utcGuess = new Date(Date.UTC(year, month - 1, 1))
  return new Date(utcGuess.getTime() - getOffsetMinutes(utcGuess, timeZone) * 60000)
}

export function getMonthRanges(timeZone = TIME_ZONE) {
  const now = new Date()
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit' })
  const v = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]))
  const year = +v.year
  const month = +v.month

  const prev = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 }
  const next = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 }

  return {
    currentStart: getMonthStart(year, month, timeZone),
    nextStart: getMonthStart(next.year, next.month, timeZone),
    previousStart: getMonthStart(prev.year, prev.month, timeZone),
  }
}
