(function($) {
	function getIEVersion() {
		var ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
		if( /msie|trident/i.test(ua) ) {
			var match = ua.match(/(?:msie |rv:)(\d+(\.\d+)?)/i);
    		return (match && match.length > 1 && match[1]) || '';
    	}
    	return '';
    }
    
    var W3CDOM = (document.createElement && document.getElementsByTagName),
    	IEVersion = '';
	
	if( bowser.msie )
		IEVersion = bowser.version;
	else
		IEVersion = getIEVersion();
	
	function initFileUploads() {
		if ( !W3CDOM || IEVersion.length ) return;
		
		//Create template for proxy elements
		var fakeFileUpload = document.createElement('div');
		fakeFileUpload.className = 'fakefile';
		fakeFileUpload.appendChild(document.createElement('input'));
		var image = document.createElement('a');
		image.className = "action-link";
		var imageContent = document.createTextNode("Browse");
		image.appendChild(imageContent);
		fakeFileUpload.appendChild(image);
		
		var inputs = document.getElementsByTagName('input'),
			id = 1,
			idPrefix = 'fakefile-';
		for (var i=0;i<inputs.length;i++) {
			if (inputs[i].type != 'file') continue;
			var fileInput = inputs[i],
				fileInputJQ = $(fileInput),
				clone = fakeFileUpload.cloneNode(true);
			fileInputJQ.hide();
			clone.id = idPrefix+id;
			fileInput.parentNode.appendChild(clone);
			id++;
			fileInput.relatedElement = document.getElementById(clone.id).getElementsByTagName('input')[0];
			fileInput.relatedImage = document.getElementById(clone.id).getElementsByTagName('a')[0];
			var relatedElementJQ = $(fileInput.relatedElement),
				relatedImageJQ = $(fileInput.relatedImage);
			relatedElementJQ.attr('rel', fileInput.id).prop('readonly', true);
			relatedImageJQ.attr('rel', fileInput.id);
			if(fileInputJQ.hasClass('fldrequired')) {
				relatedElementJQ.addClass('fldrequired');
			}
			
			fileInput.onchange = fileInput.onmouseout = function () {
				var thisElement = $(this);
					fileName = '',
					fileSize = false;
				if(window.FileReader) {
					//Use File API since it is available
					if(!this.files.length)
						return;
					fileName = this.files[0].name;
					fileSize = this.files[0].size;
				} else {
					//Old browser fallbacks
					if( !this.value )
						return;
					fileName = this.value.split(/(\\|\/)/g).pop();
				}
				this.relatedElement.value = fileName;
				
				var relatedImage = $(this.relatedImage);
				relatedImage.next('.filetype-error').remove();
				
				var acceptedFileTypes = thisElement.attr('accept');
				//Skip mime type verification if File API is not available
				if(acceptedFileTypes.indexOf('/') && !window.FileReader)
					return;
				
				var fileTypeError = true;
				acceptedFileTypes = acceptedFileTypes.split(',');
				fileName = fileName.toLowerCase();
				for (var ii=0;ii<acceptedFileTypes.length;ii++) {
					var acceptedFileType = acceptedFileTypes[ii].toLowerCase();
					if(acceptedFileType.indexOf('/')) {
						//MIME Type verification
						if(acceptedFileType == this.files[0].type) {
							fileTypeError = false;
							break;
						}
					}
					if(acceptedFileType.charAt(0) == '.') {
						//File extension verification
						if(fileName.endsWith(acceptedFileType)) {
							fileTypeError = false;
							break;	
						}
					}
				}
				
				if(fileTypeError) {
					relatedImage.after('<div class="filetype-error">Invalid File Type</div>');
					return;
				}
				
				var maxFileSize = thisElement.data('max-size');
				if( maxFileSize ) {
					if( false !== fileSize && fileSize > maxFileSize ) {
						var maxMegabytes = (maxFileSize / 1048576)+'MB';
						relatedImage.after('<div class="filetype-error">File is too large, must be smaller than '+maxMegabytes+'.</div>');
						return;
					}
				}
			};
			
			var browseEventClick = function () {
				$('#'+$(this).attr('rel')).click();
			};
			
			relatedElementJQ.on('click', browseEventClick);
			relatedImageJQ.on('click', browseEventClick);
			
			//Support for browser prefilled fields
			fileInputJQ.change();
		}
	}
	
	$(window).load(function() {
		initFileUploads();
	});
})(jQuery);

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}
