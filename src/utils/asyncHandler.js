// A utility function to handle asynchronous errors and log them
export async function asyncHandler(fn) {
  try {
    return await fn()
  } catch (error) {
    console.error('An error occurred:', error)
    throw error
  }
}