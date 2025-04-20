import { Router } from "express";
import * as VocabController from "../controllers/vocab";

const router = Router();

/**
 * @openapi
 * /api/vocab/random:
 *   get:
 *     summary: Get a random vocabulary word with definition
 *     tags: [Vocab]
 *     responses:
 *       200:
 *         description: A random vocabulary word with its definition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 word:
 *                   type: string
 *                 definition:
 *                   type: string
 */
router.get("/random", VocabController.getRandomWord);

/**
 * @openapi
 * /api/vocab/words:
 *   get:
 *     summary: Get multiple vocabulary words with definitions
 *     tags: [Vocab]
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of vocabulary words to return
 *     responses:
 *       200:
 *         description: List of vocabulary words with definitions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   word:
 *                     type: string
 *                   definition:
 *                     type: string
 */
router.get(
  "/words",
  (req, res, next) => {
    try {
      // Basic validation of the count parameter
      const countParam = req.query["count"] as string | undefined;
      if (countParam !== undefined && countParam !== "") {
        const count = parseInt(countParam, 10);
        if (isNaN(count) || count < 1) {
          res.status(400).json({
            message: "Count parameter must be a positive integer",
          });
          return;
        }
      }
      // Proceed to next middleware
      next();
      return;
    } catch (error) {
      next(error);
      return;
    }
  },
  VocabController.getVocabWords
);

export default router;
