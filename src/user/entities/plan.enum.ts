export enum Plan {
  FREE = 'FREE',
  GOLD = 'GOLD', 
  PLATINUM = 'PLATINUM',
  TITANIUM = 'TITANIUM'
}

export const PlanPrices = {
  [Plan.FREE]: 0,
  [Plan.GOLD]: 9.99,
  [Plan.PLATINUM]: 19.99,
  [Plan.TITANIUM]: 49.99
};
