/**
 * Input types
 */
export enum InputType {
  TEXT = 'text',
  NUMBER = 'number',
  PASSWORD = 'password',
  SEARCH = 'search',
  TEL = 'tel',
}

export enum InputStatus {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
}

export enum InputKeyboardAppearance {
  DEFAULT = 'default',
  LIGHT = 'light',
  DARK = 'dark',
}

export enum InputAutoCapitalize {
  NONE = 'none',
  SENTENCES = 'sentences',
  WORDS = 'words',
  CHARACTERS = 'characters',
}

export enum InputAutoCompleteType {
  CC_CSC = 'cc-csc',
  CC_EXP = 'cc-exp',
  CC_EXP_MONTH = 'cc-exp-month',
  CC_EXP_YEAR = 'cc-exp-year',
  CC_NUMBER = 'cc-number',
  EMAIL = 'email',
  NAME = 'name',
  PASSWORD = 'password',
  PASSWORD_NEW = 'new-password',
  PASSWORD_CURRENT = 'current-password',
  POSTAL_CODE = 'postal-code',
  STREET_ADDRESS = 'street-address',
  TEL = 'tel',
  USERNAME = 'username',
  OFF = 'off',
}

export enum InputTextContentType {
  NONE = 'none',
  URL = 'URL',
  ADDRESS_CITY = 'addressCity',
  ADDRESS_CITY_STATE = 'addressCityAndState',
  ADDRESS_STATE = 'addressState',
  COUNTRY_NAME = 'countryName',
  CREDIT_CARD_NUMBER = 'creditCardNumber',
  EMAIL_ADDRESS = 'emailAddress',
  FAMILY_NAME = 'familyName',
  FULL_STREET_ADDRESS = 'fullStreetAddress',
  GIVEN_NAME = 'givenName',
  JOB_TITLE = 'jobTitle',
  LOCATION = 'location',
  MIDDLE_NAME = 'middleName',
  NAME = 'name',
  NAME_PREFIX = 'namePrefix',
  NAME_SUFFIX = 'nameSuffix',
  NICKNAME = 'nickname',
  ORGANIZATION_NAME = 'organizationName',
  POSTAL_CODE = 'postalCode',
  STREET_ADDRESS_LINE_ONE = 'streetAddressLine1',
  STREET_ADDRESS_LINE_TWO = 'streetAddressLine2',
  SUB_LOCALITY = 'sublocality',
  TELEPHONE_NUMBER = 'telephoneNumber',
  USERNAME = 'username',
  PASSWORD = 'password',
  NEW_PASSWORD = 'newPassword',
  ONE_TIME_CODE = 'oneTimeCode',
}

export enum InputKeyboardType {
  DEFAULT = 'default',
  EMAIL_ADDRESS = 'email-address',
  NUMERIC = 'numeric',
  PHONE_PAD = 'phone-pad',
  NUMBER_PAD = 'number-pad',
  DECIMAL_PAD = 'decimal-pad',
  VISIBLE_PASSWORD = 'visible-password',
  ASCII_CAPABLE = 'ascii-capable',
  NUMBERS_AND_PUNCTUATION = 'numbers-and-punctuation',
  URL = 'url',
  NAME_PHONE_PAD = 'name-phone-pad',
  TWITTER = 'twitter',
  WEB_SEARCH = 'web-search',
}
