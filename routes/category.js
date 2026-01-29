const { Router } = require("express");
const {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/Validators/categoryValidator");

// ✅ Middleware للتحقق من Admin
const AuthenticateAdmin = require("../middlewares/AuthenticateAdmin");

const categoryRouter = Router();
const subCategoryRouter = require("./subCategory");

// المسارات الرئيسية للفئات
categoryRouter
  .route("/")
  .get(getCategories) 
  .post(AuthenticateAdmin, createCategoryValidator, addCategory); 

categoryRouter
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(AuthenticateAdmin, updateCategoryValidator, updateCategory) 
  .delete(AuthenticateAdmin, deleteCategoryValidator, deleteCategory); 

categoryRouter.use("/:categoryId/subCategory", subCategoryRouter);

module.exports = categoryRouter;
