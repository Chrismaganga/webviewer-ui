# Dynamic Form Builder - Advanced Edition

A powerful, user-friendly form builder component that allows users to create dynamic forms and generate professional PDFs for resumes, cover letters, job applications, contracts, invoices, and other documents.

## 🚀 Features

### 📋 Pre-built Templates

- **Professional Resume**: Complete resume template with all essential sections
- **Cover Letter**: Professional cover letter template with proper formatting
- **Job Application**: Comprehensive job application form
- **Service Contract**: Professional service contract template
- **Professional Invoice**: Detailed invoice template for services/products
- **Custom Forms**: Create your own forms from scratch

### 📝 Advanced Field Types (12 types)

- **Text**: Single line text input
- **Textarea**: Multi-line text input with word wrapping
- **Email**: Email validation with real-time checking
- **Phone**: Phone number input with formatting
- **Date**: Date picker with validation
- **Number**: Numeric input with validation
- **URL**: URL input with protocol validation
- **Password**: Secure password input
- **Select**: Dropdown with custom options
- **Checkbox**: Boolean selection
- **Radio**: Single choice from multiple options
- **Signature**: Digital signature field

### ✅ Smart Validation System

- **Real-time Validation**: Instant feedback as users type
- **Multiple Validation Rules**: required, email, phone, url, min/max length, numeric, alpha, alphanumeric, date validation
- **Custom Validation**: Add custom validation rules
- **Error Display**: Clear error messages with visual indicators
- **Form-level Validation**: Complete form validation before PDF generation

### 💾 Auto-Save & Form Management

- **Auto-Save**: Automatically saves forms every 2 seconds
- **Local Storage**: Forms persist between sessions
- **Form Library**: Save and manage multiple forms
- **Import/Export**: Export forms as JSON, import from files
- **Form Templates**: Save custom templates for reuse

### 🎨 User-Friendly Interface

- **Tabbed Interface**: Builder, Preview, Settings, and Saved Forms tabs
- **Drag & Drop**: Reorder fields with up/down arrows
- **Field Duplication**: Copy fields with one click
- **Real-time Preview**: See form as it will appear in PDF
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

### ⚙️ Advanced Settings

- **PDF Customization**:
  - Theme selection (Professional, Modern, Classic)
  - Font size options (Small, Medium, Large)
  - Spacing control (Compact, Normal, Spacious)
  - Header/Footer toggle
- **Form Settings**: Customize form appearance and behavior
- **Export Options**: Multiple PDF generation options

### 📄 Enhanced PDF Generation

- **Professional Layout**: Clean, well-formatted PDFs
- **Word Wrapping**: Automatic text wrapping for long content
- **Multi-page Support**: Automatic page breaks for long forms
- **Header/Footer**: Customizable headers and footers
- **Date Stamping**: Automatic generation date
- **File Naming**: Smart file naming with dates

## 🛠️ Technical Features

### 🔧 Advanced Logic

- **Field Management**: Add, edit, delete, duplicate, and reorder fields
- **Validation Engine**: Comprehensive validation with custom rules
- **PDF Engine**: Uses WebViewer's PDFNet for high-quality PDF generation
- **State Management**: Redux integration for seamless state handling
- **Error Handling**: Robust error handling with user-friendly messages

### 📱 Responsive & Accessible

- **Mobile-Friendly**: Optimized for all screen sizes
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **High Contrast**: Accessible color schemes
- **Focus Management**: Proper focus handling for accessibility

### 🔒 Data Security

- **Local Storage**: All data stored locally in browser
- **No Server Dependencies**: Works completely offline
- **Data Privacy**: No data sent to external servers
- **Secure Validation**: Client-side validation with security best practices

## 📖 Usage Guide

### Getting Started

1. **Open the Form Builder**: Click the "Dynamic Form Builder" button in the menu
2. **Choose a Template**: Select from pre-built templates or start with a custom form
3. **Customize Fields**: Add, edit, or remove fields as needed
4. **Preview Your Form**: Switch to the Preview tab to see how it looks
5. **Generate PDF**: Fill out the form and click "Generate PDF"

### Creating Custom Forms

1. **Select "Custom" Template**: Start with a blank form
2. **Add Fields**: Use the "Add Field" button to add different field types
3. **Configure Fields**: Set labels, placeholders, validation rules, and options
4. **Reorder Fields**: Use the up/down arrows to reorder fields
5. **Save Your Form**: Forms are auto-saved, or use "Save Form" manually

### Advanced Features

- **Validation Rules**: Add validation like `required|email|min:5` to fields
- **Field Options**: For select/radio fields, add custom options
- **Form Settings**: Customize PDF appearance in the Settings tab
- **Form Management**: Load, save, and delete forms in the Saved Forms tab

## 🎯 Use Cases

### For Job Seekers

- Create professional resumes with consistent formatting
- Generate tailored cover letters for specific positions
- Build comprehensive job applications
- Track multiple application versions

### For Businesses

- Create service contracts and agreements
- Generate professional invoices
- Build customer feedback forms
- Create employee onboarding forms

### For Developers

- Rapid form prototyping
- PDF generation without server dependencies
- Custom form building for clients
- Integration with existing applications

## 🔧 Integration

### Redux Integration

The component integrates seamlessly with the existing Redux store:

```javascript
// Open the form builder
dispatch(actions.openElement(DataElements.DYNAMIC_FORM_BUILDER));

// Close the form builder
dispatch(actions.closeElement(DataElements.DYNAMIC_FORM_BUILDER));
```

### API Integration

Use the helper functions for custom integration:

```javascript
import { generatePDF, validateForm, saveFormToStorage, loadFormsFromStorage } from 'helpers/dynamicFormHelpers';

// Generate PDF
const pdfBlob = await generatePDF(title, fields, formData, settings);

// Validate form
const { errors, isValid } = validateForm(fields, formData);

// Save form
saveFormToStorage(formData);
```

## 🎨 Customization

### Styling

The component uses SCSS for styling and can be customized:

```scss
.DynamicFormBuilder {
  .form-builder-container {
    // Custom styles
  }
}
```

### Templates

Add custom templates by extending the templates object:

```javascript
const customTemplates = {
  CUSTOM_TEMPLATE: {
    title: 'My Custom Template',
    description: 'Description of my template',
    fields: [
      // Field definitions
    ],
  },
};
```

### Validation Rules

Extend validation by adding new rules to the validation engine:

```javascript
// Add custom validation rule
case 'custom_rule':
  if (value && !customValidation(value)) {
    return 'Custom validation failed';
  }
  break;
```

## 🚀 Performance Features

### Optimization

- **Lazy Loading**: Components load only when needed
- **Debounced Auto-Save**: Prevents excessive saves
- **Efficient Rendering**: Optimized React rendering
- **Memory Management**: Proper cleanup of resources

### Caching

- **Form Caching**: Forms cached in localStorage
- **Template Caching**: Templates loaded once and cached
- **PDF Caching**: Generated PDFs cached temporarily

## 🔍 Troubleshooting

### Common Issues

1. **PDF Generation Fails**: Ensure WebViewer core is loaded
2. **Validation Errors**: Check field validation rules
3. **Auto-Save Not Working**: Check browser localStorage support
4. **Form Not Loading**: Clear localStorage and try again

### Debug Mode

Enable debug mode for detailed logging:

```javascript
// Add to component props
debug={true}
```

## 📈 Future Enhancements

### Planned Features

- **Cloud Storage**: Save forms to cloud services
- **Collaboration**: Multi-user form editing
- **Advanced Templates**: More professional templates
- **Form Analytics**: Track form usage and completion rates
- **API Integration**: Connect to external data sources
- **Advanced PDF**: More PDF customization options

### Community Contributions

- **Template Library**: Community-contributed templates
- **Plugin System**: Extensible plugin architecture
- **Theme Marketplace**: Custom themes and styles

## 🤝 Contributing

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Open Dynamic Form Builder in the app

### Code Standards

- Follow existing code style
- Add proper JSDoc comments
- Include unit tests for new features
- Update documentation for changes

### Testing

Run the test suite:

```bash
npm test
```

## 📄 License

This component is part of the WebViewer UI project and follows the same licensing terms.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section
2. Review the code comments
3. Open an issue in the repository
4. Contact the development team

---

**Dynamic Form Builder** - Making form creation and PDF generation simple, powerful, and user-friendly! 🎉
