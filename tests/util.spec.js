import { formatNumber, ordinalize, slugify } from '../src/util'

describe('Utilities', () => {
  describe('Format number', () => {
    it('Adds thousands separators', () => {
      expect(formatNumber(52000)).toBe('52,000')
    })

    it('Returns an empty string for null values', () => {
      expect(formatNumber(null)).toBe('')
    })

    it('Treats zero as a valid value', () => {
      expect(formatNumber(0)).toBe('0')
    })
  })

  describe('Ordinalize', () => {
    it('Returns ordinal version of number', () => {
      expect(ordinalize(1)).toBe('1st')
    })

    it('Returns an empty string for null values', () => {
      expect(ordinalize(null)).toBe('')
    })

    it('Treats zero as empty', () => {
      expect(ordinalize(0)).toBe('')
    })
  })

  describe('Slugify', () => {
    it('Full name', () => {
      expect(slugify('John Doe')).toBe('john-doe')
    })

    it('Removes non alpha-numeric characters', () => {
      expect(slugify('John B. Fizz-Buzz')).toBe('john-b-fizz-buzz')
    })

    it('Doesn\'t leave trailing hyphens', () => {
      expect(slugify('John Doe &')).toBe('john-doe')
    })
  })
})
