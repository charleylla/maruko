const packageJson = require('../package.json')

module.exports = {
  cliName: 'maruko',
  cliNameAlias: 'icb',
  version: `maruko v${packageJson.version}`,
  configName:'maruko-cli.json',
  projectTypes:[
    {
      type:'react',
      repo:'ssh://git@220.167.101.49:18389/FE-ZeroToOne/icb-react-starter.git'
    }
  ],
  pathSuffix:{
    module:{
      reg:/solution\/pages\/|solution\/pages$|solution\/components\/|solution\/components$|framework/,
      validPaths:['solution/pages']
    },
    component:{
      reg:/solution\/pages\/|solution\/pages$|solution\/components\/|solution\/components$|framework/,
      validPaths:['solution/pages','solution/components']
    },
    dto:{
      reg:/solution\/model\/dto$|framework/,
      validPaths:['solution/model/dto']
    },
    enum:{
      reg:/solution\/shared\/enums$|framework/,
      validPaths:['solution/shared/enums']
    },
    service:{
      reg:/solution\/model\/services$|framework/,
      validPaths:['solution/model/services']
    },
    store:{
      validPaths:['solution/store']      
    }
  },
  commandTypes: [
    {
      command:'module',
      alias:'m',
      desc:'Create Module',
      prefix:'🍉',
    },
    {
      command:'component',
      alias:'c',
      desc:'Create Component',
      prefix:'🍌',
    },
    {
      command:'dto',
      alias:'d',
      desc:'Create DTO',
      prefix:'🍎',
    },
    {
      command:'enum',
      alias:'e',
      desc:'Create Enum',
      prefix:'🍐',
    },
    {
      command:'service',
      alias:'s',
      desc:'Create Service',
      prefix:'🍇',
    },
  ]
}