import { NoteCreateDTOType } from "../dtos/note/create-note";
import { NoteUpdateDTOType } from "../dtos/note/update-note";
import { throwError } from "../helpers/error-thrower";
import cache from "../lib/cache-manager";
import { prisma } from "../lib/prisma";

export class NoteService {
  static serviceName = "Note Service";

  static async updateNote(id: string, body: NoteUpdateDTOType, userId: string) {
    try {
      const { content, color } = body;

      const updatedNote = await prisma.note.update({
        where: {
          id: id,
          userId: userId,
        },
        data: {
          content: content,
          color: color,
        },
      });

      await cache.del(`notes_page_${updatedNote.pageId}_user_${userId}`);
      await cache.del(`my_notes_user_${userId}`);

      return updatedNote;
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }

  static async createNote(body: NoteCreateDTOType, userId: string) {
    try {
      const { content, pageId, ayahId, color, surahName, ayahNumber } = body;

      const newNote = await prisma.note.create({
        data: {
          content: content,
          pageId: pageId,
          ayahId: ayahId,
          surahName: surahName,
          ayahNumber: ayahNumber,
          color: color ?? "yellow",
          userId: userId,
        },
      });

      await cache.del(`notes_page_${pageId}_user_${userId}`);
      await cache.del(`my_notes_user_${userId}`);

      return newNote;
    } catch (error: Error | any) {
      console.error(error);
      throwError(error, this.serviceName);
    }
  }

  static async getNotesByPageId(pageId: number, userId: string) {
    try {
      const cachedNotes = await cache.get(
        `notes_page_${pageId}_user_${userId}`
      );
      if (cachedNotes) return cachedNotes;

      const notes = await prisma.note.findMany({
        where: {
          pageId: pageId,
          userId: userId,
        },
      });

      await cache.set(`notes_page_${pageId}_user_${userId}`, notes);

      return notes;
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }

  static async getMyNotes(userId: string) {
    try {
      const cachedNotes = await cache.get(`my_notes_user_${userId}`);

      if (cachedNotes) return cachedNotes;

      console.log("not cached");

      const notes = await prisma.note.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          pageId: "asc",
        },
      });

      await cache.set(`my_notes_user_${userId}`, notes);

      return notes;
    } catch (error: Error | any) {
      throwError(error, this.serviceName);
    }
  }
}
