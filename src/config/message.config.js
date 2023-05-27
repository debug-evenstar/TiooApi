const ResponseMessage = {
    pass: {
        create: 'Resource created successfully',
        update: 'Resource updated successfully',
        delete: 'Resource deleted successfully',
        read: 'Resource fetched successfully',
        register: 'Account created successfully. Kindly check email for OTP'
    },
    fail: {
        bad_request: 'Bad Request',
        unauthorized: 'Unauthorized',
        not_found: 'Not Found',
        server: 'Internal Server Error',
        forbidden: 'Forbidden',
        account_conflict: 'Account Already Exist'
    },

    code: {
        create: 201,
        success: 200,
        no_content: 204,
        bad_request: 400,
        unauthorized: 401,
        forbidden: 403,
        not_found: 404,
        conflict: 409,
        server_error: 500,

    }

}

module.exports = ResponseMessage;