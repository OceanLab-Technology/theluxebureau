# API Documentation

This document provides comprehensive documentation for all API routes in the ecommerce application.

## Authentication

Most API routes require authentication. The API uses Supabase authentication with JWT tokens.

### Authentication Headers
```
Authorization: Bearer <jwt_token>
```

### User Roles
- `user`: Regular authenticated user
- `admin`: Administrator with full access

## Base URL
```
/api
```

## Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "data": any, // Present on successful requests
  "error": string, // Present on failed requests
  "message": string, // Optional success/info message
  "pagination": { // Present on paginated responses
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

## API Routes

### Products

#### `GET /api/products`
List all products with optional filtering and pagination.

**Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `category` (optional): Filter by category
- `name` (optional): Search by name (case-insensitive partial match)
- `slug` (optional): Filter by slug

**Response:** Array of product objects with pagination

#### `POST /api/products` (Admin only)
Create a new product.

**Body:**
```json
{
  "name": "string (required)",
  "description": "string",
  "price": "number (required)",
  "inventory": "number (required)",
  "category": "string",
  "slug": "string",
  "title": "string",
  "image_1": "string",
  "image_2": "string",
  "image_3": "string",
  "image_4": "string",
  "image_5": "string",
  "why_we_chose_it": "string",
  "about_the_maker": "string",
  "particulars": "string"
}
```

#### `GET /api/products/[id]`
Get a specific product by ID.

#### `PUT /api/products/[id]` (Admin only)
Update a specific product.

#### `DELETE /api/products/[id]` (Admin only)
Delete a specific product.

---

### Orders

#### `GET /api/orders` (Authenticated)
List all orders with optional filtering and pagination.

**Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status (`New`, `Active`, `Complete`)
- `customer_email`: Search by customer email
- `payment_status`: Filter by payment status

#### `POST /api/orders`
Create a new order.

**Body:**
```json
{
  "customer_name": "string (required)",
  "customer_email": "string (required)",
  "recipient_name": "string (required)",
  "recipient_address": "string (required)",
  "delivery_date": "string (required)",
  "notes": "string",
  "status": "string",
  "total_amount": "number",
  "stripe_session_id": "string",
  "stripe_payment_intent_id": "string",
  "payment_status": "string",
  "product_details": "object",
  "personalization": "object"
}
```

#### `GET /api/orders/[id]` (Authenticated)
Get a specific order with order items.

#### `PUT /api/orders/[id]` (Authenticated)
Update a specific order.

#### `DELETE /api/orders/[id]` (Admin only)
Delete a specific order.

---

### Cart Items

#### `GET /api/cart` (Authenticated)
Get current user's cart items with product details.

#### `POST /api/cart` (Authenticated)
Add item to cart or update quantity if item exists.

**Body:**
```json
{
  "product_id": "string (required)",
  "quantity": "number (required)",
  "custom_data": "object"
}
```

#### `PUT /api/cart/[id]` (Authenticated)
Update cart item quantity or custom data.

#### `DELETE /api/cart/[id]` (Authenticated)
Remove item from cart.

#### `DELETE /api/cart` (Authenticated)
Clear entire cart.

---

### Customers

#### `GET /api/customers` (Admin only)
List all customers with optional filtering and pagination.

**Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status (`Active`, `Inactive`)
- `email`: Search by email
- `name`: Search by name

#### `POST /api/customers` (Admin only)
Create a new customer.

**Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string",
  "address": "string",
  "status": "string",
  "total_spent": "number",
  "order_count": "number"
}
```

#### `GET /api/customers/[id]` (Admin only)
Get a specific customer.

#### `PUT /api/customers/[id]` (Admin only)
Update a specific customer.

#### `DELETE /api/customers/[id]` (Admin only)
Delete a specific customer.

---

### Form Submissions

#### `GET /api/form-submissions` (Admin only)
List all form submissions with optional filtering and pagination.

**Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status
- `source`: Filter by source
- `order_type`: Filter by order type
- `email`: Search by email

#### `POST /api/form-submissions` (Public)
Create a new form submission.

**Body:**
```json
{
  "name": "string",
  "email": "string",
  "message": "string",
  "phone": "string",
  "company": "string",
  "form_data": "object",
  "status": "string",
  "source": "string",
  "order_type": "string",
  "recipients": "object",
  "event_details": "object",
  "design_options": "object",
  "delivery_date": "string",
  "order_value": "number"
}
```

#### `GET /api/form-submissions/[id]` (Admin only)
Get a specific form submission.

#### `PUT /api/form-submissions/[id]` (Admin only)
Update a specific form submission.

#### `DELETE /api/form-submissions/[id]` (Admin only)
Delete a specific form submission.

---

### Activities

#### `GET /api/activities` (Admin only)
List all activities with optional filtering and pagination.

**Parameters:**
- `page`, `limit`: Pagination
- `type`: Filter by activity type
- `entity_type`: Filter by entity type
- `entity_id`: Filter by entity ID
- `user_id`: Filter by user ID

#### `POST /api/activities` (Authenticated)
Create a new activity log entry.

**Body:**
```json
{
  "type": "string (required)",
  "entity_type": "string (required)",
  "entity_id": "string (required)",
  "title": "string (required)",
  "description": "string",
  "user_id": "string",
  "metadata": "object"
}
```

---

### Team Management

#### `GET /api/team/members` (Admin only)
List all team members.

#### `POST /api/team/members` (Admin only)
Add a new team member.

**Body:**
```json
{
  "user_id": "string (required)",
  "email": "string (required)",
  "role": "string",
  "permissions": "object"
}
```

#### `GET /api/team/invitations` (Admin only)
List all team invitations.

#### `POST /api/team/invitations` (Admin only)
Send a team invitation.

**Body:**
```json
{
  "email": "string (required)",
  "role": "string"
}
```

---

### Site Settings

#### `GET /api/settings`
Get site settings. Can get all settings or specific setting by key.

**Parameters:**
- `key` (optional): Get specific setting by key

#### `POST /api/settings` (Admin only)
Create a new site setting.

**Body:**
```json
{
  "setting_key": "string (required)",
  "setting_value": "string"
}
```

#### `PUT /api/settings` (Admin only)
Update a site setting.

**Parameters:**
- `key` (required): Setting key to update

**Body:**
```json
{
  "setting_value": "string"
}
```

---

### Order Items

#### `GET /api/order-items` (Admin only)
List order items with optional filtering.

**Parameters:**
- `page`, `limit`: Pagination
- `order_id`: Filter by order ID
- `product_id`: Filter by product ID

#### `POST /api/order-items` (Admin only)
Create a new order item.

**Body:**
```json
{
  "order_id": "string (required)",
  "product_id": "string (required)",
  "quantity": "number (required)",
  "unit_price": "number (required)"
}
```

---

### Profiles

#### `GET /api/profiles` (Authenticated)
Get current user's profile.

#### `PUT /api/profiles` (Authenticated)
Update current user's profile.

**Body:**
```json
{
  "email": "string",
  "role": "string" // Only admins can change roles
}
```

## Error Codes

- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `409`: Conflict - Duplicate entry
- `500`: Internal Server Error

## Examples

### Create a Product
```bash
curl -X POST /api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Luxury Watch",
    "description": "A beautiful luxury watch",
    "price": 999.99,
    "inventory": 10,
    "category": "accessories"
  }'
```

### Get Products with Filtering
```bash
curl -X GET "/api/products?category=accessories&page=1&limit=5"
```

### Add Item to Cart
```bash
curl -X POST /api/cart \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "123e4567-e89b-12d3-a456-426614174000",
    "quantity": 2
  }'
```

### Create Order
```bash
curl -X POST /api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "recipient_name": "Jane Doe",
    "recipient_address": "123 Main St, City, State, ZIP",
    "delivery_date": "2024-12-25",
    "total_amount": 999.99
  }'
```
