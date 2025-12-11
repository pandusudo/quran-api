import { Router } from "express";
import { chapterRouters } from "./chapter.router";
import { profileRouters } from "./profile.router";
import { verseRouters } from "./verse.router";
import { noteRouters } from "./note.router";
import { bookmarkRouters } from "./bookmark.router";
import { historyRouters } from "./history.router";
import { readingPlanRouters } from "./reading-plan.router";
import { dashboardRouters } from "./dashboard.router";
import { achievementRouters } from "./achievement.router";

const router = Router();

router.use("/chapters", chapterRouters);
router.use("/profile", profileRouters);
router.use("/verses", verseRouters);
router.use("/notes", noteRouters);
router.use("/bookmarks", bookmarkRouters);
router.use("/history", historyRouters);
router.use("/reading-plans", readingPlanRouters);
router.use("/dashboards", dashboardRouters);
router.use("/achievements", achievementRouters);

router.use("/redirect", (_, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/auth/login`);
});
router.use("/redirect-change-email", (_, res) => {
  res.redirect(
    `${process.env.FRONTEND_URL}/dashboard/settings?msg=Verification email sent to your new email address`
  );
});

export { router as mainRouter };
