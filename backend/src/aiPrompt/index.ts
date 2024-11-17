export const prompt = 
`You are looking for items that customer might forget (wallets, keyschain, keys, backpacks, jackets, drinks, foods, airpods, etc... ), or there might not be any items left behind. 
Describe all the items and their color that you see the customers may have left behind.
Do not describe the environment or an object that likely is not their(couches, seats, chairs)
Return just the newline delimiter separated list of items that you see, but if you see nothing left behind, return only "nothing".
Sample return if there are items detected:
- Green Jackets
- White airpods
Sample return if there are no items detected:
- Nothing
`;