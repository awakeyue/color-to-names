import colors from "./colors.json";
import { getDeltaE00, getDeltaE76, getDeltaE94 } from "delta-e";

// hex regex
const hexRegExp = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
// hex short regex
const shortHexRegExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
// rgb regex
const rgbRegExp = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i;

type HexColor = string;
type RgbColor = [number, number, number];
type LabColor = {
  L: number;
  A: number;
  B: number;
};

export type ColorInfo = [HexColor, ...string[]];
interface ColorInfoNormalize {
  lab: LabColor;
  rgb: RgbColor;
  hex: string;
  source: ColorInfo;
}

type DeltaEFormula = 1976 | 1994 | 2000;
interface Config {
  colorJson: ColorInfo[]; // color lib
  deltaEFormula?: DeltaEFormula; // deltaE formula
}

let config: Config = {
  colorJson: colors as ColorInfo[],
  deltaEFormula: 2000,
};
let colorJsonNormalize = normalizeColorInfo(config.colorJson);

export function setConfig(newConfig: {
  colorJson?: ColorInfo[];
  deltaEFormula?: DeltaEFormula;
}): void {
  config = { ...config, ...newConfig };
  if (config.colorJson) {
    colorJsonNormalize = normalizeColorInfo(config.colorJson);
  }
}

function getDeltaE(color1: LabColor, color2: LabColor): number {
  switch (config.deltaEFormula) {
    case 1976:
      return getDeltaE76(color1, color2);
    case 1994:
      return getDeltaE94(color1, color2);
    case 2000:
      return getDeltaE00(color1, color2);
    default:
      return getDeltaE00(color1, color2);
  }
}

function parseColor(color: string): RgbColor | null {
  const hexMatch = color.match(hexRegExp);
  if (hexMatch) {
    return [
      parseInt(hexMatch[1], 16),
      parseInt(hexMatch[2], 16),
      parseInt(hexMatch[3], 16),
    ];
  }

  const shortHexMatch = color.match(shortHexRegExp);
  if (shortHexMatch) {
    return [
      parseInt(shortHexMatch[1] + shortHexMatch[1], 16),
      parseInt(shortHexMatch[2] + shortHexMatch[2], 16),
      parseInt(shortHexMatch[3] + shortHexMatch[3], 16),
    ];
  }

  const rgbMatch = color.match(rgbRegExp);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1], 10),
      parseInt(rgbMatch[2], 10),
      parseInt(rgbMatch[3], 10),
    ];
  }
  return null;
}

function rgbToLab(rgb: RgbColor): LabColor {
  let r = rgb[0] / 255;
  let g = rgb[1] / 255;
  let b = rgb[2] / 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return {
    L: Math.round(116 * y - 16),
    A: Math.round(500 * (x - y)),
    B: Math.round(200 * (y - z)),
  };
}

function normalizeColorInfo(colors: ColorInfo[]): ColorInfoNormalize[] {
  const _colors = colors
    .map((colorInfo: ColorInfo): ColorInfoNormalize | null => {
      const hex = colorInfo[0];
      const rgb = parseColor(hex);
      if (!rgb) {
        console.warn(`Invalid color: ${hex}`);
        return null;
      }
      const lab = rgbToLab(rgb);
      return {
        lab,
        rgb,
        hex,
        source: colorInfo,
      };
    })
    .filter(Boolean) as ColorInfoNormalize[];
  // sort by lab
  _colors.sort((a, b) => compareLab(a.lab, b.lab));
  return _colors;
}

function compareLab(a: LabColor, b: LabColor): number {
  const { L: l1, A: a1, B: b1 } = a;
  const { L: l2, A: a2, B: b2 } = b;

  if (l1 === l2 && a1 === a2 && b1 === b2) {
    return 0;
  }

  if (
    l1 < l2 ||
    (l1 === l2 && a1 < a2) ||
    (l1 === l2 && a1 === a2 && b1 < b2)
  ) {
    return -1;
  }

  return 1;
}

// get closest color
function getClosestColor(lab: LabColor): ColorInfo | null {
  let minDeltaE = Infinity;
  let closestColor: ColorInfo | null = null;
  for (const color of colorJsonNormalize) {
    if (color.lab) {
      if (color.lab === lab) {
        closestColor = color.source;
        break;
      }
      const deltaE = getDeltaE(lab, color.lab);
      if (deltaE < minDeltaE) {
        minDeltaE = deltaE;
        closestColor = color.source;
      }
    }
  }
  return closestColor;
}

export function colorToNames(color: string): ColorInfo | null {
  const rgb = parseColor(color);
  if (rgb) {
    const lab = rgbToLab(rgb);
    const closestColor = getClosestColor(lab);
    return closestColor;
  }
  return null;
}

export function isDarkColor(color: string): boolean {
  const rgb = parseColor(color);
  if (rgb) {
    const [r, g, b] = rgb;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }
  return false;
}
