const express = require("express");
const router = express.Router();

const expensesController = require("../../controllers/mylogr.monthly-spends/expenses.controller");

router.post("/", expensesController.createExpense);
router.get("/", expensesController.getExpenses);
router.get("/summary", expensesController.getMonthlySummary);
router.get("/:id", expensesController.getExpenseById);
router.put("/:id", expensesController.updateExpense);
router.delete("/:id", expensesController.deleteExpense);
router.patch("/restore/:id", expensesController.restoreExpense);

module.exports = router;
