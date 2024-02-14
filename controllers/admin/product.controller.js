const filterStateHelper = require("../../helpers/filter-state.helper");
const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");


module.exports.index = async (req, res) => {

  try {
    //Status Filter
    const filterState = filterStateHelper(req.query);
    //End Status

    const find = {
      deleted: false
    }

    if(req.query.status) {
      find.status = req.query.status;
    }
      // Search
    if(req.query.keyword) {
      const regex = new RegExp(req.query.keyword, "i");
      find.title = regex;
    }
    // End Search

    //Pagination
    const countProducts = await Product.countDocuments(find);
    const objectPagination = paginationHelper(4, req.query, countProducts);
    //End Pagination
    
    const products = await Product.find(find)
      .sort({
        position: "desc"
      })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);
    
    res.render("admin/pages/products/index", {
      pageTitle: "Danh sách sản phẩm",
      products: products,
      filterState: filterState,
      keyword: req.query.keyword,
      pagination: objectPagination
    });
    
  }catch (error){
   console.log(error);
   res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
}
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({
    _id: id
  }, {
    status: status
  });

  req.flash('success', 'Cập nhật trạng thái thành công!');

  res.redirect("back");
}



// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
    case "inactive":
      await Product.updateMany({
        _id: { $in: ids }
      }, {
        status: type
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');
      break;
    case "delete-all":
      await Product.updateMany({
        _id: { $in: ids }
      }, {
        deleted: true,
        deletedAt: new Date()
      });
      req.flash('success', 'Xóa sản phẩm thành công!');
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne({
          _id: id
        }, {
          position: position
        });
      }
      req.flash('success', 'Thay đổi vị trí thành công!');
      break;
    default:
      break;
  }

  res.redirect("back");
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    // await Product.deleteOne({
    //   _id: id
    // });

    await Product.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date()
    });
    req.flash('success', 'Xóa sản phẩm thành công!');
  } catch (error) {
    console.log(error);
  }

  res.redirect("back");
}

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
  });
};


//[POST] admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if(req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const product = new Product(req.body);
  await product.save();

  req.flash("success", "Thêm mới sản phẩm thành công !");

  res.redirect(`/${systemConfig.prefixAdmin}/products`);
};


