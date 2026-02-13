/**
 * Module path resolver - handles both local and deployment environments
 * Works around issues with double-src paths in some deployments
 */
const path = require('path');

// Determine if we're in a nested src/src structure
const isNestedDeployment = __dirname.includes('src/src') || __dirname.includes('src\\src');

// Calculate the actual project root
const getProjectRoot = () => {
  let current = __dirname;
  while (current !== path.dirname(current)) {
    if (require('fs').existsSync(path.join(current, 'package.json'))) {
      return current;
    }
    current = path.dirname(current);
  }
  return __dirname;
};

const projectRoot = getProjectRoot();
const srcRoot = path.join(projectRoot, 'src');

/**
 * Resolve a module path relative to src root
 * @param {string} modulePath - Path relative to src folder
 * @returns {string} - Absolute path to module
 */
const resolveModule = (modulePath) => {
  return path.join(srcRoot, modulePath);
};

module.exports = { resolveModule, projectRoot, srcRoot };
