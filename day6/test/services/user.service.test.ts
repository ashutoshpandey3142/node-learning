import { expect } from 'chai';
import sinon from 'sinon';
import User, { IUserCreation } from '../../src/models/user.model';
import { UserService } from '../../src/services/user.service';
import GlobalError from '../../src/utils/errors/GlobalError';

describe('UserService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const userData: IUserCreation = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
            const createdUser = { ...userData, id: '1' };
            User.findOne = sinon.stub().resolves(null);
            User.create = sinon.stub().resolves(createdUser as User);

            const result = await UserService.createUser(userData);
            expect(result).to.deep.equal(createdUser);
        });

        it('should throw an error if user already exists', async () => {
            const userData: IUserCreation = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
            User.findOne = sinon.stub().resolves(userData as User);

            try {
                await UserService.createUser(userData);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(GlobalError);
                expect((error as GlobalError).statusCode).to.equal(409);
                expect((error as GlobalError).message).to.equal('User already exists');
            }
        });
        it("should throw a general error when an unexpected error occurs", async () => {
            const userData: IUserCreation = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
            User.findOne = sinon.stub().returns(null);
            User.create = sinon.stub().throws(new Error("Database error"));
            try {
                await UserService.createUser(userData);
                expect.fail("Expected an error to be thrown.");
            } catch (error: any) {
                expect(error).to.be.instanceOf(GlobalError);
                expect(error.statusCode).to.equal(500);
                expect(error.message).to.equal("Error: Error: Database error");
            }
        });
    });

    describe('getUserById', () => {
        it('should return a user by ID', async () => {
            const user = { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password123' };
            User.findByPk = sinon.stub().resolves(user as User);

            const result = await UserService.getUserById('1');
            expect(result).to.deep.equal(user);
        });

        it('should throw an error if user not found', async () => {
            User.findByPk = sinon.stub().resolves(null);

            try {
                await UserService.getUserById('1');
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(GlobalError);
                expect((error as GlobalError).statusCode).to.equal(404);
                expect((error as GlobalError).message).to.equal('User not found');
            }
        });
        it('should throw GlobalError if there is a database error', async () => {
            const userId = '10';
            const dbError = new Error('Database error');
            User.findByPk = sinon.stub().throws(dbError);

            try {
                await UserService.getUserById(userId);
            } catch (err: any) {
                expect(err).to.be.instanceOf(GlobalError);
                expect(err.statusCode).to.equal(500);
                expect(err.message).to.equal("Error: Error: Database error");
            }
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [
                { id: '1', name: 'John Doe', email: 'john@example.com', password: 'password123' },
                { id: '2', name: 'Jane Doe', email: 'jane@example.com', password: 'password456' }
            ];
            User.findAll = sinon.stub().resolves(users as User[]);

            const result = await UserService.getAllUsers();
            expect(result).to.deep.equal(users);
        });
        it('should throw GlobalError if there is a database error', async () => {
            const dbError = new Error('Database error');
            User.findAll = sinon.stub().throws(dbError);

            try {
                await UserService.getAllUsers();
            } catch (err: any) {
                expect(err).to.be.instanceOf(GlobalError);
                expect(err.message).to.include('Error:');
                expect(err.message).to.equal("Error: Error: Database error");
                expect(err.statusCode).to.equal(500);
            }
        });
    });

    describe('updateUser', () => {

        it('should throw a 404 GlobalError if user not found', async () => {
            User.findByPk = sinon.stub().resolves(null);

            try {
                await UserService.updateUser('1', { name: 'John Updated' });
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(GlobalError);
                expect((error as GlobalError).statusCode).to.equal(404);
                expect((error as GlobalError).message).to.equal('User not found');
            }
        });

        it('should throw a 500 GlobalError on failure', async () => {
            User.findByPk = sinon.stub().throws(new Error('Database error'));

            try {
                await UserService.updateUser('1', { name: 'John Updated' });
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(GlobalError);
                expect((error as GlobalError).message).to.equal('Error: Error: Database error');
            }
        });
    });

   
    describe('deleteUser', () => {
        it('should delete a user', async () => {
            const userId = '1';
            const user = sinon.createStubInstance(User);
            user.id = userId;
            user.name = 'John Doe';
            user.email = 'john@example.com';
            user.password = 'password123';

            user.destroy.resolves();

            User.findByPk = sinon.stub().resolves(user as unknown as User);

            const result = await UserService.deleteUser(userId);
            expect(result).to.deep.equal({ message: 'User deleted successfully' });
            expect(user.destroy.calledOnce).to.be.true;
        });

        it('should throw a 404 GlobalError if user not found', async () => {
            User.findByPk = sinon.stub().resolves(null);

            try {
                await UserService.deleteUser('1');
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(GlobalError);
                expect((error as GlobalError).statusCode).to.equal(404);
                expect((error as GlobalError).message).to.equal('User not found');
            }
        });

        it('should throw a 500 GlobalError on failure', async () => {
            User.findByPk = sinon.stub().throws(new Error('Database error'));

            try {
                await UserService.deleteUser('1');
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(GlobalError);
                expect((error as GlobalError).message).to.equal('Error: Error: Database error');
            }
        });
    });
});
