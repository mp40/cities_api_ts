import { Address, getAddressesInRadius } from "../model";

type JobData = {
  jobId: string;
  from: string;
  distance: number;
};

export class JobQueue {
  jobs: JobData[];
  isProcessing: boolean;
  results: Map<string, Address[] | "not found">;
  constructor() {
    this.jobs = [];
    this.results = new Map();
    this.isProcessing = false;
  }

  addJob(jobData: JobData): void {
    this.jobs.push(jobData);
    this.processJobs();
  }

  async processJobs(): Promise<void> {
    if (!this.isProcessing && this.jobs.length > 0) {
      this.isProcessing = true;
      const jobData = this.jobs.shift();
      if (jobData === undefined) {
        return;
      }

      const result = await getAddressesInRadius(jobData.from, jobData.distance);
      this.results.set(jobData.jobId, result || "not found");

      this.isProcessing = false;
      this.processJobs();
    }
  }

  getJobResult(jobId: string): Address[] | "not found" | null {
    const result = this.results.get(jobId);
    if (!result) {
      return null;
    }

    return result;
  }
}

export default new JobQueue();
