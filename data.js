import {config} from 'dotenv'
import {DataTypes, Sequelize, Op} from 'sequelize';
import initData from './fixtures/data.json' assert {type: 'json'};

config(); // load environment
const uri = `postgres://${process.env.DATABASE_USER}` +
    `:${process.env.DATABASE_PASSWORD}` +
    `@${process.env.DATABASE_HOST}` +
    `:${process.env.DATABASE_PORT}` +
    `/${process.env.DATABASE_NAME}`;
const sequelize = new Sequelize(uri);

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priorityLevel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completionStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    EmployeeId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'Employees',
            key: 'id'
        }
    }
});

Employee.hasMany(Task);

(async () => {
    await sequelize.sync();
    if (!(await Employee.count())) {
        await Employee.bulkCreate(initData.employees);
    }
    if (!(await Task.count())) {
        await Task.bulkCreate(initData.tasks);
    }
})();


const createEmployee = async (employee) => {
    const newEmployee = (await Employee.create({
        firstName: employee.firstName,
        lastName: employee.lastName,
        department: employee.department
    }, {
        returning: true,
        plain: true
    })).dataValues;
    if (employee.tasks?.length > 0) {
        await Task.update({
            EmployeeId: newEmployee.id
        }, {
            where: {
                id: {
                    [Op.in]: employee.tasks
                }
            }
        });
    }
    return {
        employee: newEmployee
    }
};


const createTask = async (task) => {
    return {
        task: (await Task.create({
            description: task.description,
            priorityLevel: task.priorityLevel,
            completionStatus: task.completionStatus,
            EmployeeId: task.EmployeeId
        }, {
            returning: true,
            plain: true
        })).dataValues
    };
};


const getEmployees = async () => {
    return {employees: await Employee.findAll()};
};

const getTasks = async () => {
    return {tasks: await Task.findAll()};
};

const getTask = async (id) => {
    return {
        task: await Task.findAll({
            where: {
                id: id
            }
        })
    };
};

const updateTask = async (task) => {
    return {
        task: (await Task.update({
            description: task.description,
            priorityLevel: task.priorityLevel,
            completionStatus: task.completionStatus,
            EmployeeId: task.EmployeeId
        }, {
            where: {
                id: task.id
            },
            returning: true,
            plain: true
        }))[1].dataValues
    };
};

const deleteTask = async (task) => {
    return {
        rowsDeleted: await Task.destroy({
            where: {
                id: task.id
            }
        })
    };
};

const deleteEmployee = async (employee) => {
    return {
        rowsDeleted: await Employee.destroy({
            where: {
                id: employee.id
            }
        })
    };
};

const updateEmployee = async (employee) => {
    const updatedEmployee = (await Employee.update({
        firstName: employee.firstName,
        lastName: employee.lastName,
        department: employee.department
    }, {
        where: {
            id: employee.id
        },
        returning: true,
        plain: true
    }))[1].dataValues;
    if (employee.tasks?.length > 0) {
        await Task.update({
            EmployeeId: updatedEmployee.id
        }, {
            where: {
                id: {
                    [Op.in]: employee.tasks
                }
            }
        });
        await Task.update({
            EmployeeId: null
        }, {
            where: {
                id: {
                    [Op.notIn]: employee.tasks
                },
                EmployeeId: updatedEmployee.id
            }
        });
    }
    return {
        employee: updatedEmployee
    }
};

export {
    getEmployees,
    getTasks,
    getTask,
    updateTask,
    updateEmployee,
    createTask,
    createEmployee,
    deleteTask,
    deleteEmployee
};