const config = require('config');
const conf = require('./conf');

jest.mock('config');

describe('conf', () => {
  let fullConfig;

  beforeEach(() => {
    fullConfig = {
      projects: [
        { org: 'org', project: 'project' },
        { org: 'lorem', project: 'ipsum', extends: ['subType'] }
      ],
      defaults: {
        subType: {
          key: 'value'
        }
      }
    };
  });

  describe('find', () => {
    beforeEach(() => {
      config.get = jest.fn().mockReturnValueOnce([
        { org: 'org', project: 'project' },
        { org: 'lorem', project: 'ipsum' }
      ]);
    });

    it('should find projects by org and project', () => {
      const result = conf.find('lorem', 'ipsum');

      expect(config.get).toBeCalledWith('projects');
      expect(result).toEqual({
        org: 'lorem',
        project: 'ipsum'
      });
    });

    it('should return nothing if project is not found', () => {
      const result = conf.find('dolor', 'sit');

      expect(config.get).toBeCalledWith('projects');
      expect(result).toEqual(undefined);
    });
  });

  describe('merge', () => {
    it('should return a non-extended object', () => {});
    it('should return an extended object', () => {
      const result = conf.merge(fullConfig.projects[1], fullConfig.defaults);

      expect(result).toBeDefined();
    });
  });

  describe('list', () => {
    it('should list simple data', () => {
      config.get = jest.fn().mockReturnValueOnce([
        { org: 'org', project: 'project' },
        { org: 'lorem', project: 'ipsum' }
      ]);

      const result = conf.list();

      expect(config.get).toBeCalledWith('projects');
      expect(result).toEqual([
        { org: 'org', project: 'project' },
        { org: 'lorem', project: 'ipsum' }
      ]);
    });

    it('should load data with extends', () => {
      config.get = jest.fn();
      config.has = jest.fn();

      config.get.mockReturnValueOnce(fullConfig.projects);
      config.has.mockReturnValueOnce(true);
      config.get.mockReturnValueOnce(fullConfig.defaults);

      const result = conf.list();

      expect(config.get).toBeCalledWith('projects');
      expect(config.has).toBeCalledWith('defaults');
      expect(config.get).toBeCalledWith('defaults');

      expect(result).toEqual([
        { org: 'org', project: 'project' },
        {
          org: 'lorem',
          project: 'ipsum',
          extends: ['subType'],
          key: 'value'
        }
      ]);
    });

    it('should load data with invalid extends', () => {
      fullConfig = {
        projects: [
          { org: 'org', project: 'project' },
          { org: 'lorem', project: 'ipsum', extends: ['invalidSubType'] }
        ],
        defaults: {
          subType: {
            key: 'value'
          }
        }
      };

      config.get = jest.fn().mockReturnValueOnce(fullConfig.projects);

      config.has = jest.fn().mockReturnValueOnce(true);
      config.get.mockReturnValueOnce([
        { org: 'org', project: 'project' },
        {
          org: 'lorem',
          project: 'ipsum',
          extends: ['invalidSubType'],
          subType: {
            key: 'value'
          }
        }
      ]);

      const result = conf.load({ org: 'lorem', project: 'ipsum' });

      expect(config.get).toBeCalledWith('projects');
      expect(config.has).toBeCalledWith('defaults');

      expect(result).toEqual({
        org: 'lorem',
        project: 'ipsum',
        extends: ['invalidSubType']
      });
    });
  });

  describe('load', () => {
    it('should load simple data', () => {
      config.get = jest.fn().mockReturnValueOnce([
        { org: 'org', project: 'project' },
        { org: 'lorem', project: 'ipsum' }
      ]);

      const result = conf.load({ org: 'lorem', project: 'ipsum' });

      expect(config.get).toBeCalledWith('projects');
      expect(result).toEqual({
        org: 'lorem',
        project: 'ipsum'
      });
    });

    it('should load data with extends', () => {
      config.get = jest.fn();
      config.has = jest.fn();

      config.get.mockReturnValueOnce(fullConfig.projects);
      config.has.mockReturnValueOnce(true);
      config.get.mockReturnValueOnce(fullConfig.defaults);

      const result = conf.load({ org: 'lorem', project: 'ipsum' });

      expect(config.get).toBeCalledWith('projects');
      expect(config.has).toBeCalledWith('defaults');
      expect(config.get).toBeCalledWith('defaults');

      expect(result).toEqual({
        org: 'lorem',
        project: 'ipsum',
        extends: ['subType'],
        key: 'value'
      });
    });

    it('should load data with invalid extends', () => {
      fullConfig = {
        projects: [
          { org: 'org', project: 'project' },
          { org: 'lorem', project: 'ipsum', extends: ['invalidSubType'] }
        ],
        defaults: {
          subType: {
            key: 'value'
          }
        }
      };

      config.get = jest.fn().mockReturnValueOnce(fullConfig.projects);

      config.has = jest.fn().mockReturnValueOnce(true);
      config.get.mockReturnValueOnce([
        { org: 'org', project: 'project' },
        {
          org: 'lorem',
          project: 'ipsum',
          extends: ['invalidSubType'],
          subType: {
            key: 'value'
          }
        }
      ]);

      const result = conf.load({ org: 'lorem', project: 'ipsum' });

      expect(config.get).toBeCalledWith('projects');
      expect(config.has).toBeCalledWith('defaults');

      expect(result).toEqual({
        org: 'lorem',
        project: 'ipsum',
        extends: ['invalidSubType']
      });
    });
  });
});
