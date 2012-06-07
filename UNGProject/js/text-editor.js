/**
 * This file provides classes needed by the text editor
 */

/**
 * Editors
 * editors must implement the following methods :
 * load : load the editor in the current page
 * saveEdition : save the edition made by this editor to the current document
 * loadContentFromDocument : display the content of the specified document in the editor
 */
Xinha = function() {
    this.name = "Xinha";                // name to use in dialog boxes
    this.objectName = "Xinha"  // name of the object reference
    this.load = function() {
	if(FirstTimeListLoad){
		if(FirstTimeLoadControl){
			$("#ha").css("height","450px").css("width","100%").htmlbox({
				    toolbars:[
					    [
						// Cut, Copy, Paste
						"separator","cut","copy","paste",
						// Undo, Redo
						"separator","undo","redo",
						// Bold, Italic, Underline, Strikethrough, Sup, Sub
						"separator","bold","italic","underline","strike","sup","sub",
						// Left, Right, Center, Justify
						"separator","justify","left","center","right",
						// Ordered List, Unordered List, Indent, Outdent
						"separator","ol","ul","indent","outdent",
						// Hyperlink, Remove Hyperlink, Image
						"separator","link","unlink","image"
		
						],
						[// Show code
						"separator","code",
					// Formats, Font size, Font family, Font color, Font, Background
					"separator","formats","fontsize","fontfamily",
						"separator","fontcolor","highlight",
						],
						[
						//Strip tags
						"separator","removeformat","striptags","hr","paragraph",
						// Styles, Source code syntax buttons
						"separator","quote","styles","syntax"
						]
					],
					skin:"blue"
				});
		}
	}
	else{
		$("#ha").css("height","450px").css("width","100%").htmlbox({
				    toolbars:[
					    [
						// Cut, Copy, Paste
						"separator","cut","copy","paste",
						// Undo, Redo
						"separator","undo","redo",
						// Bold, Italic, Underline, Strikethrough, Sup, Sub
						"separator","bold","italic","underline","strike","sup","sub",
						// Left, Right, Center, Justify
						"separator","justify","left","center","right",
						// Ordered List, Unordered List, Indent, Outdent
						"separator","ol","ul","indent","outdent",
						// Hyperlink, Remove Hyperlink, Image
						"separator","link","unlink","image"
		
						],
						[// Show code
						"separator","code",
					// Formats, Font size, Font family, Font color, Font, Background
					"separator","formats","fontsize","fontfamily",
						"separator","fontcolor","highlight",
						],
						[
						//Strip tags
						"separator","removeformat","striptags","hr","paragraph",
						// Styles, Source code syntax buttons
						"separator","quote","styles","syntax"
						]
					],
					skin:"blue"
				});
	}
	
    }
    this.saveEdition = function() {
        getCurrentDocument().saveEdition(document.getElementById("ha_html").contentWindow.document.body.innerHTML);
    }
    this.loadContentFromDocument = function(doc) {
//controllers are defined in the index.html
	if(FirstTimeListLoad){
		if(doc.getContent()){
			if(!isSaving){
				if(FirstTimeLoadControl)
					tryUntilSucceed(function() {document.getElementById("ha_html").contentWindow.document.write(doc.getContent());});
			}
		}
	}
	else{
		if(doc.getContent()){
			if(!isSaving){
				tryUntilSucceed(function() {document.getElementById("ha_html").contentWindow.document.write(doc.getContent());});
			}
		}
	}
	if((FirstTimeLoadControl==false)&&(isFirstTimeLoad==false))
		FirstTimeLoadControl=true;
	FirstTimeListLoad=false;
	isSaving=false;
    }
    this.load();
}


/**
 * Text documents
 *
 * editable documents must override the following arguments and methods of JSONDocument prototype
 * type : a unique type ID
 * saveEdition : set the argument as the new content of the document. Change last modification time and display the changes
 * setAsCurrentDocument : set the document as currentDocument in the local storage and display its properties in the current page
 */

JSONDocument.prototype.type = "text";
JSONDocument.prototype.saveEdition = function(content) {
    this.setLastUser(getCurrentUser().getName());
    this.setContent(content);
    this.setLastModification(getCurrentTime());
    getCurrentPage().displayDocumentInformation(this);
}

