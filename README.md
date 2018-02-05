# jquery.fileupload.js
jQuery plugin for proxying &lt;input type="file ... /> elements.

Uses the File API to 
* Validate the selected file's mime type or extension via the input's accept attribute.
* Enforce a max file size for the selected file via the input's data-max-size attribute. This value is set in bytes.
