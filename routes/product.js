const { Router } = require("express");
const {
  addproduct,
  getAllProducts,
  getproduct,
  UpdateProduct,
  deleteProduct,
  getUniqueGenres,
  getUniqueAuthors,
  uploadProductFiles,
  uploadImagesToCloudinary,
} = require("../controllers/productController");

const {
  addProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/Validators/productValidator");

const {
  manualPdfFileValidator,
  manualImageCoverValidator,
  parseSubcategoryArray,
} = require("../middlewares/productImg&FileValidator");

// ✅ استدعاء Middleware التحقق من Admin
const AuthenticateAdmin = require("../middlewares/AuthenticateAdmin");

const productRouter = Router();

productRouter
  .route("/")
  .get(getAllProducts) // جميع المستخدمين يمكنهم مشاهدة المنتجات
  .post(
    AuthenticateAdmin, // فقط Admin يمكنه إضافة المنتجات
    uploadProductFiles,
    manualPdfFileValidator,
    manualImageCoverValidator,
    uploadImagesToCloudinary,
    parseSubcategoryArray,
    addProductValidator,
    addproduct
  );

productRouter.get("/genres", getUniqueGenres);
productRouter.get("/authors", getUniqueAuthors);

productRouter
  .route("/:id")
  .get(getProductValidator, getproduct)
  .put(
    uploadProductFiles,
    uploadImagesToCloudinary,
    parseSubcategoryArray,
    updateProductValidator,
    UpdateProduct
  )
  .delete(AuthenticateAdmin, deleteProductValidator, deleteProduct);

module.exports = productRouter;

// const { Router } = require("express");
// const {
//   addproduct,
//   getAllProducts,
//   getproduct,
//   UpdateProduct,
//   deleteProduct,
//   getUniqueGenres,
//   getUniqueAuthors,
//   uploadProductFiles,
//   uploadImagesToCloudinary,
// } = require("../controllers/productController");

// const {
//   addProductValidator,
//   getProductValidator,
//   updateProductValidator,
//   deleteProductValidator,
// } = require("../utils/Validators/productValidator");
// const {
//   manualPdfFileValidator,
//   manualImageCoverValidator,
//   parseSubcategoryArray,
// } = require("../middlewares/productImg&FileValidator");

// const productRouter = Router();

// productRouter
//   .route("/")
//   .get(getAllProducts)
//   .post(
//         uploadProductFiles,
//         manualPdfFileValidator,
//         manualImageCoverValidator,
//         uploadImagesToCloudinary,
//         parseSubcategoryArray,
//         addProductValidator,
//         addproduct);

// productRouter.get("/genres", getUniqueGenres);
// productRouter.get("/authors", getUniqueAuthors);

// productRouter
//   .route("/:id")
//   .get(getProductValidator, getproduct)
//   .put(uploadProductFiles, uploadImagesToCloudinary, parseSubcategoryArray,updateProductValidator, UpdateProduct)
//   .delete(deleteProductValidator, deleteProduct);

// module.exports = productRouter;
