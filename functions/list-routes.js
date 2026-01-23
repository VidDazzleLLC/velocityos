#!/usr/bin/env node
/**
 * Script to list all registered routes in the Express app
 */

console.log('📋 Listing all registered API routes...\n');

try {
  // This is a bit of a hack to inspect the routes without starting the server
  const express = require('express');
  
  // Mock Firebase Functions to avoid initialization errors
  const mockFunctions = {
    https: {
      onRequest: (app) => {
        // Extract and display all routes from the Express app
        const routes = [];
        
        app._router.stack.forEach((middleware) => {
          if (middleware.route) {
            // Routes registered directly on the app
            const methods = Object.keys(middleware.route.methods)
              .map(m => m.toUpperCase())
              .join(', ');
            routes.push({
              method: methods,
              path: middleware.route.path
            });
          } else if (middleware.name === 'router') {
            // Router middleware (like express.Router())
            middleware.handle.stack.forEach((handler) => {
              if (handler.route) {
                const methods = Object.keys(handler.route.methods)
                  .map(m => m.toUpperCase())
                  .join(', ');
                routes.push({
                  method: methods,
                  path: handler.route.path
                });
              }
            });
          }
        });
        
        // Display routes
        if (routes.length === 0) {
          console.log('⚠️  No routes found!');
        } else {
          console.log('Routes registered:');
          console.log('==================\n');
          routes.forEach(route => {
            console.log(`${route.method.padEnd(6)} ${route.path}`);
          });
          console.log(`\nTotal: ${routes.length} routes\n`);
        }
        
        // Verify required endpoints
        const requiredEndpoints = [
          { method: 'GET', path: '/api/health' },
          { method: 'POST', path: '/api/agent/restart' },
          { method: 'POST', path: '/api/gateway/dispatch' },
          { method: 'GET', path: '/api/analytics/dashboard' },
          { method: 'POST', path: '/api/customer/create' },
          { method: 'GET', path: '/api/customer/list' },
          { method: 'POST', path: '/api/voc/feedback' },
          { method: 'POST', path: '/api/payment/charge' },
          { method: 'POST', path: '/api/campaign/start' },
          { method: 'POST', path: '/api/outboundcall' }
        ];
        
        console.log('Checking required endpoints:');
        console.log('============================\n');
        
        let allFound = true;
        requiredEndpoints.forEach(required => {
          const found = routes.some(
            route => route.method === required.method && route.path === required.path
          );
          const status = found ? '✅' : '❌';
          console.log(`${status} ${required.method.padEnd(6)} ${required.path}`);
          if (!found) allFound = false;
        });
        
        if (allFound) {
          console.log('\n✨ All required endpoints are registered!\n');
        } else {
          console.log('\n⚠️  Some required endpoints are missing!\n');
          process.exit(1);
        }
        
        return () => {}; // Return a mock function
      }
    },
    logger: {
      info: () => {},
      error: () => {}
    }
  };
  
  // Temporarily replace the firebase-functions module
  require.cache[require.resolve('firebase-functions')] = {
    exports: mockFunctions
  };
  
  // Now load our index.js
  const functions = require('./index.js');
  
  process.exit(0);
  
} catch (error) {
  console.error('❌ ERROR listing routes:');
  console.error(error.message);
  process.exit(1);
}
