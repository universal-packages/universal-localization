# Localization

[![npm version](https://badge.fury.io/js/@universal-packages%2Fstate.svg)](https://www.npmjs.com/package/@universal-packages/localization)
[![Testing](https://github.com/universal-packages/universal-localization/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-localization/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-localization/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-localization)

Dynamic localization with fallbacks and variable replacement.

## Install

```shell
npm install @universal-packages/localization
```

## Localization

Localization class is the high level representation of the localization object, it provides all tools related to modify and read from localization.

```js
import { Localization } from '@universal-packages/localization'

const dictionary: LocalizationDictionary = {
  en: {
    hello: 'Hello',
    world: 'World',
    name: {
      hello: 'Hello {{name}} {{emoji}}'
    }
  },
  'en-US': {
    hello: 'Howdy',
    world: 'World',
    name: {
      hello: 'Howdy {{name}} {{emoji}}'
    }
  },
  es: {
    hello: 'Hola',
    world: 'Mundo',
    name: {
      hello: 'Hola {{name}} {{emoji}}'
    }
  },
  'es-MX': {
    hello: 'Que onda',
    world: 'Mundo',
    name: {
      hello: 'Que onda {{name}} {{emoji}}'
    }
  },
  'fr-CM': {
    hello: 'Bonjour',
    world: 'Monde',
    name: {
      hello: 'Bonjour {{name}} {{emoji}}'
    }
  }
}

const localization = new Localization(dictionary)

console.log(localization.translate('hello'))
//> Hello
console.log(localization.translate('world'))
//> World
console.log(localization.translate('name.hello', { name: 'John', emoji: '👋' }))
//> Hello John 👋

localization.setLocale('en-US')
console.log(localization.translate('hello'))
//> Howdy
console.log(localization.translate('world'))
//> World
console.log(localization.translate('name.hello', { name: 'John', emoji: '👋' }))
//> Howdy John 👋

localization.setLocale('es')
console.log(localization.translate('hello'))
//> Hola
console.log(localization.translate('world'))
//> Mundo
console.log(localization.translate('name.hello', { name: 'Juan', emoji: '👋' }))
//> Hola Juan 👋

localization.setLocale('es-MX')
console.log(localization.translate('hello'))
//> Que onda
console.log(localization.translate('world'))
//> Mundo
console.log(localization.translate('name.hello', { name: 'Juanito', emoji: '👋' }))
//> Que onda Juanito 👋
```

### Instance methods

#### **`.translate(subject: string | string[], [locales: Object])`**

- **`subject`** `string | string[]`
  The path to the translation you want to get, Use dot notation to access nested translations or an array of string.
- **`locales`** `Object`
  If the target translation needs variables to be replaced, you can pass them as an object here. use `{{ <variableName> }}` in the translation to indicate where the variable should be placed.

Looks for a translation in the current locale, if it doesn’t find it, it will look for it in the fallback locale, if it doesn’t find it there either, it will return the subject.

## Events

When the locale changes, the instance will emit the event, useful to subscribe to locale changes form other places of the app agnostic to the origin change.

```js
const localization = new Localization(dictionary)

localization.on('change', (locale, localeDictionary) => console.log('Localization changed'))
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
