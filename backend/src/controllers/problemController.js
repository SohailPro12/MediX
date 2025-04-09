const Problem = require('../models/Problem');

exports.createProblem = async (req, res) => {
  try {
    const { name, role, message } = req.body;
    const problem = new Problem({ name, role, message });
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du problème.' });
  }
};

// Get all problems with optional filters
exports.getAllProblems = async (req, res) => {
  try {
    // Extract query parameters
    const { role, dateSortOrder } = req.query;

    // Build query filters
    let filter = {};

    if (role) {
      filter.role = role; // Filter by role if provided
    }

    // Build the sort order based on the dateSortOrder query parameter
    const sortOrder = dateSortOrder === 'asc' ? 1 : -1; // Ascending (1) or Descending (-1)

    // Fetch problems from the database with filters and sorting
    const problems = await Problem.find(filter).sort({ createdAt: sortOrder });

    res.status(200).json(problems); // Return the filtered and sorted problems
  } catch (error) {
    console.error('Erreur lors de la récupération des problèmes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.markAsSolved = async (req, res) => {
    try {
      const problem = await Problem.findByIdAndUpdate(
        req.params.id,
        { solved: true },
        { new: true }
      );
      if (!problem) return res.status(404).json({ message: "Problème introuvable." });
      res.json(problem);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour." });
    }
  };
  
  exports.deleteProblem = async (req, res) => {
    try {
      const result = await Problem.findByIdAndDelete(req.params.id);
      if (!result) return res.status(404).json({ message: "Problème introuvable." });
      res.json({ message: "Problème supprimé." });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression." });
    }
  };
