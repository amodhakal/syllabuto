import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    
    // Get user from the users table using the subject as the ID
    const userId = identity.subject as Id<"users">;
    let userFromDb = null;
    
    try {
      // Use db.get() to directly fetch the user by ID
      userFromDb = await ctx.db.get(userId);
    } catch (e) {
      console.log("Could not get user from DB:", e);
    }
    
    // Log for debugging - check what we actually have
    console.log("=== USER DEBUG ===");
    console.log("Identity subject:", identity.subject);
    console.log("Identity full:", JSON.stringify(identity, null, 2));
    console.log("User from DB:", JSON.stringify(userFromDb, null, 2));
    
    // Type assertion to access identity fields (Convex Auth identity type is restrictive)
    const identityAny = identity as Record<string, unknown>;
    
    // The identity object from Google OAuth should have these fields
    // Check all possible field names
    const name = 
      userFromDb?.name ?? 
      (identityAny.name as string | undefined) ?? 
      (identityAny.given_name as string | undefined) ?? 
      (identityAny.nickname as string | undefined) ??
      (identityAny.preferred_username as string | undefined) ??
      null;
      
    const email = 
      userFromDb?.email ?? 
      (identityAny.email as string | undefined) ?? 
      null;
      
    const picture = 
      userFromDb?.image ?? 
      (identityAny.picture as string | undefined) ?? 
      (identityAny.avatar_url as string | undefined) ??
      null;
    
    const provider = 
      (identityAny.issuer as string | undefined) ?? 
      (identityAny.provider as string | undefined) ?? 
      null;
    
    return {
      name,
      email,
      picture,
      provider,
      // Include raw data for debugging
      _raw: { identity, userFromDb },
    };
  },
});

