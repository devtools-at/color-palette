/**
 * Color Palette Generator
 * Generate color palettes
 *
 * Online tool: https://devtools.at/tools/color-palette
 *
 * @packageDocumentation
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

function createColor(h: number, s: number, l: number): Color {
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  return {
    hex,
    rgb,
    hsl: { h, s, l },
  };
}

function generatePalette(baseColor: string, scheme: SchemeType): Color[] {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const { h, s, l } = hsl;

  const normalizeHue = (hue: number) => ((hue % 360) + 360) % 360;

  switch (scheme) {
    case "complementary":
      return [
        createColor(h, s, l),
        createColor(normalizeHue(h + 180), s, l),
      ];

    case "analogous":
      return [
        createColor(normalizeHue(h - 30), s, l),
        createColor(h, s, l),
        createColor(normalizeHue(h + 30), s, l),
      ];

    case "triadic":
      return [
        createColor(h, s, l),
        createColor(normalizeHue(h + 120), s, l),
        createColor(normalizeHue(h + 240), s, l),
      ];

    case "split-complementary":
      return [
        createColor(h, s, l),
        createColor(normalizeHue(h + 150), s, l),
        createColor(normalizeHue(h + 210), s, l),
      ];

    case "tetradic":
      return [
        createColor(h, s, l),
        createColor(normalizeHue(h + 90), s, l),
        createColor(normalizeHue(h + 180), s, l),
        createColor(normalizeHue(h + 270), s, l),
      ];

    case "monochromatic":
      return [
        createColor(h, s, Math.max(10, l - 20)),
        createColor(h, s, Math.max(10, l - 10)),
        createColor(h, s, l),
        createColor(h, s, Math.min(90, l + 10)),
        createColor(h, s, Math.min(90, l + 20)),
      ];

    default:
      return [createColor(h, s, l)];
  }
}

// Export for convenience
export default { encode, decode };
