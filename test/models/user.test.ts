import { expect } from 'chai';
import mongoose from 'mongoose';
import '../../../app/models/user';

describe('User Model', () => {
  const User = mongoose.model('User');

  before(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        process.env.TEST_DB || 'mongodb://localhost:27017/ntwitter-test'
      );
    }
  });

  after(async () => {
    // Cleanup
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('User creation', () => {
    it('should create a user with valid data', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        provider: 'github',
        github: { id: 123 }
      });

      const savedUser = await user.save();
      expect(savedUser._id).to.exist;
      expect(savedUser.name).to.equal('Test User');
    });

    it('should fail to create user without required fields', async () => {
      const user = new User({
        name: 'Incomplete User'
        // Missing email, username, etc.
      });

      try {
        await user.save();
        expect.fail('Should have thrown validation error');
      } catch (err: any) {
        expect(err).to.exist;
      }
    });
  });

  describe('User authentication', () => {
    it('should authenticate password correctly', async () => {
      const user = new User({
        name: 'Auth Test',
        username: 'authtest',
        email: 'auth@test.com',
        provider: 'local'
      });

      user.password = 'testpassword123';
      const result = user.authenticate('testpassword123');

      expect(result).to.be.true;
    });

    it('should reject invalid password', async () => {
      const user = new User({
        name: 'Auth Test 2',
        username: 'authtest2',
        email: 'auth2@test.com',
        provider: 'local'
      });

      user.password = 'correctpassword';
      const result = user.authenticate('wrongpassword');

      expect(result).to.be.false;
    });
  });

  describe('User methods', () => {
    it('should generate a salt', async () => {
      const user = new User({
        name: 'Salt Test',
        username: 'salttest',
        provider: 'github'
      });

      const salt = user.makeSalt();
      expect(salt).to.be.a('number');
      expect(salt).to.be.greaterThan(0);
    });

    it('should encrypt password', async () => {
      const user = new User({
        name: 'Encrypt Test',
        username: 'encrypttest',
        provider: 'github'
      });

      const encrypted = user.encryptPassword('mypassword');
      expect(encrypted).to.be.a('string');
      expect(encrypted).to.not.equal('mypassword');
    });
  });
});
