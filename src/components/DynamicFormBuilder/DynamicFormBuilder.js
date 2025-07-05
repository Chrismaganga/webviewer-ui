import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Choice, Input } from '@pdftron/webviewer-react-toolkit';
import Button from '../Button';
import Dropdown from '../Dropdown';
import TextInput from '../TextInput';
import CreatableList from '../CreatableList';
import HorizontalDivider from '../HorizontalDivider';
import ModalWrapper from '../ModalWrapper';
import core from 'core';
import downloadPdf from 'helpers/downloadPdf';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import './DynamicFormBuilder.scss';

const FORM_TEMPLATES = {
  RESUME: 'resume',
  COVER_LETTER: 'cover_letter',
  APPLICATION: 'application',
  CONTRACT: 'contract',
  INVOICE: 'invoice',
  CUSTOM: 'custom',
};

const FIELD_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  EMAIL: 'email',
  PHONE: 'phone',
  DATE: 'date',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SIGNATURE: 'signature',
  NUMBER: 'number',
  URL: 'url',
  PASSWORD: 'password',
};

const DynamicFormBuilder = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState(FORM_TEMPLATES.RESUME);
  const [formTitle, setFormTitle] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [currentField, setCurrentField] = useState(null);
  const [isEditingField, setIsEditingField] = useState(false);
  const [formData, setFormData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState('builder'); // builder, preview, settings
  const [formSettings, setFormSettings] = useState({
    theme: 'professional',
    fontSize: 'medium',
    spacing: 'normal',
    includeHeader: true,
    includeFooter: true,
  });
  const [savedForms, setSavedForms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const autoSaveTimeoutRef = useRef(null);

  // Enhanced predefined templates with more fields and better structure
  const templates = {
    [FORM_TEMPLATES.RESUME]: {
      title: 'Professional Resume',
      description: 'Create a comprehensive professional resume',
      fields: [
        {
          id: 'fullName',
          label: 'Full Name',
          type: FIELD_TYPES.TEXT,
          required: true,
          placeholder: 'Enter your full name',
          validation: 'required|min:2',
        },
        {
          id: 'email',
          label: 'Email',
          type: FIELD_TYPES.EMAIL,
          required: true,
          placeholder: 'Enter your email',
          validation: 'required|email',
        },
        {
          id: 'phone',
          label: 'Phone',
          type: FIELD_TYPES.PHONE,
          required: true,
          placeholder: 'Enter your phone number',
          validation: 'required|phone',
        },
        {
          id: 'address',
          label: 'Address',
          type: FIELD_TYPES.TEXTAREA,
          required: false,
          placeholder: 'Enter your address',
        },
        {
          id: 'linkedin',
          label: 'LinkedIn Profile',
          type: FIELD_TYPES.URL,
          required: false,
          placeholder: 'https://linkedin.com/in/yourprofile',
        },
        {
          id: 'website',
          label: 'Personal Website',
          type: FIELD_TYPES.URL,
          required: false,
          placeholder: 'https://yourwebsite.com',
        },
        {
          id: 'summary',
          label: 'Professional Summary',
          type: FIELD_TYPES.TEXTAREA,
          required: true,
          placeholder: 'Brief professional summary highlighting your key strengths and career objectives',
          validation: 'required|min:50',
        },
        {
          id: 'experience',
          label: 'Work Experience',
          type: FIELD_TYPES.TEXTAREA,
          required: true,
          placeholder: 'List your work experience with company names, positions, dates, and key achievements',
          validation: 'required|min:100',
        },
        {
          id: 'education',
          label: 'Education',
          type: FIELD_TYPES.TEXTAREA,
          required: true,
          placeholder: 'List your educational background including degrees, institutions, and graduation dates',
          validation: 'required|min:50',
        },
        {
          id: 'skills',
          label: 'Skills',
          type: FIELD_TYPES.TEXTAREA,
          required: false,
          placeholder: 'List your technical and soft skills',
        },
        {
          id: 'certifications',
          label: 'Certifications',
          type: FIELD_TYPES.TEXTAREA,
          required: false,
          placeholder: 'List your professional certifications and licenses',
        },
        {
          id: 'languages',
          label: 'Languages',
          type: FIELD_TYPES.TEXTAREA,
          required: false,
          placeholder: 'List languages you speak and proficiency levels',
        },
        {
          id: 'projects',
          label: 'Projects',
          type: FIELD_TYPES.TEXTAREA,
          required: false,
          placeholder: 'Highlight key projects and their outcomes',
        },
        {
          id: 'references',
          label: 'References',
          type: FIELD_TYPES.TEXTAREA,
          required: false,
          placeholder: 'Professional references (optional)',
        },
      ],
    },
    [FORM_TEMPLATES.COVER_LETTER]: {
      title: 'Cover Letter',
      description: 'Create a compelling cover letter for job applications',
      fields: [
        {
          id: 'fullName',
          label: 'Full Name',
          type: FIELD_TYPES.TEXT,
          required: true,
          placeholder: 'Enter your full name',
          validation: 'required|min:2',
        },
        {
          id: 'email',
          label: 'Email',
          type: FIELD_TYPES.EMAIL,
          required: true,
          placeholder: 'Enter your email',
          validation: 'required|email',
        },
        {
          id: 'phone',
          label: 'Phone',
          type: FIELD_TYPES.PHONE,
          required: true,
          placeholder: 'Enter your phone number',
          validation: 'required|phone',
        },
        {
          id: 'date',
          label: 'Date',
          type: FIELD_TYPES.DATE,
          required: true,
          placeholder: 'Enter date',
          validation: 'required',
        },
        {
          id: 'companyName',
          label: 'Company Name',
          type: FIELD_TYPES.TEXT,
          required: true,
          placeholder: 'Enter company name',
          validation: 'required|min:2',
        },
        {
          id: 'hiringManager',
          label: 'Hiring Manager Name',
          type: FIELD_TYPES.TEXT,
          required: false,
          placeholder: 'Name of hiring manager (if known)',
        },
        {
          id: 'position',
          label: 'Position Title',
          type: FIELD_TYPES.TEXT,
          required: true,
          placeholder: 'Enter position title',
          validation: 'required|min:2',
        },
        {
          id: 'jobSource',
          label: 'How did you hear about this position?',
          type: FIELD_TYPES.SELECT,
          required: false,
          options: ['Job Board', 'Company Website', 'Referral', 'LinkedIn', 'Indeed', 'Other'],
          placeholder: 'Select source',
        },
        {
          id: 'introduction',
          label: 'Introduction',
          type: FIELD_TYPES.TEXTAREA,
          required: true,
          placeholder: 'Opening paragraph introducing yourself and expressing interest in the position',
          validation: 'required|min:100',
        },
        {
          id: 'body',
          label: 'Body',
          type: FIELD_TYPES.TEXTAREA,
          required: true,
          placeholder:
            'Main content highlighting your relevant experience, skills, and why you are a good fit for the position',
          validation: 'required|min:200',
        },
        {
          id: 'closing',
          label: 'Closing',
          type: FIELD_TYPES.TEXTAREA,
          required: true,
          placeholder: 'Closing paragraph expressing enthusiasm and requesting an interview',
          validation: 'required|min:50',
        },
        {
          id: 'signature',
          label: 'Signature',
          type: FIELD_TYPES.SIGNATURE,
          required: true,
          placeholder: 'Digital signature',
        },
      ],
    },
    [FORM_TEMPLATES.APPLICATION]: {
      title: 'Job Application',
      description: 'Complete job application form',
      fields: [
        {
          id: 'fullName',
          label: 'Full Name',
          type: FIELD_TYPES.TEXT,
          required: true,
          placeholder: 'Enter your full name',
          validation: 'required|min:2',
        },
        {
          id: 'email',
          label: 'Email',
          type: FIELD_TYPES.EMAIL,
          required: true,
          placeholder: 'Enter your email',
          validation: 'required|email',
        },
        {
          id: 'phone',
          label: 'Phone',
          type: FIELD_TYPES.PHONE,
          required: true,
          placeholder: 'Enter your phone number',
          validation: 'required|phone',
        },
        {
          id: 'position',
          label: 'Position Applied For',
          type: FIELD_TYPES.TEXT,
          required: true,
          placeholder: 'Enter position title',
          validation: 'required|min:2',
        },
        {
          id: 'experience',
          label: 'Years of Experience',
          type: FIELD_TYPES.SELECT,
          required: true,
          options: ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'],
          validation: 'required',
        },
        {
          id: 'availability',
          label: 'Availability',
          type: FIELD_TYPES.DATE,
          required: true,
          placeholder: 'When can you start?',
          validation: 'required',
        },
        {
          id: 'salary',
          label: 'Expected Salary',
          type: FIELD_TYPES.NUMBER,
          required: false,
          placeholder: 'Enter expected salary',
        },
        {
          id: 'workAuthorization',
          label: 'Work Authorization',
          type: FIELD_TYPES.SELECT,
          required: true,
          options: ['US Citizen', 'Permanent Resident', 'Work Visa', 'Other'],
          validation: 'required',
        },
        {
          id: 'relocation',
          label: 'Willing to Relocate?',
          type: FIELD_TYPES.CHECKBOX,
          required: false,
          placeholder: 'Are you willing to relocate for this position?',
        },
        {
          id: 'remote',
          label: 'Remote Work Preference',
          type: FIELD_TYPES.SELECT,
          required: false,
          options: ['On-site only', 'Hybrid', 'Remote preferred', 'Remote only'],
        },
        {
          id: 'references',
          label: 'References',
          type: FIELD_TYPES.TEXTAREA,
          required: false,
          placeholder: 'List your professional references',
        },
        {
          id: 'additionalInfo',
          label: 'Additional Information',
          type: FIELD_TYPES.TEXTAREA,
          required: false,
          placeholder: 'Any additional information you would like to share',
        },
      ],
    },
    [FORM_TEMPLATES.CONTRACT]: {
      title: 'Service Contract',
      description: 'Professional service contract template',
      fields: [
        {
          id: 'clientName',
          label: 'Client Name',
          type: FIELD_TYPES.TEXT,
          required: true,
          placeholder: 'Enter client name',
          validation: 'required|min:2',
        },
        {
          id: 'clientEmail',
          label: 'Client Email',
          type: FIELD_TYPES.EMAIL,
          required: true,
          placeholder: 'Enter client email',
          validation: 'required|email',
        },
        {
          id: 'serviceDescription',
          label: 'Service Description',
          type: FIELD_TYPES.TEXTAREA,
          required: true,
          placeholder: 'Detailed description of services to be provided',
          validation: 'required|min:50',
        },
        {
          id: 'startDate',
          label: 'Start Date',
          type: FIELD_TYPES.DATE,
          required: true,
          placeholder: 'Project start date',
          validation: 'required',
        },
        {
          id: 'endDate',
          label: 'End Date',
          type: FIELD_TYPES.DATE,
          required: true,
          placeholder: 'Project end date',
          validation: 'required',
        },
        {
          id: 'totalAmount',
          label: 'Total Amount',
          type: FIELD_TYPES.NUMBER,
          required: true,
          placeholder: 'Total contract amount',
          validation: 'required|min:1',
        },
        {
          id: 'paymentTerms',
          label: 'Payment Terms',
          type: FIELD_TYPES.SELECT,
          required: true,
          options: ['Net 30', 'Net 15', 'Due on completion', '50% upfront, 50% on completion'],
          validation: 'required',
        },
        {
          id: 'terms',
          label: 'Terms and Conditions',
          type: FIELD_TYPES.TEXTAREA,
          required: true,
          placeholder: 'Additional terms and conditions',
          validation: 'required|min:100',
        },
        {
          id: 'clientSignature',
          label: 'Client Signature',
          type: FIELD_TYPES.SIGNATURE,
          required: true,
          placeholder: 'Client signature',
        },
        {
          id: 'providerSignature',
          label: 'Provider Signature',
          type: FIELD_TYPES.SIGNATURE,
          required: true,
          placeholder: 'Provider signature',
        },
      ],
    },
    [FORM_TEMPLATES.INVOICE]: {
      title: 'Professional Invoice',
      description: 'Create a detailed invoice for services or products',
      fields: [
        {
          id: 'invoiceNumber',
          label: 'Invoice Number',
          type: FIELD_TYPES.TEXT,
          required: true,
          placeholder: 'Enter invoice number',
          validation: 'required|min:3',
        },
        {
          id: 'invoiceDate',
          label: 'Invoice Date',
          type: FIELD_TYPES.DATE,
          required: true,
          placeholder: 'Invoice date',
          validation: 'required',
        },
        {
          id: 'dueDate',
          label: 'Due Date',
          type: FIELD_TYPES.DATE,
          required: true,
          placeholder: 'Payment due date',
          validation: 'required',
        },
        {
          id: 'clientName',
          label: 'Client Name',
          type: FIELD_TYPES.TEXT,
          required: true,
          placeholder: 'Enter client name',
          validation: 'required|min:2',
        },
        {
          id: 'clientAddress',
          label: 'Client Address',
          type: FIELD_TYPES.TEXTAREA,
          required: true,
          placeholder: 'Enter client address',
          validation: 'required|min:10',
        },
        {
          id: 'serviceDescription',
          label: 'Service/Product Description',
          type: FIELD_TYPES.TEXTAREA,
          required: true,
          placeholder: 'Detailed description of services or products',
          validation: 'required|min:20',
        },
        {
          id: 'quantity',
          label: 'Quantity',
          type: FIELD_TYPES.NUMBER,
          required: true,
          placeholder: 'Quantity',
          validation: 'required|min:1',
        },
        {
          id: 'unitPrice',
          label: 'Unit Price',
          type: FIELD_TYPES.NUMBER,
          required: true,
          placeholder: 'Price per unit',
          validation: 'required|min:0',
        },
        {
          id: 'taxRate',
          label: 'Tax Rate (%)',
          type: FIELD_TYPES.NUMBER,
          required: false,
          placeholder: 'Tax rate percentage',
        },
        {
          id: 'notes',
          label: 'Notes',
          type: FIELD_TYPES.TEXTAREA,
          required: false,
          placeholder: 'Additional notes or terms',
        },
        {
          id: 'paymentInstructions',
          label: 'Payment Instructions',
          type: FIELD_TYPES.TEXTAREA,
          required: false,
          placeholder: 'Payment method and instructions',
        },
      ],
    },
  };

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    if (formTitle && formFields.length > 0) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveFormLocally();
        setAutoSaveStatus('Auto-saved');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      }, 2000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formTitle, formFields, formData]);

  // Load saved forms on component mount
  useEffect(() => {
    loadSavedForms();
  }, []);

  // Enhanced template loading with better field management
  useEffect(() => {
    if (selectedTemplate && templates[selectedTemplate]) {
      setFormTitle(templates[selectedTemplate].title);
      setFormFields(
        templates[selectedTemplate].fields.map(field => ({
          ...field,
          id: `${field.id}_${Date.now()}`,
          options: field.options || [],
        })),
      );
      setFormData({});
      setValidationErrors({});
    }
  }, [selectedTemplate]);

  // Validation functions
  const validateField = (field, value) => {
    if (!field.validation) return null;

    const rules = field.validation.split('|');
    for (const rule of rules) {
      const [ruleName, ruleValue] = rule.split(':');

      switch (ruleName) {
        case 'required':
          if (!value || value.toString().trim() === '') {
            return `${field.label} is required`;
          }
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (value && !emailRegex.test(value)) {
            return 'Please enter a valid email address';
          }
          break;
        case 'phone':
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            return 'Please enter a valid phone number';
          }
          break;
        case 'url':
          const urlRegex = /^https?:\/\/.+/;
          if (value && !urlRegex.test(value)) {
            return 'Please enter a valid URL starting with http:// or https://';
          }
          break;
        case 'min':
          if (value && value.toString().length < parseInt(ruleValue)) {
            return `${field.label} must be at least ${ruleValue} characters`;
          }
          break;
        case 'max':
          if (value && value.toString().length > parseInt(ruleValue)) {
            return `${field.label} must be no more than ${ruleValue} characters`;
          }
          break;
      }
    }
    return null;
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    formFields.forEach(field => {
      const value = formData[field.id] || '';
      const error = validateField(field, value);
      if (error) {
        errors[field.id] = error;
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  // Local storage functions
  const saveFormLocally = () => {
    const formData = {
      id: Date.now(),
      title: formTitle,
      fields: formFields,
      template: selectedTemplate,
      settings: formSettings,
      lastModified: new Date().toISOString(),
    };

    const savedForms = JSON.parse(localStorage.getItem('dynamicFormBuilder_forms') || '[]');
    const existingIndex = savedForms.findIndex(form => form.title === formTitle);

    if (existingIndex >= 0) {
      savedForms[existingIndex] = formData;
    } else {
      savedForms.push(formData);
    }

    localStorage.setItem('dynamicFormBuilder_forms', JSON.stringify(savedForms));
  };

  const loadSavedForms = () => {
    const savedForms = JSON.parse(localStorage.getItem('dynamicFormBuilder_forms') || '[]');
    setSavedForms(savedForms);
  };

  const loadForm = formId => {
    const form = savedForms.find(f => f.id === formId);
    if (form) {
      setFormTitle(form.title);
      setFormFields(form.fields);
      setSelectedTemplate(form.template);
      setFormSettings(form.settings || formSettings);
      setFormData({});
      setValidationErrors({});
    }
  };

  const deleteForm = formId => {
    const updatedForms = savedForms.filter(f => f.id !== formId);
    setSavedForms(updatedForms);
    localStorage.setItem('dynamicFormBuilder_forms', JSON.stringify(updatedForms));
  };

  // Enhanced field management
  const addField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: '',
      type: FIELD_TYPES.TEXT,
      required: false,
      placeholder: '',
      options: [],
      validation: '',
    };
    setCurrentField(newField);
    setIsEditingField(false);
  };

  const editField = field => {
    setCurrentField({ ...field });
    setIsEditingField(true);
  };

  const deleteField = fieldId => {
    setFormFields(formFields.filter(field => field.id !== fieldId));
    setFormData(prev => {
      const newData = { ...prev };
      delete newData[fieldId];
      return newData;
    });
  };

  const duplicateField = field => {
    const duplicatedField = {
      ...field,
      id: `field_${Date.now()}`,
      label: `${field.label} (Copy)`,
    };
    setFormFields([...formFields, duplicatedField]);
  };

  const moveField = (fieldId, direction) => {
    const currentIndex = formFields.findIndex(f => f.id === fieldId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= formFields.length) return;

    const newFields = [...formFields];
    [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];
    setFormFields(newFields);
  };

  const saveField = () => {
    if (!currentField.label.trim()) return;

    if (isEditingField) {
      setFormFields(formFields.map(field => (field.id === currentField.id ? currentField : field)));
    } else {
      setFormFields([...formFields, currentField]);
    }

    setCurrentField(null);
    setIsEditingField(false);
  };

  const cancelEdit = () => {
    setCurrentField(null);
    setIsEditingField(false);
  };

  const handleFormDataChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Enhanced PDF generation with better formatting
  const generatePDF = async () => {
    if (!validateForm()) {
      setActiveTab('preview');
      return;
    }

    setIsGenerating(true);
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
      const contentWidth = pageWidth - margin * 2;
      let yPosition = pageHeight - margin;

      // Add header if enabled
      if (formSettings.includeHeader) {
        const headerFont = await Font.create(pdfDoc, Font.StandardType1Font.e_helvetica_bold);
        const headerElement = await elementBuilder.createTextBegin(headerFont, 24);
        await headerElement.setTextMatrix(await Matrix2D.createIdentityMatrix());
        await headerElement.setTextColor(await ColorPt.init(0.2, 0.2, 0.2));
        await elementWriter.writeElement(headerElement);

        const headerText = await elementBuilder.createTextRun(formTitle);
        await headerText.setTextMatrix(await Matrix2D.createIdentityMatrix().translate(margin, yPosition));
        await elementWriter.writeElement(headerText);

        yPosition -= 60;
      }

      // Add form fields with better formatting
      for (const field of formFields) {
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

        // Simple word wrapping
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
      if (formSettings.includeFooter) {
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
      const blob = new Blob([data], { type: 'application/pdf' });

      // Download the PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Enhanced field editor with validation
  const renderFieldEditor = () => {
    if (!currentField) return null;

    return (
      <div className="field-editor">
        <h3>{isEditingField ? 'Edit Field' : 'Add New Field'}</h3>

        <div className="field-input">
          <label>Field Label: *</label>
          <Input
            value={currentField.label}
            onChange={e => setCurrentField({ ...currentField, label: e.target.value })}
            placeholder="Enter field label"
            className={!currentField.label.trim() ? 'error' : ''}
          />
          {!currentField.label.trim() && <div className="error-message">Field label is required</div>}
        </div>

        <div className="field-input">
          <label>Field Type:</label>
          <Dropdown
            options={Object.values(FIELD_TYPES).map(type => ({
              value: type,
              label: type.charAt(0).toUpperCase() + type.slice(1),
            }))}
            value={currentField.type}
            onChange={option => setCurrentField({ ...currentField, type: option.value })}
          />
        </div>

        <div className="field-input">
          <label>Placeholder:</label>
          <Input
            value={currentField.placeholder}
            onChange={e => setCurrentField({ ...currentField, placeholder: e.target.value })}
            placeholder="Enter placeholder text"
          />
        </div>

        <div className="field-input">
          <label>Validation Rules:</label>
          <Input
            value={currentField.validation}
            onChange={e => setCurrentField({ ...currentField, validation: e.target.value })}
            placeholder="e.g., required|email|min:5"
          />
          <small>Available rules: required, email, phone, url, min:X, max:X</small>
        </div>

        <div className="field-input">
          <Choice
            checked={currentField.required}
            onChange={e => setCurrentField({ ...currentField, required: e.target.checked })}
            label="Required field"
          />
        </div>

        {currentField.type === FIELD_TYPES.SELECT && (
          <div className="field-input">
            <label>Options:</label>
            <CreatableList
              options={currentField.options.map((option, index) => ({ value: option, label: option }))}
              onOptionsUpdated={options => setCurrentField({ ...currentField, options: options.map(opt => opt.value) })}
            />
          </div>
        )}

        <div className="field-actions">
          <Button onClick={saveField} disabled={!currentField.label.trim()}>
            {isEditingField ? 'Update Field' : 'Add Field'}
          </Button>
          <Button onClick={cancelEdit} className="secondary">
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  // Enhanced field input rendering
  const renderFieldInput = field => {
    const value = formData[field.id] || '';
    const error = validationErrors[field.id];

    const inputProps = {
      value: value,
      onChange: e => handleFormDataChange(field.id, e.target.value),
      placeholder: field.placeholder,
      className: error ? 'error' : '',
    };

    switch (field.type) {
      case FIELD_TYPES.TEXTAREA:
        return (
          <div className="field-input-wrapper">
            <textarea {...inputProps} rows={4} className={`form-textarea ${error ? 'error' : ''}`} />
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      case FIELD_TYPES.EMAIL:
        return (
          <div className="field-input-wrapper">
            <Input type="email" {...inputProps} />
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      case FIELD_TYPES.PHONE:
        return (
          <div className="field-input-wrapper">
            <Input type="tel" {...inputProps} />
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      case FIELD_TYPES.DATE:
        return (
          <div className="field-input-wrapper">
            <Input type="date" {...inputProps} />
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      case FIELD_TYPES.NUMBER:
        return (
          <div className="field-input-wrapper">
            <Input type="number" {...inputProps} />
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      case FIELD_TYPES.URL:
        return (
          <div className="field-input-wrapper">
            <Input type="url" {...inputProps} />
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      case FIELD_TYPES.PASSWORD:
        return (
          <div className="field-input-wrapper">
            <Input type="password" {...inputProps} />
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      case FIELD_TYPES.SELECT:
        return (
          <div className="field-input-wrapper">
            <Dropdown
              options={field.options.map(option => ({ value: option, label: option }))}
              value={value}
              onChange={option => handleFormDataChange(field.id, option.value)}
              placeholder={field.placeholder}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      case FIELD_TYPES.CHECKBOX:
        return (
          <div className="field-input-wrapper">
            <Choice
              checked={value}
              onChange={e => handleFormDataChange(field.id, e.target.checked)}
              label={field.placeholder}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      case FIELD_TYPES.SIGNATURE:
        return (
          <div className="field-input-wrapper">
            <div className="signature-field">
              <Button onClick={() => handleFormDataChange(field.id, 'Signed')}>Add Signature</Button>
              {value && <span className="signature-status">✓ Signed</span>}
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      default:
        return (
          <div className="field-input-wrapper">
            <Input {...inputProps} />
            {error && <div className="error-message">{error}</div>}
          </div>
        );
    }
  };

  // Render tabs
  const renderTabs = () => (
    <div className="form-builder-tabs">
      <button className={`tab ${activeTab === 'builder' ? 'active' : ''}`} onClick={() => setActiveTab('builder')}>
        Form Builder
      </button>
      <button className={`tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>
        Preview
      </button>
      <button className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
        Settings
      </button>
      <button className={`tab ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
        Saved Forms
      </button>
    </div>
  );

  // Render saved forms
  const renderSavedForms = () => (
    <div className="saved-forms-section">
      <h3>Saved Forms</h3>
      {savedForms.length === 0 ? (
        <p>No saved forms yet. Create a form and it will be auto-saved.</p>
      ) : (
        <div className="saved-forms-list">
          {savedForms.map(form => (
            <div key={form.id} className="saved-form-item">
              <div className="saved-form-info">
                <h4>{form.title}</h4>
                <p>Last modified: {new Date(form.lastModified).toLocaleDateString()}</p>
              </div>
              <div className="saved-form-actions">
                <Button onClick={() => loadForm(form.id)} className="small">
                  Load
                </Button>
                <Button onClick={() => deleteForm(form.id)} className="small secondary">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render settings
  const renderSettings = () => (
    <div className="settings-section">
      <h3>Form Settings</h3>

      <div className="setting-group">
        <label>Theme:</label>
        <Dropdown
          options={[
            { value: 'professional', label: 'Professional' },
            { value: 'modern', label: 'Modern' },
            { value: 'classic', label: 'Classic' },
          ]}
          value={formSettings.theme}
          onChange={option => setFormSettings({ ...formSettings, theme: option.value })}
        />
      </div>

      <div className="setting-group">
        <label>Font Size:</label>
        <Dropdown
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ]}
          value={formSettings.fontSize}
          onChange={option => setFormSettings({ ...formSettings, fontSize: option.value })}
        />
      </div>

      <div className="setting-group">
        <label>Spacing:</label>
        <Dropdown
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'normal', label: 'Normal' },
            { value: 'spacious', label: 'Spacious' },
          ]}
          value={formSettings.spacing}
          onChange={option => setFormSettings({ ...formSettings, spacing: option.value })}
        />
      </div>

      <div className="setting-group">
        <Choice
          checked={formSettings.includeHeader}
          onChange={e => setFormSettings({ ...formSettings, includeHeader: e.target.checked })}
          label="Include header in PDF"
        />
      </div>

      <div className="setting-group">
        <Choice
          checked={formSettings.includeFooter}
          onChange={e => setFormSettings({ ...formSettings, includeFooter: e.target.checked })}
          label="Include footer in PDF"
        />
      </div>
    </div>
  );

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Dynamic Form Builder" className="DynamicFormBuilder">
      <div className="form-builder-container">
        {renderTabs()}

        {activeTab === 'builder' && (
          <>
            <div className="template-section">
              <h3>Choose Template</h3>
              <Dropdown
                options={Object.entries(templates).map(([key, template]) => ({
                  value: key,
                  label: template.title,
                }))}
                value={selectedTemplate}
                onChange={option => setSelectedTemplate(option.value)}
              />
              {templates[selectedTemplate]?.description && (
                <p className="template-description">{templates[selectedTemplate].description}</p>
              )}
            </div>

            <HorizontalDivider />

            <div className="form-title-section">
              <h3>Form Title</h3>
              <Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Enter form title" />
            </div>

            <HorizontalDivider />

            <div className="fields-section">
              <div className="fields-header">
                <h3>Form Fields</h3>
                <div className="fields-actions">
                  <Button onClick={addField}>Add Field</Button>
                  <Button onClick={() => setShowPreview(!showPreview)} className="secondary">
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>
              </div>

              {renderFieldEditor()}

              <div className="fields-list">
                {formFields.map((field, index) => (
                  <div key={field.id} className="field-item">
                    <div className="field-info">
                      <span className="field-label">{field.label}</span>
                      <span className="field-type">{field.type}</span>
                      {field.required && <span className="required-badge">Required</span>}
                      {field.validation && <span className="validation-badge">Validated</span>}
                    </div>
                    <div className="field-actions">
                      <Button onClick={() => moveField(field.id, 'up')} disabled={index === 0} className="small">
                        ↑
                      </Button>
                      <Button
                        onClick={() => moveField(field.id, 'down')}
                        disabled={index === formFields.length - 1}
                        className="small"
                      >
                        ↓
                      </Button>
                      <Button onClick={() => duplicateField(field)} className="small">
                        Copy
                      </Button>
                      <Button onClick={() => editField(field)} className="small">
                        Edit
                      </Button>
                      <Button onClick={() => deleteField(field.id)} className="small secondary">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'preview' && (
          <div className="form-preview-section">
            <h3>Form Preview</h3>
            <div className="form-preview">
              <h2>{formTitle}</h2>
              {formFields.map(field => (
                <div key={field.id} className="form-field">
                  <label>
                    {field.label}
                    {field.required && <span className="required">*</span>}
                  </label>
                  {renderFieldInput(field)}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && renderSettings()}

        {activeTab === 'saved' && renderSavedForms()}

        <div className="form-actions">
          <div className="form-status">
            {autoSaveStatus && <span className="auto-save-status">{autoSaveStatus}</span>}
            {Object.keys(validationErrors).length > 0 && (
              <span className="validation-status">{Object.keys(validationErrors).length} validation error(s)</span>
            )}
          </div>
          <div className="action-buttons">
            <Button onClick={generatePDF} disabled={isGenerating || formFields.length === 0} className="primary">
              {isGenerating ? 'Generating PDF...' : 'Generate PDF'}
            </Button>
            <Button onClick={saveFormLocally} className="secondary">
              Save Form
            </Button>
            <Button onClick={onClose} className="secondary">
              Close
            </Button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

DynamicFormBuilder.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DynamicFormBuilder;
