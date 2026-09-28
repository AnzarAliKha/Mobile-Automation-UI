import fs from 'fs';
import path from 'path';

export class DataReader {
  /**
   * Reads and parses a JSON file relative to the src/data directory
   */
  public static readJson<T>(relativePath: string): T {
    const fullPath = path.resolve(__dirname, '../data', relativePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Data file not found at: ${fullPath}`);
    }
    const rawData = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(rawData) as T;
  }

  /**
   * Reads a simple CSV string/file into an array of objects
   */
  public static parseCsv<T extends Record<string, string>>(csvContent: string): T[] {
    const lines = csvContent.trim().split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] ?? '';
      });
      return obj as T;
    });
  }
}
