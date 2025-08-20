/**
 * Send 5 concurrent requests to the specified API endpoint with bearer token
 */

// Default API configuration (can be overridden)
let API_CONFIG = {
    endpoint: "https://teststrategise.aigeeks.dev/api/v1/backend/super-api-v2",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZlMDQ2ZTk5NmZhMTNjZjgyZjEzMjIiLCJpYXQiOjE3NTU1ODM4MjksImV4cCI6MTc1NjE4ODYyOX0.WrjUGc9qthQMoPZl6J_dXpoXHif1_qaU0MXnfP14CWk",
    method: "GET",
    body: null
};

/**
 * Update API configuration
 * @param {Object} config - New configuration object
 */
function updateApiConfig(config) {
    API_CONFIG = { ...API_CONFIG, ...config };
    console.log('📝 API Configuration updated:', API_CONFIG);
}

/**
 * Makes a single API request with configurable method, URL, token, and body
 * @param {number} requestId - Identifier for the request
 * @param {Object} customConfig - Optional custom configuration for this request
 * @returns {Promise<Object>} Response object with request details
 */
async function makeApiRequest(requestId, customConfig = {}) {
    const startTime = Date.now();
    
    // Merge custom config with global config
    const config = { ...API_CONFIG, ...customConfig };
    
    try {
        console.log(`🚀 Starting ${config.method} request ${requestId} to ${config.endpoint}...`);
        
        const fetchOptions = {
            method: config.method,
            headers: {
                'Accept': 'application/json'
            }
            // Timeout removed - requests will wait indefinitely
        };
        
        // Add Authorization header only if token is provided
        if (config.token && config.token.trim()) {
            fetchOptions.headers['Authorization'] = `Bearer ${config.token}`;
        }
        
        // Add Content-Type header and body for POST requests
        if (config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH') {
            fetchOptions.headers['Content-Type'] = 'application/json';
            if (config.body) {
                fetchOptions.body = typeof config.body === 'string' ? config.body : JSON.stringify(config.body);
            }
        }
        
        const response = await fetch(config.endpoint, fetchOptions);

        const endTime = Date.now();
        const duration = endTime - startTime;

        const result = {
            requestId,
            method: config.method,
            endpoint: config.endpoint,
            success: response.ok,
            status: response.status,
            statusText: response.statusText,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            requestBody: config.body,
            data: null,
            error: null
        };

        if (response.ok) {
            // Try to parse JSON response
            try {
                result.data = await response.json();
                console.log(`✅ Request ${requestId} completed successfully (${duration}ms)`);
            } catch (parseError) {
                // If JSON parsing fails, get text
                result.data = await response.text();
                console.log(`✅ Request ${requestId} completed with text response (${duration}ms)`);
            }
        } else {
            result.error = `HTTP ${response.status}: ${response.statusText}`;
            console.log(`❌ Request ${requestId} failed: ${result.error} (${duration}ms)`);
        }

        return result;

    } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const result = {
            requestId,
            method: config.method,
            endpoint: config.endpoint,
            success: false,
            status: null,
            statusText: null,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            requestBody: config.body,
            data: null,
            error: error.message
        };

        console.log(`❌ Request ${requestId} failed: ${result.error} (${duration}ms)`);
        return result;
    }
}

/**
 * Sends n concurrent requests to the API endpoint
 * @param {number} numberOfRequests - Number of concurrent requests to send (default: 5)
 * @param {Object|Array} customConfig - Optional custom configuration for all requests, or array of configs per request
 * @returns {Promise<Array>} Array of all request results
 */
async function sendConcurrentRequests(numberOfRequests = 5, customConfig = {}) {
    // Handle different payload scenarios
    let configs = [];
    
    if (Array.isArray(customConfig)) {
        // Array of different configs/payloads
        configs = customConfig.slice(0, numberOfRequests);
        // Fill remaining with the last config if needed
        while (configs.length < numberOfRequests) {
            configs.push(customConfig[customConfig.length - 1] || {});
        }
    } else {
        // Single config for all requests
        configs = Array(numberOfRequests).fill(customConfig);
    }
    
    // Merge with global config
    configs = configs.map(config => ({ ...API_CONFIG, ...config }));
    
    const firstConfig = configs[0];
    console.log(`🌟 Starting ${numberOfRequests} concurrent ${firstConfig.method} requests...\n`);
    console.log(`📡 Endpoint: ${firstConfig.endpoint}`);
    if (firstConfig.token && firstConfig.token.trim()) {
        console.log(`🔑 Using Bearer Token: ${firstConfig.token.substring(0, 20)}...`);
    } else {
        console.log(`🔑 No authentication token (public endpoint)`);
    }
    console.log(`🔧 Method: ${firstConfig.method}`);
    
    // Show payload info
    const uniquePayloads = [...new Set(configs.map(c => JSON.stringify(c.body)))];
    if (uniquePayloads.length === 1 && configs[0].body) {
        console.log(`📦 Request Body (same for all): ${typeof configs[0].body === 'string' ? configs[0].body.substring(0, 100) : JSON.stringify(configs[0].body).substring(0, 100)}...`);
    } else if (uniquePayloads.length > 1) {
        console.log(`📦 Using ${uniquePayloads.length} different payloads across ${numberOfRequests} requests`);
    }
    console.log('');
    
    const startTime = Date.now();
    
    // Create n request promises with individual configs
    const requestPromises = configs.map((config, index) => 
        makeApiRequest(index + 1, config)
    );
    
    try {
        // Wait for all requests to complete
        const results = await Promise.all(requestPromises);
        
        const endTime = Date.now();
        const totalDuration = endTime - startTime;
        
        // Display summary
        console.log('\n📊 RESULTS SUMMARY:');
        console.log('='.repeat(50));
        console.log(`Total execution time: ${totalDuration}ms`);
        
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;
        
        console.log(`✅ Successful requests: ${successCount}/${numberOfRequests}`);
        console.log(`❌ Failed requests: ${failureCount}/${numberOfRequests}`);
        console.log(`📈 Success rate: ${(successCount/numberOfRequests*100).toFixed(1)}%\n`);
        
        // Display individual results
        results.forEach(result => {
            console.log(`Request ${result.requestId}:`);
            console.log(`  Status: ${result.success ? '✅ Success' : '❌ Failed'}`);
            console.log(`  HTTP Status: ${result.status || 'N/A'}`);
            console.log(`  Duration: ${result.duration}`);
            console.log(`  Timestamp: ${result.timestamp}`);
            
            if (result.success && result.data) {
                console.log(`  Response Data:`);
                console.log(JSON.stringify(result.data, null, 2).split('\n').map(line => `    ${line}`).join('\n'));
            } else if (result.error) {
                console.log(`  Error: ${result.error}`);
            }
            
            console.log(`  Complete Result Object:`);
            console.log(JSON.stringify(result, null, 2).split('\n').map(line => `    ${line}`).join('\n'));
            console.log('');
        });
        
        return results;
        
    } catch (error) {
        console.error('❌ Unexpected error during concurrent requests:', error);
        throw error;
    }
}

/**
 * Alternative version using Promise.allSettled for better error handling
 * This version continues even if some requests fail
 * @param {number} numberOfRequests - Number of concurrent requests to send (default: 5)
 * @param {Object} customConfig - Optional custom configuration for all requests
 * @returns {Promise<Array>} Array of all request results
 */
async function sendConcurrentRequestsWithSettled(numberOfRequests = 5, customConfig = {}) {
    const config = { ...API_CONFIG, ...customConfig };
    
    console.log(`🌟 Starting ${numberOfRequests} concurrent ${config.method} requests (with Promise.allSettled)...\n`);
    console.log(`📡 Endpoint: ${config.endpoint}`);
    if (config.token && config.token.trim()) {
        console.log(`🔑 Using Bearer Token: ${config.token.substring(0, 20)}...`);
    } else {
        console.log(`🔑 No authentication token (public endpoint)`);
    }
    console.log(`🔧 Method: ${config.method}`);
    console.log('');
    
    const startTime = Date.now();
    
    // Create n request promises
    const requestPromises = Array.from({ length: numberOfRequests }, (_, index) => 
        makeApiRequest(index + 1, config)
    );
    
    // Use Promise.allSettled to handle individual failures gracefully
    const settledResults = await Promise.allSettled(requestPromises);
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    // Process results
    const results = settledResults.map((settled, index) => {
        if (settled.status === 'fulfilled') {
            return settled.value;
        } else {
            return {
                requestId: index + 1,
                success: false,
                status: null,
                statusText: null,
                duration: 'N/A',
                timestamp: new Date().toISOString(),
                data: null,
                error: `Promise rejected: ${settled.reason?.message || 'Unknown error'}`
            };
        }
    });
    
    console.log('\n📊 RESULTS SUMMARY (Promise.allSettled):');
    console.log('='.repeat(50));
    console.log(`Total execution time: ${totalDuration}ms`);
    
    const successCount = results.filter(r => r.success).length;
    console.log(`✅ Successful requests: ${successCount}/${numberOfRequests}`);
    console.log(`❌ Failed requests: ${numberOfRequests - successCount}/${numberOfRequests}\n`);
    
    return results;
}

// Execute the requests
async function main(numberOfRequests = 5) {
    try {
        console.log(`🎯 API Request Test - ${numberOfRequests} Concurrent Requests\n`);
        
        // Method 1: Using Promise.all
        console.log('Method 1: Using Promise.all');
        const results1 = await sendConcurrentRequests(numberOfRequests);
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        // Method 2: Using Promise.allSettled (more robust)
        console.log('Method 2: Using Promise.allSettled');
        const results2 = await sendConcurrentRequestsWithSettled(numberOfRequests);
        
        // Return both results for further processing if needed
        return {
            promiseAllResults: results1,
            promiseAllSettledResults: results2
        };
        
    } catch (error) {
        console.error('❌ Main execution error:', error);
    }
}

/**
 * Save results to a JSON file (Node.js only)
 * @param {Array} results - Array of request results
 * @param {string} filename - Output filename (optional)
 */
async function saveResultsToFile(results, filename) {
    if (typeof window !== 'undefined') {
        console.log('💾 File saving is only available in Node.js environment');
        return;
    }
    
    try {
        const fs = require('fs').promises;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outputFile = filename || `api-results-${timestamp}.json`;
        
        const output = {
            metadata: {
                timestamp: new Date().toISOString(),
                totalRequests: results.length,
                successfulRequests: results.filter(r => r.success).length,
                failedRequests: results.filter(r => !r.success).length,
                successRate: `${(results.filter(r => r.success).length / results.length * 100).toFixed(1)}%`
            },
            results: results
        };
        
        await fs.writeFile(outputFile, JSON.stringify(output, null, 2));
        console.log(`💾 Results saved to: ${outputFile}`);
        
    } catch (error) {
        console.error('❌ Failed to save results:', error.message);
    }
}

/**
 * Display results in prettified format
 * @param {Array} results - Array of request results
 * @param {boolean} showFullData - Whether to show complete response data
 */
function displayPrettifiedResults(results, showFullData = true) {
    console.log('\n📋 PRETTIFIED RESULTS:');
    console.log('='.repeat(80));
    
    results.forEach((result, index) => {
        console.log(`\n🔍 REQUEST ${result.requestId} DETAILS:`);
        console.log('─'.repeat(40));
        
        if (showFullData) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            const summary = {
                requestId: result.requestId,
                success: result.success,
                status: result.status,
                duration: result.duration,
                timestamp: result.timestamp,
                dataPreview: result.data ? 
                    (typeof result.data === 'object' ? 
                        JSON.stringify(result.data).substring(0, 200) + '...' : 
                        result.data.substring(0, 200) + '...') : null,
                error: result.error
            };
            console.log(JSON.stringify(summary, null, 2));
        }
    });
    
    console.log('\n' + '='.repeat(80));
}

/**
 * Quick helper functions for common use cases
 */
async function send1Request(config = {}) { return await sendConcurrentRequests(1, config); }
async function send5Requests(config = {}) { return await sendConcurrentRequests(5, config); }
async function send10Requests(config = {}) { return await sendConcurrentRequests(10, config); }
async function send20Requests(config = {}) { return await sendConcurrentRequests(20, config); }
async function send50Requests(config = {}) { return await sendConcurrentRequests(50, config); }
async function send100Requests(config = {}) { return await sendConcurrentRequests(100, config); }

/**
 * Method-specific helper functions
 */
async function sendGetRequests(numberOfRequests = 5, endpoint, token) {
    const config = { method: 'GET' };
    if (endpoint) config.endpoint = endpoint;
    if (token) config.token = token;
    return await sendConcurrentRequests(numberOfRequests, config);
}

async function sendPostRequests(numberOfRequests = 5, body, endpoint, token) {
    const config = { method: 'POST', body };
    if (endpoint) config.endpoint = endpoint;
    if (token) config.token = token;
    return await sendConcurrentRequests(numberOfRequests, config);
}

async function sendPutRequests(numberOfRequests = 5, body, endpoint, token) {
    const config = { method: 'PUT', body };
    if (endpoint) config.endpoint = endpoint;
    if (token) config.token = token;
    return await sendConcurrentRequests(numberOfRequests, config);
}

async function sendPatchRequests(numberOfRequests = 5, body, endpoint, token) {
    const config = { method: 'PATCH', body };
    if (endpoint) config.endpoint = endpoint;
    if (token) config.token = token;
    return await sendConcurrentRequests(numberOfRequests, config);
}

async function sendDeleteRequests(numberOfRequests = 5, endpoint, token) {
    const config = { method: 'DELETE' };
    if (endpoint) config.endpoint = endpoint;
    if (token) config.token = token;
    return await sendConcurrentRequests(numberOfRequests, config);
}

/**
 * Send requests with different payloads
 * @param {Array} payloads - Array of different payloads/bodies for each request
 * @param {Object} baseConfig - Base configuration (endpoint, token, method)
 * @returns {Promise<Array>} Array of all request results
 */
async function sendRequestsWithDifferentPayloads(payloads, baseConfig = {}) {
    if (!Array.isArray(payloads) || payloads.length === 0) {
        throw new Error('Payloads must be a non-empty array');
    }
    
    const configs = payloads.map(payload => ({
        ...baseConfig,
        body: payload
    }));
    
    return await sendConcurrentRequests(payloads.length, configs);
}

/**
 * Send requests with array of JSON payloads (new format)
 * @param {Array} payloadArray - Array of JSON objects as payloads
 * @param {Object} baseConfig - Base configuration (endpoint, token, method)
 * @returns {Promise<Array>} Array of all request results
 */
async function sendRequestsWithPayloadArray(payloadArray, baseConfig = {}) {
    if (!Array.isArray(payloadArray) || payloadArray.length === 0) {
        throw new Error('Payload array must be a non-empty array');
    }
    
    // Validate that all items are objects
    for (let i = 0; i < payloadArray.length; i++) {
        if (typeof payloadArray[i] !== 'object' || payloadArray[i] === null) {
            throw new Error(`Payload at index ${i} must be a valid JSON object`);
        }
    }
    
    console.log(`📦 Processing ${payloadArray.length} payloads from array format`);
    
    const configs = payloadArray.map(payload => ({
        ...baseConfig,
        body: payload
    }));
    
    return await sendConcurrentRequests(payloadArray.length, configs);
}

/**
 * Generate different payloads with variations
 * @param {Object} basePayload - Base payload structure
 * @param {number} count - Number of variations to generate
 * @param {Function} variationFn - Function to generate variations (optional)
 * @returns {Array} Array of different payloads
 */
function generatePayloadVariations(basePayload, count, variationFn) {
    const payloads = [];
    
    for (let i = 0; i < count; i++) {
        let payload = JSON.parse(JSON.stringify(basePayload)); // Deep clone
        
        if (variationFn) {
            payload = variationFn(payload, i);
        } else {
            // Default variation: add index-based changes
            if (payload.id !== undefined) payload.id = i + 1;
            if (payload.name !== undefined) payload.name = `${payload.name} ${i + 1}`;
            if (payload.email !== undefined) {
                const emailParts = payload.email.split('@');
                payload.email = `${emailParts[0]}${i + 1}@${emailParts[1]}`;
            }
            payload.requestIndex = i + 1;
            payload.timestamp = new Date().toISOString();
        }
        
        payloads.push(payload);
    }
    
    return payloads;
}

/**
 * Send POST requests with auto-generated payload variations
 * @param {number} numberOfRequests - Number of requests to send
 * @param {Object} basePayload - Base payload structure
 * @param {Object} config - Configuration (endpoint, token, etc.)
 * @param {Function} variationFn - Custom variation function (optional)
 * @returns {Promise<Array>} Array of all request results
 */
async function sendPostRequestsWithVariations(numberOfRequests, basePayload, config = {}, variationFn) {
    const payloads = generatePayloadVariations(basePayload, numberOfRequests, variationFn);
    
    return await sendRequestsWithDifferentPayloads(payloads, {
        method: 'POST',
        ...config
    });
}

// Auto-execute if running directly
if (typeof window === 'undefined') {
    // Node.js environment - check for command line arguments
    const args = process.argv.slice(2);
    const numberOfRequests = args[0] ? parseInt(args[0]) : 5;
    
    if (isNaN(numberOfRequests) || numberOfRequests < 1) {
        console.error('❌ Invalid number of requests. Please provide a positive integer.');
        console.log('Usage: node apiRequests.js [numberOfRequests]');
        console.log('Example: node apiRequests.js 10');
        process.exit(1);
    }
    
    main(numberOfRequests).then(async (results) => {
        console.log(`\n🎉 All ${numberOfRequests} requests completed!`);
        
        // Check if user wants to save results to file
        if (args.includes('--save') || args.includes('-s')) {
            const filename = args[args.indexOf('--save') + 1] || args[args.indexOf('-s') + 1];
            if (results && results.promiseAllResults) {
                await saveResultsToFile(results.promiseAllResults, filename);
            }
        }
        
        // Check if user wants prettified output
        if (args.includes('--pretty') || args.includes('-p')) {
            if (results && results.promiseAllResults) {
                displayPrettifiedResults(results.promiseAllResults, true);
            }
        }
        
    }).catch(error => {
        console.error('❌ Execution failed:', error);
    });
} else {
    // Browser environment
    console.log('📝 To run the requests, call: main(numberOfRequests)');
    console.log('Example: main(10) for 10 concurrent requests');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateApiConfig,
        makeApiRequest,
        sendConcurrentRequests,
        sendConcurrentRequestsWithSettled,
        main,
        saveResultsToFile,
        displayPrettifiedResults,
        send1Request,
        send5Requests,
        send10Requests,
        send20Requests,
        send50Requests,
        send100Requests,
        sendGetRequests,
        sendPostRequests,
        sendPutRequests,
        sendPatchRequests,
        sendDeleteRequests,
        sendRequestsWithDifferentPayloads,
        sendRequestsWithPayloadArray,
        generatePayloadVariations,
        sendPostRequestsWithVariations,
        API_CONFIG
    };
}
