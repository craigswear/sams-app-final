import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 1. Create a JSON response object.
    const response = NextResponse.json(
      { message: 'Logout successful.' },
      { status: 200 }
    );

    // 2. Set the cookie-clearing instruction on that response.
    // This tells the browser to delete the cookie.
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      path: '/',
      expires: new Date(0), // Set expiry date to the past
    });

    // 3. Return the response to the browser.
    return response;
    
  } catch (error) {
    console.error('Logout error:', error); 
    return NextResponse.json({ message: 'Error logging out.' }, { status: 500 });
  }
}