const path = require('path');
const fs = require('fs');

/**
 * Detects the actual project root by finding package.json
 * This handles cases where Render or other platforms nest the src folder
 */
function getProjectRoot() {
  let currentDir = __dirname;

  // Walk up the directory tree until we find package.json
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  // Fallback to two levels up from config folder (should be src -> project root)
  return path.join(__dirname, '../../');
}

const PROJECT_ROOT = getProjectRoot();
const SRC_ROOT = path.join(PROJECT_ROOT, 'src');

module.exports = {
  PROJECT_ROOT,
  SRC_ROOT,
  /**
   * Resolve a path from the src directory
   * Usage: resolvePath('domains/user/models/User')
   */
  resolvePath: (filePath) => {
    return path.join(SRC_ROOT, filePath);
  },
};
