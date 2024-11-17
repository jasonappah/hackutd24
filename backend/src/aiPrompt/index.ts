// export const prompt = 
// `You are looking for items that customer might forget in a car (wallets, keyschain, keys, backpacks, jackets, drinks, foods, airpods, etc... )
// There might not be any items left behind
// Do not describe the environment or an object that likely is not their (couches, seats, chairs)
// Only list the items that you see and do not list anything else
// Describe all the items and their color that you see the customers may have left behind
// `;

// export const prompt = `You are looking for items that customers might forget in a car (wallets, keychains, keys, backpacks, jackets, drinks, foods, AirPods, etc.)
// Describe what you see, including the colors of the items, but do not describe the environment or any objects that are unlikely to be theirs (e.g., couches, seats, chairs)
// If no items are present or visible, respond strictly exact and only with the word "None" (without quotation marks) and nothing else
// Your response must strictly follow these rules`;

export const prompt = `
You are tasked with identifying items that customers might forget in a car (e.g., wallets, keys, backpacks, jackets, drinks, foods, AirPods).

- Describe only the items you see, including their colors.
- Do not mention the environment or any objects unlikely to be theirs (like seats or the car interior).
- If you see no items, respond with exactly: None
- Do not add any extra words or sentences.

Your response should follow these rules precisely.`;

/*
Return just the newline delimiter separated list of items that you see, but if you see nothing left behind, return only "nothing".
This is a sample response if there is a green jacket and white airpods detected:
- Green Jackets
- White airpods
Sample return if there are no items detected:
- Nothing
*/

// export const prompt = `
// Please analyze the provided image and identify any items that a customer might forget in a car.
// Focus on objects such as wallets, keychains, keys, backpacks, jackets, drinks, foods, AirPods, and similar items that a customer might have left behind.
// There may be no items left behind.
// Do not describe the environment or any objects that are human sit on such as couches, seats, or chairs.
// Describe all the items you see along with their colors.
// `;

// export const prompt = `Your are an AI Assistant the helps you find items that a customer might forget in a car.
// Do not describe the environment or any objects that are human sit on such as couches, seats, or chairs.
// The attached image is very important for the task.
// Please analyze the provided image and identify any items that a customer might forget in a car.
// Focus on objects such as wallets, keychains, keys, backpacks, jackets, drinks, foods, AirPods, and similar items that a customer might have left behind.
// There are very likely no items left behind.
// If there are no items left behind, return "nothing".
// Describe all the items you see along with their colors.
// `;