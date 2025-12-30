import { expect } from 'chai';
import * as utils from '../../lib/utils';

describe('Utils', () => {
  describe('errors function', () => {
    it('should format validation errors into array', () => {
      const errors = {
        email: { message: 'Email is required' },
        username: { message: 'Username is required' }
      };

      const result = utils.errors(errors);

      expect(result).to.be.an('array');
      expect(result).to.include('Email is required');
      expect(result).to.include('Username is required');
    });

    it('should return default error if no errors provided', () => {
      const errors = {};
      const result = utils.errors(errors);

      expect(result).to.eql(['Oops! There was an error']);
    });
  });

  describe('findByParam function', () => {
    const testArray = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ];

    it('should find object without callback', () => {
      const target = { id: 2, name: 'Bob' };
      const result = utils.findByParam(testArray, target);

      expect(result).to.eql(target);
    });

    it('should call callback with found object', (done) => {
      const target = { id: 1, name: 'Alice' };
      utils.findByParam(testArray, target, (err: any, result: any) => {
        expect(err).to.be.undefined;
        expect(result).to.eql(target);
        done();
      });
    });

    it('should call callback with error if not found', (done) => {
      const target = { id: 99, name: 'NotFound' };
      utils.findByParam(testArray, target, (err: any, result: any) => {
        expect(err).to.equal('not found');
        expect(result).to.be.undefined;
        done();
      });
    });

    it('should return undefined if not found without callback', () => {
      const target = { id: 99, name: 'NotFound' };
      const result = utils.findByParam(testArray, target);

      expect(result).to.be.undefined;
    });
  });
});
