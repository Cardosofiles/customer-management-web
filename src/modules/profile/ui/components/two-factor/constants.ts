export const QR_CODE_URL = (totpUri: string) =>
  `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(totpUri)}`
