# Localization

[![npm version](https://badge.fury.io/js/@universal-packages%2Flocalization.svg)](https://www.npmjs.com/package/@universal-packages/localization)
[![Testing](https://github.com/universal-packages/universal-localization/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-localization/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-localization/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-localization)

Type-safe localization with smart locale fallbacks and variable replacement.

## Install

```shell
npm install @universal-packages/localization
```

## Localization

Localization class provides type-safe internationalization for your application with an intuitive, object-oriented API.

```js
import { Localization } from '@universal-packages/localization'

const primaryDictionary = {
  hello: {
    en: 'Hello',
    'en-US': 'Howdy',
    es: 'Hola',
    'es-MX': 'Que onda'
  },
  world: {
    en: 'World',
    es: 'Mundo'
  },
  name: {
    hello: {
      en: 'Hello {{name}} {{emoji}}',
      'en-US': 'Howdy {{name}} {{emoji}}',
      es: 'Hola {{name}} {{emoji}}',
      'es-MX': 'Que onda {{name}} {{emoji}}'
    }
  }
}

const localization = new Localization({ primaryDictionary })

// Use the default locale (en)
console.log(localization.translate.hello())
//> Hello
console.log(localization.translate.world())
//> World
console.log(localization.translate.name.hello({ name: 'John', emoji: '👋' }))
//> Hello John 👋

// Change locale
localization.setLocale('en-US')
console.log(localization.translate.hello())
//> Howdy
console.log(localization.translate.world())
//> World (falls back to 'en' when 'en-US' not available)
console.log(localization.translate.name.hello({ name: 'John', emoji: '👋' }))
//> Howdy John 👋

// Use Spanish locale
localization.setLocale('es')
console.log(localization.translate.hello())
//> Hola
console.log(localization.translate.world())
//> Mundo
console.log(localization.translate.name.hello({ name: 'Juan', emoji: '👋' }))
//> Hola Juan 👋

// Use Mexican Spanish locale
localization.setLocale('es-MX')
console.log(localization.translate.hello())
//> Que onda
console.log(localization.translate.world())
//> Mundo (falls back to 'es' when 'es-MX' not available)
console.log(localization.translate.name.hello({ name: 'Juanito', emoji: '👋' }))
//> Que onda Juanito 👋
```

### Options

- **`primaryDictionary`** `Dictionary<T>` (required)
  The main dictionary containing all your translations.
- **`secondaryDictionary`** `Dictionary<S>` (optional)
  Additional translations that will be merged with the primary dictionary.
- **`defaultLocale`** `Locale` (optional, default: 'en')
  The default locale to use when instance is created. You can change the locale later using the `.setLocale(locale: Locale)` method.

### Dictionary Structure

Dictionaries should be structured as nested objects with translations at the leaf nodes:

```js
const dictionary = {
  // Simple key
  hello: {
    en: 'Hello',
    es: 'Hola'
  },
  // Nested keys
  dashboard: {
    welcome: {
      en: 'Welcome to the dashboard',
      es: 'Bienvenido al panel'
    },
    stats: {
      users: {
        en: '{{count}} users',
        es: '{{count}} usuarios'
      }
    }
  }
}
```

### Locale Fallback Strategy

The Localization class implements a smart fallback strategy when a requested locale doesn't exist:

1. If the exact locale exists (e.g., 'en-US'), it will be used
2. If not, it falls back to the base language (e.g., 'en' from 'en-US')
3. If the base language doesn't exist, it falls back to any variant of that language (e.g., 'en-GB')
4. If no variants exist, it falls back to any available locale

### Instance methods

#### **`.setLocale(locale: Locale)`**

- **`locale`** `string`
  Sets the active locale. The fallback strategy is applied if the exact locale is not available.

#### **`.translate`**

The `translate` property is a proxy that mirrors your dictionary structure with functions at the leaf nodes:

```js
// Access simple key
localization.translate.hello()

// Access nested key
localization.translate.dashboard.welcome()

// With variable substitution
localization.translate.dashboard.stats.users({ count: 42 })
```

### Static methods

#### **`Localization.inferDefault(options: LocalizationOptions)`**

Returns the default locale that would be selected based on the provided options, without creating a full Localization instance. This is useful when you need to know what locale will be used without instantiating the full class.

```js
const locale = Localization.inferDefault({
  primaryDictionary,
  defaultLocale: 'fr'
})
console.log(locale) // 'fr' if available, or follows fallback strategy
```

## Events

The Localization class extends EventEmitter and emits warnings for missing translations and other issues:

```js
const localization = new Localization({ primaryDictionary })

localization.on('warning', (event) => console.log(event.message))
```

Example warning events:

- Missing translations for specific locales
- Translation key does not exist
- No translation found for a key in the current locale
- Locale not found, falling back to another

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
