/**
 * POST Request Examples
 * Demonstrates how to use the new POST request functionality with custom URLs, tokens, and bodies
 */

const { 
    updateApiConfig, 
    sendConcurrentRequests, 
    sendPostRequests, 
    sendGetRequests,
    API_CONFIG 
} = require('./apiRequests.js');

/**
 * Example 1: Basic POST requests with custom configuration
 */
async function basicPostExample() {
    console.log('🎯 Basic POST Request Example\n');
    
    // Update global configuration for POST requests
    updateApiConfig({
        method: 'POST',
        endpoint: 'https://jsonplaceholder.typicode.com/posts',
        token: 'your-custom-token-here',
        body: {
            title: 'Test Post',
            body: 'This is a test post body',
            userId: 1
        }
    });
    
    try {
        const results = await sendConcurrentRequests(3);
        console.log(`\n✅ Completed ${results.length} POST requests`);
        return results;
    } catch (error) {
        console.error('❌ POST example error:', error);
    }
}

/**
 * Example 2: Different endpoints and tokens
 */
async function multiEndpointExample() {
    console.log('🎯 Multi-Endpoint Example\n');
    
    // Example with different APIs
    const configs = [
        {
            endpoint: 'https://jsonplaceholder.typicode.com/posts',
            token: 'token-for-jsonplaceholder',
            method: 'POST',
            body: { title: 'Post 1', body: 'Content 1', userId: 1 }
        },
        {
            endpoint: 'https://httpbin.org/post',
            token: 'token-for-httpbin',
            method: 'POST',
            body: { message: 'Hello from httpbin', timestamp: new Date().toISOString() }
        }
    ];
    
    try {
        for (const config of configs) {
            console.log(`\n📡 Testing ${config.endpoint}:`);
            const results = await sendConcurrentRequests(2, config);
            console.log(`✅ Completed ${results.length} requests to ${config.endpoint}`);
        }
    } catch (error) {
        console.error('❌ Multi-endpoint example error:', error);
    }
}

/**
 * Example 3: Using method-specific helper functions
 */
async function helperFunctionExample() {
    console.log('🎯 Helper Function Example\n');
    
    try {
        // GET requests
        console.log('📥 Testing GET requests:');
        const getResults = await sendGetRequests(
            3, 
            'https://jsonplaceholder.typicode.com/posts/1',
            'get-token-123'
        );
        
        console.log('📤 Testing POST requests:');
        const postResults = await sendPostRequests(
            2,
            {
                title: 'New Post via Helper',
                body: 'This post was created using the helper function',
                userId: 42
            },
            'https://jsonplaceholder.typicode.com/posts',
            'post-token-456'
        );
        
        console.log(`\n✅ GET Results: ${getResults.filter(r => r.success).length}/${getResults.length} successful`);
        console.log(`✅ POST Results: ${postResults.filter(r => r.success).length}/${postResults.length} successful`);
        
    } catch (error) {
        console.error('❌ Helper function example error:', error);
    }
}

/**
 * Example 4: Complex POST body structures
 */
async function complexBodyExample() {
    console.log('🎯 Complex POST Body Example\n');
    
    const complexBody = {
        user: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            preferences: {
                notifications: true,
                theme: 'dark'
            }
        },
        data: {
            items: [
                { id: 1, name: 'Item 1', price: 29.99 },
                { id: 2, name: 'Item 2', price: 39.99 }
            ],
            metadata: {
                source: 'api-test',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            }
        },
        settings: {
            timeout: 30000,
            retries: 3,
            batch: true
        }
    };
    
    try {
        const results = await sendConcurrentRequests(2, {
            method: 'POST',
            endpoint: 'https://httpbin.org/post',
            token: 'complex-body-token',
            body: complexBody
        });
        
        console.log(`\n✅ Complex body requests: ${results.filter(r => r.success).length}/${results.length} successful`);
        
        // Show the request body that was sent
        if (results.length > 0) {
            console.log('\n📦 Request body sent:');
            console.log(JSON.stringify(results[0].requestBody, null, 2));
        }
        
        return results;
        
    } catch (error) {
        console.error('❌ Complex body example error:', error);
    }
}

/**
 * Example 5: Testing different HTTP methods
 */
async function httpMethodsExample() {
    console.log('🎯 HTTP Methods Example\n');
    
    const testData = {
        name: 'Test Resource',
        description: 'A test resource for API testing',
        status: 'active'
    };
    
    const methods = [
        { method: 'GET', endpoint: 'https://httpbin.org/get' },
        { method: 'POST', endpoint: 'https://httpbin.org/post', body: testData },
        { method: 'PUT', endpoint: 'https://httpbin.org/put', body: { ...testData, updated: true } },
        { method: 'PATCH', endpoint: 'https://httpbin.org/patch', body: { status: 'updated' } },
        { method: 'DELETE', endpoint: 'https://httpbin.org/delete' }
    ];
    
    try {
        for (const config of methods) {
            console.log(`\n🔧 Testing ${config.method} requests:`);
            
            const results = await sendConcurrentRequests(2, {
                ...config,
                token: `${config.method.toLowerCase()}-test-token`
            });
            
            const successCount = results.filter(r => r.success).length;
            console.log(`  ✅ ${successCount}/${results.length} ${config.method} requests successful`);
            
            if (results.length > 0 && results[0].success) {
                console.log(`  📊 Average response time: ${results.map(r => parseInt(r.duration)).reduce((a, b) => a + b) / results.length}ms`);
            }
        }
    } catch (error) {
        console.error('❌ HTTP methods example error:', error);
    }
}

/**
 * Example 6: Real-world API integration example
 */
async function realWorldExample() {
    console.log('🎯 Real-World API Integration Example\n');
    
    // Example: Creating multiple user accounts
    const users = [
        { name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
        { name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
        { name: 'Carol Brown', email: 'carol@example.com', role: 'moderator' }
    ];
    
    try {
        console.log('👥 Creating user accounts...');
        
        // Create requests for each user
        const userCreationPromises = users.map(async (user, index) => {
            return await sendConcurrentRequests(1, {
                method: 'POST',
                endpoint: 'https://jsonplaceholder.typicode.com/users',
                token: `user-creation-token-${index}`,
                body: {
                    ...user,
                    id: null, // Let the API assign ID
                    createdAt: new Date().toISOString(),
                    active: true
                }
            });
        });
        
        const allResults = await Promise.all(userCreationPromises);
        const flatResults = allResults.flat();
        
        const successCount = flatResults.filter(r => r.success).length;
        console.log(`\n✅ User creation results: ${successCount}/${flatResults.length} successful`);
        
        // Show created users
        flatResults.forEach((result, index) => {
            if (result.success) {
                console.log(`  👤 User ${index + 1}: ${users[index]?.name} - Status: Created`);
            } else {
                console.log(`  ❌ User ${index + 1}: ${users[index]?.name} - Error: ${result.error}`);
            }
        });
        
        return flatResults;
        
    } catch (error) {
        console.error('❌ Real-world example error:', error);
    }
}

/**
 * Example 7: Configuration switching
 */
async function configSwitchingExample() {
    console.log('🎯 Configuration Switching Example\n');
    
    try {
        // Start with GET configuration
        console.log('🔄 Phase 1: GET requests');
        updateApiConfig({
            method: 'GET',
            endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
            token: 'get-phase-token'
        });
        
        const getResults = await sendConcurrentRequests(2);
        
        // Switch to POST configuration
        console.log('\n🔄 Phase 2: POST requests');
        updateApiConfig({
            method: 'POST',
            endpoint: 'https://jsonplaceholder.typicode.com/posts',
            token: 'post-phase-token',
            body: {
                title: 'Switched to POST',
                body: 'This request uses the updated configuration',
                userId: 99
            }
        });
        
        const postResults = await sendConcurrentRequests(2);
        
        // Switch to custom endpoint
        console.log('\n🔄 Phase 3: Custom endpoint');
        const customResults = await sendConcurrentRequests(1, {
            method: 'POST',
            endpoint: 'https://httpbin.org/post',
            token: 'custom-endpoint-token',
            body: {
                message: 'Custom endpoint test',
                phase: 3
            }
        });
        
        console.log(`\n📊 Results Summary:`);
        console.log(`  GET Phase: ${getResults.filter(r => r.success).length}/${getResults.length} successful`);
        console.log(`  POST Phase: ${postResults.filter(r => r.success).length}/${postResults.length} successful`);
        console.log(`  Custom Phase: ${customResults.filter(r => r.success).length}/${customResults.length} successful`);
        
    } catch (error) {
        console.error('❌ Configuration switching example error:', error);
    }
}

// Command-line interface
async function runPostExample() {
    const args = process.argv.slice(2);
    const command = args[0] || 'basic';
    
    switch (command) {
        case 'basic':
            await basicPostExample();
            break;
            
        case 'multi':
            await multiEndpointExample();
            break;
            
        case 'helpers':
            await helperFunctionExample();
            break;
            
        case 'complex':
            await complexBodyExample();
            break;
            
        case 'methods':
            await httpMethodsExample();
            break;
            
        case 'realworld':
            await realWorldExample();
            break;
            
        case 'switching':
            await configSwitchingExample();
            break;
            
        case 'all':
            console.log('🚀 Running All POST Examples...\n');
            await basicPostExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await helperFunctionExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await complexBodyExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await httpMethodsExample();
            break;
            
        default:
            console.log('📋 Available POST example commands:');
            console.log('  node postRequestExample.js basic      - Basic POST requests');
            console.log('  node postRequestExample.js multi      - Multiple endpoints');
            console.log('  node postRequestExample.js helpers    - Helper functions');
            console.log('  node postRequestExample.js complex    - Complex request bodies');
            console.log('  node postRequestExample.js methods    - All HTTP methods');
            console.log('  node postRequestExample.js realworld  - Real-world example');
            console.log('  node postRequestExample.js switching  - Configuration switching');
            console.log('  node postRequestExample.js all        - Run multiple examples');
            console.log('');
            console.log('Examples:');
            console.log('  node postRequestExample.js basic      - Send basic POST requests');
            console.log('  node postRequestExample.js methods    - Test GET, POST, PUT, PATCH, DELETE');
    }
}

// Auto-execute if running directly
if (typeof window === 'undefined' && require.main === module) {
    runPostExample().then(() => {
        console.log('\n🎉 POST examples completed!');
    }).catch(error => {
        console.error('❌ POST example failed:', error);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        basicPostExample,
        multiEndpointExample,
        helperFunctionExample,
        complexBodyExample,
        httpMethodsExample,
        realWorldExample,
        configSwitchingExample,
        runPostExample
    };
}
