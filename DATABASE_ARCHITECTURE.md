# 🗄️ **Database Architecture - Clean & Simple**

## **Overview**
This document describes the clean, simple database integration for the AI Impact Tracker extension. The architecture follows **clean code principles** with clear separation of concerns and only saves data when users explicitly opt-in.

## **🏗️ Architecture**

### **Data Flow**
```
Background Script → Chrome Storage → Database (if opted-in)
     ↓                    ↓              ↓
   ✅ Always          ✅ Always      ✅ Only when opt-in
```

### **Key Principles**
1. **Chrome Storage First** - All data is always saved locally
2. **Database Optional** - Database save only happens when user opts-in
3. **Silent Failures** - Database errors don't break the extension
4. **Single Responsibility** - Each module has one clear purpose
5. **No Duplication** - Each piece of functionality exists in exactly one place

## **📊 Database Tables**

### **user_profiles**
- `id` (uuid, primary key) - Links to Supabase auth.users
- `email` (text) - User's email address
- `opt_in_status` (boolean) - Whether user wants data saved to database
- `created_at` (timestamptz) - When profile was created
- `last_active` (timestamptz) - Last user activity

### **usage_data**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key) - Links to user_profiles.id
- `timestamp` (timestamptz) - When the request happened
- `energy_usage_wh` (numeric) - Energy usage in watt-hours
- `co2_emissions_g` (numeric) - CO2 emissions in grams
- `token_count` (integer) - Estimated token count
- `conversation_id` (text) - Unique conversation identifier
- `model_used` (text) - AI service name (ChatGPT, Claude, etc.)

### **donations**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key) - Links to user_profiles.id
- `amount` (numeric) - Donation amount
- `m2_restored` (numeric) - Square meters of land restored
- `donation_date` (timestamptz) - When donation was made

## **🔧 Implementation**

### **1. AuthContext (src/context/AuthContext.tsx)**
- **Single Responsibility**: Authentication and user profile state management ONLY
- **No Database Operations**: Focused purely on auth state
- **Clean Interface**: Simple, focused methods for auth operations
- **User Profile Management**: Create, read, update user profiles

### **2. DatabaseService (src/utils/storage/database.ts)**
- **Single Responsibility**: All database operations
- **Static Utility Class**: No complex state management
- **Opt-in Validation**: Checks user profile before saving
- **Comprehensive Operations**: CRUD operations for all data types
- **Error Handling**: Graceful failures, returns boolean
- **Type Safety**: Full TypeScript interfaces

### **3. useDatabase Hook (src/hooks/useDatabase.ts)**
- **React Integration**: Clean hook interface for components
- **Authentication Aware**: Automatically checks user auth state
- **Performance Optimized**: Uses useCallback for stable references
- **Error Handling**: Graceful fallbacks for unauthenticated users
- **Type Safe**: Full TypeScript support

### **4. Background Script Integration**
- **Automatic Database Save** - When requests complete
- **Silent Failures** - Database errors don't break tracking
- **Opt-in Respect** - Only saves for opted-in users
- **Simple Conversion** - AI request → database format

## **🚀 Usage Examples**

### **In Components - Using useDatabase Hook**
```typescript
import { useDatabase } from '@/hooks/useDatabase';

const MyComponent = () => {
    const { saveUsageData, getUserUsageData, isUserOptedIn } = useDatabase();
    
    const handleSaveData = async () => {
        const optedIn = await isUserOptedIn();
        if (optedIn) {
            const success = await saveUsageData({
                timestamp: new Date().toISOString(),
                energy_usage_wh: 50,
                co2_emissions_g: 25,
                token_count: 300,
                conversation_id: "unique-id",
                model_used: "ChatGPT"
            });
            
            if (success) {
                console.log("✅ Data saved to database");
            }
        }
    };
    
    // ... rest of component
};
```

### **In Background Script - Direct DatabaseService Usage**
```typescript
import { DatabaseService } from '@/utils/storage/database';

// Will only save if user is authenticated and opted-in
await DatabaseService.saveUsageData(userId, usageData);
```

### **Checking Opt-in Status**
```typescript
// In any component
const { isUserOptedIn } = useDatabase();

const checkOptIn = async () => {
    const optedIn = await isUserOptedIn();
    if (optedIn) {
        console.log("User opted in to database storage");
    } else {
        console.log("User not opted in - Chrome storage only");
    }
};
```

## **✅ Benefits of This Architecture**

### **1. Clean Code Principles**
- **Single Responsibility**: Each module has one clear purpose
- **No Duplication**: Each piece of functionality exists in exactly one place
- **Clear Interfaces**: Well-defined contracts between modules
- **Easy Testing**: Each module can be tested independently

### **2. Maintainability**
- **Easy to Modify**: Changes only need to be made in one place
- **Clear Dependencies**: Easy to understand what depends on what
- **Consistent Patterns**: Same approach used throughout the codebase
- **Reduced Bugs**: Less chance of inconsistencies between implementations

### **3. Developer Experience**
- **Clear Intent**: Easy to understand what each module does
- **Type Safety**: Full TypeScript support prevents runtime errors
- **IntelliSense**: Excellent IDE support with proper types
- **Documentation**: Clear interfaces and examples

### **4. Performance**
- **No Background Sync**: Immediate operations
- **No Polling**: On-demand database access
- **Minimal Overhead**: Only when needed
- **Optimized Hooks**: Stable references prevent unnecessary re-renders

## **🧪 Testing**

### **Test Database Connection**
```typescript
import { testSupabaseConnection } from '@/utils/supabase/test-connection'

const result = await testSupabaseConnection()
console.log(result) // { success: true, message: "All tables accessible" }
```

### **Test Database Operations**
```typescript
import { testDatabaseOperations } from '@/utils/supabase/test-connection'

const result = await testDatabaseOperations()
console.log(result) // { success: true, message: "Database operations working" }
```

## **🔒 Security & Privacy**

### **Row Level Security (RLS)**
- Users can only access their own data
- Database operations respect user authentication
- No cross-user data access

### **Opt-in Consent**
- Users must explicitly enable database storage
- Default is Chrome storage only
- Clear control over data sharing

### **Data Minimization**
- Only essential data is stored
- No sensitive information collected
- Respects user privacy preferences

## **📈 Future Enhancements**

### **Potential Additions**
1. **Data Export** - Allow users to download their data
2. **Data Deletion** - Right to be forgotten
3. **Analytics Dashboard** - User insights and trends
4. **API Access** - Third-party integrations

### **Current Limitations**
1. **No real-time sync** - Data saved when requests complete
2. **No offline queue** - Requires internet connection
3. **No data migration** - Chrome storage remains primary

## **🎯 Summary**

This architecture provides a **clean, maintainable, and scalable** way to integrate with the database while maintaining the extension's core functionality. It follows modern software engineering principles and gives users full control over their data while ensuring the extension always works, regardless of database connectivity.

**Key Takeaway**: Database integration is **optional and additive** - it enhances the experience for opted-in users without compromising the experience for others. The clean separation of concerns makes the codebase easy to understand, maintain, and extend.

## **🏆 Clean Code Standards Achieved**

✅ **Single Responsibility Principle** - Each module has one clear purpose  
✅ **DRY Principle** - No duplicate functionality  
✅ **Separation of Concerns** - Clear boundaries between modules  
✅ **Type Safety** - Full TypeScript support  
✅ **Error Handling** - Graceful failures throughout  
✅ **Performance** - Optimized React hooks  
✅ **Maintainability** - Easy to modify and extend  
✅ **Testing** - Each module can be tested independently 