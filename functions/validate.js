#!/usr/bin/env node
/**
 * Simple validation script to ensure the Cloud Function can be loaded
 * without syntax errors and has the correct structure.
 */

console.log('🔍 Validating Cloud Functions...\n');

try {
  // Load the functions module
  const functions = require('./index.js');
  
  // Check that the api function is exported
  if (!functions.api) {
    console.error('❌ ERROR: "api" Cloud Function not exported');
    process.exit(1);
  }
  
  console.log('✅ Cloud Function "api" is properly exported');
  
  // Check function type
  if (typeof functions.api !== 'function') {
    console.error('❌ ERROR: "api" export is not a function');
    process.exit(1);
  }
  
  console.log('✅ "api" export is a valid function');
  
  console.log('\n✨ All validations passed!');
  console.log('\nTo test locally, run:');
  console.log('  firebase emulators:start --only functions');
  console.log('\nOr deploy to Firebase:');
  console.log('  firebase deploy --only functions --project default');
  
  process.exit(0);
  
} catch (error) {
  console.error('❌ ERROR loading Cloud Functions:');
  console.error(error.message);
  console.error('\nStack trace:');
  console.error(error.stack);
  process.exit(1);
}
