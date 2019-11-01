#!/usr/bin/env node

const program = require('commander');
const config = require('../config')
const { help,throwError } = require('./util')
const BootstrapGen = require('./bootstrapGen')

program.on('--help',help)

program
  .version(config.version,'-v, --version')
  .description(`
⚡️  ${config.cliName}
⚡️  An React engineering build tool by Charley`);

program
  .command('new <project-type> <project-name>')
  .description('initialize project')
  .action(function (d, otherD,cmd){
    const result = config.projectTypes.find(v => {
      return v.type === d;
    })
    // 命令校验
    if(!result){
      throwError(`unsupported project type '${d}',only '${config.projectTypes.join('/')}' are supported.`)
    }
    // 初始化工程
    new BootstrapGen(d,otherD,cmd).init(result.repo)
  })

// 生成命令
program
  .command('generate <file-type> <file-name>')
  .description('create project files, such as Module/Component/DTO/Enum/Service')
  .alias('g')
  .action(async function (d, otherD,cmd) {
    const result = config.commandTypes.find(v => {
      return v.command === d || v.alias === d;
    })

    // 匹配 Type
    if(!result){
      throwError(`Unknown parameter type '${d}',type '${config.cliName} -h' for more usages.`)
    }

    // 匹配 Name
    if(!otherD){
      throwError(`Missing parameter <name>,type '${config.cliName} -h' for more usages.`)
    }

    // 生成文件
    await new BootstrapGen(d,otherD,cmd).run()
  })

program.parse(process.argv);