#!/usr/bin/env node
/**
 * Fix Yoga API: StyleSizeLength -> StyleLength in react-native-svg (for RN 0.76+).
 * Run after npm install so iOS build succeeds.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-svg',
  'common',
  'cpp',
  'react',
  'renderer',
  'components',
  'rnsvg',
  'RNSVGLayoutableShadowNode.cpp'
);

if (!fs.existsSync(filePath)) {
  console.warn('patch-react-native-svg: file not found, skipping');
  process.exit(0);
}

let content = fs.readFileSync(filePath, 'utf8');
if (content.includes('StyleSizeLength')) {
  content = content.replace(/yoga::StyleSizeLength::percent\(100\)/g, 'yoga::StyleLength::percent(100)');
  fs.writeFileSync(filePath, content);
  console.log('patch-react-native-svg: applied StyleSizeLength -> StyleLength fix');
} else {
  console.log('patch-react-native-svg: already patched or not needed');
}
