import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '@middlewares/auth.middleware';

import { Report } from '@modules/report/report.model';

import { successResponse, errorResponse } from '@utils/response';

//Utils
import { getBaseUrl } from '@utils/url';

import { logger } from '@config/logger';

import fs from 'fs';
import path from 'path';

export const createReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, officeId } = req.body;

    if (!title || !description || !officeId) {
      return errorResponse(
        res,
        'Missing required fields',
        400,
        "Missing 'title', 'description', or 'office' in request body"
      );
    }

    const files = req.files as Express.Multer.File[] | undefined;

    const attachments = files
      ? files.map((file) => `/uploads/reports/${file.filename}`)
      : [];

    if (!req.user) {
      return errorResponse(
        res,
        'User not authenticated',
        401,
        'Authentication required to create a report'
      );
    }

    const report = await Report.create({
      title,
      description,
      office: officeId,
      status: 'open',
      createdBy: req.user.userId, // assuming authMiddleware injects this
      attachments,
    });

    return successResponse(res, report, 'Report created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getAllReports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const baseUrl = getBaseUrl(req);

    // Fetch all reports with user details and office info
    const reports = await Report.find()
      .populate('createdBy', 'email')
      .populate('office', 'name location');

    //Loop through reports to prepend baseUrl to attachment paths
    reports.forEach((report) => {
      report.attachments = report.attachments.map(
        (attachment) => `${baseUrl}${attachment}`
      );
    });

    return successResponse(res, reports, 'Reports fetched successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const baseUrl = getBaseUrl(req);

    const reportId = req.params.id;

    const report = await Report.findById(reportId)
      .populate('createdBy', 'email')
      .populate('office', 'name location');

    if (!report) {
      return errorResponse(
        res,
        'Report not found',
        404,
        `No report with ID ${reportId}`
      );
    }

    // Prepend baseUrl to attachment paths
    report.attachments = report.attachments.map(
      (attachment) => `${baseUrl}${attachment}`
    );

    return successResponse(res, report, 'Report fetched successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const deleteReportById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reportId = req.params.id;

    const report = await Report.findById(reportId);

    if (!report) {
      return errorResponse(
        res,
        'Report not found',
        404,
        `No report with ID ${reportId}`
      );
    }

    // 🔥 Delete attachments from filesystem
    if (report.attachments && report.attachments.length > 0) {
      report.attachments.forEach((attachmentPath) => {
        /**
         * attachmentPath example:
         * /uploads/reports/1766142917297-595954635.jpeg
         */

        const fullPath = path.join(process.cwd(), attachmentPath);

        // Safety check: ensure we only delete inside uploads
        if (fullPath.includes(path.join(process.cwd(), 'uploads'))) {
          fs.unlink(fullPath, (err) => {
            if (err && err.code !== 'ENOENT') {
              logger.error(`Failed to delete file ${fullPath}:` + err);
            }
          });
        }
      });
    }

    // 🗑️ Delete report from DB
    const deletedReport = await report.deleteOne();

    return successResponse(
      res,
      deletedReport,
      'Report deleted successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const baseUrl = getBaseUrl(req);
    const reportId = req.params.id;
    const { status, resolution } = req.body;
    const updateData: any = { status };

    if (resolution) {
      updateData.resolution = resolution;
    }

    if (status === 'closed') {
      updateData.closedAt = new Date();
      // Assuming req.user is available via authMiddleware
      if (req.user) {
        updateData.closedBy = req.user.userId;
      }
    }

    const report = await Report.findByIdAndUpdate(reportId, updateData, {
      new: true, // This option returns the modified document. If not set, it returns the original.
    })
      .populate('createdBy', 'email')
      .populate('office', 'name location');

    if (!report) {
      return errorResponse(
        res,
        'Report not found',
        404,
        `No report with ID ${reportId}`
      );
    }

    // Prepend baseUrl to attachment paths
    report.attachments = report.attachments.map(
      (attachment) => `${baseUrl}${attachment}`
    );

    return successResponse(
      res,
      report,
      'Report status updated successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};
