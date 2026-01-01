// src/routes/simpleRoute.js
import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /test:
 *   get:
 *     description: Simple test route
 *     responses:
 *       200:
 *         description: A simple test response
 */
router.get('/test', (req, res) => {
  res.send('Test route works');
});

export default router;
