/**
 * Different Payloads Examples
 * Demonstrates the new functionality for sending different payloads and no timeout limits
 */

const { 
    sendConcurrentRequests,
    sendRequestsWithDifferentPayloads,
    generatePayloadVariations,
    sendPostRequestsWithVariations
} = require('./apiRequests.js');

/**
 * Example 1: Send requests with completely different payloads
 */
async function differentPayloadsExample() {
    console.log('🎯 Different Payloads Example\n');
    
    const differentPayloads = [
        { name: "Alice Johnson", email: "alice@example.com", role: "admin", department: "IT" },
        { name: "Bob Smith", email: "bob@example.com", role: "user", department: "Sales" },
        { name: "Carol Brown", email: "carol@example.com", role: "moderator", department: "Support" },
        { name: "David Wilson", email: "david@example.com", role: "user", department: "Marketing" },
        { name: "Eve Davis", email: "eve@example.com", role: "manager", department: "HR" }
    ];
    
    try {
        console.log(`📦 Sending ${differentPayloads.length} requests with different payloads:`);
        differentPayloads.forEach((payload, index) => {
            console.log(`  ${index + 1}. ${payload.name} (${payload.role}) - ${payload.department}`);
        });
        console.log('');
        
        const results = await sendRequestsWithDifferentPayloads(differentPayloads, {
            method: 'POST',
            endpoint: 'https://jsonplaceholder.typicode.com/users',
            token: 'different-payloads-token'
        });
        
        const successCount = results.filter(r => r.success).length;
        console.log(`\n✅ Results: ${successCount}/${results.length} requests successful`);
        
        // Show what payload each request used
        results.forEach(result => {
            if (result.success) {
                console.log(`  ✅ Request ${result.requestId}: ${result.requestBody.name} - Success`);
            } else {
                console.log(`  ❌ Request ${result.requestId}: ${result.requestBody?.name || 'Unknown'} - ${result.error}`);
            }
        });
        
        return results;
        
    } catch (error) {
        console.error('❌ Different payloads example error:', error);
    }
}

/**
 * Example 2: Auto-generated payload variations
 */
async function payloadVariationsExample() {
    console.log('🎯 Payload Variations Example\n');
    
    const basePayload = {
        name: "Test User",
        email: "testuser@example.com",
        role: "user",
        active: true,
        preferences: {
            theme: "light",
            notifications: true
        }
    };
    
    try {
        console.log('📦 Base payload:');
        console.log(JSON.stringify(basePayload, null, 2));
        console.log('\n🔄 Generating 5 variations...\n');
        
        const results = await sendPostRequestsWithVariations(
            5,
            basePayload,
            {
                endpoint: 'https://jsonplaceholder.typicode.com/users',
                token: 'variations-token'
            }
        );
        
        const successCount = results.filter(r => r.success).length;
        console.log(`✅ Results: ${successCount}/${results.length} variation requests successful`);
        
        // Show the variations that were generated
        console.log('\n📋 Generated variations:');
        results.forEach(result => {
            console.log(`  Request ${result.requestId}:`);
            console.log(`    Name: ${result.requestBody.name}`);
            console.log(`    Email: ${result.requestBody.email}`);
            console.log(`    Request Index: ${result.requestBody.requestIndex}`);
            console.log(`    Success: ${result.success ? '✅' : '❌'}`);
            console.log('');
        });
        
        return results;
        
    } catch (error) {
        console.error('❌ Payload variations example error:', error);
    }
}

/**
 * Example 3: Custom variation function
 */
async function customVariationExample() {
    console.log('🎯 Custom Variation Function Example\n');
    
    const basePayload = {
        product: "Widget",
        price: 19.99,
        category: "Electronics"
    };
    
    // Custom variation function
    const customVariationFn = (payload, index) => {
        const products = ["Widget", "Gadget", "Tool", "Device", "Component"];
        const categories = ["Electronics", "Hardware", "Software", "Accessories", "Parts"];
        
        payload.product = `${products[index % products.length]} ${index + 1}`;
        payload.price = (19.99 + (index * 5.00)).toFixed(2);
        payload.category = categories[index % categories.length];
        payload.sku = `SKU-${String(index + 1).padStart(4, '0')}`;
        payload.inStock = Math.random() > 0.2; // 80% chance in stock
        payload.createdAt = new Date().toISOString();
        
        return payload;
    };
    
    try {
        console.log('📦 Base payload:');
        console.log(JSON.stringify(basePayload, null, 2));
        console.log('\n🔄 Generating 4 custom variations...\n');
        
        const variations = generatePayloadVariations(basePayload, 4, customVariationFn);
        
        const results = await sendRequestsWithDifferentPayloads(variations, {
            method: 'POST',
            endpoint: 'https://httpbin.org/post',
            token: 'custom-variations-token'
        });
        
        const successCount = results.filter(r => r.success).length;
        console.log(`✅ Results: ${successCount}/${results.length} custom variation requests successful`);
        
        // Show the custom variations
        console.log('\n📋 Custom variations generated:');
        results.forEach(result => {
            console.log(`  Request ${result.requestId}:`);
            console.log(`    Product: ${result.requestBody.product}`);
            console.log(`    Price: $${result.requestBody.price}`);
            console.log(`    Category: ${result.requestBody.category}`);
            console.log(`    SKU: ${result.requestBody.sku}`);
            console.log(`    In Stock: ${result.requestBody.inStock ? '✅' : '❌'}`);
            console.log(`    Success: ${result.success ? '✅' : '❌'}`);
            console.log('');
        });
        
        return results;
        
    } catch (error) {
        console.error('❌ Custom variation example error:', error);
    }
}

/**
 * Example 4: Mixed payloads with array configuration
 */
async function mixedPayloadsExample() {
    console.log('🎯 Mixed Payloads with Array Configuration Example\n');
    
    // Different configurations for different requests
    const configs = [
        {
            method: 'POST',
            endpoint: 'https://jsonplaceholder.typicode.com/posts',
            token: 'posts-token',
            body: { title: 'First Post', body: 'Content of first post', userId: 1 }
        },
        {
            method: 'POST',
            endpoint: 'https://jsonplaceholder.typicode.com/posts',
            token: 'posts-token',
            body: { title: 'Second Post', body: 'Content of second post', userId: 2 }
        },
        {
            method: 'POST',
            endpoint: 'https://jsonplaceholder.typicode.com/users',
            token: 'users-token',
            body: { name: 'New User', email: 'newuser@example.com', username: 'newuser' }
        }
    ];
    
    try {
        console.log('📦 Sending requests with mixed endpoints and payloads:');
        configs.forEach((config, index) => {
            console.log(`  ${index + 1}. ${config.method} ${config.endpoint}`);
            console.log(`     Payload: ${JSON.stringify(config.body).substring(0, 50)}...`);
        });
        console.log('');
        
        // Send using array configuration (each request gets different config)
        const results = await sendConcurrentRequests(configs.length, configs);
        
        const successCount = results.filter(r => r.success).length;
        console.log(`✅ Results: ${successCount}/${results.length} mixed requests successful`);
        
        // Show results for each different endpoint
        results.forEach(result => {
            console.log(`  Request ${result.requestId}:`);
            console.log(`    Endpoint: ${result.endpoint}`);
            console.log(`    Method: ${result.method}`);
            console.log(`    Success: ${result.success ? '✅' : '❌'}`);
            if (result.requestBody) {
                const bodyPreview = JSON.stringify(result.requestBody).substring(0, 60);
                console.log(`    Payload: ${bodyPreview}...`);
            }
            console.log('');
        });
        
        return results;
        
    } catch (error) {
        console.error('❌ Mixed payloads example error:', error);
    }
}

/**
 * Example 5: No timeout demonstration (long-running requests)
 */
async function noTimeoutExample() {
    console.log('🎯 No Timeout Demonstration\n');
    
    console.log('⏰ Testing requests without timeout limits...');
    console.log('   (Using httpbin.org/delay endpoints to simulate slow responses)\n');
    
    const slowConfigs = [
        {
            method: 'GET',
            endpoint: 'https://httpbin.org/delay/2', // 2 second delay
            token: 'slow-token-1'
        },
        {
            method: 'GET', 
            endpoint: 'https://httpbin.org/delay/5', // 5 second delay
            token: 'slow-token-2'
        },
        {
            method: 'POST',
            endpoint: 'https://httpbin.org/delay/3', // 3 second delay
            token: 'slow-token-3',
            body: { message: 'This is a slow POST request', delay: 3 }
        }
    ];
    
    try {
        console.log('🐌 Starting slow requests (no timeout):');
        slowConfigs.forEach((config, index) => {
            const delay = config.endpoint.split('/delay/')[1];
            console.log(`  ${index + 1}. ${config.method} request with ${delay}s delay`);
        });
        console.log('\n⏳ Waiting for all requests to complete...\n');
        
        const startTime = Date.now();
        const results = await sendConcurrentRequests(slowConfigs.length, slowConfigs);
        const endTime = Date.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(1);
        
        const successCount = results.filter(r => r.success).length;
        console.log(`✅ Results: ${successCount}/${results.length} slow requests completed`);
        console.log(`⏱️  Total time: ${totalTime}s (all requests waited without timeout)`);
        
        results.forEach(result => {
            const delay = result.endpoint.split('/delay/')[1];
            console.log(`  Request ${result.requestId}: ${delay}s delay - ${result.success ? '✅ Success' : '❌ Failed'} (${result.duration})`);
        });
        
        return results;
        
    } catch (error) {
        console.error('❌ No timeout example error:', error);
    }
}

// Command-line interface
async function runDifferentPayloadsExample() {
    const args = process.argv.slice(2);
    const command = args[0] || 'different';
    
    switch (command) {
        case 'different':
            await differentPayloadsExample();
            break;
            
        case 'variations':
            await payloadVariationsExample();
            break;
            
        case 'custom':
            await customVariationExample();
            break;
            
        case 'mixed':
            await mixedPayloadsExample();
            break;
            
        case 'notimeout':
            await noTimeoutExample();
            break;
            
        case 'all':
            console.log('🚀 Running All Different Payloads Examples...\n');
            await differentPayloadsExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await payloadVariationsExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await customVariationExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await mixedPayloadsExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await noTimeoutExample();
            break;
            
        default:
            console.log('📋 Available different payloads example commands:');
            console.log('  node differentPayloadsExample.js different   - Different payloads per request');
            console.log('  node differentPayloadsExample.js variations  - Auto-generated variations');
            console.log('  node differentPayloadsExample.js custom      - Custom variation function');
            console.log('  node differentPayloadsExample.js mixed       - Mixed endpoints and payloads');
            console.log('  node differentPayloadsExample.js notimeout   - No timeout demonstration');
            console.log('  node differentPayloadsExample.js all         - Run multiple examples');
            console.log('');
            console.log('Examples:');
            console.log('  node differentPayloadsExample.js different   - Send unique payloads');
            console.log('  node differentPayloadsExample.js notimeout   - Test slow requests');
    }
}

// Auto-execute if running directly
if (typeof window === 'undefined' && require.main === module) {
    runDifferentPayloadsExample().then(() => {
        console.log('\n🎉 Different payloads examples completed!');
    }).catch(error => {
        console.error('❌ Different payloads example failed:', error);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        differentPayloadsExample,
        payloadVariationsExample,
        customVariationExample,
        mixedPayloadsExample,
        noTimeoutExample,
        runDifferentPayloadsExample
    };
}
