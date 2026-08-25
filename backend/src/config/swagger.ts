import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "YOLO Backend API",
    version: "1.0.0",
    description: "API Documentation for the YOLO social platform backend",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "jwt",
        description: "JWT access token inside the 'jwt' cookie",
      },
    },
    schemas: {
      UserProfile: {
        type: "object",
        properties: {
          _id: { type: "string" },
          username: { type: "string" },
          fullname: { type: "string" },
          profileImg: { type: "string" },
          coverImg: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UserAuth: {
        type: "object",
        properties: {
          _id: { type: "string" },
          email: { type: "string" },
          userID: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Post: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userID: { type: "string" },
          text: { type: "string" },
          img: { type: "string" },
          likes: {
            type: "array",
            items: { type: "string" }
          },
          comments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                userID: { type: "string" },
                text: { type: "string" }
              }
            }
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        }
      },
      Message: {
        type: "object",
        properties: {
          _id: { type: "string" },
          senderID: { type: "string" },
          conversationID: { type: "string" },
          text: { type: "string" },
          img: { type: "string" },
          isSeen: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        }
      },
      Conversation: {
        type: "object",
        properties: {
          _id: { type: "string" },
          participants: {
            type: "array",
            items: { type: "string" }
          },
          lastMessage: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        }
      }
    },
  },
  paths: {
    "/api/auth/signup": {
      post: {
        summary: "Create a new user account",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "fullname", "username"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                  fullname: { type: "string" },
                  username: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Successfully created account",
          },
          400: {
            description: "Invalid fields or existing email",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Log in to an existing account",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
          },
          400: {
            description: "Invalid credentials",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        summary: "Log out of the current session",
        tags: ["Auth"],
        responses: {
          200: {
            description: "Logout successful",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        summary: "Get current authenticated user info",
        tags: ["Auth"],
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "Current user profile data",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/user": {
      get: {
        summary: "Get all user profiles",
        tags: ["User"],
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "List of all user profiles",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/UserProfile" },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/user/profile/{userID}": {
      get: {
        summary: "Get user profile by ID",
        tags: ["User"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userID",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User ID of the profile to fetch",
          },
        ],
        responses: {
          200: {
            description: "User profile data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserProfile" },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/user/update": {
      put: {
        summary: "Update user profile info",
        tags: ["User"],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fullname: { type: "string" },
                  username: { type: "string" },
                  profileImg: { type: "string" },
                  coverImg: { type: "string" },
                  newPassword: { type: "string" },
                  currentPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profile updated successfully",
          },
          400: {
            description: "Invalid input or verification failed",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/friend/{userID}/all": {
      get: {
        summary: "Get all friends of a user",
        tags: ["Friend"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userID",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "User ID",
          },
        ],
        responses: {
          200: {
            description: "List of friends",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/friend/request": {
      get: {
        summary: "Get all incoming friend requests",
        tags: ["Friend"],
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "List of friend requests",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/friend/recommend": {
      get: {
        summary: "Get recommended users to add as friends",
        tags: ["Friend"],
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "List of recommended users",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/friend/request/{userID}": {
      post: {
        summary: "Send a friend request to a user",
        tags: ["Friend"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userID",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Friend request sent",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/friend/request/{requestID}/accept": {
      put: {
        summary: "Accept friend request by Request ID",
        tags: ["Friend"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "requestID",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Friend request accepted",
          },
        },
      },
    },
    "/api/friend/request/user/{userID}/accept": {
      put: {
        summary: "Accept friend request by Sender User ID",
        tags: ["Friend"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userID",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Friend request accepted",
          },
        },
      },
    },
    "/api/friend/request/{requestID}/decline": {
      put: {
        summary: "Decline friend request by Request ID",
        tags: ["Friend"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "requestID",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Friend request declined",
          },
        },
      },
    },
    "/api/friend/request/user/{userID}/decline": {
      put: {
        summary: "Decline friend request by Sender User ID",
        tags: ["Friend"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userID",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Friend request declined",
          },
        },
      },
    },
    "/api/friend/request/delete": {
      delete: {
        summary: "Delete all friend requests (Testing only)",
        tags: ["Friend"],
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "All friend requests deleted",
          },
        },
      },
    },
    "/api/post": {
      get: {
        summary: "Get all posts",
        tags: ["Post"],
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "List of posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Post" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new post",
        tags: ["Post"],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  img: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Post created successfully",
          },
        },
      },
    },
    "/api/post/{userID}": {
      get: {
        summary: "Get posts created by a specific user",
        tags: ["Post"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "userID",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "List of user's posts",
          },
        },
      },
    },
    "/api/conversation": {
      get: {
        summary: "Get all conversations of the current user",
        tags: ["Conversation"],
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "List of conversations",
          },
        },
      },
      post: {
        summary: "Create a new conversation",
        tags: ["Conversation"],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["participants"],
                properties: {
                  participants: {
                    type: "array",
                    items: { type: "string" }
                  },
                  isGroup: { type: "boolean" },
                  conversationName: { type: "string" }
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Conversation created successfully",
          },
        },
      },
      delete: {
        summary: "Delete all conversations of the current user (Testing only)",
        tags: ["Conversation"],
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "All conversations deleted",
          },
        },
      },
    },
    "/api/conversation/{conversationID}": {
      get: {
        summary: "Get conversation data by conversation ID",
        tags: ["Conversation"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "conversationID",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Conversation details",
          },
        },
      },
    },
    "/api/conversation/{participantID}/user": {
      get: {
        summary: "Get conversation by participant user ID",
        tags: ["Conversation"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "participantID",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Conversation details",
          },
        },
      },
    },
    "/api/conversation/seen/{conversationID}": {
      patch: {
        summary: "Mark all messages in a conversation as seen",
        tags: ["Conversation"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "conversationID",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Messages marked as seen",
          },
        },
      },
    },
    "/api/conversation/{conversationID}/invite": {
      post: {
        summary: "Invite users to a conversation",
        tags: ["Conversation"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "conversationID",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userIDs"],
                properties: {
                  userIDs: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Users added to conversation",
          },
        },
      },
    },
    "/api/conversation/{conversationID}/leave": {
      delete: {
        summary: "Leave a conversation",
        tags: ["Conversation"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "conversationID",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Left conversation successfully",
          },
        },
      },
    },
    "/api/message/{conversationID}": {
      get: {
        summary: "Get all messages from a conversation",
        tags: ["Message"],
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "conversationID",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "List of messages",
          },
        },
      },
    },
    "/api/message/send": {
      post: {
        summary: "Send a message (General endpoint)",
        tags: ["Message"],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["conversationID", "text"],
                properties: {
                  conversationID: { type: "string" },
                  text: { type: "string" },
                  img: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Message sent successfully",
          },
        },
      },
    },
    "/api/message/direct": {
      post: {
        summary: "Send a direct message to a user",
        tags: ["Message"],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["receiverID", "text"],
                properties: {
                  receiverID: { type: "string" },
                  text: { type: "string" },
                  img: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Message sent successfully",
          },
        },
      },
    },
    "/api/message/group": {
      post: {
        summary: "Send a group message",
        tags: ["Message"],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["conversationID", "text"],
                properties: {
                  conversationID: { type: "string" },
                  text: { type: "string" },
                  img: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Message sent successfully",
          },
        },
      },
    },
    "/api/message": {
      delete: {
        summary: "Delete all messages (Testing only)",
        tags: ["Message"],
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "All messages deleted successfully",
          },
        },
      },
    },
    "/api/cloudinary/sign-delivery": {
      get: {
        summary: "Generate signature for Cloudinary upload",
        tags: ["Cloudinary"],
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "Cloudinary credentials and signature",
          },
        },
      },
    },
  },
};

export function setupSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
