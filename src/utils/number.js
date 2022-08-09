import BigNumber from 'bignumber.js';

BigNumber.set({
  EXPONENTIAL_AT: [-50, 50],
  DECIMAL_PLACES: 30,
  ROUNDING_MODE: BigNumber.ROUND_FLOOR,
});

export const isEq = (a, b) => new BigNumber(a).eq(b);
export const isLt = (a, b) => new BigNumber(a).lt(b);
export const isLte = (a, b) => new BigNumber(a).lte(b);
export const isGt = (a, b) => new BigNumber(a).gt(b);
export const isGte = (a, b) => new BigNumber(a).gte(b);

export const getMax = (a, b) => BigNumber.max(a, b).toFixed();
export const getDiv = (a, b) => new BigNumber(a).div(b).toFixed();
export const getTimes = (a, b) => new BigNumber(a).times(b).toFixed();
export const getPlus = (a, b) => new BigNumber(a).plus(b).toFixed();
export const getMinus = (a, b) => new BigNumber(a).minus(b).toFixed();
export const getPow = (a, b) => new BigNumber(a).pow(b).toFixed();
export const getShift = (a, b) => new BigNumber(a).shiftedBy(Number(b)).toFixed();

export const getFixed = (val, fixed, trailingZeros) => {
  const numStr = val || '0';
  if (trailingZeros) {
    return new BigNumber(numStr).toFixed(fixed);
  }
  return new BigNumber(numStr).decimalPlaces(fixed).toString();
};

export const getFixedFloor = (val, fixed = 2) => {
  const numStr = val || '0';
  const BN = BigNumber.clone();
  BN.config({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });
  return new BN(numStr).decimalPlaces(fixed).toString();
};

export const getPercent = (a, b) => {
  // 0-1
  if (isEq(b, '0')) {
    return isGt(a, b) ? '1' : '0';
  }
  const result = getDiv(a, b);
  return getFixed(result, 4);
};

export const amount2Decimals = (amount, decimals) => getFixed(getShift(amount, decimals), 0, true);

export const decimals2Amount = (amount, decimals) => getFixed(getShift(amount, -decimals), 6);

export const isNumber = (val) => {
  if (!val && val !== 0) {
    return false;
  }
  const num = Number(val);
  return !Number.isNaN(num);
};

export const isPositiveNumber = (val) => isNumber(val) && isGt(val, 0);

export const gas2Gwei = (gas) => `${getFixed(getShift(gas, -9), 2)} GWEI`;

export const gwei2Gas = (gas) => BigNumber(gas).multipliedBy(BigNumber(10).pow(9)).toString();
