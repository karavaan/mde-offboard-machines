export async function makeApiRequest(url, options) {
    try {
        const response = await fetch(url, options);

        if (response.status === 429) {
            const retryAfter = parseInt(response.headers.get('Retry-After'), 10);
            await spinner(`Rate limit exceeded. Retrying after ${retryAfter} seconds.`, () => sleep(retryAfter * 1000))
            return makeApiRequest(url, options);
        }

        return response
    } catch (error) {
        console.error('API request failed:', error.message);
    }
}
