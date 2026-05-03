import { nanoid } from 'nanoid';

export const generateId = (size = 8) => nanoid(size);
