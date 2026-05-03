import { nanoid } from 'nanoid';

/**
 * Wrapper for generating unique element IDs
 * @param {number} size - length of the ID
 * @returns {string}
 */
export const generateId = (size = 8) => {
  return nanoid(size);
};
