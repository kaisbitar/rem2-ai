# 🗄️ **Database Architecture - Clean & Simple**

## **Overview**
This document describes the clean, simple database integration for the AI Impact Tracker extension. The architecture follows the **KISS principle** (Keep It Simple, Stupid) and only saves data when users explicitly opt-in.

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
4. **Simple Integration** - No complex sync queues or state management

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
- **Simple database methods** - `saveUsageData()`, `saveDonation()`
- **Opt-in checking** - Only saves when `userProfile.opt_in_status = true`
- **Clean error handling** - Returns boolean success/failure
- **No complex sync logic** - Direct database operations

### **2. DatabaseService (src/utils/storage/database.ts)**
- **Static utility class** - No complex state management
- **Opt-in validation** - Checks user profile before saving
- **Simple CRUD operations** - Insert, select, update
- **Error handling** - Graceful failures, returns boolean

### **3. Background Script Integration**
- **Automatic database save** - When requests complete
- **Silent failures** - Database errors don't break tracking
- **Opt-in respect** - Only saves for opted-in users
- **Simple conversion** - AI request → database format

## **🚀 Usage Examples**

### **Saving Usage Data**
```typescript
// In background script - automatic save
const usageData = {
    timestamp: new Date().toISOString(),
    energy_usage_wh: 50,
    co2_emissions_g: 25,
    token_count: 300,
    conversation_id: "unique-id",
    model_used: "ChatGPT"
};

// Will only save if user is authenticated and opted-in
await DatabaseService.saveUsageData(userId, usageData);
```

### **Saving Donations**
```typescript
// In popup - user-initiated save
const donation = {
    amount: 10.00,
    m2_restored: 5.0,
    donation_date: new Date().toISOString()
};

// Will only save if user is authenticated and opted-in
await DatabaseService.saveDonation(userId, donation);
```

### **Checking Opt-in Status**
```typescript
// In any component
const { userProfile } = useAuth();

if (userProfile?.opt_in_status) {
    // User has opted in - safe to save to database
    console.log("User opted in to database storage");
} else {
    // User has not opted in - only use Chrome storage
    console.log("User not opted in - Chrome storage only");
}
```

## **✅ Benefits of This Architecture**

### **1. Simplicity**
- **No complex sync logic** - Direct database operations
- **No state management** - Simple boolean returns
- **No queues** - Immediate save or fail

### **2. Reliability**
- **Chrome storage always works** - Extension never breaks
- **Database optional** - Graceful degradation
- **Silent failures** - User experience unaffected

### **3. Performance**
- **No background sync** - Immediate operations
- **No polling** - On-demand database access
- **Minimal overhead** - Only when needed

### **4. User Privacy**
- **Explicit opt-in** - Users control their data
- **Local-first** - Data always stored locally
- **Transparent** - Clear when data goes to database

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

This architecture provides a **clean, simple, and reliable** way to integrate with the database while maintaining the extension's core functionality. It follows modern privacy principles and gives users full control over their data while ensuring the extension always works, regardless of database connectivity.

**Key Takeaway**: Database integration is **optional and additive** - it enhances the experience for opted-in users without compromising the experience for others. 