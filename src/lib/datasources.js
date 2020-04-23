
// const GithubAPI = require('./src/graphql/datasources/github-cacheable');
// const CircleCIAPI = require('./src/graphql/datasources/circleci');


const loadDatasources = ({config}) => {
  // search oldProjects for all extends
  const extendsArr = config.projects.reduce((acc, projectValue) => {
    projectValue.extends.forEach((extendValue) => {
      if (!acc.includes(extendValue)) {
        acc.push(extendValue);
      }
    });

    return acc
  }, []);

  // find all defaults that have a datasource that matches unique extends
  const usedDefaults = Object.keys(config.defaults).filter((key) => extendsArr.includes(key));

  // return datasources
  return usedDefaults.reduce((acc, defaultValue) => {
    if(defaultValue && config.defaults[defaultValue].datasource && !acc.includes(config.defaults[defaultValue].datasource)) {
      acc.push(config.defaults[defaultValue].datasource);
    }
    return acc;
  }, []);
};

module.exports = {
  loadDatasources
}
