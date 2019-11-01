require('colors');
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer');
const shell = require('shelljs');
const nameStyles = require('name-styles');
const cowsay = require('cowsay');
const ora = require('ora');
const config = require('../config')
const { throwError } = require('./util')

class BootstrapGen {
  constructor(fileType, fileName, cmd) {
    this.fileType = fileType;
    this.fileNameUpper = fileName.toUpperCase();
    this.fileNameCap = nameStyles.pascal(fileName);
    this.fileName = nameStyles.hyphen(fileName);
    this.fileNameCamel = nameStyles.camel(fileName);

    this.cmd = cmd;
    this.cwd = process.cwd().split(path.sep).join('/');

    this.templatePath = path.resolve(__dirname, '../template');
    this.rootDir = null;
    this.relativeDir = null;
    this.currentPathInput = null;
    this.destPath = null;

    // 生成的文件队列
    this.fileQueue = [];
    // 命令对应的 ITEM
    this.result = config.commandTypes.find(v => {
      return v.command === fileType || v.alias === fileType;
    })
  }

  initTip(){
    const filePath = `cd ${this.fileName}`.green;
    const cmd = `npm start`.green;
    const successTip = 
`
Initialize project ${this.fileName} successfully.
run:
    ${filePath}
    ${cmd}
`;
    return successTip;
  }

  // 初始化工程
  init(repo) {
    // 加载图标
    const spinner = ora('Download starter templates...\n').start();

    if (!shell.which('git')) {
      spinner.fail('Sorry, this script requires git\n')
      shell.exit(1);
    }

    shell.exec(`git clone ${repo} ${this.fileName}`,(code, stdout, stderr) => {
      if(code) spinner.fail(stderr);
      else {
        spinner.succeed('Download starter templates...OK\n');
        const spinnerInstall = ora('Install dependiences...\n').start();
        shell.cd(this.fileName)
        // 安装时 silent 运行，不阻塞 loading
        shell.exec(`npm install`, { silent:true },(code, stdout, stderr) => {
          if(code) spinnerInstall.fail(stderr)
          else spinnerInstall.succeed('Install dependiences...OK\n');
          shell.rm('-rf','.git')
          // 打印说明
          console.log(
            cowsay.say({
              text: this.initTip()
            })
          )
        })
      }
    })
  }

  // 生成文件
  async run() {
    this.checkMakuroProject()
    const destPath = await this.checkMakuroPath()
    const { command } = this.result;
    this.destPath = destPath;
    // 执行生成命令
    await this[command + 'Gen'](destPath);
    let successTip = '';
    this.fileQueue.push(
      this.fileNameCap + '.' + command
    )

    this.fileQueue.forEach(v => {
      successTip += `\n  🎉 🎉 🎉  ${v} 创建完成  🎉 🎉 🎉\n`;
    })

    console.log(
      cowsay.say({
        text: successTip
      })
    )
  }

  checkMakuroProject() {
    const srcReg = /\/src\/|\/src$/ig;
    // 必须在 src 中使用
    if (!srcReg.test(this.cwd)) {
      throwError(`请在 src 目录下使用 ${config.cliName} 命令！当前工作目录：${this.cwd}`)
    }

    // 拆解 src 目录
    const [rootDir, relativeDir] = this.cwd.split(srcReg)
    this.rootDir = rootDir;
    this.relativeDir = relativeDir;

    const isMakuroProject = fs.existsSync(rootDir + '/' + config.configName);
    if (!isMakuroProject) throwError(`您所在的不是一个 ${config.cliName} 项目，使用 '${config.cliName} -h' 获取更多使用帮助。`)
  }

  async checkMakuroPath() {
    const pathSuffixConfig = config.pathSuffix[this.result.command]
    const isInValidPath = pathSuffixConfig.reg.test(this.relativeDir);
    let distPath = this.cwd;

    if (!isInValidPath) {
      const validPath = pathSuffixConfig.validPaths.join(' 或 ');
      const choices = [];
      pathSuffixConfig.validPaths.forEach(v => {
        choices.push({
          name: `生成到 src/${v} (推荐)`,
          value: v
        })
      });
      choices.push({
        name: `仍然生成到 src/${this.relativeDir} (不推荐)`,
        value: this.relativeDir
      });

      const input = await inquirer.prompt({
        name: 'pathRequire',
        type: 'rawlist',
        message: `我们强烈建议在 ${validPath} 下生成 ${this.result.command} 文件，请选择进一步操作`,
        choices,
      })

      distPath = this.rootDir + '/src/' + input.pathRequire
    }

    return distPath;
  }

  async checkExist(path, pathAlias = `${this.fileNameCap}.${this.result.command}`) {
    if (fs.existsSync(path)) {
      const input = await inquirer.prompt({
        name: 'cover',
        type: 'confirm',
        message: `${pathAlias} 已存在，是否覆盖原始文件`,
        default: false,
      })

      return {
        cover: input.cover
      }
    }

    return {
      cover: true
    }
  }

  // 获取 Module 下的 Routes 路径
  getModuleRoutesPath(path){
    const splitArr = path.split('pages');
    console.log(splitArr)
    if(splitArr.length < 2){
      return '/' + this.fileName;
    }else{
      return splitArr[1]
      // console.log(this.cwd)
    }
  }

  // 生成 Module
  async moduleGen(destPath){
    // 生成 Module
    const sourceDir = this.templatePath + '/@module/*';
    const destDirName = this.fileName;
    const destDir = destPath + '/' + destDirName;
    const { cover } = await this.checkExist(destDir);
    if (!cover) return;

    shell.cd(destPath);
    shell.mkdir(destDirName);
    shell.cp('-R', sourceDir, destDir);
    shell.cd(destDirName);

    shell.ls().forEach(file => {
      // const routesPath = destDir.split(path.sep)[1];
      const routesPath = this.getModuleRoutesPath(destDir)
      let destFileName = file;
      if (/^fname\.|\.tpl$/ig.test(file)) {
        destFileName = this.fileName + '.' + file.replace(/^fname\.|\.tpl$/ig, '');
        shell.mv(file, destFileName)
      }
      // component less
      shell.sed('-i', /%_ModuleName_%/g, this.fileNameCap + 'Module', destFileName);
      // route
      shell.sed('-i', /%_RoutesName_%/g, this.fileNameCamel + 'Routes', destFileName);
      // 文件名
      shell.sed('-i', /\.\/fname/g, './' + this.fileName, destFileName);
      // Routes 的 path
      shell.sed('-i', /%_RoutesPath_%/g, routesPath, destFileName)
    })
  }

  async componentGen(destPath) {
    // 生成组件
    const sourceDir = this.templatePath + '/@component/*';
    const destDirName = this.fileName + '-component';
    const destDir = destPath + '/' + destDirName;
    let destStoreName = '';
    const { cover } = await this.checkExist(destDir);
    if (!cover) return;

    shell.cd(destPath);
    shell.mkdir(destDirName);
    shell.cp('-R', sourceDir, destDir);
    shell.cd(destDirName);
    shell.ls().forEach(file => {
      let destFileName = file;
      if (/^fname\.|\.tpl$/ig.test(file)) {
        destFileName = this.fileName + '.' + file.replace(/^fname\.|\.tpl$/ig, '');
        shell.mv(file, destFileName)
        if (/\.store\./g.test(destFileName)) {
          destStoreName = destFileName;
        }
      }
      // component less
      shell.sed('-i', /%_ComponentName_%/g, this.fileNameCap + 'Component', destFileName);
      // store
      shell.sed('-i', /%_StoreName_%/g, this.fileNameCap + 'Store', destFileName);
      shell.sed('-i', /%_StoreNameAttr_%/g, this.fileNameCamel + 'Store', destFileName);

      // 文件名
      shell.sed('-i', /\.\/fname/g, './' + this.fileName, destFileName);
    })

    // 自动注入 Store
    await this.storeGen(destDirName, destStoreName);
  }

  resolveAliasPath(){
    let framePaths = this.destPath.split('framework')
    let soluctionPaths = this.destPath.split('solution')
    let path = '';

    if(framePaths.length > 1){
      framePaths.shift();
      path = '~/framework/' + framePaths.join('')
      return path;
    }

    if(soluctionPaths.length > 1){
      soluctionPaths.shift();
      path = '~/solution/' + soluctionPaths.join('').substr(1)
      return path;
    }
  }

  async storeGen(componentDestDirName, destStoreName) {
    // 导入的文件不要后缀
    destStoreName = destStoreName.replace('.ts','');
    const storeDir = this.rootDir + '/src/' + config.pathSuffix.store.validPaths[0]
    const storePath = storeDir + '/store.all.ts';
    // component.module.ts 路径
    const componentModuleDir = this.rootDir + '/src/' + config.pathSuffix.component.validPaths[1]
    const componentModulePath = componentModuleDir + '/component.module.ts';
    const storeContent = fs.readFileSync(storePath).toString();
    const componentModuleComponent = fs.readFileSync(componentModulePath).toString();

    const storeClassName = this.fileNameCap + 'Store';
    const tabSpace = ' ' + ' ';

    const packageEndReg = /\/\/\s+--\s+Package\s+End\s+--/g
    const attrEndReg = /\/\/\s+--\s+Attr\s+End\s+--/g
    const packageEndStr = `//  -- Package End --`;
    const attrEndStr = `${tabSpace}//  -- Attr End --`;

    const storeAlias = this.resolveAliasPath();
    // 是否为 components 组件目录
    const isComponentsDir = storeAlias.startsWith('~/solution/');
    if(isComponentsDir){
      const importStr = `export { ${this.fileNameCap}Component } from '${storeAlias}/${componentDestDirName}/${this.fileName}.component';`;
      const componentModuleContentAfterImport = componentModuleComponent.replace(packageEndReg, importStr + '\n' + packageEndStr)
      fs.writeFileSync(componentModulePath, componentModuleContentAfterImport);
    }
    
    const importStr = `import { ${storeClassName} } from '${storeAlias}/${componentDestDirName}/${destStoreName}';`;
    const attrStr = `${this.fileNameCamel}Store: ${storeClassName} = new ${storeClassName}();`;
    const storeContentAfterImport = storeContent.replace(packageEndReg, importStr + '\n' + packageEndStr)
    const storeContentAfterAttr = storeContentAfterImport.replace(attrEndReg, attrStr + '\n' + attrEndStr)

    fs.writeFileSync(storePath, storeContentAfterAttr);
  }

  async dtoGen(destPath, optional = false) {
    // 生成 DTO
    const sourceDir = this.templatePath + '/@dto/*';

    const { cover } = await this.checkExist(destPath + `/${this.fileName}.${this.result.command}.ts`);
    if (!cover) return;

    shell.cd(destPath);
    shell.cp('-R', sourceDir, destPath);
    shell.ls().forEach(file => {
      let destFileName = file;
      if (/^fname\.|\.tpl$/ig.test(file)) {
        destFileName = this.fileName + '.' + file.replace(/^fname\.|\.tpl$/ig, '');
        shell.mv(file, destFileName)
      }
      shell.sed('-i', /%_DtoName_%/g, this.fileNameCap, destFileName);
    })

    if (optional) {
      this.fileQueue.push(
        this.fileNameCap + '.dto'
      )
    } else {
      await this.genOptionalFile();
    }
  }

  async genOptionalFile() {
    let
      optionalMsg = '',
      optionalPath = '',
      optionalCommand = '';
    const { alias } = this.result;
    if (alias === 'd') {
      optionalMsg = '是否同步生成对应的 Service 文件'
      optionalPath = config.pathSuffix.service.validPaths[0];
      optionalCommand = 'service';
    } else if (alias === 's') {
      optionalMsg = '是否同步生成对应的 Dto 文件'
      optionalPath = config.pathSuffix.dto.validPaths[0];
      optionalCommand = 'dto';
    }

    const input = await inquirer.prompt({
      name: 'optionalPath',
      type: 'confirm',
      message: optionalMsg,
      default: true,
    })

    if (input.optionalPath) {
      this[optionalCommand + 'Gen'](this.rootDir + '/src/' + optionalPath, true)
    }
  }

  async enumGen(destPath) {
    // 生成枚举
    const sourceDir = this.templatePath + '/@enum/*';

    const { cover } = await this.checkExist(destPath + `/${this.fileName}.${this.result.command}.ts`);
    if (!cover) return;

    shell.cd(destPath);
    shell.cp('-R', sourceDir, destPath);
    shell.ls().forEach(file => {
      let destFileName = file;
      if (/^fname\.|\.tpl$/ig.test(file)) {
        destFileName = this.fileName + '.' + file.replace(/^fname\.|\.tpl$/ig, '');
        shell.mv(file, destFileName)
      }
      // 不启用 namespace
      // shell.sed('-i', /%_EnumName_%/g, this.fileNameCap + 'Enum', destFileName);
      shell.sed('-i', /%_EnumNameCap%/g, this.fileNameUpper, destFileName);
    })
  }

  async serviceGen(destPath, optional = false) {
    // 生成 Service
    const sourceDir = this.templatePath + '/@service/*';

    const { cover } = await this.checkExist(destPath + `/${this.fileName}.${this.result.command}.ts`);
    if (!cover) return;

    shell.cd(destPath);
    shell.cp('-R', sourceDir, destPath);
    shell.ls().forEach(file => {
      let destFileName = file;
      if (/^fname\.|\.tpl$/ig.test(file)) {
        destFileName = this.fileName + '.' + file.replace(/^fname\.|\.tpl$/ig, '');
        shell.mv(file, destFileName)
      }
      shell.sed('-i', /%_DtoName_%/g, this.fileNameCap, destFileName);
      shell.sed('-i', /%_DtoPath_%/g, '../dto/' + this.fileName + '.dto', destFileName);
      shell.sed('-i', /%_ServiceName_%/g, this.fileNameCap + 'Service', destFileName);
    })

    if (optional) {
      this.fileQueue.push(
        this.fileNameCap + '.service'
      )
    } else {
      await this.genOptionalFile();
    }
  }
}

module.exports = BootstrapGen;