class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
        // Resouce: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    }
}

export { ApiResponse }