import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const SYNC_QUEUE_KEY = '@lanie_sync_queue';

export interface SyncTask {
    id: string;
    type: 'BREAKDOWN_REPORT' | 'TRIP_LOG';
    payload: any;
    timestamp: number;
}

export const syncManager = {
    async enqueueTask(task: Omit<SyncTask, 'id' | 'timestamp'>) {
        const fullTask: SyncTask = {
            ...task,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
        };

        try {
            const existing = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
            const queue: SyncTask[] = existing ? JSON.parse(existing) : [];
            queue.push(fullTask);
            await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
            
            // Attempt immediate sync if online
            this.attemptSync();
            
            return fullTask.id;
        } catch (e) {
            console.error('Failed to enqueue sync task', e);
            throw e;
        }
    },

    async getQueue(): Promise<SyncTask[]> {
        const existing = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
        return existing ? JSON.parse(existing) : [];
    },

    async attemptSync() {
        const state = await NetInfo.fetch();
        if (!state.isConnected) return;

        const queue = await this.getQueue();
        if (queue.length === 0) return;

        const remainingQueue = [];

        for (const task of queue) {
            try {
                // Mock API call to backend
                console.log(`[SyncManager] Syncing task ${task.id} of type ${task.type}`);
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // If this throws, it goes to catch and keeps it in the queue
                // await api.post('/sync', task.payload);

                console.log(`[SyncManager] Task ${task.id} synced successfully`);
            } catch (error) {
                console.warn(`[SyncManager] Task ${task.id} failed to sync, retaining in queue`);
                remainingQueue.push(task);
            }
        }

        await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remainingQueue));
    }
};
