/**
 * Array Payload Examples
 * Demonstrates the new array format for sending different payloads
 */

const { 
    sendRequestsWithPayloadArray,
    sendConcurrentRequests
} = require('./apiRequests.js');

/**
 * Example 1: Basic array payload usage
 */
async function basicArrayExample() {
    console.log('🎯 Basic Array Payload Example\n');
    
    const payloadArray = [
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "1"
        },
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "2"
        },
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "3"
        }
    ];
    
    try {
        console.log('📦 Using array format with your payload structure:');
        console.log(`   Array length: ${payloadArray.length} payloads`);
        console.log(`   Batch numbers: ${payloadArray.map(p => p.batchnumber).join(', ')}`);
        console.log('');
        
        const results = await sendRequestsWithPayloadArray(payloadArray, {
            method: 'POST',
            endpoint: 'https://example.dev/api/v1/backend/super-api-v2',
            token: '' // Token is in each payload
        });
        
        const successCount = results.filter(r => r.success).length;
        console.log(`✅ Results: ${successCount}/${results.length} requests successful`);
        
        results.forEach(result => {
            const batchNumber = result.requestBody.batchnumber;
            console.log(`  Request ${result.requestId} (batch ${batchNumber}): ${result.success ? '✅ Success' : '❌ Failed'}`);
            if (!result.success) {
                console.log(`    Error: ${result.error}`);
            }
        });
        
        return results;
        
    } catch (error) {
        console.error('❌ Basic array example error:', error);
    }
}

/**
 * Example 2: Your 10 payloads in array format
 */
async function your10PayloadsExample() {
    console.log('🎯 Your 10 Payloads Array Example\n');
    
    const your10Payloads = [
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "1"
        },
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "2"
        },
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "3"
        },
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "4"
        },
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "5"
        },
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "6"
        },
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "7"
        },
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "8"
        },
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "9"
        },
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
            "currentUrl": "https://example.dev/",
            "backendUrl": "https://example.dev/api/v1/backend",
            "type": "ExecutiveSummary",
            "batchnumber": "10"
        }
    ];
    
    try {
        console.log('📦 Sending your 10 payloads using array format:');
        console.log(`   Total payloads: ${your10Payloads.length}`);
        console.log(`   Batch range: ${your10Payloads[0].batchnumber} - ${your10Payloads[your10Payloads.length-1].batchnumber}`);
        console.log('');
        
        const results = await sendRequestsWithPayloadArray(your10Payloads, {
            method: 'POST',
            endpoint: 'https://example.dev/api/v1/backend/super-api-v2',
            token: '' // Token is in each payload
        });
        
        const successCount = results.filter(r => r.success).length;
        console.log(`✅ Results: ${successCount}/${results.length} requests successful`);
        
        // Group results by success/failure
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        if (successful.length > 0) {
            console.log(`\n✅ Successful requests (${successful.length}):`);
            successful.forEach(result => {
                const batchNumber = result.requestBody.batchnumber;
                console.log(`  Batch ${batchNumber}: Request ${result.requestId} - ${result.duration}`);
            });
        }
        
        if (failed.length > 0) {
            console.log(`\n❌ Failed requests (${failed.length}):`);
            failed.forEach(result => {
                const batchNumber = result.requestBody.batchnumber;
                console.log(`  Batch ${batchNumber}: Request ${result.requestId} - ${result.error}`);
            });
        }
        
        return results;
        
    } catch (error) {
        console.error('❌ Your 10 payloads example error:', error);
    }
}

/**
 * Example 3: Comparison between old format and new array format
 */
async function formatComparisonExample() {
    console.log('🎯 Format Comparison Example\n');
    
    const samplePayloads = [
        { name: "User 1", email: "user1@example.com", id: 1 },
        { name: "User 2", email: "user2@example.com", id: 2 },
        { name: "User 3", email: "user3@example.com", id: 3 }
    ];
    
    try {
        console.log('📊 Comparing old vs new format:\n');
        
        console.log('❌ OLD FORMAT (line-by-line):');
        console.log('{"name": "User 1", "email": "user1@example.com", "id": 1}');
        console.log('{"name": "User 2", "email": "user2@example.com", "id": 2}');
        console.log('{"name": "User 3", "email": "user3@example.com", "id": 3}');
        console.log('');
        
        console.log('✅ NEW FORMAT (JSON array):');
        console.log(JSON.stringify(samplePayloads, null, 2));
        console.log('');
        
        console.log('🚀 Testing new array format...');
        
        const results = await sendRequestsWithPayloadArray(samplePayloads, {
            method: 'POST',
            endpoint: 'https://jsonplaceholder.typicode.com/users',
            token: 'example-token'
        });
        
        const successCount = results.filter(r => r.success).length;
        console.log(`✅ Array format results: ${successCount}/${results.length} successful`);
        
        results.forEach(result => {
            const userName = result.requestBody.name;
            console.log(`  ${userName}: ${result.success ? '✅ Success' : '❌ Failed'}`);
        });
        
        return results;
        
    } catch (error) {
        console.error('❌ Format comparison example error:', error);
    }
}

// Command-line interface
async function runArrayExample() {
    const args = process.argv.slice(2);
    const command = args[0] || 'basic';
    
    switch (command) {
        case 'basic':
            await basicArrayExample();
            break;
            
        case 'your10':
            await your10PayloadsExample();
            break;
            
        case 'comparison':
            await formatComparisonExample();
            break;
            
        case 'all':
            console.log('🚀 Running All Array Examples...\n');
            await basicArrayExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await formatComparisonExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await your10PayloadsExample();
            break;
            
        default:
            console.log('📋 Available array example commands:');
            console.log('  node arrayPayloadExample.js basic      - Basic array format usage');
            console.log('  node arrayPayloadExample.js your10     - Your 10 payloads example');
            console.log('  node arrayPayloadExample.js comparison - Old vs new format comparison');
            console.log('  node arrayPayloadExample.js all        - Run all examples');
            console.log('');
            console.log('Examples:');
            console.log('  node arrayPayloadExample.js basic      - Test array format');
            console.log('  node arrayPayloadExample.js your10     - Use your exact payloads');
    }
}

// Auto-execute if running directly
if (typeof window === 'undefined' && require.main === module) {
    runArrayExample().then(() => {
        console.log('\n🎉 Array payload examples completed!');
    }).catch(error => {
        console.error('❌ Array payload example failed:', error);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        basicArrayExample,
        your10PayloadsExample,
        formatComparisonExample,
        runArrayExample
    };
}
