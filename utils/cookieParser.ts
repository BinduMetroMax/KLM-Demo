export function parseCookie(cookieString: string | undefined): Record<string, string> {
    const cookies: Record<string, string> = {};

    if (cookieString) {
        const cookiePairs = cookieString.split(';');

        cookiePairs.forEach((cookiePair) => {
            const [key, value] = cookiePair.split('=');
            if (key && value) {
                cookies[key.trim()] = value.trim();
            }
        });
    }

    return cookies;
}


interface TokenObject {
    [key: string]: string | undefined;
}

export function parseTokens(tokens: string[] | undefined): TokenObject {
    const tokenObject: TokenObject = {};

    tokens?.forEach(token => {
        const parts = token.split('; ');

        parts.forEach(part => {
            const [key, value] = part.split('=');
            tokenObject[key] = value;
        });
    });

    return tokenObject;
}


// const cookieString = "access_token=5d9e23b9-0238-4b8a-a105-b6e50d51e370;refresh_token=5d9e23b9-0238-4b8a-a105-b6e50d51e370";
// const cookies = parseCookie(cookieString);

// console.log(cookies.access_token); // Output: 5d9e23b9-0238-4b8a-a105-b6e50d51e370
// console.log(cookies.refresh_token); // Output: 5d9e23b9-0238-4b8a-a105-b6e50d51e370
