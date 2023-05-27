const ResponseMessage = {
    pass: {
        create: 'Created successfully',
        update: 'Updated successfully',
        delete: 'Deleted successfully',
        read: 'Fetched successfully',
        register: 'Account created successfully. Kindly check email for OTP',
        resend_otp: 'OTP has been resent. Kindly check email for OTP',
        verify: 'Verification successful',
        login: 'LoggedIn successfully'
    },
    fail: {
        bad_request: 'Bad Request',
        unauthorized: 'Unauthorized',
        not_found: 'Not Found',
        server: 'Internal Server Error',
        forbidden: 'Forbidden',
        account_conflict: 'Account Already Exist',
        incorrect_otp: "OTP is incorrect",
        expired_token: "OTP Expired",
        no_user: "User does not exist",
        login: "Username or Password don't match",
        verify: "Account Not Verified"

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