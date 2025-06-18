import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Chat Application API',
            version: '1.0.0',
            description: 'A real-time chat application API with authentication and messaging features',
            contact: {
                name: 'API Support',
                email: 'support@ichat.com'
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://your-vercel-app.vercel.app'
                    : 'http://localhost:3000',
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'User ID'
                        },
                        username: {
                            type: 'string',
                            description: 'Username'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email'
                        },
                        isConfirmed: {
                            type: 'boolean',
                            description: 'Email confirmation status'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Message: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Message ID'
                        },
                        sender: {
                            type: 'string',
                            description: 'Sender user ID'
                        },
                        receiver: {
                            type: 'string',
                            description: 'Receiver user ID'
                        },
                        content: {
                            type: 'string',
                            description: 'Message content'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/**/*.js', './src/app.controller.js'] // Path to the API docs
};

const specs = swaggerJsdoc(options);

export default specs; 