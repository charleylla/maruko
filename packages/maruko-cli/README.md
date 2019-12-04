## maruko
### An engineering building tool

### Install
```
npm install -g @charleylla/maruko-cli
yarn global add @charleylla/maruko-cli
```

### View help information
```
maruko -h
icb -h
```

### Initialize project
```
icb new <project-type> <project-name>
maruko new <project-type> <project-name>
```

see the currently supported project types below

### Currently supported project type

- [x] react
- [x] react-hooks
- [ ] vue
- [ ] flutter

### Usage
```
🍉  🍉  Create Module  🍉  🍉

 - maruko generate module <your-module-name>
 - icb generate module <your-module-name>

Or use by the alias way:

 - maruko g m <your-module-name>
 - icb g m <your-module-name>

🍌 🍌 Create Component 🍌 🍌     
       
- maruko generate component <your-component-name>
- icb generate component <your-component-name>

Or use by the alias way:
   
- maruko g c <your-component-name>
- icb g c <your-component-name>

🍎 🍎 Create DTO 🍎 🍎

- maruko generate dto <your-dto-name>
- icb generate dto <your-dto-name>

Or use by the alias way:

- maruko g d <your-dto-name>
- icb g d <your-dto-name>

🍐 🍐 Create Enum 🍐 🍐  

- maruko generate enum <your-enum-name>
- icb generate enum <your-enum-name>

Or use by the alias way:

- maruko g e <your-enum-name>
- icb g e <your-enum-name>

🍇 🍇 Create Service 🍇 🍇

- maruko generate service <your-service-name>
- icb generate service <your-service-name>

Or use by the alias way:

- maruko g s <your-service-name>
- icb g s <your-service-name>
```

### Component Templates

alse, you can choose the template of your component, we support the following template styles:

- Mobx
- React Hooks with useReducer
- React Hooks with useState

to create a component with a certain template, you can run ``` maruko g c <your-component-name> -t <component-type>```, we currently support the following component types:

- mobx (or you can use the alias name 'm')
- hooks-reducer (or you can use the alias name 'r')
- hooks-state (or you can use the alias name 's')

for example:

```
maruko g c test -t mobx
maruko g c test -t hooks-reducer
maruko g c test -t hooks-state

or 

maruko g c test -t m
maruko g c test -t r
maruko g c test -t s
```

the 'hooks-state' is the default template type, to use template with hooks-reducer, you can directly run:
```
maruko g c <your-component-name>
```