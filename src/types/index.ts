export interface ProjectConfig {
  name: string
  tagline: string
  cause: string
  description: string
  token: {
    symbol: string
    address: string
    bagsUrl: string
  }
  treasury: {
    wallet: string
    solscanUrl: string
  }
  team: {
    lockupMonths: number
  }
  theme: {
    accentColor: string
  }
  social: {
    twitter: string
    telegram: string
  }
  appStoreUrl: string
}
