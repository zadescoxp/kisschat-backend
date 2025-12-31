import { Request, Response } from "express";
import { messageQueue } from "../utils/queue.util.js";

export async function getJobStatus(req: Request, res: Response) {
    const { jobId } = req.params;

    try {
        const job = await messageQueue.getJob(jobId);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const state = await job.getState();
        const progress = job.progress;

        if (state === 'completed') {
            const result = job.returnvalue;
            return res.json({
                status: 'completed',
                result: result
            });
        } else if (state === 'failed') {
            return res.json({
                status: 'failed',
                error: job.failedReason
            });
        } else {
            return res.json({
                status: state,
                progress: progress
            });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
