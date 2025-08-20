/**
 * Dynamic API Request Examples
 * Demonstrates how to use the dynamic request functionality
 */

// Import the functions (uncomment if using in Node.js with modules)
// const { sendConcurrentRequests, sendConcurrentRequestsWithSettled, main } = require('./apiRequests.js');

/**
 * Example usage of dynamic concurrent requests
 */
async function demonstrateDynamicRequests() {
    console.log('🎯 Dynamic API Request Examples\n');
    
    try {
        // Example 1: Send 1 request
        console.log('📍 Example 1: Single Request');
        await sendConcurrentRequests(1);
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        // Example 2: Send 3 requests
        console.log('📍 Example 2: Three Requests');
        await sendConcurrentRequests(3);
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        // Example 3: Send 10 requests
        console.log('📍 Example 3: Ten Requests');
        await sendConcurrentRequests(10);
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        // Example 4: Send 20 requests with error handling
        console.log('📍 Example 4: Twenty Requests (with Promise.allSettled)');
        await sendConcurrentRequestsWithSettled(20);
        
    } catch (error) {
        console.error('❌ Demo error:', error);
    }
}

/**
 * Test different request counts
 */
async function testVariousRequestCounts() {
    const testCounts = [1, 2, 5, 10, 15, 25];
    
    console.log('🧪 Testing Various Request Counts\n');
    
    for (const count of testCounts) {
        console.log(`\n📊 Testing ${count} concurrent requests:`);
        console.log('-'.repeat(40));
        
        const startTime = Date.now();
        
        try {
            const results = await sendConcurrentRequests(count);
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            const successCount = results.filter(r => r.success).length;
            const avgResponseTime = results
                .filter(r => r.success)
                .map(r => parseInt(r.duration))
                .reduce((sum, time) => sum + time, 0) / successCount || 0;
            
            console.log(`✅ Results: ${successCount}/${count} successful`);
            console.log(`⏱️  Total time: ${duration}ms`);
            console.log(`📈 Avg response time: ${avgResponseTime.toFixed(1)}ms`);
            console.log(`🚀 Requests per second: ${(count / (duration / 1000)).toFixed(2)}`);
            
        } catch (error) {
            console.error(`❌ Failed with ${count} requests:`, error.message);
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

/**
 * Performance benchmark
 */
async function performanceBenchmark() {
    console.log('🏁 Performance Benchmark\n');
    
    const benchmarkCounts = [1, 5, 10, 20, 50];
    const results = [];
    
    for (const count of benchmarkCounts) {
        console.log(`🔄 Benchmarking ${count} requests...`);
        
        const iterations = 3;
        const timings = [];
        
        for (let i = 0; i < iterations; i++) {
            const startTime = Date.now();
            
            try {
                await sendConcurrentRequests(count);
                const endTime = Date.now();
                timings.push(endTime - startTime);
                
            } catch (error) {
                console.error(`❌ Benchmark failed for ${count} requests:`, error.message);
                break;
            }
            
            // Small delay between iterations
            if (i < iterations - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        if (timings.length > 0) {
            const avgTime = timings.reduce((sum, time) => sum + time, 0) / timings.length;
            const minTime = Math.min(...timings);
            const maxTime = Math.max(...timings);
            
            results.push({
                requests: count,
                avgTime: avgTime.toFixed(1),
                minTime,
                maxTime,
                requestsPerSecond: (count / (avgTime / 1000)).toFixed(2)
            });
            
            console.log(`  ✅ Avg: ${avgTime.toFixed(1)}ms, Min: ${minTime}ms, Max: ${maxTime}ms`);
        }
        
        console.log('');
    }
    
    // Display benchmark summary
    console.log('📊 BENCHMARK SUMMARY:');
    console.log('='.repeat(60));
    console.log('Requests | Avg Time | Min Time | Max Time | Req/Sec');
    console.log('-'.repeat(60));
    
    results.forEach(result => {
        console.log(
            `${result.requests.toString().padStart(8)} | ` +
            `${result.avgTime.padStart(8)}ms | ` +
            `${result.minTime.toString().padStart(8)}ms | ` +
            `${result.maxTime.toString().padStart(8)}ms | ` +
            `${result.requestsPerSecond.padStart(7)}`
        );
    });
}

// Command-line interface
async function runExample() {
    const args = process.argv.slice(2);
    const command = args[0] || 'demo';
    
    switch (command) {
        case 'demo':
            await demonstrateDynamicRequests();
            break;
            
        case 'test':
            await testVariousRequestCounts();
            break;
            
        case 'benchmark':
            await performanceBenchmark();
            break;
            
        case 'custom':
            const count = parseInt(args[1]) || 5;
            console.log(`🎯 Running ${count} concurrent requests:`);
            await sendConcurrentRequests(count);
            break;
            
        default:
            console.log('📋 Available commands:');
            console.log('  node dynamicExample.js demo       - Run demonstration');
            console.log('  node dynamicExample.js test       - Test various counts');
            console.log('  node dynamicExample.js benchmark  - Performance benchmark');
            console.log('  node dynamicExample.js custom [n] - Run n requests');
            console.log('');
            console.log('Examples:');
            console.log('  node dynamicExample.js custom 15  - Run 15 requests');
            console.log('  node dynamicExample.js benchmark  - Run performance tests');
    }
}

// Auto-execute if running directly
if (typeof window === 'undefined' && require.main === module) {
    runExample().then(() => {
        console.log('\n🎉 Example completed!');
    }).catch(error => {
        console.error('❌ Example failed:', error);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        demonstrateDynamicRequests,
        testVariousRequestCounts,
        performanceBenchmark,
        runExample
    };
}
