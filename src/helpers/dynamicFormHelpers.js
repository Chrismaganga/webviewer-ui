/**
 * Dynamic Form Builder Helper Functions
 * Provides utilities for form validation, PDF generation, and form management
 */

// Validation rules
export const VALIDATION_RULES = {
  REQUIRED: 'required',
  EMAIL: 'email',
  PHONE: 'phone',
  URL: 'url',
  MIN_LENGTH: 'min',
  MAX_LENGTH: 'max',
  NUMERIC: 'numeric',
  ALPHA: 'alpha',
  ALPHANUMERIC: 'alphanumeric',
  DATE: 'date',
  FUTURE_DATE: 'future_date',
  PAST_DATE: 'past_date',
};

// Field types with their default properties
export const FIELD_TYPES = {
  TEXT: {
    type: 'text',
    label: 'Text Input',
    placeholder: 'Enter text',
    validation: [],
  },
  TEXTAREA: {
    type: 'textarea',
    label: 'Text Area',
    placeholder: 'Enter longer text',
    validation: [],
  },
  EMAIL: {
    type: 'email',
    label: 'Email',
    placeholder: 'Enter email address',
    validation: ['email'],
  },
  PHONE: {
    type: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter phone number',
    validation: ['phone'],
  },
  DATE: {
    type: 'date',
    label: 'Date',
    placeholder: 'Select date',
    validation: [],
  },
  NUMBER: {
    type: 'number',
    label: 'Number',
    placeholder: 'Enter number',
    validation: ['numeric'],
  },
  URL: {
    type: 'url',
    label: 'URL',
    placeholder: 'Enter URL',
    validation: ['url'],
  },
  PASSWORD: {
    type: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    validation: [],
  },
  SELECT: {
    type: 'select',
    label: 'Dropdown',
    placeholder: 'Select an option',
    validation: [],
    options: [],
  },
  CHECKBOX: {
    type: 'checkbox',
    label: 'Checkbox',
    placeholder: 'Check this option',
    validation: [],
  },
  RADIO: {
    type: 'radio',
    label: 'Radio Button',
    placeholder: 'Select one option',
    validation: [],
    options: [],
  },
  SIGNATURE: {
    type: 'signature',
    label: 'Signature',
    placeholder: 'Add your signature',
    validation: [],
  },
};

/**
 * Validate a single field value against its validation rules
 * @param {Object} field - Field configuration
 * @param {*} value - Field value to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (field, value) => {
  if (!field.validation || field.validation.length === 0) {
    return null;
  }

  const rules = Array.isArray(field.validation) ? field.validation : field.validation.split('|');

  for (const rule of rules) {
    const [ruleName, ruleValue] = rule.split(':');
    const error = validateRule(ruleName, ruleValue, value, field);
    if (error) {
      return error;
    }
  }

  return null;
};

/**
 * Validate a single rule
 * @param {string} ruleName - Name of the validation rule
 * @param {string} ruleValue - Value for the rule (if applicable)
 * @param {*} value - Value to validate
 * @param {Object} field - Field configuration
 * @returns {string|null} - Error message or null if valid
 */
const validateRule = (ruleName, ruleValue, value, field) => {
  switch (ruleName) {
    case VALIDATION_RULES.REQUIRED:
      if (!value || value.toString().trim() === '') {
        return `${field.label} is required`;
      }
      break;

    case VALIDATION_RULES.EMAIL:
      if (value && !isValidEmail(value)) {
        return 'Please enter a valid email address';
      }
      break;

    case VALIDATION_RULES.PHONE:
      if (value && !isValidPhone(value)) {
        return 'Please enter a valid phone number';
      }
      break;

    case VALIDATION_RULES.URL:
      if (value && !isValidUrl(value)) {
        return 'Please enter a valid URL starting with http:// or https://';
      }
      break;

    case VALIDATION_RULES.MIN_LENGTH:
      if (value && value.toString().length < parseInt(ruleValue)) {
        return `${field.label} must be at least ${ruleValue} characters`;
      }
      break;

    case VALIDATION_RULES.MAX_LENGTH:
      if (value && value.toString().length > parseInt(ruleValue)) {
        return `${field.label} must be no more than ${ruleValue} characters`;
      }
      break;

    case VALIDATION_RULES.NUMERIC:
      if (value && !isNumeric(value)) {
        return `${field.label} must be a number`;
      }
      break;

    case VALIDATION_RULES.ALPHA:
      if (value && !isAlpha(value)) {
        return `${field.label} must contain only letters`;
      }
      break;

    case VALIDATION_RULES.ALPHANUMERIC:
      if (value && !isAlphanumeric(value)) {
        return `${field.label} must contain only letters and numbers`;
      }
      break;

    case VALIDATION_RULES.DATE:
      if (value && !isValidDate(value)) {
        return 'Please enter a valid date';
      }
      break;

    case VALIDATION_RULES.FUTURE_DATE:
      if (value && !isFutureDate(value)) {
        return 'Date must be in the future';
      }
      break;

    case VALIDATION_RULES.PAST_DATE:
      if (value && !isPastDate(value)) {
        return 'Date must be in the past';
      }
      break;
  }

  return null;
};

/**
 * Validate an entire form
 * @param {Array} fields - Array of field configurations
 * @param {Object} formData - Form data object
 * @returns {Object} - Object with errors and isValid flag
 */
export const validateForm = (fields, formData) => {
  const errors = {};
  let isValid = true;

  fields.forEach(field => {
    const value = formData[field.id] || '';
    const error = validateField(field, value);
    if (error) {
      errors[field.id] = error;
      isValid = false;
    }
  });

  return { errors, isValid };
};

/**
 * Generate PDF from form data
 * @param {string} title - Form title
 * @param {Array} fields - Form fields
 * @param {Object} formData - Form data
 * @param {Object} settings - PDF settings
 * @returns {Promise<Blob>} - PDF blob
 */
export const generatePDF = async (title, fields, formData, settings = {}) => {
  try {
    const { PDFNet } = window.Core;
    const { PDFDoc, ElementBuilder, ElementWriter, Font, ColorPt, Matrix2D, Rect } = PDFNet;

    const pdfDoc = await PDFDoc.create();
    const page = await pdfDoc.pageCreate();
    pdfDoc.pagePushBack(page);

    const elementBuilder = await ElementBuilder.create();
    const elementWriter = await ElementWriter.create();
    await elementWriter.beginOnPage(page, ElementWriter.WriteMode.e_overlay, false);

    // Page setup
    const pageWidth = 612;
    const pageHeight = 792;
    const margin = 50;
    let yPosition = pageHeight - margin;

    // Add header if enabled
    if (settings.includeHeader !== false) {
      const headerFont = await Font.create(pdfDoc, Font.StandardType1Font.e_helvetica_bold);
      const headerElement = await elementBuilder.createTextBegin(headerFont, 24);
      await headerElement.setTextMatrix(await Matrix2D.createIdentityMatrix());
      await headerElement.setTextColor(await ColorPt.init(0.2, 0.2, 0.2));
      await elementWriter.writeElement(headerElement);

      const headerText = await elementBuilder.createTextRun(title);
      await headerText.setTextMatrix(await Matrix2D.createIdentityMatrix().translate(margin, yPosition));
      await elementWriter.writeElement(headerText);

      yPosition -= 60;
    }

    // Add form fields with better formatting
    for (const field of fields) {
      const value = formData[field.id] || '';
      if (!value && !field.required) continue;

      // Field label
      const labelFont = await Font.create(pdfDoc, Font.StandardType1Font.e_helvetica_bold);
      const labelElement = await elementBuilder.createTextBegin(labelFont, 12);
      await elementWriter.writeElement(labelElement);

      const labelText = await elementBuilder.createTextRun(`${field.label}:`);
      await labelText.setTextMatrix(await Matrix2D.createIdentityMatrix().translate(margin, yPosition));
      await elementWriter.writeElement(labelText);

      yPosition -= 20;

      // Field value with word wrapping
      const valueFont = await Font.create(pdfDoc, Font.StandardType1Font.e_helvetica);
      const valueElement = await elementBuilder.createTextBegin(valueFont, 10);
      await elementWriter.writeElement(valueElement);

      // Word wrapping logic
      const words = value.toString().split(' ');
      let currentLine = '';
      let lineHeight = 15;

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        if (testLine.length > 80 && currentLine) {
          // Write current line
          const lineText = await elementBuilder.createTextRun(currentLine);
          await lineText.setTextMatrix(await Matrix2D.createIdentityMatrix().translate(margin, yPosition));
          await elementWriter.writeElement(lineText);
          yPosition -= lineHeight;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      // Write remaining text
      if (currentLine) {
        const lineText = await elementBuilder.createTextRun(currentLine);
        await lineText.setTextMatrix(await Matrix2D.createIdentityMatrix().translate(margin, yPosition));
        await elementWriter.writeElement(lineText);
        yPosition -= lineHeight;
      }

      yPosition -= 20;

      // Check if we need a new page
      if (yPosition < margin + 100) {
        await elementWriter.end();
        await elementBuilder.reset();

        const newPage = await pdfDoc.pageCreate();
        pdfDoc.pagePushBack(newPage);
        await elementWriter.beginOnPage(newPage, ElementWriter.WriteMode.e_overlay, false);
        yPosition = pageHeight - margin;
      }
    }

    // Add footer if enabled
    if (settings.includeFooter !== false) {
      const footerFont = await Font.create(pdfDoc, Font.StandardType1Font.e_helvetica);
      const footerElement = await elementBuilder.createTextBegin(footerFont, 8);
      await footerElement.setTextMatrix(await Matrix2D.createIdentityMatrix());
      await footerElement.setTextColor(await ColorPt.init(0.5, 0.5, 0.5));
      await elementWriter.writeElement(footerElement);

      const footerText = await elementBuilder.createTextRun(`Generated on ${new Date().toLocaleDateString()}`);
      await footerText.setTextMatrix(await Matrix2D.createIdentityMatrix().translate(margin, margin));
      await elementWriter.writeElement(footerText);
    }

    await elementWriter.end();
    await elementBuilder.reset();

    // Save the PDF
    const data = await pdfDoc.saveMemoryBuffer(0);
    return new Blob([data], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

/**
 * Download PDF blob
 * @param {Blob} pdfBlob - PDF blob
 * @param {string} filename - Filename for download
 */
export const downloadPDF = (pdfBlob, filename) => {
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Save form to localStorage
 * @param {Object} formData - Form data to save
 * @param {string} storageKey - Storage key (default: 'dynamicFormBuilder_forms')
 */
export const saveFormToStorage = (formData, storageKey = 'dynamicFormBuilder_forms') => {
  try {
    const savedForms = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const existingIndex = savedForms.findIndex(form => form.title === formData.title);

    if (existingIndex >= 0) {
      savedForms[existingIndex] = formData;
    } else {
      savedForms.push(formData);
    }

    localStorage.setItem(storageKey, JSON.stringify(savedForms));
    return true;
  } catch (error) {
    console.error('Error saving form:', error);
    return false;
  }
};

/**
 * Load forms from localStorage
 * @param {string} storageKey - Storage key (default: 'dynamicFormBuilder_forms')
 * @returns {Array} - Array of saved forms
 */
export const loadFormsFromStorage = (storageKey = 'dynamicFormBuilder_forms') => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch (error) {
    console.error('Error loading forms:', error);
    return [];
  }
};

/**
 * Delete form from localStorage
 * @param {string} formId - Form ID to delete
 * @param {string} storageKey - Storage key (default: 'dynamicFormBuilder_forms')
 */
export const deleteFormFromStorage = (formId, storageKey = 'dynamicFormBuilder_forms') => {
  try {
    const savedForms = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedForms = savedForms.filter(f => f.id !== formId);
    localStorage.setItem(storageKey, JSON.stringify(updatedForms));
    return true;
  } catch (error) {
    console.error('Error deleting form:', error);
    return false;
  }
};

/**
 * Export form as JSON
 * @param {Object} formData - Form data to export
 * @param {string} filename - Filename for export
 */
export const exportFormAsJSON = (formData, filename) => {
  const dataStr = JSON.stringify(formData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'form_export.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import form from JSON
 * @param {File} file - JSON file to import
 * @returns {Promise<Object>} - Parsed form data
 */
export const importFormFromJSON = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const formData = JSON.parse(e.target.result);
        resolve(formData);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

// Utility functions for validation
const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = phone => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

const isValidUrl = url => {
  const urlRegex = /^https?:\/\/.+/;
  return urlRegex.test(url);
};

const isNumeric = value => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

const isAlpha = value => {
  return /^[a-zA-Z\s]+$/.test(value);
};

const isAlphanumeric = value => {
  return /^[a-zA-Z0-9\s]+$/.test(value);
};

const isValidDate = value => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

const isFutureDate = value => {
  const date = new Date(value);
  const now = new Date();
  return date > now;
};

const isPastDate = value => {
  const date = new Date(value);
  const now = new Date();
  return date < now;
};

/**
 * Format form data for display
 * @param {Object} formData - Raw form data
 * @param {Array} fields - Field configurations
 * @returns {Object} - Formatted form data
 */
export const formatFormData = (formData, fields) => {
  const formatted = {};

  fields.forEach(field => {
    const value = formData[field.id];
    if (value !== undefined && value !== null && value !== '') {
      switch (field.type) {
        case 'date':
          formatted[field.label] = new Date(value).toLocaleDateString();
          break;
        case 'checkbox':
          formatted[field.label] = value ? 'Yes' : 'No';
          break;
        case 'signature':
          formatted[field.label] = value ? 'Signed' : 'Not signed';
          break;
        default:
          formatted[field.label] = value;
      }
    }
  });

  return formatted;
};

/**
 * Generate a unique ID for form fields
 * @returns {string} - Unique ID
 */
export const generateFieldId = () => {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Clone a field with a new ID
 * @param {Object} field - Field to clone
 * @returns {Object} - Cloned field
 */
export const cloneField = field => {
  return {
    ...field,
    id: generateFieldId(),
    label: `${field.label} (Copy)`,
  };
};

/**
 * Get field type information
 * @param {string} type - Field type
 * @returns {Object} - Field type information
 */
export const getFieldTypeInfo = type => {
  return FIELD_TYPES[type.toUpperCase()] || FIELD_TYPES.TEXT;
};

/**
 * Get all available field types
 * @returns {Array} - Array of field type objects
 */
export const getAvailableFieldTypes = () => {
  return Object.entries(FIELD_TYPES).map(([key, value]) => ({
    value: key.toLowerCase(),
    label: value.label,
  }));
};
