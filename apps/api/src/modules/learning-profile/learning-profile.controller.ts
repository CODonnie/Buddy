import { Response } from "express";
import { AuthRequest } from "../../shared/middleware/auth.middleware";
import { HTTP_STATUS } from "../../shared/constants/http-status";
import { asyncHandler } from "../../shared/utils/async-handler";
import { sendResponse } from "../../shared/utils/send-response";
import { LearningProfileService } from "./learning-profile.service";

export class LearningProfileController {
  static me = asyncHandler(async (req: AuthRequest, res: Response) => {
    const profile = await LearningProfileService.getMyProfile(req.user!.userId);

    sendResponse({
      res,
      statusCode: HTTP_STATUS.OK,
      message: "Learning profile fetched successfully",
      data: profile,
    });
  });
}
