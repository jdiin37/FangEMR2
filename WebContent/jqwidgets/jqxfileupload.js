/*
jQWidgets v5.2.0 (2017-Sep)
Copyright (c) 2011-2017 jQWidgets.
License: http://jqwidgets.com/license/
*/
!function(e){"use strict";e.jqx.jqxWidget("jqxFileUpload","",{}),e.extend(e.jqx._jqxFileUpload.prototype,{defineInstance:function(){var t={width:null,height:"auto",uploadUrl:"",fileInputName:"",autoUpload:!1,multipleFilesUpload:!0,accept:null,browseTemplate:"",uploadTemplate:"",cancelTemplate:"",localization:null,renderFiles:null,disabled:!1,rtl:!1,events:["select","remove","uploadStart","uploadEnd"]};return this===e.jqx._jqxFileUpload.prototype?t:(e.extend(!0,this,t),t)},createInstance:function(){var t=this;if(void 0===t.host.jqxButton)throw new Error("jqxFileUpload: Missing reference to jqxbuttons.js");t._createFromInput("jqxFileUpload"),e.jqx.browser.msie?e.jqx.browser.version<11&&(t._ieOldWebkit=!0,e.jqx.browser.version<8&&(t._ie7=!0)):e.jqx.browser.webkit&&(t._ieOldWebkit=!0),t._fluidWidth="string"==typeof t.width&&"%"===t.width.charAt(t.width.length-1),t._fluidHeight="string"==typeof t.height&&"%"===t.height.charAt(t.height.length-1),t._render(!0)},_createFromInput:function(t){var o=this;if("input"==o.element.nodeName.toLowerCase()){o.field=o.element,o.field.className&&(o._className=o.field.className);var l={title:o.field.title};o.field.id.length?l.id=o.field.id.replace(/[^\w]/g,"_")+"_"+t:l.id=e.jqx.utilities.createId()+"_"+t;var i=e("<div></div>",l);i[0].style.cssText=o.field.style.cssText,o.width||(o.width=e(o.field).width()),o.height||(o.height=e(o.field).outerHeight()),e(o.field).hide().after(i);var a=o.host.data();if(o.host=i,o.host.data(a),o.element=i[0],o.element.id=o.field.id,o.field.id=l.id,o._className&&(o.host.addClass(o._className),e(o.field).removeClass(o._className)),o.field.tabIndex){var d=o.field.tabIndex;o.field.tabIndex=-1,o.element.tabIndex=d}}},_render:function(t){var o=this;o._setSize(),o._addClasses(),!0===t?o._appendElements():o._removeHandlers(),o._addHandlers(),o._ie7&&(o._borderAndPadding("width",o.host),"auto"!==o.height&&o._borderAndPadding("height",o.host)),e.jqx.utilities.resize(o.host,null,!0),e.jqx.utilities.resize(o.host,function(){if(o._fluidWidth){o._ie7&&(o.host.css("width",o.width),o._borderAndPadding("width",o.host));for(var e=0;e<o._fileRows.length;e++){var t=o._fileRows[e],l=t.fileRow;o._ie7&&(l.css("width","100%"),o._borderAndPadding("width",l)),o.renderFiles||o._setMaxWidth(t)}if(o.rtl&&o._ieOldWebkit)for(var i=0;i<o._forms.length;i++){var a=o._browseButton.position();o._forms[i].form.css({left:a.left,top:a.top})}}o._ie7&&o._fluidHeight&&(o.host.css("height",o.height),o._borderAndPadding("height",o.host))})},render:function(){this._render(!1)},refresh:function(e){!0!==e&&this._render(!1)},destroy:function(){var e=this;e.cancelAll(),e._removeHandlers(!0),e.host.remove()},browse:function(){if(!(e.jqx.browser.msie&&e.jqx.browser.version<10)){var t=this;(!0===t.multipleFilesUpload||!1===t.multipleFilesUpload&&0===t._fileRows.length)&&t._forms[t._forms.length-1].fileInput.click()}},_uploadFile:function(e){var t=this;0===t._uploadQueue.length&&t._uploadQueue.push(e),t.renderFiles||(e.uploadFile.add(e.cancelFile).hide(),e.loadingElement.show()),e.fileInput.attr("name",t.fileInputName),t._raiseEvent("2",{file:e.fileName}),e.form[0].submit(),t._fileObjectToRemove=e},uploadFile:function(e){var t=this,o=t._fileRows[e];void 0!==o&&t._uploadFile(o)},uploadAll:function(){var e=this;if(e._fileRows.length>0){for(var t=e._fileRows.length-1;t>=0;t--)e._uploadQueue.push(e._fileRows[t]);e._uploadFile(e._fileRows[0])}},cancelFile:function(e){var t=this;t._removeSingleFileRow(t._fileRows[e])},cancelAll:function(){var e=this;if(e._fileRows.length>0){for(var t=0;t<e._fileRows.length;t++)e._removeFileRow(e._fileRows[t]);setTimeout(function(){e._browseButton.css("margin-bottom",0)},400),e._fileRows.length=0,e._hideButtons(!0)}},propertyChangedHandler:function(t,o,l,i){var a=t.element.id;if("localization"===o)return!i.browseButton||l&&i.browseButton===l.browseButton||(t._browseButton.text(i.browseButton),t._browseButton.jqxButton({width:"auto"})),!i.uploadButton||l&&i.uploadButton===l.uploadButton||(t._uploadButton.text(i.uploadButton),t._uploadButton.jqxButton({width:"auto"})),!i.cancelButton||l&&i.cancelButton===l.cancelButton||(t._cancelButton.text(i.cancelButton),t._cancelButton.jqxButton({width:"auto"})),void(t.renderFiles||(!i.uploadFileTooltip||l&&i.uploadFileTooltip===l.uploadFileTooltip||e("#"+a+" .jqx-file-upload-file-upload").attr("title",i.uploadFileTooltip),!i.uploadFileTooltip||l&&i.cancelFileTooltip===l.cancelFileTooltip||e("#"+a+" .jqx-file-upload-file-cancel").attr("title",i.cancelFileTooltip)));if(i!==l)switch(o){case"width":if(t.host.css("width",i),t._ie7){t._borderAndPadding("width",t.host);for(var d=0;d<t._fileRows.length;d++){var n=t._fileRows[d].fileRow;n.css("width","100%"),t._borderAndPadding("width",n)}}return void(t._fluidWidth="string"==typeof i&&"%"===i.charAt(i.length-1));case"height":return t.host.css("height",i),t._ie7&&t._borderAndPadding("height",t.host),void(t._fluidHeight="string"==typeof i&&"%"===i.charAt(i-1));case"uploadUrl":for(var r=0;r<t._forms.length;r++)t._forms[r].form.attr("action",i);return;case"accept":for(var s=0;s<t._forms.length;s++)t._forms[s].fileInput.attr("accept",i);return;case"theme":return e.jqx.utilities.setTheme(l,i,t.host),t._browseButton.jqxButton({theme:i}),t._uploadButton.jqxButton({theme:i}),void t._cancelButton.jqxButton({theme:i});case"browseTemplate":return void t._browseButton.jqxButton({template:i});case"uploadTemplate":return void t._uploadButton.jqxButton({template:i});case"cancelTemplate":return void t._cancelButton.jqxButton({template:i});case"disabled":return t._browseButton.jqxButton({disabled:i}),t._uploadButton.jqxButton({disabled:i}),t._cancelButton.jqxButton({disabled:i}),void(!0===i?t.host.addClass(t.toThemeProperty("jqx-fill-state-disabled")):t.host.removeClass(t.toThemeProperty("jqx-fill-state-disabled")));case"rtl":return void function(o){var l=o?"addClass":"removeClass";t._browseButton[l](t.toThemeProperty("jqx-file-upload-button-browse-rtl")),t._cancelButton[l](t.toThemeProperty("jqx-file-upload-button-cancel-rtl")),t._uploadButton[l](t.toThemeProperty("jqx-file-upload-button-upload-rtl")),e.jqx.browser.msie&&e.jqx.browser.version>8&&t._uploadButton[l](t.toThemeProperty("jqx-file-upload-button-upload-rtl-ie"));for(var i=0;i<t._fileRows.length;i++){var a=t._fileRows[i];a.fileNameContainer[l](t.toThemeProperty("jqx-file-upload-file-name-rtl")),a.cancelFile[l](t.toThemeProperty("jqx-file-upload-file-cancel-rtl")),a.uploadFile[l](t.toThemeProperty("jqx-file-upload-file-upload-rtl")),a.loadingElement[l](t.toThemeProperty("jqx-file-upload-loading-element-rtl"))}}(i)}},_raiseEvent:function(t,o){void 0===o&&(o={owner:null});var l=this.events[t];o.owner=this;var i=new e.Event(l);return i.owner=this,i.args=o,i.preventDefault&&i.preventDefault(),this.host.trigger(i)},_setSize:function(){var e=this;e.host.css("width",e.width),e.host.css("height",e.height)},_borderAndPadding:function(e,t){var o;o="width"===e?parseInt(t.css("border-left-width"),10)+parseInt(t.css("border-right-width"),10)+parseInt(t.css("padding-left"),10)+parseInt(t.css("padding-right"),10):parseInt(t.css("border-top-width"),10)+parseInt(t.css("border-bottom-width"),10)+parseInt(t.css("padding-top"),10)+parseInt(t.css("padding-bottom"),10),t.css(e,t[e]()-o)},_addClasses:function(){var e=this;e.host.addClass(e.toThemeProperty("jqx-widget jqx-widget-content jqx-rc-all jqx-file-upload")),!0===e.disabled&&e.host.addClass(e.toThemeProperty("jqx-fill-state-disabled"))},_appendElements:function(){var t=this,o="Browse",l=90,i="Upload All",a=90,d="Cancel All",n=90,r=t.element.id;t.localization&&(t.localization.browseButton&&(o=t.localization.browseButton,l="auto"),t.localization.uploadButton&&(i=t.localization.uploadButton,a="auto"),t.localization.cancelButton&&(d=t.localization.cancelButton,n="auto")),t._browseButton=e('<button id="'+r+'BrowseButton" class="'+t.toThemeProperty("jqx-file-upload-button-browse")+'">'+o+"</button>"),t.host.append(t._browseButton),t._browseButton.jqxButton({theme:t.theme,width:l,template:t.browseTemplate,disabled:t.disabled}),t._browseButton.after('<div style="clear: both;"></div>'),t._bottomButtonsContainer=e('<div class="'+t.toThemeProperty("jqx-file-upload-buttons-container")+'"></div>'),t.host.append(t._bottomButtonsContainer),t._uploadButton=e('<button id="'+r+'UploadButton" class="'+t.toThemeProperty("jqx-file-upload-button-upload")+'">'+i+"</button>"),t._bottomButtonsContainer.append(t._uploadButton),t._uploadButton.jqxButton({theme:t.theme,width:a,template:t.uploadTemplate,disabled:t.disabled}),t._cancelButton=e('<button id="'+r+'CancelButton" class="'+t.toThemeProperty("jqx-file-upload-button-cancel")+'">'+d+"</button>"),t._bottomButtonsContainer.append(t._cancelButton),t._cancelButton.jqxButton({theme:t.theme,width:n,template:t.cancelTemplate,disabled:t.disabled}),t._bottomButtonsContainer.after('<div style="clear: both;"></div>'),t.rtl&&(t._browseButton.addClass(t.toThemeProperty("jqx-file-upload-button-browse-rtl")),t._cancelButton.addClass(t.toThemeProperty("jqx-file-upload-button-cancel-rtl")),t._uploadButton.addClass(t.toThemeProperty("jqx-file-upload-button-upload-rtl")),e.jqx.browser.msie&&e.jqx.browser.version>8&&t._uploadButton.addClass(t.toThemeProperty("jqx-file-upload-button-upload-rtl-ie"))),t._uploadIframe=e('<iframe name="'+r+'Iframe" class="'+t.toThemeProperty("jqx-file-upload-iframe")+'" src=""></iframe>'),t.host.append(t._uploadIframe),t._iframeInitialized=!1,t._uploadQueue=[],t._forms=[],t._addFormAndFileInput(),t._fileRows=[]},_addFormAndFileInput:function(){var t=this,o=t.element.id,l=e('<form class="'+t.toThemeProperty("jqx-file-upload-form")+'" action="'+t.uploadUrl+'" target="'+o+'Iframe" method="post" enctype="multipart/form-data"></form>');t.host.append(l);var i=e('<input type="file" class="'+t.toThemeProperty("jqx-file-upload-file-input")+'" />');if(t.accept&&i.attr("accept",t.accept),l.append(i),t._ieOldWebkit){var a=t._browseButton.position(),d=t._browseButton.outerWidth(),n=t._browseButton.outerHeight(),r=t.rtl&&t._ie7?12:0;l.css({left:a.left-r,top:a.top,width:d,height:n}),l.addClass(t.toThemeProperty("jqx-file-upload-form-ie9")),i.addClass(t.toThemeProperty("jqx-file-upload-file-input-ie9")),t.addHandler(l,"mouseenter.jqxFileUpload"+o,function(){t._browseButton.addClass(t.toThemeProperty("jqx-fill-state-hover"))}),t.addHandler(l,"mouseleave.jqxFileUpload"+o,function(){t._browseButton.removeClass(t.toThemeProperty("jqx-fill-state-hover"))}),t.addHandler(l,"mousedown.jqxFileUpload"+o,function(){t._browseButton.addClass(t.toThemeProperty("jqx-fill-state-pressed"))}),t.addHandler(e(document),"mouseup.jqxFileUpload"+o,function(){t._browseButton.hasClass("jqx-fill-state-pressed")&&t._browseButton.removeClass(t.toThemeProperty("jqx-fill-state-pressed"))})}t.addHandler(i,"change.jqxFileUpload"+o,function(){var a,d=this.value;e.jqx.browser.mozilla||(d=-1!==d.indexOf("fakepath")?d.slice(12):d.slice(d.lastIndexOf("\\")+1)),a=e.jqx.browser.msie&&e.jqx.browser.version<10?"IE9 and earlier do not support getting the file size.":this.files[0].size;var n=t._addFileRow(d,l,i,a);1===t._fileRows.length&&(t._browseButton.css("margin-bottom","10px"),t._hideButtons(!1)),t._ieOldWebkit&&(t.removeHandler(l,"mouseenter.jqxFileUpload"+o),t.removeHandler(l,"mouseleave.jqxFileUpload"+o),t.removeHandler(l,"mousedown.jqxFileUpload"+o)),t._addFormAndFileInput(),t.removeHandler(i,"change.jqxFileUpload"+o),!0===t.autoUpload&&t._uploadFile(n)}),!0===t._ieOldWebkit&&t.addHandler(i,"click.jqxFileUpload"+o,function(e){!1===t.multipleFilesUpload&&t._fileRows.length>0&&e.preventDefault()}),t._forms.push({form:l,fileInput:i})},_addFileRow:function(t,o,l,i){var a,d,n,r,s,u=this,p="Cancel",c="Upload File";a=e('<div class="'+u.toThemeProperty("jqx-widget-content jqx-rc-all jqx-file-upload-file-row")+'"></div>'),0===u._fileRows.length?u._browseButton.after(a):u._fileRows[u._fileRows.length-1].fileRow.after(a),u.renderFiles?a.html(u.renderFiles(t)):(d=e('<div class="'+u.toThemeProperty("jqx-widget-header jqx-rc-all jqx-file-upload-file-name")+'">'+t+"</div>"),a.append(d),u.localization&&(u.localization.cancelFileTooltip&&(p=u.localization.cancelFileTooltip),u.localization.uploadFileTooltip&&(c=u.localization.uploadFileTooltip)),r=e('<div class="'+u.toThemeProperty("jqx-widget-header jqx-rc-all jqx-file-upload-file-cancel")+'" title="'+p+'"><div class="'+u.toThemeProperty("jqx-icon-close jqx-file-upload-icon")+'"></div></div>'),a.append(r),s=e('<div class="'+u.toThemeProperty("jqx-widget-header jqx-rc-all jqx-file-upload-file-upload")+'" title="'+c+'"><div class="'+u.toThemeProperty("jqx-icon-arrow-up jqx-file-upload-icon jqx-file-upload-icon-upload")+'"></div></div>'),a.append(s),n=e('<div class="'+u.toThemeProperty("jqx-file-upload-loading-element")+'"></div>'),a.append(n),u.rtl&&(d.addClass(u.toThemeProperty("jqx-file-upload-file-name-rtl")),r.addClass(u.toThemeProperty("jqx-file-upload-file-cancel-rtl")),s.addClass(u.toThemeProperty("jqx-file-upload-file-upload-rtl")),n.addClass(u.toThemeProperty("jqx-file-upload-loading-element-rtl"))),u._setMaxWidth({fileNameContainer:d,uploadFile:s,cancelFile:r})),u._ie7&&(u._borderAndPadding("width",a),u._borderAndPadding("height",a),u.renderFiles||(u._borderAndPadding("height",d),u._borderAndPadding("height",s),u._borderAndPadding("height",r)));var f={fileRow:a,fileNameContainer:d,fileName:t,uploadFile:s,cancelFile:r,loadingElement:n,form:o,fileInput:l,index:u._fileRows.length};return u._addFileHandlers(f),u._fileRows.push(f),u._raiseEvent("0",{file:t,size:i}),f},_setMaxWidth:function(e){var t=this,o=e.cancelFile.outerWidth(!0)+e.uploadFile.outerWidth(!0),l=t._ie7?6:0,i=t.host.width()-parseInt(t.host.css("padding-left"),10)-parseInt(t.host.css("padding-right"),10)-o-l-7;e.fileNameContainer.css("max-width",i)},_addFileHandlers:function(e){var t=this;if(!t.renderFiles){var o=t.element.id;t.addHandler(e.uploadFile,"mouseenter.jqxFileUpload"+o,function(){!1===t.disabled&&e.uploadFile.addClass(t.toThemeProperty("jqx-fill-state-hover"))}),t.addHandler(e.uploadFile,"mouseleave.jqxFileUpload"+o,function(){!1===t.disabled&&e.uploadFile.removeClass(t.toThemeProperty("jqx-fill-state-hover"))}),t.addHandler(e.uploadFile,"click.jqxFileUpload"+o,function(){!1===t.disabled&&t._uploadFile(e)}),t.addHandler(e.cancelFile,"mouseenter.jqxFileUpload"+o,function(){!1===t.disabled&&e.cancelFile.addClass(t.toThemeProperty("jqx-fill-state-hover"))}),t.addHandler(e.cancelFile,"mouseleave.jqxFileUpload"+o,function(){!1===t.disabled&&e.cancelFile.removeClass(t.toThemeProperty("jqx-fill-state-hover"))}),t.addHandler(e.cancelFile,"click.jqxFileUpload"+o,function(){!1===t.disabled&&t._removeSingleFileRow(e)})}},_removeSingleFileRow:function(e){var t=this;if(t._removeFileRow(e),t._fileRows.splice(e.index,1),0===t._fileRows.length)setTimeout(function(){t._browseButton.css("margin-bottom",0)},400),t._hideButtons(!0);else for(var o=0;o<t._fileRows.length;o++)t._fileRows[o].index=o},_removeFileRow:function(e){var t=this,o=t.element.id;t.renderFiles||(t.removeHandler(e.uploadFile,"mouseenter.jqxFileUpload"+o),t.removeHandler(e.uploadFile,"mouseleave.jqxFileUpload"+o),t.removeHandler(e.uploadFile,"click.jqxFileUpload"+o),t.removeHandler(e.cancelFile,"mouseenter.jqxFileUpload"+o),t.removeHandler(e.cancelFile,"mouseleave.jqxFileUpload"+o),t.removeHandler(e.cancelFile,"click.jqxFileUpload"+o)),e.fileRow.fadeOut(function(){e.fileRow.remove(),e.form.remove()}),t._raiseEvent("1",{file:e.fileName})},_hideButtons:function(e){var t=this;!0===e?t._bottomButtonsContainer.fadeOut():t._bottomButtonsContainer.fadeIn()},_addHandlers:function(){var t=this,o=t.element.id;t._ieOldWebkit||t.addHandler(t._browseButton,"click.jqxFileUpload"+o,function(){t.browse()}),t.addHandler(t._uploadButton,"click.jqxFileUpload"+o,function(){t.uploadAll()}),t.addHandler(t._cancelButton,"click.jqxFileUpload"+o,function(){t.cancelAll()}),t.addHandler(t._uploadIframe,"load.jqxFileUpload"+o,function(){if((e.jqx.browser.chrome||e.jqx.browser.webkit)&&(t._iframeInitialized=!0),!1===t._iframeInitialized)t._iframeInitialized=!0;else{var o=t._uploadIframe.contents().find("body").html();t._uploadQueue.length>0&&t._raiseEvent("3",{file:t._uploadQueue[t._uploadQueue.length-1].fileName,response:o}),t._fileObjectToRemove&&(t._removeSingleFileRow(t._fileObjectToRemove),t._fileObjectToRemove=null),t._uploadQueue.pop(),t._uploadQueue.length>0&&t._uploadFile(t._uploadQueue[t._uploadQueue.length-1])}})},_removeHandlers:function(t){var o=this,l=o.element.id;if(o.removeHandler(o._browseButton,"click.jqxFileUpload"+l),o.removeHandler(o._uploadButton,"click.jqxFileUpload"+l),o.removeHandler(o._cancelButton,"click.jqxFileUpload"+l),o.removeHandler(o._uploadIframe,"load.jqxFileUpload"+l),!0===t){var i=o._forms[o._forms.length-1];o.removeHandler(i.fileInput,"change.jqxFileUpload"+l),o._ieOldWebkit&&(o.removeHandler(i.form,"mouseenter.jqxFileUpload"+l),o.removeHandler(i.form,"mouseleave.jqxFileUpload"+l),o.removeHandler(i.form,"mousedown.jqxFileUpload"+l),o.removeHandler(e("body"),"mouseup.jqxFileUpload"+l))}}})}(jqxBaseFramework);

