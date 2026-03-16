/**
 * User Registration Integration Test
 * 
 * This script tests the complete user registration flow:
 * 1. Starts an in-memory MongoDB
 * 2. Tests the AuthService registration
 * 3. Verifies user is saved to database
 * 4. Tests duplicate email prevention
 * 5. Tests login with registered credentials
 */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { User } from '@ai-job-applier/database';
import { AuthService } from './src/services/AuthService';

async function runTests() {
  console.log('🚀 Starting User Registration Integration Tests...\n');
  
  // Start in-memory MongoDB
  console.log('📦 Starting in-memory MongoDB...');
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  console.log(`   Connected to: ${mongoUri}`);
  
  await mongoose.connect(mongoUri);
  console.log('✅ Database connected\n');
  
  const authService = new AuthService();
  let testsPassed = 0;
  let testsFailed = 0;
  
  // Test 1: Register a new user
  try {
    console.log('📝 Test 1: Registering a new user...');
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'SecurePass123!'
    };
    
    const result = await authService.register(userData);
    
    if (result && result.user && result.token) {
      console.log('   ✅ User registered successfully');
      console.log(`      - Email: ${result.user.email}`);
      console.log(`      - Name: ${result.user.firstName} ${result.user.lastName}`);
      console.log(`      - Token: ${result.token.substring(0, 20)}...`);
      testsPassed++;
    } else {
      console.log('   ❌ Registration failed - no result returned');
      testsFailed++;
    }
  } catch (error: any) {
    console.log(`   ❌ Registration failed: ${error.message}`);
    testsFailed++;
  }
  
  // Test 2: Verify user saved to database
  try {
    console.log('\n💾 Test 2: Verifying user saved to database...');
    const savedUser = await User.findOne({ email: 'john.doe@example.com' });
    
    if (savedUser) {
      console.log('   ✅ User found in database');
      console.log(`      - ID: ${savedUser._id}`);
      console.log(`      - First Name: ${savedUser.firstName}`);
      console.log(`      - Last Name: ${savedUser.lastName}`);
      console.log(`      - Password Hashed: ${savedUser.password !== 'SecurePass123!' ? 'Yes' : 'No'}`);
      testsPassed++;
    } else {
      console.log('   ❌ User not found in database');
      testsFailed++;
    }
  } catch (error: any) {
    console.log(`   ❌ Database verification failed: ${error.message}`);
    testsFailed++;
  }
  
  // Test 3: Prevent duplicate email registration
  try {
    console.log('\n🚫 Test 3: Testing duplicate email prevention...');
    const duplicateUserData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'AnotherPass123!'
    };
    
    await authService.register(duplicateUserData);
    console.log('   ❌ Duplicate registration was allowed (should have failed)');
    testsFailed++;
  } catch (error: any) {
    if (error.message.includes('Email already exists')) {
      console.log('   ✅ Duplicate email correctly rejected');
      console.log(`      - Error: ${error.message}`);
      testsPassed++;
    } else {
      console.log(`   ❌ Wrong error: ${error.message}`);
      testsFailed++;
    }
  }
  
  // Test 4: Login with valid credentials
  try {
    console.log('\n🔐 Test 4: Testing login with valid credentials...');
    const loginResult = await authService.login({
      email: 'john.doe@example.com',
      password: 'SecurePass123!'
    });
    
    if (loginResult && loginResult.user && loginResult.token) {
      console.log('   ✅ Login successful');
      console.log(`      - Email: ${loginResult.user.email}`);
      console.log(`      - Token: ${loginResult.token.substring(0, 20)}...`);
      testsPassed++;
    } else {
      console.log('   ❌ Login failed - no result returned');
      testsFailed++;
    }
  } catch (error: any) {
    console.log(`   ❌ Login failed: ${error.message}`);
    testsFailed++;
  }
  
  // Test 5: Reject invalid credentials
  try {
    console.log('\n❌ Test 5: Testing login with invalid password...');
    await authService.login({
      email: 'john.doe@example.com',
      password: 'WrongPassword!'
    });
    console.log('   ❌ Login with wrong password was allowed (should have failed)');
    testsFailed++;
  } catch (error: any) {
    if (error.message.includes('Invalid credentials')) {
      console.log('   ✅ Invalid credentials correctly rejected');
      console.log(`      - Error: ${error.message}`);
      testsPassed++;
    } else {
      console.log(`   ❌ Wrong error: ${error.message}`);
      testsFailed++;
    }
  }
  
  // Cleanup
  console.log('\n🧹 Cleaning up...');
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('   Database disconnected and server stopped\n');
  
  // Summary
  console.log('='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  console.log(`   📝 Total:  ${testsPassed + testsFailed}`);
  console.log('='.repeat(50));
  
  if (testsFailed > 0) {
    console.log('\n❌ Some tests failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});
