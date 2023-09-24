const baseTypes = require('../baseTypes');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      const types = baseTypes(Sequelize);

      await queryInterface.createTable(
        'users',
        {
          id: types.id,

          first_name: Sequelize.STRING,

          last_name: Sequelize.STRING,

          email: Sequelize.STRING,

          phone: Sequelize.STRING,

          encrypted_password: {
            type: Sequelize.STRING,
            allowNull: false,
          },

          ...types.timestamps,
        },
        { transaction },
      );

      await queryInterface.addIndex('users', {
        fields: ['email'],
        unique: true,
        transaction,
      });

      await queryInterface.addIndex('users', {
        fields: ['phone'],
        unique: true,
        transaction,
      });

      await queryInterface.sequelize.query(
        `ALTER TABLE
          users
        ADD CONSTRAINT
          user_email_or_phone_not_null
        CHECK
          (email IS NOT NULL OR phone IS NOT NULL);`,
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('users');
  },
};
