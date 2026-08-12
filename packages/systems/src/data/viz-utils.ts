export type VizPoint = {
  id: string;
  label: string;
  value: number;
  context?: string;
};

export type VizPosition = { x: number; y: number };

export const VIZ_WIDTH = 640;
export const VIZ_HEIGHT = 240;
export const VIZ_PADDING = { top: 22, right: 20, bottom: 28, left: 34 };

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function extent(values: number[], includeZero = false) {
  if (!values.length) return { min: 0, max: 1 };
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (includeZero) min = Math.min(min, 0);
  if (min === max) {
    const padding = Math.max(Math.abs(min) * 0.15, 1);
    min -= padding;
    max += padding;
  }
  return { min, max };
}

export function projectPoints(
  points: Array<Pick<VizPoint, "value">>,
  options: { width?: number; height?: number; padding?: typeof VIZ_PADDING; min?: number; max?: number; includeZero?: boolean } = {},
): VizPosition[] {
  const width = options.width ?? VIZ_WIDTH;
  const height = options.height ?? VIZ_HEIGHT;
  const padding = options.padding ?? VIZ_PADDING;
  const values = points.map((point) => point.value);
  const range = options.min !== undefined && options.max !== undefined
    ? { min: options.min, max: options.max }
    : extent(values, options.includeZero);
  const xSpan = Math.max(width - padding.left - padding.right, 1);
  const ySpan = Math.max(height - padding.top - padding.bottom, 1);
  return points.map((point, index) => ({
    x: padding.left + (index / Math.max(points.length - 1, 1)) * xSpan,
    y: height - padding.bottom - ((point.value - range.min) / Math.max(range.max - range.min, 1)) * ySpan,
  }));
}

export function linePath(points: VizPosition[]) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
}

export function areaPath(points: VizPosition[], height = VIZ_HEIGHT, bottom = VIZ_PADDING.bottom) {
  if (!points.length) return "";
  return `${linePath(points)} L ${points.at(-1)!.x.toFixed(2)} ${(height - bottom).toFixed(2)} L ${points[0]!.x.toFixed(2)} ${(height - bottom).toFixed(2)} Z`;
}

export function indexFromClientX(clientX: number, rect: { left: number; width: number }, length: number) {
  const percent = clamp((clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
  return Math.round(percent * Math.max(length - 1, 0));
}

export function percentForIndex(index: number, length: number) {
  return (clamp(index, 0, Math.max(length - 1, 0)) / Math.max(length - 1, 1)) * 100;
}

export function formatSigned(value: number, formatValue: (value: number) => string) {
  return `${value > 0 ? "+" : ""}${formatValue(value)}`;
}
