import type { Request, Response } from "express";

import {
  listPendingSubmissionsQuerySchema,
  publicPriceManualSubmissionSchema,
  publicPriceUploadSchema,
  rejectSubmissionSchema,
  submissionIdParamSchema,
  submissionReferenceCodeParamSchema,
} from "./submissions.schemas.js";
import { submissionsService } from "./submissions.service.js";

export const submissionsController = {
  async submitPublicUpload(req: Request, res: Response) {
    const payload = publicPriceUploadSchema.parse(req.body);
    const result = await submissionsService.submitPublicUpload(payload);
    res.status(201).json(result);
  },

  async submitManualEntry(req: Request, res: Response) {
    const payload = publicPriceManualSubmissionSchema.parse(req.body);
    const result = await submissionsService.submitManualEntry(payload);
    res.status(201).json(result);
  },

  async listPending(req: Request, res: Response) {
    const query = listPendingSubmissionsQuerySchema.parse(req.query);
    const result = await submissionsService.listPending(query.limit);
    res.json(result);
  },

  async getPublicStatus(req: Request, res: Response) {
    const { referenceCode } = submissionReferenceCodeParamSchema.parse(req.params);
    const result = await submissionsService.getPublicStatus(referenceCode);
    res.json(result);
  },

  async approve(req: Request, res: Response) {
    const { id } = submissionIdParamSchema.parse(req.params);
    const result = await submissionsService.approve(id, req.auth!.userId);
    res.json(result);
  },

  async reject(req: Request, res: Response) {
    const { id } = submissionIdParamSchema.parse(req.params);
    const payload = rejectSubmissionSchema.parse(req.body);
    const result = await submissionsService.reject(
      id,
      req.auth!.userId,
      payload.reviewNote,
    );
    res.json(result);
  },
};
