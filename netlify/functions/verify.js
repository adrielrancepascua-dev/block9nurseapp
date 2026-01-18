// Netlify Function: Access Code Verification
// Checks if code is valid from hardcoded list (placeholder for production)

// Hardcoded list of 5 test codes (expand to 200 for production)
const VALID_CODES = [
  'NP-1234',
  'NP-5678',
  'NP-9012',
  'NP-3456',
  'NP-7890'
];

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { code } = JSON.parse(event.body);

    // Validate code format
    if (!code || !/^NP-\d{4}$/.test(code)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          valid: false, 
          message: 'Invalid code format' 
        })
      };
    }

    // Check if code exists in valid list
    const isValid = VALID_CODES.includes(code.toUpperCase());

    if (isValid) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          valid: true, 
          message: 'Access granted' 
        })
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          valid: false, 
          message: 'Invalid or already-used code' 
        })
      };
    }

  } catch (error) {
    console.error('Verification error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        valid: false, 
        message: 'Server error' 
      })
    };
  }
};
