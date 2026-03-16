// 🔄 Real-time Updates Service for Cross-Domain Deployments
// This service ensures admin changes reflect on frontend even on different Vercel domains

import { api, Destination, Category } from './api';

interface UpdateEvent {
  id: string;
  type: 'destination' | 'category';
  action: 'added' | 'updated' | 'deleted';
  itemName: string;
  timestamp: string;
  processed: boolean;
}

class RealtimeUpdateService {
  private updateQueue: UpdateEvent[] = [];
  private lastCheckTime: string = new Date().toISOString();
  private pollingInterval: NodeJS.Timeout | null = null;
  private subscribers: ((event: UpdateEvent) => void)[] = [];

  constructor() {
    this.startPolling();
  }

  // Subscribe to updates
  subscribe(callback: (event: UpdateEvent) => void) {
    this.subscribers.push(callback);
  }

  // Unsubscribe from updates
  unsubscribe(callback: (event: UpdateEvent) => void) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  // Start polling for updates
  private startPolling() {
    this.pollingInterval = setInterval(() => {
      this.checkForUpdates();
    }, 3000); // Check every 3 seconds
  }

  // Check for database updates
  private async checkForUpdates() {
    try {
      // Only run on client-side
      if (typeof window === 'undefined') {
        return;
      }

      // Get current data from backend
      const [destinations, categories] = await Promise.all([
        api.getDestinations(),
        api.getCategories()
      ]);

      // Check if data has changed by comparing timestamps
      const currentTime = new Date().toISOString();
      
      // For destinations - check if count changed or individual items updated
      const currentDestinations = JSON.stringify(destinations.map(d => ({
        id: d.id,
        title: d.title,
        // Add other fields that might indicate updates
      })));

      // For categories - check if count changed
      const currentCategories = JSON.stringify(categories.map(c => ({
        id: c.id,
        name: c.name
      })));

      // Store current state for comparison
      const storedDestinations = localStorage.getItem('lastDestinationsState');
      const storedCategories = localStorage.getItem('lastCategoriesState');

      // Detect changes
      if (storedDestinations && storedDestinations !== currentDestinations) {
        this.detectChanges('destination', destinations, JSON.parse(storedDestinations));
      }

      if (storedCategories && storedCategories !== currentCategories) {
        this.detectChanges('category', categories, JSON.parse(storedCategories));
      }

      // Update stored state
      localStorage.setItem('lastDestinationsState', currentDestinations);
      localStorage.setItem('lastCategoriesState', currentCategories);
      localStorage.setItem('lastCheckTime', currentTime);

    } catch (error) {
      console.error('Real-time update check failed:', error);
    }
  }

  // Detect what changed between old and new data
  private detectChanges(type: 'destination' | 'category', newData: any[], oldData: any[]) {
    const oldMap = new Map(oldData.map(item => [item.id, item]));
    const newMap = new Map(newData.map(item => [item.id, item]));

    // Check for additions
    for (const [id, newItem] of newMap) {
      if (!oldMap.has(id)) {
        this.createUpdateEvent(type, 'added', newItem.title || newItem.name || `Item ${id}`);
      }
    }

    // Check for deletions
    for (const [id, oldItem] of oldMap) {
      if (!newMap.has(id)) {
        this.createUpdateEvent(type, 'deleted', oldItem.title || oldItem.name || `Item ${id}`);
      }
    }

    // Check for updates
    for (const [id, newItem] of newMap) {
      const oldItem = oldMap.get(id);
      if (oldItem && JSON.stringify(newItem) !== JSON.stringify(oldItem)) {
        this.createUpdateEvent(type, 'updated', newItem.title || newItem.name || `Item ${id}`);
      }
    }
  }

  // Create and broadcast update event
  private createUpdateEvent(type: 'destination' | 'category', action: 'added' | 'updated' | 'deleted', itemName: string) {
    const event: UpdateEvent = {
      id: Date.now().toString(),
      type,
      action,
      itemName,
      timestamp: new Date().toISOString(),
      processed: false
    };

    // Add to queue
    this.updateQueue.unshift(event);
    if (this.updateQueue.length > 50) {
      this.updateQueue = this.updateQueue.slice(0, 50);
    }

    // Store in localStorage for persistence
    localStorage.setItem('updateQueue', JSON.stringify(this.updateQueue));

    // Notify all subscribers
    this.subscribers.forEach(callback => callback(event));

    console.log(`🔄 Real-time update detected: ${action} ${type} - ${itemName}`);
  }

  // Get recent updates
  getRecentUpdates(limit: number = 10): UpdateEvent[] {
    const stored = localStorage.getItem('updateQueue');
    if (stored) {
      try {
        return JSON.parse(stored).slice(0, limit);
      } catch (error) {
        console.error('Failed to parse update queue:', error);
      }
    }
    return [];
  }

  // Clear updates
  clearUpdates() {
    this.updateQueue = [];
    localStorage.removeItem('updateQueue');
  }

  // Stop polling
  stop() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

// Export singleton instance
export const realtimeService = new RealtimeUpdateService();
export type { UpdateEvent };
