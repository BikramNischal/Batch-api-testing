/**
 * JSON Output Examples
 * Demonstrates the prettified JSON output functionality
 */

const { sendConcurrentRequests, displayPrettifiedResults, saveResultsToFile } = require('./apiRequests.js');

/**
 * Example 1: Basic JSON output
 */
async function basicJsonExample() {
    console.log('🎯 Basic JSON Output Example\n');
    
    try {
        // Send 3 requests
        const results = await sendConcurrentRequests(3);
        
        console.log('\n' + '='.repeat(80));
        console.log('📋 PRETTIFIED JSON OUTPUT:');
        console.log('='.repeat(80));
        
        // Display each result as prettified JSON
        results.forEach((result, index) => {
            console.log(`\n🔍 REQUEST ${result.requestId} - COMPLETE JSON OBJECT:`);
            console.log('─'.repeat(60));
            console.log(JSON.stringify(result, null, 2));
        });
        
        return results;
        
    } catch (error) {
        console.error('❌ Example error:', error);
    }
}

/**
 * Example 2: Structured output with metadata
 */
async function structuredJsonExample() {
    console.log('🎯 Structured JSON Output Example\n');
    
    try {
        const results = await sendConcurrentRequests(5);
        
        // Create structured output
        const structuredOutput = {
            metadata: {
                timestamp: new Date().toISOString(),
                totalRequests: results.length,
                successfulRequests: results.filter(r => r.success).length,
                failedRequests: results.filter(r => !r.success).length,
                successRate: `${(results.filter(r => r.success).length / results.length * 100).toFixed(1)}%`,
                averageResponseTime: results
                    .filter(r => r.success)
                    .map(r => parseInt(r.duration))
                    .reduce((sum, time) => sum + time, 0) / results.filter(r => r.success).length || 0
            },
            summary: {
                endpoint: "https://teststrategise.aigeeks.dev/api/v1/backend/super-api-v2",
                method: "GET",
                authType: "Bearer Token",
                concurrentRequests: results.length
            },
            results: results.map(result => ({
                ...result,
                // Add computed fields
                responseSize: result.data ? JSON.stringify(result.data).length : 0,
                isSuccess: result.success,
                hasError: !!result.error
            }))
        };
        
        console.log('\n' + '='.repeat(80));
        console.log('📊 STRUCTURED JSON OUTPUT WITH METADATA:');
        console.log('='.repeat(80));
        console.log(JSON.stringify(structuredOutput, null, 2));
        
        return structuredOutput;
        
    } catch (error) {
        console.error('❌ Example error:', error);
    }
}

/**
 * Example 3: Save and display results
 */
async function saveAndDisplayExample() {
    console.log('🎯 Save and Display JSON Example\n');
    
    try {
        const results = await sendConcurrentRequests(3);
        
        // Save to file
        await saveResultsToFile(results, 'example-output.json');
        
        // Display prettified results
        displayPrettifiedResults(results, true);
        
        return results;
        
    } catch (error) {
        console.error('❌ Example error:', error);
    }
}

/**
 * Example 4: Filter and format specific data
 */
async function filteredJsonExample() {
    console.log('🎯 Filtered JSON Output Example\n');
    
    try {
        const results = await sendConcurrentRequests(5);
        
        // Filter successful requests only
        const successfulResults = results.filter(r => r.success);
        
        // Extract only relevant data
        const filteredOutput = {
            summary: {
                timestamp: new Date().toISOString(),
                totalRequests: results.length,
                successfulRequests: successfulResults.length,
                dataExtracted: successfulResults.length
            },
            successfulRequests: successfulResults.map(result => ({
                requestId: result.requestId,
                status: result.status,
                duration: result.duration,
                timestamp: result.timestamp,
                responseData: result.data,
                metadata: {
                    responseSize: result.data ? JSON.stringify(result.data).length : 0,
                    hasValidData: !!result.data,
                    responseType: typeof result.data
                }
            })),
            failedRequests: results.filter(r => !r.success).map(result => ({
                requestId: result.requestId,
                error: result.error,
                status: result.status,
                duration: result.duration
            }))
        };
        
        console.log('\n' + '='.repeat(80));
        console.log('🔍 FILTERED JSON OUTPUT (Success/Failure Separated):');
        console.log('='.repeat(80));
        console.log(JSON.stringify(filteredOutput, null, 2));
        
        return filteredOutput;
        
    } catch (error) {
        console.error('❌ Example error:', error);
    }
}

/**
 * Example 5: Performance analysis JSON
 */
async function performanceJsonExample() {
    console.log('🎯 Performance Analysis JSON Example\n');
    
    try {
        const results = await sendConcurrentRequests(10);
        
        const successfulResults = results.filter(r => r.success);
        const durations = successfulResults.map(r => parseInt(r.duration));
        
        const performanceOutput = {
            testInfo: {
                timestamp: new Date().toISOString(),
                endpoint: "https://teststrategise.aigeeks.dev/api/v1/backend/super-api-v2",
                totalRequests: results.length,
                concurrentExecution: true
            },
            performanceMetrics: {
                successRate: `${(successfulResults.length / results.length * 100).toFixed(1)}%`,
                averageResponseTime: durations.reduce((sum, time) => sum + time, 0) / durations.length || 0,
                minResponseTime: Math.min(...durations) || 0,
                maxResponseTime: Math.max(...durations) || 0,
                medianResponseTime: durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)] || 0,
                totalExecutionTime: Math.max(...results.map(r => parseInt(r.duration))) || 0
            },
            detailedResults: results.map((result, index) => ({
                requestNumber: index + 1,
                requestId: result.requestId,
                success: result.success,
                httpStatus: result.status,
                responseTime: result.duration,
                timestamp: result.timestamp,
                error: result.error || null,
                responseDataSize: result.data ? JSON.stringify(result.data).length : 0,
                responsePreview: result.data ? 
                    (typeof result.data === 'object' ? 
                        JSON.stringify(result.data).substring(0, 100) + '...' : 
                        result.data.substring(0, 100) + '...') : null
            }))
        };
        
        console.log('\n' + '='.repeat(80));
        console.log('📈 PERFORMANCE ANALYSIS JSON OUTPUT:');
        console.log('='.repeat(80));
        console.log(JSON.stringify(performanceOutput, null, 2));
        
        return performanceOutput;
        
    } catch (error) {
        console.error('❌ Example error:', error);
    }
}

// Command-line interface
async function runJsonExample() {
    const args = process.argv.slice(2);
    const command = args[0] || 'basic';
    
    switch (command) {
        case 'basic':
            await basicJsonExample();
            break;
            
        case 'structured':
            await structuredJsonExample();
            break;
            
        case 'save':
            await saveAndDisplayExample();
            break;
            
        case 'filtered':
            await filteredJsonExample();
            break;
            
        case 'performance':
            await performanceJsonExample();
            break;
            
        case 'all':
            console.log('🚀 Running All JSON Examples...\n');
            await basicJsonExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await structuredJsonExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await filteredJsonExample();
            console.log('\n' + '═'.repeat(100) + '\n');
            await performanceJsonExample();
            break;
            
        default:
            console.log('📋 Available JSON example commands:');
            console.log('  node jsonExample.js basic       - Basic JSON output');
            console.log('  node jsonExample.js structured  - Structured output with metadata');
            console.log('  node jsonExample.js save        - Save and display results');
            console.log('  node jsonExample.js filtered    - Filtered success/failure output');
            console.log('  node jsonExample.js performance - Performance analysis output');
            console.log('  node jsonExample.js all         - Run all examples');
            console.log('');
            console.log('Examples:');
            console.log('  node jsonExample.js basic       - Show basic prettified JSON');
            console.log('  node jsonExample.js performance - Show performance metrics');
    }
}

// Auto-execute if running directly
if (typeof window === 'undefined' && require.main === module) {
    runJsonExample().then(() => {
        console.log('\n🎉 JSON examples completed!');
    }).catch(error => {
        console.error('❌ JSON example failed:', error);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        basicJsonExample,
        structuredJsonExample,
        saveAndDisplayExample,
        filteredJsonExample,
        performanceJsonExample,
        runJsonExample
    };
}
