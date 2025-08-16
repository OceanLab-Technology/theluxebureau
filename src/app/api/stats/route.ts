import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError } from '../utils';

function getDateRange(monthOffset = 0) {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const start = new Date(target.getFullYear(), target.getMonth(), 1);
    const end = new Date(target.getFullYear(), target.getMonth() + 1, 0, 23, 59, 59);
    return { start: start.toISOString(), end: end.toISOString() };
}

function calcChange(current: number, previous: number): number {
    if (previous === 0 && current === 0) return 0;
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { start: startThis, end: endThis } = getDateRange(0);
        const { start: startLast, end: endLast } = getDateRange(-1);

        const [
            { data: ordersThis },
            { data: ordersLast },
            { data: customersThis },
            { data: customersLast },
        ] = await Promise.all([
            supabase.from('orders').select('*').gte('created_at', startThis).lte('created_at', endThis).eq('payment_status', 'completed'),
            supabase.from('orders').select('*').gte('created_at', startLast).lte('created_at', endLast).eq('payment_status', 'completed'),
            supabase.from('users').select('*').gte('created_at', startThis).lte('created_at', endThis),
            supabase.from('users').select('*').gte('created_at', startLast).lte('created_at', endLast),
        ]);

        const revenueThis = (ordersThis ?? []).reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const revenueLast = (ordersLast ?? []).reduce((sum, o) => sum + (o.total_amount || 0), 0);

        const ordersThisCount = (ordersThis ?? []).length;
        const ordersLastCount = (ordersLast ?? []).length;

        const customersThisCount = (customersThis ?? []).length;
        const customersLastCount = (customersLast ?? []).length;

        const growthRate = calcChange(ordersThisCount, ordersLastCount);

        return NextResponse.json({
            success: true,
            data: {
                revenue: {
                    value: revenueThis,
                    change: calcChange(revenueThis, revenueLast),
                },
                orders: {
                    value: ordersThisCount,
                    change: calcChange(ordersThisCount, ordersLastCount),
                },
                customers: {
                    value: customersThisCount,
                    change: calcChange(customersThisCount, customersLastCount),
                },
                growthRate: {
                    value: growthRate,
                    change: calcChange(growthRate, 0), // assume previous growth was 0
                },
            },
        });
    } catch (error) {
        return handleError(error);
    }
}
