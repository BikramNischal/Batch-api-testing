/**
 * Public Endpoint Examples
 * Demonstrates requests without authentication tokens
 */

const { 
    sendConcurrentRequests,
    updateApiConfig,
    sendGetRequests,
    sendPostRequests
} = require('./apiRequests.js');

/**
 * Example 1: Public GET requests (no authentication)
 */
async function publicGetExample() {
    console.log('🎯 Public GET Requests Example\n');
    
    const publicEndpoints = [
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://jsonplaceholder.typicode.com/users/1',
        'https://jsonplaceholder.typicode.com/comments/1',
        'https://httpbin.org/json',
        'https://httpbin.org/uuid'
    ];
    
    try {
        console.log('📡 Testing public endpoints (no authentication required):');
        publicEndpoints.forEach((endpoint, index) => {
            console.log(`  ${index + 1}. ${endpoint}`);
        });
        console.log('');
        
        for (const endpoint of publicEndpoints) {
            console.log(`🔄 Testing: ${endpoint}`);
            const results = await sendConcurrentRequests(2, {
                method: 'GET',
                endpoint: endpoint,
                token: '' // Empty token - no authentication
            });
            
            const successCount = results.filter(r => r.success).length;
            console.log(`  ✅ Results: ${successCount}/${results.length} successful\n`);
        }
        
    } catch (error) {
        console.error('❌ Public GET example error:', error);
    }
}

/**
 * Example 2: Public POST requests
 */
async function publicPostExample() {
    console.log('🎯 Public POST Requests Example\n');
    
    const testPayloads = [
        { title: 'Public Post 1', body: 'This is a public post', userId: 1 },
        { title: 'Public Post 2', body: 'Another public post', userId: 2 },
        { title: 'Public Post 3', body: 'Third public post', userId: 3 }
    ];
    
    try {
        console.log('📦 Sending POST requests to public endpoint without authentication:');
        testPayloads.forEach((payload, index) => {
            console.log(`  ${index + 1}. ${payload.title}`);
        });
        console.log('');
        
        const results = await sendConcurrentRequests(testPayloads.length, testPayloads.map(payload => ({
            method: 'POST',
            endpoint: 'https://jsonplaceholder.typicode.com/posts',
            token: '', // No token needed
            body: payload
        })));
        
        const successCount = results.filter(r => r.success).length;
        console.log(`✅ Results: ${successCount}/${results.length} public POST requests successful`);
        
        results.forEach(result => {
            if (result.success) {
                console.log(`  ✅ Request ${result.requestId}: "${result.requestBody.title}" - Created with ID ${result.data.id}`);
            } else {
                console.log(`  ❌ Request ${result.requestId}: "${result.requestBody?.title}" - ${result.error}`);
            }
        });
        
        return results;
        
    } catch (error) {
        console.error('❌ Public POST example error:', error);
    }
}

/**
 * Example 3: Mixed authentication (some with tokens, some without)
 */
async function mixedAuthExample() {
    console.log('🎯 Mixed Authentication Example\n');
    
    const mixedConfigs = [
        {
            method: 'GET',
            endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
            token: '', // Public endpoint
            description: 'Public JSONPlaceholder API'
        },
        {
            method: 'GET', 
            endpoint: 'https://httpbin.org/bearer',
            token: 'test-token-123',
            description: 'HTTPBin bearer token test'
        },
        {
            method: 'GET',
            endpoint: 'https://httpbin.org/json',
            token: '', // Public endpoint
            description: 'Public HTTPBin JSON endpoint'
        }
    ];
    
    try {
        console.log('🔄 Testing mixed authentication scenarios:');
        mixedConfigs.forEach((config, index) => {
            const authStatus = config.token ? '🔐 With Auth' : '🌐 Public';
            console.log(`  ${index + 1}. ${authStatus}: ${config.description}`);
        });
        console.log('');
        
        const results = await sendConcurrentRequests(mixedConfigs.length, mixedConfigs);
        
        const successCount = results.filter(r => r.success).length;
        console.log(`✅ Results: ${successCount}/${results.length} mixed auth requests successful`);
        
        results.forEach((result, index) => {
            const config = mixedConfigs[index];
            const authType = config.token ? 'Authenticated' : 'Public';
            console.log(`  Request ${result.requestId} (${authType}): ${result.success ? '✅ Success' : '❌ Failed'}`);
            if (!result.success) {
                console.log(`    Error: ${result.error}`);
            }
        });
        
        return results;
        
    } catch (error) {
        console.error('❌ Mixed auth example error:', error);
    }
}

/**
 * Example 4: Testing public APIs without authentication
 */
async function publicApisExample() {
    console.log('🎯 Popular Public APIs Example\n');
    
    const publicApis = [
        {
            name: 'JSONPlaceholder',
            endpoint: 'https://jsonplaceholder.typicode.com/posts',
            method: 'GET',
            description: 'Fake REST API for testing'
        },
        {
            name: 'HTTPBin',
            endpoint: 'https://httpbin.org/get',
            method: 'GET',
            description: 'HTTP request & response service'
        },
        {
            name: 'Cat Facts',
            endpoint: 'https://catfact.ninja/fact',
            method: 'GET',
            description: 'Random cat facts API'
        },
        {
            name: 'Dog API',
            endpoint: 'https://dog.ceo/api/breeds/image/random',
            method: 'GET',
            description: 'Random dog images API'
        }
    ];
    
    try {
        console.log('🌐 Testing popular public APIs (no authentication required):');
        publicApis.forEach((api, index) => {
            console.log(`  ${index + 1}. ${api.name}: ${api.description}`);
        });
        console.log('');
        
        for (const api of publicApis) {
            console.log(`🔄 Testing ${api.name}...`);
            
            const results = await sendConcurrentRequests(3, {
                method: api.method,
                endpoint: api.endpoint,
                token: '' // No authentication needed
            });
            
            const successCount = results.filter(r => r.success).length;
            console.log(`  ✅ ${api.name}: ${successCount}/3 requests successful`);
            
            if (successCount > 0) {
                const sampleData = results.find(r => r.success)?.data;
                if (sampleData) {
                    const preview = JSON.stringify(sampleData).substring(0, 100);
                    console.log(`  📄 Sample response: ${preview}...`);
                }
            }
            console.log('');
        }
        
    } catch (error) {
        console.error('❌ Public APIs example error:', error);
    }
}

/**
 * Example 5: Configuration switching between authenticated and public
 */
async function configSwitchingExample() {
    console.log('🎯 Configuration Switching Example\n');
    
    try {
        // Phase 1: Public endpoint
        console.log('🌐 Phase 1: Public endpoint (no authentication)');
        updateApiConfig({
            method: 'GET',
            endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
            token: '' // Clear token for public access
        });
        
        const publicResults = await sendConcurrentRequests(2);
        console.log(`  ✅ Public requests: ${publicResults.filter(r => r.success).length}/2 successful\n`);
        
        // Phase 2: Authenticated endpoint
        console.log('🔐 Phase 2: Authenticated endpoint');
        updateApiConfig({
            method: 'GET',
            endpoint: 'https://httpbin.org/bearer',
            token: 'test-authentication-token-456'
        });
        
        const authResults = await sendConcurrentRequests(2);
        console.log(`  ✅ Authenticated requests: ${authResults.filter(r => r.success).length}/2 successful\n`);
        
        // Phase 3: Back to public
        console.log('🌐 Phase 3: Back to public endpoint');
        updateApiConfig({
            method: 'GET',
            endpoint: 'https://httpbin.org/json',
            token: '' // Remove authentication
        });
        
        const finalResults = await sendConcurrentRequests(2);
        console.log(`  ✅ Final public requests: ${finalResults.filter(r => r.success).length}/2 successful`);
        
        console.log('\n📊 Configuration switching completed successfully!');
        
    } catch (error) {
        console.error('❌ Configuration switching example error:', error);
    }
}

/**
 * Example 6: No token validation demonstration
 */
async function noTokenValidationExample() {
    console.log('🎯 No Token Validation Demonstration\n');
    
    const testCases = [
        { token: '', description: 'Empty token' },
        { token: '   ', description: 'Whitespace only token' },
        { token: undefined, description: 'Undefined token' },
        { token: null, description: 'Null token' }
    ];
    
    try {
        console.log('🔄 Testing various token scenarios:');
        
        for (const testCase of testCases) {
            console.log(`\n  Testing: ${testCase.description}`);
            
            const results = await sendConcurrentRequests(1, {
                method: 'GET',
                endpoint: 'https://httpbin.org/get',
                token: testCase.token
            });
            
            const result = results[0];
            console.log(`    Result: ${result.success ? '✅ Success' : '❌ Failed'}`);
            console.log(`    Auth header included: ${result.success && result.data?.headers?.Authorization ? 'Yes' : 'No'}`);
        }
        
        console.log('\n✅ All token scenarios handled gracefully - no validation errors!');
        
    } catch (error) {
        console.error('❌ No token validation example error:', error);
    }
}

// Command-line interface
async function runPublicEndpointExample() {
    const args = process.argv.slice(2);
    const command = args[0] || 'get';
    
    switch (command) {
        case 'get':
            await publicGetExample();
            break;
            
        case 'post':
            await publicPostExample();
            break;
            
        case 'mixed':
            await mixedAuthExample();
            break;
            
        case 'apis':
            await publicApisExample();
            break;
            
        case 'switching':
            await configSwitchingExample();
            break;
            
        case 'validation':
            await noTokenValidationExample();
            break;
            
        case 'all':
            console.log('🚀 Running All Public Endpoint Examples...\n');
            await publicGetExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await publicPostExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await mixedAuthExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await publicApisExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await noTokenValidationExample();
            break;
            
        default:
            console.log('📋 Available public endpoint example commands:');
            console.log('  node publicEndpointExample.js get        - Public GET requests');
            console.log('  node publicEndpointExample.js post       - Public POST requests');
            console.log('  node publicEndpointExample.js mixed      - Mixed authentication');
            console.log('  node publicEndpointExample.js apis       - Popular public APIs');
            console.log('  node publicEndpointExample.js switching  - Config switching');
            console.log('  node publicEndpointExample.js validation - Token validation test');
            console.log('  node publicEndpointExample.js all        - Run multiple examples');
            console.log('');
            console.log('Examples:');
            console.log('  node publicEndpointExample.js get        - Test public endpoints');
            console.log('  node publicEndpointExample.js apis       - Test popular public APIs');
    }
}

// Auto-execute if running directly
if (typeof window === 'undefined' && require.main === module) {
    runPublicEndpointExample().then(() => {
        console.log('\n🎉 Public endpoint examples completed!');
    }).catch(error => {
        console.error('❌ Public endpoint example failed:', error);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        publicGetExample,
        publicPostExample,
        mixedAuthExample,
        publicApisExample,
        configSwitchingExample,
        noTokenValidationExample,
        runPublicEndpointExample
    };
}
