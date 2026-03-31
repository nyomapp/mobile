type UploadTask = () => Promise<void>;

class UploadQueue {
  private queue: UploadTask[] = [];
  private isProcessing = false;
  private activeGroup: string | null = null;

  add(task: UploadTask, documentType: string) {
    this.queue.push(task);

    // Don't wait - just trigger processing if not already running
    if (!this.isProcessing) {
      void this.process();
    }
  }

  private async process() {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        try {
          await task();
        } catch (error) {
          console.error("Upload queue task failed:", error);
        }
      }
    }
    this.isProcessing = false;
  }
}

export const uploadQueue = new UploadQueue();
