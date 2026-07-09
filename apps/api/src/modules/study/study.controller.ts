import { Response } from "express";

import { StudyService } from "./study.service";

import { AuthRequest } from "../../shared/middleware/auth.middleware";

import { asyncHandler } from "../../shared/utils/async-handler";
import { sendResponse } from "../../shared/utils/send-response";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class StudyController {
    static start = asyncHandler(
        async (req: AuthRequest, res: Response) => {

            const session = await StudyService.startSession({
                ...req.body,
                userId: req.user!.userId,
            });

            sendResponse({
                res,
                statusCode: HTTP_STATUS.CREATED,
                message: "Study session started successfully",
                data: session,
            });
        }
    );

    static current = asyncHandler(
        async (req: AuthRequest, res: Response) => {

            const session = await StudyService.getCurrentSession(
                req.user!.userId
            );

            sendResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message: "Current study session fetched successfully",
                data: session,
            });
        }
    );

    static end = asyncHandler(
        async (req: AuthRequest, res: Response) => {

            const session = await StudyService.endSession(
                req.params.id as string,
                req.user!.userId
            );

            sendResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message: "Study session ended successfully",
                data: session,
            });
        }
    );

    static history = asyncHandler(
        async (req: AuthRequest, res: Response) => {

            const sessions = await StudyService.getHistory(
                req.user!.userId
            );

            sendResponse({
                res,
                statusCode: HTTP_STATUS.OK,
                message: "Study history fetched successfully",
                data: sessions,
            });
        }
    );
}