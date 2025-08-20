/**
 * Examples demonstrating how to use the async API request functions
 */

// Import the functions (uncomment if using in Node.js with modules)
// const { sendMultipleRequests, sendMultipleRequestsWithRetry, sendRequestsInBatches, raceRequests } = require('./asyncApiRequests.js');

// Example 1: Basic multiple requests
async function basicExample() {
    console.log('=== Basic Multiple Requests Example ===');
    
    const urls = [
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://jsonplaceholder.typicode.com/posts/2',
        'https://jsonplaceholder.typicode.com/posts/3',
        'https://jsonplaceholder.typicode.com/users/1'
    ];

    try {
        const results = await sendMultipleRequests(urls);
        
        results.forEach((result, index) => {
            console.log(`Request ${index + 1}:`);
            console.log(`  URL: ${result.url}`);
            console.log(`  Success: ${result.success}`);
            console.log(`  Status: ${result.status}`);
            if (result.success) {
                console.log(`  Data: ${JSON.stringify(result.data).substring(0, 100)}...`);
            } else {
                console.log(`  Error: ${result.error}`);
            }
            console.log('');
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example 2: POST requests with custom options
async function postRequestsExample() {
    console.log('=== POST Requests Example ===');
    
    const requests = [
        {
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'POST',
            body: {
                title: 'Test Post 1',
                body: 'This is a test post',
                userId: 1
            }
        },
        {
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'POST',
            body: {
                title: 'Test Post 2',
                body: 'This is another test post',
                userId: 2
            }
        }
    ];

    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-token-here'
        }
    };

    try {
        const results = await sendMultipleRequests(requests, options);
        console.log('POST Results:', results);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example 3: Requests with retry logic
async function retryExample() {
    console.log('=== Retry Logic Example ===');
    
    const urls = [
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://httpstat.us/500', // This will return 500 error
        'https://httpstat.us/200?sleep=2000', // This will be slow
        'https://invalid-url-that-will-fail.com'
    ];

    const options = {
        maxRetries: 2,
        retryDelay: 1000,
        timeout: 5000
    };

    try {
        const results = await sendMultipleRequestsWithRetry(urls, options);
        
        results.forEach((result, index) => {
            console.log(`Request ${index + 1}:`);
            console.log(`  URL: ${result.url}`);
            console.log(`  Success: ${result.success}`);
            console.log(`  Retry Count: ${result.retryCount}`);
            console.log(`  ${result.success ? 'Data' : 'Error'}: ${result.success ? 'Success' : result.error}`);
            console.log('');
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example 4: Batch processing
async function batchExample() {
    console.log('=== Batch Processing Example ===');
    
    // Create 10 URLs for testing
    const urls = Array.from({ length: 10 }, (_, i) => 
        `https://jsonplaceholder.typicode.com/posts/${i + 1}`
    );

    const options = {
        batchDelay: 500, // 500ms delay between batches
        timeout: 5000
    };

    try {
        const results = await sendRequestsInBatches(urls, 3, options); // Process 3 at a time
        
        console.log(`Processed ${results.length} requests in batches`);
        const successCount = results.filter(r => r.success).length;
        console.log(`Success rate: ${successCount}/${results.length}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example 5: Racing requests (first successful wins)
async function raceExample() {
    console.log('=== Race Requests Example ===');
    
    const mirrorUrls = [
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://httpstat.us/200?sleep=3000', // Slow mirror
        'https://httpstat.us/200?sleep=1000'  // Faster mirror
    ];

    try {
        console.log('Racing requests to find the fastest...');
        const fastestResult = await raceRequests(mirrorUrls);
        
        console.log('Fastest response:');
        console.log(`  URL: ${fastestResult.url}`);
        console.log(`  Index: ${fastestResult.index}`);
        console.log(`  Status: ${fastestResult.status}`);
    } catch (error) {
        console.error('All requests failed:', error.message);
    }
}

// Example 6: Real-world API integration
async function realWorldExample() {
    console.log('=== Real-world API Integration Example ===');
    
    // Example: Fetching user data and their posts concurrently
    const userId = 1;
    const requests = [
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
        `https://jsonplaceholder.typicode.com/albums?userId=${userId}`,
        `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
    ];

    try {
        const [userResult, postsResult, albumsResult, todosResult] = await sendMultipleRequests(requests);
        
        if (userResult.success) {
            console.log('User:', userResult.data.name);
            console.log('Email:', userResult.data.email);
        }
        
        if (postsResult.success) {
            console.log(`Posts: ${postsResult.data.length} posts found`);
        }
        
        if (albumsResult.success) {
            console.log(`Albums: ${albumsResult.data.length} albums found`);
        }
        
        if (todosResult.success) {
            const completedTodos = todosResult.data.filter(todo => todo.completed).length;
            console.log(`Todos: ${completedTodos}/${todosResult.data.length} completed`);
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example 7: Error handling and monitoring
async function errorHandlingExample() {
    console.log('=== Error Handling Example ===');
    
    const mixedUrls = [
        'https://jsonplaceholder.typicode.com/posts/1', // Should work
        'https://httpstat.us/404', // Will return 404
        'https://httpstat.us/500', // Will return 500
        'https://invalid-domain-12345.com', // Will fail completely
    ];

    try {
        const results = await sendMultipleRequests(mixedUrls);
        
        // Analyze results
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        console.log(`\nSummary:`);
        console.log(`Successful: ${successful.length}`);
        console.log(`Failed: ${failed.length}`);
        
        if (failed.length > 0) {
            console.log(`\nFailure details:`);
            failed.forEach(result => {
                console.log(`  ${result.url}: ${result.error}`);
            });
        }
        
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// Run all examples (uncomment to test)
async function runAllExamples() {
    try {
        await basicExample();
        await postRequestsExample();
        await retryExample();
        await batchExample();
        await raceExample();
        await realWorldExample();
        await errorHandlingExample();
    } catch (error) {
        console.error('Example execution error:', error);
    }
}

// Uncomment the line below to run examples
// runAllExamples();

// Export examples for individual testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        basicExample,
        postRequestsExample,
        retryExample,
        batchExample,
        raceExample,
        realWorldExample,
        errorHandlingExample,
        runAllExamples
    };
}
