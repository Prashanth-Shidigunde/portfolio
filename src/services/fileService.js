/**
 * File Handling & Upload Service Abstraction
 */
import { validateFileSize } from '../utils/validation';

export const fileService = {
  validateFiles(filesList, maxMb = 25) {
    const validFiles = [];
    let error = null;

    for (const file of Array.from(filesList)) {
      const err = validateFileSize(file, maxMb);
      if (err) {
        error = err;
        break;
      }
      validFiles.push(file);
    }

    return { validFiles, error };
  }
};

export default fileService;
