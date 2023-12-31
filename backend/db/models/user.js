'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
        User.hasMany(models.Spot, {
          foreignKey: 'ownerId',
          onDelete: 'CASCADE',
          hooks: true
        })

        User.hasMany(models.Booking, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          hooks: true
        })

        User.hasMany(models.Review, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
          hooks: true
        })
     }
  };

  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [4, 30],
            msg: 'incorrect length'
          },

          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: false
        },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: false
        }
    }, {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};