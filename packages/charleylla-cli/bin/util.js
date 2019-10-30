const config = require(`../config`)

// 自定义帮助
function help(){
  console.log(``)
  console.log(`Usage:` + '\n');

  for(let i = 0; i < config.commandTypes.length; i++){
    const { prefix,desc,alias,command } = config.commandTypes[i];
    console.log(`${prefix}  ${prefix}  ${desc}  ${prefix}  ${prefix}` + '\n');
    console.log(` - ${config.cliName} generate ${command} <your-${command}-name>`)
    console.log(` - ${config.cliNameAlias} generate ${command} <your-${command}-name>`)
    console.log('\n' + `Or use by the alias way:` + '\n')
    console.log(` - ${config.cliName} g ${alias} <your-${command}-name>`)
    console.log(` - ${config.cliNameAlias} g ${alias} <your-${command}-name>`)
    console.log(``)
  }

  console.log(``)
}

function throwError(errMsg){
  throw new Error(` ❌  ${errMsg}`)
}

module.exports = {
  help,
  throwError
};