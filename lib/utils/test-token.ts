/**
 * Utility to test token validity against the API
 */

export async function testTokenValidity(token: string): Promise<{
  isValid: boolean;
  error?: string;
  response?: any;
}> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        isValid: true,
        response: data,
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        isValid: false,
        error: `${response.status}: ${errorData.message || response.statusText}`,
        response: errorData,
      };
    }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Test token in browser console
 * Usage: window.testToken('your-token-here')
 */
if (typeof window !== "undefined") {
  (window as any).testToken = async (token: string) => {
    console.log("Testing token:", token);
    const result = await testTokenValidity(token);
    console.log("Token test result:", result);
    return result;
  };
}
