export async function fetchCategory() {
    const response = fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    )

    if(!response.ok) {
        throw new Error('Failed to fetch categories')
    }

    const data = await response.json()
    return data
}

