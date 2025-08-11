import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/auth/login", 
    "/auth/sign-up", 
    "/auth/forgot-password", 
    "/auth/sign-up-success", 
    "/auth/confirm",
    "/auth/update-password",
    "/auth/error",
    "/api/stripe/webhook",
    "/products",
    "/",
    // Allow accessing individual product pages
    "/products/"
  ];
  
  // Define protected routes that require authentication
  const protectedRoutes = ["/admin", "/account"];
  
  // Routes that show dialog before redirecting (handled by client-side)
  const dialogRoutes = ["/personalize", "/personalise", "/checkout"];
  
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    (route.endsWith("/") && request.nextUrl.pathname.startsWith(route))
  );
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  const isDialogRoute = dialogRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // If user is not authenticated and trying to access a protected route (but not dialog routes)
  if (!user && isProtectedRoute && !isDialogRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // For dialog routes, let the client-side components handle the auth flow
  // We don't redirect here to allow the modal to show first

  // If user is authenticated and trying to access auth pages, redirect to products
  const authPages = ["/auth/login", "/auth/sign-up"];
  if (user && authPages.includes(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/products";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
