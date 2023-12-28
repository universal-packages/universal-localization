import { Localization } from '../src'

describe(Localization, (): void => {
  it('loads the dictionary', async (): Promise<void> => {
    const localization = new Localization({ localizationsLocation: './tests/__fixtures__/good' })

    await localization.prepare()

    expect(localization.dictionary).toEqual({
      en: { first: { hello: 'Hello', world: 'World', name: { hello: 'Hello {{name}} {{emoji}}' } }, second: { door: 'Door' }, light: 'Light' },
      'en-US': { first: { hello: 'Howdy', world: 'World', name: { hello: 'Howdy {{name}} {{emoji}}' } } },
      es: { first: { hello: 'Hola', world: 'Mundo', name: { hello: 'Hola {{name}} {{emoji}}' } }, second: { door: 'Puerta' }, third: { light: 'Luz' } },
      'es-MX': { first: { hello: 'Que onda', world: 'Mundo', name: { hello: 'Que onda {{name}} {{emoji}}' } } },
      'fr-CM': { first: { hello: 'Bonjour', world: 'Monde', name: { hello: 'Bonjour {{name}} {{emoji}}' } } }
    })
  })

  it('loads the dictionary ignoring file name as root key', async (): Promise<void> => {
    const localization = new Localization({ localizationsLocation: './tests/__fixtures__/good', useFileName: false })

    await localization.prepare()

    expect(localization.dictionary).toEqual({
      en: { hello: 'Hello', world: 'World', name: { hello: 'Hello {{name}} {{emoji}}' }, door: 'Door', light: 'Light' },
      'en-US': { hello: 'Howdy', world: 'World', name: { hello: 'Howdy {{name}} {{emoji}}' } },
      es: { hello: 'Hola', world: 'Mundo', name: { hello: 'Hola {{name}} {{emoji}}' }, door: 'Puerta', light: 'Luz' },
      'es-MX': { hello: 'Que onda', world: 'Mundo', name: { hello: 'Que onda {{name}} {{emoji}}' } },
      'fr-CM': { hello: 'Bonjour', world: 'Monde', name: { hello: 'Bonjour {{name}} {{emoji}}' } }
    })
  })

  it('emits error if a locale can be inferred from the file name nor any of the keys inside seem to be locales', async (): Promise<void> => {
    const localization = new Localization({ localizationsLocation: './tests/__fixtures__/bad' })
    const errorMock = jest.fn()

    localization.on('error', errorMock)

    await localization.prepare()

    expect(errorMock.mock.calls).toEqual([
      [{ event: 'error', error: new Error('Invalid locale "hello" coming from "first.local"') }],
      [{ event: 'error', error: new Error('Invalid locale "world" coming from "first.local"') }],
      [{ event: 'error', error: new Error('Invalid locale "name" coming from "first.local"') }]
    ])
  })

  it('translates by using the default or use the provided one', async (): Promise<void> => {
    const localization = new Localization({ localizationsLocation: './tests/__fixtures__/good' })

    await localization.prepare()

    expect(localization.options.defaultLocale).toEqual('en')
    expect(localization.translate('first.hello')).toEqual('Hello')
    expect(localization.translate('first.world')).toEqual('World')
    expect(localization.translate('first.name.hello', null, { name: 'John', emoji: '👋' })).toEqual('Hello John 👋')

    expect(localization.translate('first.hello', 'en-US')).toEqual('Howdy')
    expect(localization.translate('first.world', 'en-US')).toEqual('World')
    expect(localization.translate('first.name.hello', 'en-US', { name: 'John', emoji: '👋' })).toEqual('Howdy John 👋')

    expect(localization.translate('first.hello', 'es')).toEqual('Hola')
    expect(localization.translate('first.world', 'es')).toEqual('Mundo')
    expect(localization.translate('first.name.hello', 'es', { name: 'Juan', emoji: '👋' })).toEqual('Hola Juan 👋')

    expect(localization.translate('first.hello', 'es-MX')).toEqual('Que onda')
    expect(localization.translate('first.world', 'es-MX')).toEqual('Mundo')
    expect(localization.translate('first.name.hello', 'es-MX', { name: 'Juanito', emoji: '👋' })).toEqual('Que onda Juanito 👋')
  })

  it('translate by using the closest locale when the locale is not found', async (): Promise<void> => {
    const localization = new Localization({ localizationsLocation: './tests/__fixtures__/good' })
    const warningMock = jest.fn()

    await localization.prepare()

    localization.on('warning', warningMock)

    expect(localization.translate('first.hello', 'fr-CM')).toEqual('Bonjour')
    expect(localization.translate('first.world', 'fr-CM')).toEqual('Monde')
    expect(localization.translate('first.name.hello', 'fr-CM', { name: 'Jean', emoji: '👋' })).toEqual('Bonjour Jean 👋')

    expect(localization.translate('first.hello', 'fr')).toEqual('Bonjour')
    expect(localization.translate('first.world', 'fr')).toEqual('Monde')
    expect(localization.translate('first.name.hello', 'fr', { name: 'Jean', emoji: '👋' })).toEqual('Bonjour Jean 👋')

    expect(localization.translate('first.hello', 'es-AR')).toEqual('Hola')
    expect(localization.translate('first.world', 'es-AR')).toEqual('Mundo')
    expect(localization.translate('first.name.hello', 'es-AR', { name: 'Juan', emoji: '👋' })).toEqual('Hola Juan 👋')

    expect(warningMock.mock.calls).toEqual([
      [{ event: 'warning', message: 'Missing locale "fr", using "fr-CM" instead for "first.hello"' }],
      [{ event: 'warning', message: 'Missing locale "fr", using "fr-CM" instead for "first.world"' }],
      [{ event: 'warning', message: 'Missing locale "fr", using "fr-CM" instead for "first.name.hello"' }],
      [{ event: 'warning', message: 'Missing locale "es-AR", using "es" instead for "first.hello"' }],
      [{ event: 'warning', message: 'Missing locale "es-AR", using "es" instead for "first.world"' }],
      [{ event: 'warning', message: 'Missing locale "es-AR", using "es" instead for "first.name.hello"' }]
    ])
  })

  it('translate by using the first found locale if no locale can by found closest to the requested one', async (): Promise<void> => {
    const localization = new Localization({ localizationsLocation: './tests/__fixtures__/good' })
    const warningMock = jest.fn()

    await localization.prepare()

    localization.on('warning', warningMock)

    expect(localization.translate('first.hello', 'ar')).toEqual('Howdy')
    expect(localization.translate('first.world', 'ar')).toEqual('World')
    expect(localization.translate('first.name.hello', 'ar', { name: 'John', emoji: '👋' })).toEqual('Howdy John 👋')

    expect(warningMock.mock.calls).toEqual([
      [{ event: 'warning', message: 'Missing locale "ar", using "en-US" instead for "first.hello"' }],
      [{ event: 'warning', message: 'Missing locale "ar", using "en-US" instead for "first.world"' }],
      [{ event: 'warning', message: 'Missing locale "ar", using "en-US" instead for "first.name.hello"' }]
    ])
  })

  it('returns the same subject when no translation exists', async (): Promise<void> => {
    const localization = new Localization({ localizationsLocation: './tests/__fixtures__/good' })
    const warningMock = jest.fn()

    await localization.prepare()

    localization.on('warning', warningMock)

    expect(localization.translate('foo')).toEqual('missing <foo>')
    expect(localization.translate('foo.bar')).toEqual('missing <foo.bar>')
    expect(localization.translate('foo.bar.baz')).toEqual('missing <foo.bar.baz>')
    expect(localization.translate('name', null, { name: 'John', emoji: '👋' })).toEqual('missing <name>')

    expect(warningMock.mock.calls).toEqual([
      [{ event: 'warning', message: 'Missing translation for "foo" in "en"' }],
      [{ event: 'warning', message: 'Missing translation for "foo.bar" in "en"' }],
      [{ event: 'warning', message: 'Missing translation for "foo.bar.baz" in "en"' }],
      [{ event: 'warning', message: 'Missing translation for "name" in "en"' }]
    ])
  })
})
