import { Response } from "express";
import { AuthRequest } from "../../shared/middleware/auth.middleware";
import { HTTP_STATUS } from "../../shared/constants/http-status";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendResponse } from "../../shared/utils/send-response";
import { LearningService } from "./learning.service";

export class LearningController {
  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const entry = await LearningService.createEntry(req.user!.userId, req.body);

    sendResponse({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: "Learning entry created successfully",
      data: entry,
    });
  });

  static get = asyncHandler(async (req: AuthRequest, res: Response) => {
    const entry = await LearningService.getEntry(
      req.user!.userId,
      req.params.studySessionId as string,
    );

    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: "Learning entry fetched successfully",
      data: entry,
    });
  });

  static update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const entry = await LearningService.updateEntry(
      req.user!.userId,
      req.params.studySessionId as string,
      req.body,
    );

    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: "Learning entry updated successfully",
      data: entry,
    });
  });
}
