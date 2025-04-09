const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');

router.post('/', problemController.createProblem);
router.get('/', problemController.getAllProblems);
router.patch('/:id/solve', problemController.markAsSolved);
router.delete('/:id', problemController.deleteProblem);


module.exports = router;
