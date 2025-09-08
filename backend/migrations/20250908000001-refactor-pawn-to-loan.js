'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Create new Loans table (based on PawnTickets structure)
      await queryInterface.createTable('Loans', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        customer_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Customers',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        loan_number: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        loan_type: {
          type: Sequelize.ENUM('PAWN', 'TITLE', 'SECURED', 'UNSECURED', 'CHECK_REDISCOUNT'),
          allowNull: false,
          defaultValue: 'PAWN'
        },
        issue_date: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        maturity_date: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        grace_period_end: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        principal_amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        interest_rate: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('ACTIVE', 'DUE_SOON', 'OVERDUE', 'REDEEMED', 'FORFEITED'),
          allowNull: false,
          defaultValue: 'ACTIVE'
        },
        outstanding_principal: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        accrued_interest: {
          type: Sequelize.DECIMAL(10, 2),
          defaultValue: 0.00
        },
        penalties: {
          type: Sequelize.DECIMAL(10, 2),
          defaultValue: 0.00
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, { transaction });

      // 2. Create new Collaterals table (to replace PawnedItems)
      await queryInterface.createTable('Collaterals', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        loan_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Loans',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        collateral_type: {
          type: Sequelize.ENUM('PHYSICAL_ITEM', 'VEHICLE_TITLE', 'PROPERTY_TITLE', 'CHECK', 'NONE'),
          allowNull: false,
          defaultValue: 'PHYSICAL_ITEM'
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        estimated_value: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        },
        // For physical items
        item_name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        // For checks
        check_number: {
          type: Sequelize.STRING,
          allowNull: true
        },
        check_date: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        check_amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        },
        bank_name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        drawer_name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        // For vehicle titles
        vehicle_make: {
          type: Sequelize.STRING,
          allowNull: true
        },
        vehicle_model: {
          type: Sequelize.STRING,
          allowNull: true
        },
        vehicle_year: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        vehicle_vin: {
          type: Sequelize.STRING,
          allowNull: true
        },
        // For property titles
        property_address: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        property_type: {
          type: Sequelize.STRING,
          allowNull: true
        },
        title_number: {
          type: Sequelize.STRING,
          allowNull: true
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, { transaction });

      // 3. Check if PawnTickets table exists and migrate data
      const pawnTicketsExist = await queryInterface.sequelize.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'PawnTickets';",
        { type: Sequelize.QueryTypes.SELECT, transaction }
      );

      if (pawnTicketsExist.length > 0) {
        await queryInterface.sequelize.query(`
          INSERT INTO Loans (
            id, customer_id, loan_number, loan_type, issue_date, maturity_date, 
            grace_period_end, principal_amount, interest_rate, status, 
            outstanding_principal, accrued_interest, penalties, created_at, updated_at
          )
          SELECT 
            id, customer_id, ticket_number, 'PAWN', issue_date, maturity_date,
            grace_period_end, principal_amount, interest_rate, status,
            outstanding_principal, accrued_interest, penalties, created_at, updated_at
          FROM PawnTickets;
        `, { transaction });

        // 4. Migrate PawnedItems to Collaterals
        const pawnedItemsExist = await queryInterface.sequelize.query(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'PawnedItems';",
          { type: Sequelize.QueryTypes.SELECT, transaction }
        );

        if (pawnedItemsExist.length > 0) {
          await queryInterface.sequelize.query(`
            INSERT INTO Collaterals (
              id, loan_id, collateral_type, description, estimated_value, 
              item_name, created_at, updated_at
            )
            SELECT 
              id, pawn_ticket_id, 'PHYSICAL_ITEM', 
              COALESCE(description, item_name), estimated_value,
              item_name, created_at, updated_at
            FROM PawnedItems;
          `, { transaction });
        }

        // 5. Update Payments table foreign key
        await queryInterface.addColumn('Payments', 'loan_id', {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Loans',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }, { transaction });

        await queryInterface.sequelize.query(`
          UPDATE Payments SET loan_id = pawn_ticket_id;
        `, { transaction });

        // 6. Update Notes table foreign key
        await queryInterface.addColumn('Notes', 'loan_id', {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Loans',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }, { transaction });

        await queryInterface.sequelize.query(`
          UPDATE Notes SET loan_id = pawn_ticket_id;
        `, { transaction });

        // 7. Update Attachments table foreign keys
        await queryInterface.addColumn('Attachments', 'loan_id', {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Loans',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }, { transaction });

        await queryInterface.addColumn('Attachments', 'collateral_id', {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Collaterals',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }, { transaction });

        // Migrate attachment relationships
        await queryInterface.sequelize.query(`
          UPDATE Attachments 
          SET collateral_id = pawned_item_id 
          WHERE pawned_item_id IS NOT NULL;
        `, { transaction });

        await queryInterface.sequelize.query(`
          UPDATE Attachments 
          SET type = 'collateral' 
          WHERE type = 'pawned_item';
        `, { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove new columns from existing tables
      await queryInterface.removeColumn('Payments', 'loan_id', { transaction });
      await queryInterface.removeColumn('Notes', 'loan_id', { transaction });
      await queryInterface.removeColumn('Attachments', 'loan_id', { transaction });
      await queryInterface.removeColumn('Attachments', 'collateral_id', { transaction });

      // Drop new tables
      await queryInterface.dropTable('Collaterals', { transaction });
      await queryInterface.dropTable('Loans', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};