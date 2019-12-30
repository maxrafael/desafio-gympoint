module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('enrollments', 'plan_id', {
      type: Sequelize.INTEGER,
      references: { model: 'plans', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
    });
  },
};
