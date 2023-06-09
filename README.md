# Localization

[![npm version](https://badge.fury.io/js/@universal-packages%2Flocalization.svg)](https://www.npmjs.com/package/@universal-packages/localization)
[![Testing](https://github.com/universal-packages/universal-localization/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-localization/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-localization/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-localization)

Dynamic localization with fallbacks and variable replacement.

## Install

```shell
npm install @universal-packages/localization
```

## Localization

Localization class is the high level representation of the localization object, it provides tools to internationalize your app.

```js
import { Localization } from '@universal-packages/localization'

const localization = new Localization()

console.log(localization.translate('hello'))
//> Hello
console.log(localization.translate('world'))
//> World
console.log(localization.translate('name.hello', null, { name: 'John', emoji: '👋' }))
//> Hello John 👋

console.log(localization.translate('hello', 'en-US'))
//> Howdy
console.log(localization.translate('world', 'en-US'))
//> World
console.log(localization.translate('name.hello', 'en-US', { name: 'John', emoji: '👋' }))
//> Howdy John 👋

console.log(localization.translate('hello', 'es'))
//> Hola
console.log(localization.translate('world', 'es'))
//> Mundo
console.log(localization.translate('name.hello', 'es', { name: 'Juan', emoji: '👋' }))
//> Hola Juan 👋

console.log(localization.translate('hello', 'es-MX'))
//> Que onda
console.log(localization.translate('world', 'es-MX'))
//> Mundo
console.log(localization.translate('name.hello', 'es-MX', { name: 'Juanito', emoji: '👋' }))
//> Que onda Juanito 👋
```

### Options

- **`dictionary`** `LocalizationDictionary`
  The dictionary to use for the localization, in case you aleady have a dictionary, you can pass it here.
- **`useFileName`** `boolean` `default: true`
  If you want your translations to be namespaced by the name of the file they are in, you can set this to true.
- **`localizationsLocation`** `string` `default: './src`
  The path to the folder where the localizations are located. Files can be `json`, `yaml`, `js`, `ts` and can be nested deeply in the folder structure and should be prefixed with the locale they are for alongside `local`
  ```
  - src
    |- general.en-US.local.yaml
    |- general.es-MX.local.yaml
    |- mailers
      |- welcome.en-US.local.yaml
      |- welcome.es-MX.local.yaml
    |- pages
      |- home.en-US.local.yaml
      |- home.es-MX.local.yaml
  ```
- **`defaultLocale`** `Locale` `default: 'en`
  The default locale to use when no locale is provided.

### Instance methods

#### **`.translate(subject: string | string[], locale: string, [locales: Object])`**

- **`subject`** `string | string[]`
  The path to the translation you want to get, Use dot notation to access nested translations or an array of string.
- **`locale`** `string`
  A valid locale string, it will be used to look for the translation in the dictionary.
- **`locales`** `Object`
  If the target translation needs variables to be replaced, you can pass them as an object here. use `{{ <variableName> }}` in the translation to indicate where the variable should be placed.

Looks for a translation in the current locale, if it doesn’t find it, it will look for it in the fallback locale, if it doesn’t find it there either, it will return the subject.

## Events

Warning and errors related to missing dictionaries and translations are emitted as events.

```js
const localization = new Localization()

localization.on('waring', (warning) => console.log(warning))
localization.on('error', (error) => console.log(error))
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
