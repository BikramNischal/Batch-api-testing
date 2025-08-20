# 🚀 Concurrent API Request Tool

A powerful JavaScript tool for sending multiple concurrent API requests with support for GET, POST, PUT, PATCH, and DELETE methods. Features both a browser-based UI and Node.js command-line interface.

## 📋 Table of Contents

- [Features](#-features)
- [File Structure](#-file-structure)
- [Quick Start](#-quick-start)
- [Browser Interface](#-browser-interface)
- [Node.js Usage](#-nodejs-usage)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Configuration Options](#-configuration-options)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

- 🔄 **Concurrent Requests**: Send multiple async requests simultaneously
- 🌐 **Multiple HTTP Methods**: Support for GET, POST, PUT, PATCH, DELETE
- 🔐 **Flexible Authentication**: Optional Bearer token support
- 📊 **Multiple Payload Modes**: Single, different payloads, auto-variations, array format
- 🎨 **Interactive UI**: Beautiful web interface with real-time monitoring
- 📁 **Export Results**: Download JSON results or copy to clipboard
- ⚡ **No Timeouts**: Requests run without artificial time limits
- 🔧 **Dynamic Configuration**: Change endpoints, tokens, and methods on the fly

## 📁 File Structure

```
├── apiRequests.js              # Core API utility functions
├── runRequests.html           # Browser-based UI interface
├── examples.json              # Sample payload array
├── dynamicExample.js          # Example: Dynamic request count
├── jsonExample.js             # Example: Prettified JSON output
├── postRequestExample.js      # Example: POST requests
├── differentPayloadsExample.js # Example: Multiple payloads
├── publicEndpointExample.js   # Example: Public API (no token)
├── arrayPayloadExample.js     # Example: Array payload format
└── README.md                  # This documentation
```

## 🚀 Quick Start

### Browser Interface (Recommended)

1. **Open the interface**: Double-click `runRequests.html` in your browser
2. **Configure your request**:
   - Set the number of requests (1-1000)
   - Choose HTTP method (GET, POST, PUT, PATCH, DELETE)
   - Enter your API endpoint URL
   - Add Bearer token (optional)
3. **Choose payload mode** (for POST/PUT/PATCH):
   - **Single Payload**: Same data for all requests
   - **Different Payloads**: Line-by-line JSON objects
   - **Auto Variations**: Generate variations from base payload
   - **Array of Payloads**: Standard JSON array format
4. **Click "Run Concurrent Requests"**
5. **View results** in Console Output or JSON Results tab

### Node.js Usage

```javascript
const { sendConcurrentRequests } = require('./apiRequests');

// Simple GET request
sendConcurrentRequests(5, {
    endpoint: 'https://api.example.com/data',
    method: 'GET',
    token: 'your-bearer-token'
});
```

## 🌐 Browser Interface

### Main Controls

| Control | Description |
|---------|-------------|
| **Number of Requests** | Set how many concurrent requests to send (1-1000) |
| **HTTP Method** | Choose GET, POST, PUT, PATCH, or DELETE |
| **API Endpoint** | Full URL of your API endpoint |
| **Bearer Token** | Optional authentication token |

### Payload Modes

#### 1. Single Payload
Use the same JSON payload for all requests.

```json
{
  "message": "Hello World",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### 2. Different Payloads
Enter one JSON object per line for unique payloads.

```
{"id": 1, "name": "Alice"}
{"id": 2, "name": "Bob"}
{"id": 3, "name": "Charlie"}
```

#### 3. Auto Variations
Generate automatic variations from a base payload.

**Base Payload:**
```json
{
  "user": "test",
  "batch": 1
}
```

**Generates:**
```json
{"user": "test", "batch": 1}
{"user": "test", "batch": 2}
{"user": "test", "batch": 3}
```

#### 4. Array of Payloads (Recommended)
Standard JSON array format - easiest to work with.

```json
[
  {"id": 1, "action": "create"},
  {"id": 2, "action": "update"},
  {"id": 3, "action": "delete"}
]
```

### Output Features

- **Console Output**: Real-time request logs and responses
- **JSON Results**: Prettified JSON view of all results
- **Download JSON**: Save results as a `.json` file
- **Copy JSON**: Copy results to clipboard

## 🖥️ Node.js Usage

### Basic Usage

```javascript
const api = require('./apiRequests');

// Send 10 GET requests
await api.sendConcurrentRequests(10, {
    endpoint: 'https://api.example.com/users',
    method: 'GET',
    token: 'your-bearer-token-here'
});
```

### POST Requests with Body

```javascript
// Single payload for all requests
await api.sendConcurrentRequests(5, {
    endpoint: 'https://api.example.com/data',
    method: 'POST',
    token: 'your-token',
    body: {
        message: 'Hello API',
        timestamp: new Date().toISOString()
    }
});
```

### Different Payloads

```javascript
// Array of different configurations
const configs = [
    { body: { id: 1, name: 'Alice' } },
    { body: { id: 2, name: 'Bob' } },
    { body: { id: 3, name: 'Charlie' } }
];

await api.sendConcurrentRequests(3, {
    endpoint: 'https://api.example.com/users',
    method: 'POST',
    token: 'your-token'
}, configs);
```

### Array Payload Format

```javascript
const payloads = [
    { user: 'alice', action: 'login' },
    { user: 'bob', action: 'logout' },
    { user: 'charlie', action: 'update' }
];

await api.sendRequestsWithPayloadArray(payloads, {
    endpoint: 'https://api.example.com/actions',
    method: 'POST',
    token: 'your-token'
});
```

### Public APIs (No Authentication)

```javascript
// No token required
await api.sendConcurrentRequests(5, {
    endpoint: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET'
    // token field omitted
});
```

## 📚 API Reference

### Core Functions

#### `sendConcurrentRequests(numberOfRequests, baseConfig, customConfigs)`

Send multiple concurrent requests.

**Parameters:**
- `numberOfRequests` (number): Number of requests to send
- `baseConfig` (object): Base configuration for all requests
- `customConfigs` (array, optional): Array of custom configs for each request

**Returns:** Promise resolving to array of results

#### `sendRequestsWithPayloadArray(payloadArray, baseConfig)`

Send requests using a JSON array of payloads.

**Parameters:**
- `payloadArray` (array): Array of payload objects
- `baseConfig` (object): Base configuration (endpoint, method, token)

**Returns:** Promise resolving to array of results

#### `updateApiConfig(config)`

Update global API configuration.

**Parameters:**
- `config` (object): Configuration object to merge

### Configuration Object

```javascript
{
    endpoint: 'https://api.example.com/endpoint',  // Required
    method: 'POST',                               // GET, POST, PUT, PATCH, DELETE
    token: 'bearer-token-here',                   // Optional
    body: { key: 'value' }                        // For POST/PUT/PATCH requests
}
```

## 💡 Examples

### Example 1: Load Testing

```javascript
// Test API performance with 50 concurrent requests
const results = await sendConcurrentRequests(50, {
    endpoint: 'https://api.example.com/health',
    method: 'GET'
});

console.log(`Success rate: ${results.filter(r => r.success).length}/50`);
```

### Example 2: Batch User Creation

```javascript
const users = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Charlie', email: 'charlie@example.com' }
];

await sendRequestsWithPayloadArray(users, {
    endpoint: 'https://api.example.com/users',
    method: 'POST',
    token: 'admin-token'
});
```

### Example 3: Data Processing Pipeline

```javascript
// Process different data types concurrently
const configs = [
    { body: { type: 'ExecutiveSummary', batchnumber: '1' } },
    { body: { type: 'FinancialReport', batchnumber: '2' } },
    { body: { type: 'MarketAnalysis', batchnumber: '3' } }
];

await sendConcurrentRequests(3, {
    endpoint: 'https://api.example.com/process',
    method: 'POST',
    token: 'process-token'
}, configs);
```

## ⚙️ Configuration Options

### Global Configuration

Set default values for all requests:

```javascript
updateApiConfig({
    endpoint: 'https://api.example.com',
    token: 'default-token',
    method: 'POST'
});
```

### Per-Request Configuration

Override global settings for specific requests:

```javascript
const customConfigs = [
    { endpoint: 'https://api-1.example.com', token: 'token-1' },
    { endpoint: 'https://api-2.example.com', token: 'token-2' }
];
```

### Request Headers

Headers are automatically set based on configuration:

- `Authorization: Bearer {token}` (if token provided)
- `Content-Type: application/json` (for POST/PUT/PATCH with body)

## 🔧 Troubleshooting

### Common Issues

**1. CORS Errors (Browser)**
```
Solution: Use Node.js for cross-origin requests, or ensure your API supports CORS
```

**2. Invalid JSON in Payload**
```
Error: Unexpected token in JSON
Solution: Use the "Format JSON" buttons to validate your payload syntax
```

**3. 401 Unauthorized**
```
Solution: Check if your Bearer token is valid and not expired
```

**4. Network Timeout**
```
Solution: Check your internet connection and API endpoint availability
```

### Debug Tips

1. **Check Console Output**: Always monitor the console for detailed error messages
2. **Test Single Request First**: Use 1 request to debug configuration issues
3. **Validate JSON**: Use online JSON validators for complex payloads
4. **Check Network Tab**: In browser dev tools, inspect actual HTTP requests

### Performance Considerations

- **Concurrent Limit**: Most browsers limit ~6 concurrent connections per domain
- **API Rate Limits**: Check your API's rate limiting policies
- **Memory Usage**: Large numbers of requests (>100) may consume significant memory

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the example files for working implementations
3. Ensure your API endpoint and authentication are correct
4. Test with a simple GET request first

## 🎯 Best Practices

1. **Start Small**: Test with 1-5 requests before scaling up
2. **Use Array Format**: The "Array of Payloads" mode is most reliable
3. **Handle Errors**: Always check the `success` field in results
4. **Monitor Performance**: Watch for API rate limits and response times
5. **Validate Payloads**: Use the formatting tools to ensure valid JSON

---

**Happy API Testing! 🚀**

*This tool is designed for development and testing purposes. Always respect API rate limits and terms of service.*