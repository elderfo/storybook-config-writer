import path from "path";
import { promises as fs } from "fs";

/**
 * Determines if the path is prefixed or not
 *
 * @param {String} relativePath - Relative path to check for directory prefixes
 * @returns True if path prefix exists, otherwise false
 */
const hasPathPrefix = (relativePath: string) =>
  relativePath.substr(0, 2) === ".." ||
  relativePath.substr(0, 2) === "./" ||
  relativePath.substr(0, 2) === ".\\";

/**
 * Correctly formats path separators
 *
 * @param {String} path - Path to format
 * @returns Path with the correct separators
 */
export const formatPath = (dir: string, separator = "/") => {
  const oppositeSep = separator === "/" ? "\\" : "/";
  return dir.replace(new RegExp(`\\${oppositeSep}`, "g"), separator);
};

/**
 * Converts a path into a relative path
 *
 * @param {String} file - File to convert to a relative path
 * @param {String} fromDir - Directory to resolve to
 */
export const getRelativePath = (file: string, fromDir: string) => {
  // format paths to the OS specific format
  // (accounting for using the wrong seps)
  let relativePath = path.relative(
    formatPath(fromDir, path.sep),
    formatPath(file, path.sep)
  );

  // Prefix the path if it is not already prefixed
  if (!hasPathPrefix(relativePath)) {
    relativePath = `./${relativePath}`;
  }

  return formatPath(relativePath);
};

/**
 * Ensures the direct for the specified filePath exists
 *
 * @param {String} directory - Path to a file
 */
export const ensureFileDirectoryExists = async (directory: string) => {
  if (!(await fsObjectExists(directory))) {
    await fs.mkdir(directory);
  }
};

const fsObjectExists = async (fileOrDirectory: string) => {
  try {
    fs.access(fileOrDirectory);
    return true;
  } catch {
    return false;
  }
};