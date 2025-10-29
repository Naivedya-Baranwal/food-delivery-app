// utils/scheduledTasks.js
import cron from 'node-cron';
import deliveryAgentModel from '../models/deliveryAgentModel.js';

// Reset all agents' today deliveries at midnight (12:00 AM)
export const resetDailyDeliveries = () => {
  // Run at 00:00 (midnight) every day
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log("🕐 Midnight: Resetting today's deliveries for all agents...");
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const result = await deliveryAgentModel.updateMany(
        {},
        {
          $set: {
            todayDeliveries: 0,
            lastResetDate: today
          }
        }
      );

      console.log(`✅ Reset complete: ${result.modifiedCount} agents updated`);
    } catch (error) {
      console.error("❌ Error resetting daily deliveries:", error);
    }
  }, {
    timezone: "Asia/Kolkata" // ✅ Set your timezone
  });

  console.log("⏰ Daily reset scheduler initialized");
};
