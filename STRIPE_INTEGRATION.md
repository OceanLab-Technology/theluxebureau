# Stripe Integration Guide

This project includes two Stripe payment integration methods using `@stripe/react-stripe-js` and `@stripe/stripe-js`.

## Overview

### Method 1: Stripe Elements (Recommended)
- **Components**: `StripeCheckoutForm`, `StripeProvider`
- **Flow**: Embedded payment form → PaymentIntent → Webhook processing
- **Benefits**: Better UX, customizable, keeps users on your site

### Method 2: Stripe Checkout (Legacy)
- **Components**: `CustomCheckoutForm`
- **Flow**: Redirect to Stripe → Checkout Session → Webhook processing
- **Benefits**: Quick implementation, handled by Stripe

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Stripe keys:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Webhook endpoint secret

### 2. Webhook Configuration

1. Go to your Stripe Dashboard → Webhooks
2. Create a new webhook endpoint: `https://yoursite.com/api/stripe/webhook`
3. Select these events:
   - `payment_intent.succeeded` (for Stripe Elements)
   - `payment_intent.payment_failed` (for failed payments)
   - `checkout.session.completed` (for Stripe Checkout)
   - `checkout.session.async_payment_succeeded` (for async payments)

### 3. Database Setup (Optional)

If using the webhook to store orders, ensure your database has these tables:

```sql
-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  stripe_payment_intent_id VARCHAR,
  amount DECIMAL(10,2),
  currency VARCHAR(3),
  status VARCHAR(20),
  customer_email VARCHAR,
  customer_first_name VARCHAR,
  customer_last_name VARCHAR,
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id VARCHAR,
  product_name VARCHAR,
  price DECIMAL(10,2),
  quantity INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Component Usage

### Using the Container Component

The easiest way to implement checkout:

```tsx
import { CheckoutContainer } from "@/components/CheckoutComponents/CheckoutContainer";

export default function CheckoutPage() {
  const items = [
    {
      id: "product-1",
      name: "Sample Product",
      price: 29.99,
      quantity: 1,
      image: "/product.jpg"
    }
  ];

  return (
    <CheckoutContainer 
      items={items}
      total={29.99}
      useStripeElements={true} // true for Elements, false for Checkout
    />
  );
}
```

### Using Stripe Elements Directly

For more control:

```tsx
import { StripeProvider } from "@/components/CheckoutComponents/StripeProvider";
import { StripeCheckoutForm } from "@/components/CheckoutComponents/StripeCheckoutForm";

export default function CustomCheckout() {
  const [clientSecret, setClientSecret] = useState("");

  // Create PaymentIntent on component mount
  useEffect(() => {
    fetch("/api/stripe/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, customerInfo, total })
    })
    .then(res => res.json())
    .then(data => setClientSecret(data.clientSecret));
  }, []);

  if (!clientSecret) return <div>Loading...</div>;

  return (
    <StripeProvider clientSecret={clientSecret}>
      <StripeCheckoutForm 
        items={items}
        total={total}
        clientSecret={clientSecret}
      />
    </StripeProvider>
  );
}
```

## API Endpoints

### `/api/stripe/payment-intent` (POST)
Creates a PaymentIntent for Stripe Elements.

**Request body:**
```json
{
  "items": [
    {
      "id": "product-1",
      "name": "Product Name",
      "price": 29.99,
      "quantity": 1
    }
  ],
  "customerInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "United States"
  },
  "total": 29.99
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### `/api/stripe/checkout` (POST)
Creates a Checkout Session for redirect flow.

### `/api/stripe/webhook` (POST)
Handles Stripe webhooks for both payment methods.

## Testing

Use Stripe's test card numbers:

- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **3D Secure**: `4000000000003220`

## Demo

Visit `/checkout/demo` to see both payment methods in action and compare their implementations.

## Styling

The components use Tailwind CSS and are styled to match your existing design system. Key styling features:

- Stone color palette for neutral tones
- Yellow accent color for primary actions
- Century font family for typography
- Responsive design for mobile/desktop

## Security Notes

1. Never expose your secret key in client-side code
2. Always validate webhooks using the signature
3. Store sensitive data server-side only
4. Use HTTPS in production
5. Validate all inputs before processing

## Troubleshooting

### Common Issues

1. **"Stripe has not loaded"**: Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
2. **Webhook signature validation fails**: Check `STRIPE_WEBHOOK_SECRET` matches your endpoint
3. **PaymentIntent creation fails**: Verify `STRIPE_SECRET_KEY` and user authentication
4. **Redirect URLs not working**: Check `NEXT_PUBLIC_BASE_URL` is correct

### Debug Mode

Enable Stripe debug mode in development:

```javascript
// In your Stripe configuration
const stripe = await loadStripe(publishableKey, {
  stripeAccount: 'acct_xxx', // optional
  locale: 'en'
});
```

## Production Deployment

1. Replace test keys with live keys
2. Update webhook endpoint URL
3. Test with real payment methods
4. Monitor webhook delivery in Stripe Dashboard
5. Set up proper error logging and monitoring
