const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');

const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];
// #3 - Force resolving nested modules to the folders below
config.resolver.disableHierarchicalLookup = true;

config.cacheStores = [
    new FileStore({ root: path.join(projectRoot, 'node_modules', '.cache', 'metro') }),
  ];

module.exports = config;
