import { expect } from 'chai';
import mongoose from 'mongoose';
import '../../../app/models/user';
import '../../../app/models/tweets';

describe('Tweet Model', () => {
  const Tweet = mongoose.model('Tweet');
  const User = mongoose.model('User');
  let testUser: any;

  before(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        process.env.TEST_DB || 'mongodb://localhost:27017/ntwitter-test'
      );
    }

    // Create a test user
    testUser = new User({
      name: 'Tweet Test User',
      email: 'tweettest@example.com',
      username: 'tweettestuser',
      provider: 'github',
      github: { id: 456, avatar_url: 'https://example.com/avatar.jpg' }
    });
    await testUser.save();
  });

  after(async () => {
    // Cleanup
    await Tweet.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Tweet creation', () => {
    it('should create a tweet with valid data', async () => {
      const tweet = new Tweet({
        body: 'This is a test tweet',
        user: testUser._id
      });

      const savedTweet = await tweet.save();
      expect(savedTweet._id).to.exist;
      expect(savedTweet.body).to.equal('This is a test tweet');
      expect(savedTweet.user).to.eql(testUser._id);
    });

    it('should fail to create tweet without body', async () => {
      const tweet = new Tweet({
        user: testUser._id
      });

      try {
        await tweet.save();
        expect.fail('Should have thrown validation error');
      } catch (err: any) {
        expect(err).to.exist;
      }
    });
  });

  describe('Tweet hashtags', () => {
    it('should store hashtags in lowercase', async () => {
      const tweet = new Tweet({
        body: 'Tweet with #Tags #NODE #TypeScript',
        user: testUser._id,
        tags: ['Tags', 'NODE', 'TypeScript']
      });

      const savedTweet = await tweet.save();
      expect(savedTweet.tags).to.include('tags');
      expect(savedTweet.tags).to.include('node');
      expect(savedTweet.tags).to.include('typescript');
    });
  });

  describe('Tweet comments', () => {
    it('should add a comment to a tweet', async () => {
      const tweet = new Tweet({
        body: 'Commentable tweet',
        user: testUser._id
      });

      const savedTweet = await tweet.save();

      const comment = { body: 'Great tweet!' };
      savedTweet.addComment(testUser, comment, (err: any) => {
        if (err) throw err;
      });

      expect(savedTweet.comments.length).to.equal(1);
      expect(savedTweet.comments[0].body).to.equal('Great tweet!');
    });
  });

  describe('Tweet favorites', () => {
    it('should track favorites count', async () => {
      const tweet = new Tweet({
        body: 'Favorable tweet',
        user: testUser._id,
        favorites: [testUser._id]
      });

      const savedTweet = await tweet.save();
      expect(savedTweet.favoritesCount).to.equal(1);
    });
  });

  describe('Tweet static methods', () => {
    it('should list tweets with pagination', async () => {
      const options = {
        criteria: {},
        perPage: 10,
        page: 0
      };

      const tweets = await Tweet.list(options);
      expect(tweets).to.be.an('array');
    });

    it('should count user tweets', async () => {
      const tweet = new Tweet({
        body: 'Count this tweet',
        user: testUser._id
      });

      await tweet.save();

      Tweet.countUserTweets(testUser._id, (err: any, count: any) => {
        if (err) throw err;
        expect(count).to.be.greaterThan(0);
      });
    });
  });
});
