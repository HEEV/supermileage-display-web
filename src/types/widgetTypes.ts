/**
 * Widget size type representing width and height in grid units
 * Screen grid: 30 units wide × 16 units tall
 */
export type WidgetSize = [number, number]; // [width, height]

/**
 * Props for the Widget component
 */
export type WidgetProps = {
  children?: React.ReactNode;
  size: WidgetSize;
};

/**
 * Validates a widget size tuple
 * @param size - The size tuple [width, height] to validate
 * @throws Error if the size is invalid
 * @returns The validated size
 */
export function validateWidgetSize(size: WidgetSize): WidgetSize {
  const [width, height] = size;

  // Validate that both values are numbers
  if (typeof width !== 'number' || typeof height !== 'number') {
    throw new Error('Widget size must contain two numbers [width, height]');
  }

  // Validate that values are positive
  if (width <= 0 || height <= 0) {
    throw new Error('Widget size dimensions must be positive numbers');
  }

  // Validate that values don't exceed grid bounds (30 width, 16 height)
  if (width > 30) {
    throw new Error(`Widget width (${width}) exceeds maximum grid width (30 units)`);
  }

  if (height > 16) {
    throw new Error(`Widget height (${height}) exceeds maximum grid height (16 units)`);
  }

  // Validate that values are finite
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    throw new Error('Widget size dimensions must be finite numbers');
  }

  return size;
}

/**
 * Checks if a widget size is valid without throwing
 * @param size - The size tuple [width, height] to check
 * @returns true if valid, false otherwise
 */
export function isValidWidgetSize(size: WidgetSize): boolean {
  try {
    validateWidgetSize(size);
    return true;
  } catch {
    return false;
  }
}

/**
 * Constants for the widget grid system
 */
export const WIDGET_GRID = {
  WIDTH_UNITS: 30,
  HEIGHT_UNITS: 16,
} as const;
