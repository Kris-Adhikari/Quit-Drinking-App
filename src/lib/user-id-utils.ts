function simpleHash(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export function clerkIdToUuid(clerkId: string): string {
  if (!clerkId) {
    throw new Error('Clerk ID is required');
  }

  // Create a consistent hash from the Clerk ID
  const hash1 = simpleHash(clerkId);
  const hash2 = simpleHash(clerkId + 'salt1');
  const hash3 = simpleHash(clerkId + 'salt2');
  const hash4 = simpleHash(clerkId + 'salt3');
  
  // Pad to ensure we have enough hex digits
  const fullHash = (hash1 + hash2 + hash3 + hash4).padEnd(32, '0').slice(0, 32);
  
  // Format as UUID v4
  return [
    fullHash.slice(0, 8),
    fullHash.slice(8, 12),
    '4' + fullHash.slice(13, 16), // Version 4
    '8' + fullHash.slice(17, 20), // Variant bits (8 = 10xx in binary)
    fullHash.slice(20, 32)
  ].join('-');
}

export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function normalizeUserId(userId: string): string {
  if (isValidUuid(userId)) {
    return userId;
  }
  
  if (userId.startsWith('user_')) {
    return clerkIdToUuid(userId);
  }
  
  throw new Error(`Invalid user ID format: ${userId}`);
}