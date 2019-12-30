module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('help_orders', 'student_id', {
      type: Sequelize.INTEGER,
      references: { model: 'students', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
    });
  },
};
