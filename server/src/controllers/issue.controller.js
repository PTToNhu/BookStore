const db = require("../models");
const Issue = db.Issue;

const getIssueByBookId = async (req, res) => {
  const bookId = req.params.bookId;
  try {
    console.log(bookId);
    const issues = await Issue.find({ BookID: bookId });
    if (!issues)
      return res.status(404).send("The issue with the given ID was not found.");
    res.send(issues);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
};

const getIssueByIssueId = async (req, res) => {
  const issueId = req.params.issueId;
  try {
    const issue = await Issue.findById(issueId);
    if (!issue)
      return res.status(404).send("The issue with the given ID was not found.");
    res.send(issue);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
};

const createIssue = async (req, res) => {
  try {
    const {
      ISSN,
      IssueNumber,
      PublicationDate,
      Pages,
      SpecialIssue,
      Volumn,
      Price,
      Amount,
      BookID,
    } = req.body;

    if (!ISSN || !BookID) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newIssue = new Issue({
      ISSN,
      IssueNumber,
      PublicationDate,
      Pages,
      SpecialIssue,
      Volumn,
      Price,
      Amount,
      BookID,
    });

    await newIssue.save();

    res
      .status(201)
      .json({ message: "Issue created successfully!", newEdition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteIssue = async (req, res) => {
  const issn = req.params.issn;

  try {
    if (!issn) {
      return res.status(400).json({ message: "Missing ISSN" });
    }

    const deletedIssue = await Issue.findOneAndDelete({ ISBN: issn });

    if (!deletedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res
      .status(200)
      .json({ message: "Issue deleted successfully!", deletedEdition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getIssueByBookId,
  getIssueByIssueId,
  createIssue,
  deleteIssue,
};
