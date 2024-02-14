const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const systemConfig = require("../../config/system");

module.exports = (apps) => {
  const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;
  apps.use(`${PATH_ADMIN}/dashboard`, dashboardRoutes);
  apps.use(`${PATH_ADMIN}/products`, productRoutes);
}