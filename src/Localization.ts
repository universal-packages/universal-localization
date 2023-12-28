import { loadConfig } from '@universal-packages/config-loader'
import { EventEmitter } from '@universal-packages/event-emitter'
import { checkDirectory } from '@universal-packages/fs-utils'
import { mapObject } from '@universal-packages/object-mapper'
import { navigateObject } from '@universal-packages/object-navigation'
import { replaceVars } from '@universal-packages/variable-replacer'

import { Locale, LocalizationDictionary, LocalizationOptions } from './types'

export default class Localization extends EventEmitter {
  public readonly options: LocalizationOptions
  public readonly dictionary: LocalizationDictionary = {}

  constructor(options?: LocalizationOptions) {
    super()

    this.options = { defaultLocale: 'en', useFileName: true, localizationsLocation: './src', ...options }
  }

  public async prepare(): Promise<void> {
    const finalPath = checkDirectory(this.options.localizationsLocation)
    const config = await loadConfig(finalPath, { conventionPrefix: 'local' })

    mapObject(config, null, (value: Record<string, any>, key: string): boolean => {
      if (key.match(/.*\.local$/)) {
        const parts = key.split('.')
        const isLocaleFromFilerName = parts[parts.length - 2].match(/^(..|..\-..)$/)

        if (isLocaleFromFilerName) {
          const localeFromFilerName = parts[parts.length - 2]

          if (!this.dictionary[localeFromFilerName]) this.dictionary[localeFromFilerName] = {}

          if (this.options.useFileName) {
            const keyFromFileName = parts.splice(0, parts.length - 2).join('.')

            if (!this.dictionary[localeFromFilerName][keyFromFileName]) this.dictionary[localeFromFilerName][keyFromFileName] = {}

            this.dictionary[localeFromFilerName][keyFromFileName] = { ...this.dictionary[localeFromFilerName][keyFromFileName], ...value }
          } else {
            this.dictionary[localeFromFilerName] = { ...this.dictionary[localeFromFilerName], ...value }
          }
        } else {
          const locales = Object.keys(value)

          for (let i = 0; i < locales.length; i++) {
            const currentLocale = locales[i]

            if (currentLocale.match(/^(..|..\-..)$/)) {
              if (!this.dictionary[currentLocale]) this.dictionary[currentLocale] = {}

              this.dictionary[currentLocale] = { ...this.dictionary[currentLocale], ...value[currentLocale] }
            } else {
              this.emit('error', { error: new Error(`Invalid locale "${currentLocale}" coming from "${key}"`) })
            }
          }
        }

        return false
      }
    })
  }

  public translate(subject: string | string[], locale?: Locale, locales?: Record<string, any>): string {
    const finalLocale = locale ? locale : this.options.defaultLocale

    let localeDictionary: Record<string, any> = this.dictionary[finalLocale]

    if (!localeDictionary) {
      const language = finalLocale.split('-')[0]
      const dictionaryFromLanguage = this.dictionary[language]

      if (dictionaryFromLanguage) {
        localeDictionary = dictionaryFromLanguage

        this.emit('warning', { message: `Missing locale "${finalLocale}", using "${language}" instead for "${subject}"` })
      } else {
        const availableLocales = Object.keys(this.dictionary)
        const closestLocale = availableLocales.find((locale) => locale.startsWith(language)) || availableLocales[0]

        if (closestLocale) {
          localeDictionary = this.dictionary[closestLocale]

          this.emit('warning', { message: `Missing locale "${finalLocale}", using "${closestLocale}" instead for "${subject}"` })
        } else {
          localeDictionary = {}

          this.emit('error', { error: new Error(`Missing locale <${finalLocale}> and no fallback found for it`) })
        }
      }
    }

    const pathInfo = navigateObject(localeDictionary, subject, { separator: '.' })

    if (pathInfo.error) {
      this.emit('warning', { message: `Missing translation for "${subject}" in "${finalLocale}"` })

      return `missing <${pathInfo.path}>`
    }

    const found = pathInfo.targetNode[pathInfo.targetKey]

    if (typeof found === 'string') {
      if (locales) return replaceVars(found, locales)

      return found
    } else {
      this.emit('warning', { message: `Missing translation for "${subject}" in "${finalLocale}"` })

      return `missing <${pathInfo.path}>`
    }
  }
}
