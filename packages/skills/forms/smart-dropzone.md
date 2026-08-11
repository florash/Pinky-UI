# Smart Dropzone

## Purpose

`SmartDropzone` provides local drag/drop and click-to-select states around a real file input. Use it for frontend selection and validation before a separate upload process.

State accepted types, size limits and whether multiple files are allowed. Avoid claiming files were uploaded, hiding the file picker alternative or validating only by extension. Processing and complete states must reflect real host state.

The label is keyboard activatable and outcomes use a live region. Touch uses the normal file picker. Validate early, release object URLs in consuming previews and never read or transmit files without explicit application intent.
