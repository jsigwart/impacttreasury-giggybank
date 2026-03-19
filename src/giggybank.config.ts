import type { ProjectConfig } from '@/types'

/**
 * GiggyBank project configuration.
 * To create a new impact project: fork, update these values, deploy.
 * All branding, token, treasury, social links, and copy are driven from here.
 */
export const config: ProjectConfig = {
  name: 'GiggyBank',
  tagline: 'High-Tip Drops for gig workers.',
  cause: 'gig-worker High-Tip Drops',
  description:
    'GiggyBank is the first live deployment of ImpactTreasury — a reusable framework for turning token fees into transparent real-world impact campaigns.',
  token: {
    symbol: 'GIGGYBANK',
    address: 'GefTGjFnJGW9PM93Ycb5RrHKiH1gPbz2Szag1mLBBAGS',
    bagsUrl: 'https://bags.fm/coin/GefTGjFnJGW9PM93Ycb5RrHKiH1gPbz2Szag1mLBBAGS',
    dexScreenerUrl: 'https://dexscreener.com/solana/GefTGjFnJGW9PM93Ycb5RrHKiH1gPbz2Szag1mLBBAGS',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/giggybank',
  },
  treasury: {
    wallet: '2FCwMoEYKFVe93FNMApYtwCEdCboCPEYnS5JSjvw6kRZ',
    solscanUrl: 'https://solscan.io/account/2FCwMoEYKFVe93FNMApYtwCEdCboCPEYnS5JSjvw6kRZ',
  },
  team: {
    lockupMonths: 12,
  },
  theme: {
    accentColor: '#4ade80',
  },
  social: {
    twitter: 'https://twitter.com/giggybank',
    telegram: '',
  },
  appStoreUrl: 'https://apps.apple.com/app/giggybank/PLACEHOLDER',
}
