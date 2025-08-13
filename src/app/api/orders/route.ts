import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError, parseQueryParams, buildFilters } from '../utils';
import { Order, ApiResponse } from '../types';

// List all orders with optional filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parseQueryParams(searchParams);

    const allowedFilters = ['status', 'customer_email', 'payment_status'];
    const filters = buildFilters(searchParams, allowedFilters);

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            image_1,
            price,
            description,
            category
          )
        )
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'customer_email') {
        query = query.ilike('customer_email', `%${value}%`);
      } else if (key === 'status') {
        query = query.ilike('status', value); // match case-insensitive
      } else {
        query = query.eq(key, value);
      }
    });

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    return handleError(error);
  }
}

//  Create a new order
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate required fields
    if (!body.customer_name || !body.customer_email || !body.recipient_name || !body.recipient_address || !body.delivery_date) {
      return NextResponse.json(
        { success: false, error: 'Customer name, email, recipient name, address, and delivery date are required' },
        { status: 400 }
      );
    }

    const orderData: Partial<Order> = {
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      recipient_name: body.recipient_name,
      recipient_address: body.recipient_address,
      delivery_date: body.delivery_date,
      notes: body.notes,
      status: body.status || 'New',
      total_amount: parseFloat(body.total_amount || '0'),
      stripe_session_id: body.stripe_session_id,
      stripe_payment_intent_id: body.stripe_payment_intent_id,
      payment_status: body.payment_status || 'pending',
      product_details: body.product_details,
      personalization: body.personalization,
    };

    // const { data, error } = await supabase
    //   .from('orders')
    //   .insert(orderData)
    //   .select()
    //   .single();

    // if (error) throw error;
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) throw orderError;


    // add to activity
    const activityData = {
      type: 'order_created', // activity type
      entity_type: 'order',
      entity_id: order.id, // use order id from the previous insert
      title: `Order created for ${order.customer_name}`,
      description: `Order #${order.id} created with total amount $${order.total_amount}`,
      metadata: {
        customer_email: order.customer_email,
        delivery_date: order.delivery_date,
        status: order.status,
      },
      user_id: body.user_id || null, // optional if logged in
    };

    const { error: activityError } = await supabase
      .from('activities')
      .insert(activityData);

    if (activityError) throw activityError;

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    return handleError(error);
  }
}
