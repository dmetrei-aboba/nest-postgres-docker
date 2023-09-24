require('dotenv').config();

module.exports = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  migrationStorageTableName: '_sequelize_meta',
};
