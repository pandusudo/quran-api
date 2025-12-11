import type { Response } from "express";
import { ResponseHandler } from "../helpers/response-handler";
import { NoteService } from "../services/note.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class NoteController {
  static async createNote(req: AuthenticatedRequest, res: Response) {
    try {
      const noteData = req.body;
      const userId = req.user?.id;
      const newNote = await NoteService.createNote(noteData, userId!);
      ResponseHandler.success(res, 201, "Note created successfully", newNote);
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async updateNote(req: AuthenticatedRequest, res: Response) {
    try {
      const noteData = req.body;
      const noteId = req.params.noteId;
      const userId = req.user?.id;
      const updatedNote = await NoteService.updateNote(
        noteId,
        noteData,
        userId!
      );
      ResponseHandler.success(
        res,
        200,
        "Note updated successfully",
        updatedNote
      );
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async getNotesByPageId(req: AuthenticatedRequest, res: Response) {
    try {
      const pageId = parseInt(req.params.pageId, 10);
      const userId = req.user?.id;
      const notes = await NoteService.getNotesByPageId(pageId, userId!);
      ResponseHandler.success(res, 200, "Notes fetched successfully", notes);
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }

  static async getMyNotes(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const notes = await NoteService.getMyNotes(userId!);
      ResponseHandler.success(res, 200, "My notes fetched successfully", notes);
    } catch (error: Error | any) {
      console.error(error);
      ResponseHandler.handleErrors(res, error);
    }
  }
}
