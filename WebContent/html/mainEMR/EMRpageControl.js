var zIndex = 10;
var element; 
var pageIndex = 0;

function resizePage(id){
	
	if(id == "mainPage"){
		var mainBlock1 = $("#mainBlock1").height();
		var mainBlock2 = $("#mainBlock2").height();
		var panelHeading = $('#' + id).find('.clearfix').height();
		var myNavbar = $("#myNavbar").height();
		
		$('#' + id).find('.pre-scrollable').css('height',userHeight - (mainBlock1+mainBlock2+panelHeading+myNavbar+170) + 'px').css('max-height',userHeight - (mainBlock1+mainBlock2+panelHeading+myNavbar+170) + 'px');
		pageHeight = $("#mainPage").height();
		pageWidth = $("#mainPage").width();
	}else if(id=="chgBedPage"){ //轉床紀錄畫面 RWD 1070410 OK
		$('#' + id).css('min-height', pageHeight +'px').css('max-height', pageHeight +'px');
		$('#' + id).css('min-width', pageWidth-1400 +'px').css('max-width', pageWidth-600 +'px');//1400
		$('#' + id).css('margin-left', pageWidth*0.2 +'px').css('margin-right', pageWidth*0.3+'px');//0.32 0.48
		 resizePanelBody("chgBedBody",pageHeight-100);//病房紀錄 panelBody
		
	}else if(id=="opdMedicineDetailPage"){  //門急診 醫藥囑查詢		
//		$('#' + id).css('min-height', (pageHeight/2) +'px').css('max-height', (pageHeight/2) +'px');
//		$('#' + id).css('min-width', (pageWidth*0.53) +'px').css('max-width', (pageWidth*0.53) +'px');
//		$('#' + id).css('margin-left', pageWidth*0.32 +'px').css('margin-right', pageWidth*0.48+'px');
		$('#' + id).css('min-height', pageHeight +'px').css('max-height', pageHeight +'px');
		$('#' + id).css('min-width', pageWidth +'px').css('max-width', pageWidth +'px');
		 resizePanelBody("opdMedicineDetailBody",(pageHeight-90));//門急紀錄 查詢醫藥囑 panelBody

		
	}else if(id=="opdDiseaseDARTPage"){  //1070503 add 從疾病彙總點過去的DART 
		$('#' + id).css('min-height', pageHeight +'px').css('max-height', pageHeight +'px');
		$('#' + id).css('min-width', pageWidth +'px').css('max-width', pageWidth +'px');
		 resizePanelBody("OpdDiseaseDARTBody",(pageHeight-90));//門急紀錄 從疾病彙總點過去的DART  panelBody
		
	}else if(id=="majorDiseasePage"){
		$('#' + id).css('min-height', pageHeight +'px').css('max-height', pageHeight +'px');
		$('#' + id).css('min-width', pageWidth +'px').css('max-width', pageWidth +'px');
		 resizePanelBody("majorDiseaseBody",(pageHeight-90));//重大疾病 panelBody
		
	}else if(id=="allergyPage"){
		$('#' + id).css('min-height', pageHeight +'px').css('max-height', pageHeight +'px');
		$('#' + id).css('min-width', pageWidth +'px').css('max-width', pageWidth +'px');
		 resizePanelBody("allergyBody",(pageHeight-90));//過敏 panelBody
		 
	}else if(id=="opdRecordPage"){
		$('#' + id).css('min-height', pageHeight +'px').css('max-height', pageHeight +'px');
		$('#' + id).css('min-width', pageWidth +'px').css('max-width', pageWidth +'px');
		
	}else{		
		$('#' + id).css('min-height', pageHeight +'px').css('max-height', pageHeight +'px');
		$('#' + id).css('min-width', pageWidth +'px').css('max-width', pageWidth +'px');
		resizePanelBody("labSumListBody",pageHeight-65);
		resizePanelBody("labChartListBody",pageHeight-60);//檢驗趨勢圖頁面 panelBody
		resizePanelBody("LabLineChart",pageHeight-120);
		//檢驗彙總趨勢圖 panelBody
		resizePanelBody("labSumChartListBody",pageHeight-90);//檢驗趨勢圖頁面 panelBody
		resizePanelBody("LabSumLineChart",pageHeight-210);
//		resizePanelBody("opdMedicineDetailBody",pageHeight-100);

		
		

		
	}
	
}

//可拖曳
function popUpPageToggle(id,justshowFlag){	
	if(justshowFlag == true){
		zIndex += 1; 		
		$('#' + id).css('z-index', zIndex);				
		$('#' + id).draggable({ handle:'.header'});	
		$('#' + id).addClass('freePage').addClass('popUp');	
		$('#' + id).show();
		
	}else if($('#'+ id).hasClass("ui-draggable")){	
		$('#' + id).css('z-index', 0);
		$('#' + id).removeClass('popUp').removeClass('freePage');
		$('#' + id).draggable( "destroy" );		
		$('#' + id).hide();
	}else{
		zIndex += 1; 		
		$('#' + id).css('z-index', zIndex);				
		$('#' + id).draggable({ handle:'.header'});	
		$('#' + id).addClass('freePage').addClass('popUp');	
		$('#' + id).show();
	}	
}

//drag




function popUpPageFixPos(id){
//	console.log("popPage:"+id);
	
	zIndex += 1; 
	$('#' + id).css('top', '65px');  //固定位置
	$('#' + id).css('left', '15px'); //固定位置
	//$('#' + id).css('height', pageHeight +'px').css('max-height', pageHeight +'px');
	$('#' + id).css('z-index', zIndex);				
	$('#' + id).draggable({ handle:'.header'});	
	$('#' + id).addClass('freePage').addClass('popUp');
	$('#' + id).show();
	goTop(id);
}

function popUpPageNo(id){	
	$('#' + id).css('z-index', 0);
	$('#' + id).removeClass('popUp').removeClass('freePage');	
	if($('#'+ id).hasClass("ui-draggable")){		
		$('#' + id).draggable( "destroy" );		
	}	
	$('#' + id).hide();
}

var goTop = function(id){
	if($('#' + id).hasClass( "popUp" ))
	{
		zIndex += 1;
		$('#' + id).css('z-index', zIndex);
	}
		
	
	if($("#"+id).hasClass( "PopPanel" )){
				
	}else{
		$( ".PopPanel" ).each(function( index ) {
			$(this).css('z-index', zIndex+=1);		
			});
	}
	
	
		
	
	
}

var setPageVisible = function(page, visible) {	//***important****
	if (visible == true) {
		if($.inArray(page, visiPageArray) == -1)  //未顯示才 add to visiPageArray
			visiPageArray.push(page);
//		console.log("showPage:"+page);
		$('#' + page).show();
		
	} else {
		visiPageArray = $.grep(visiPageArray, function(value) {
			return value != page;
		});
		popUpPageNo(page);
		$('#' + page).hide();		
	}
	processPage();
}

var hideOtherPage = function(){
	$.each( PageArray, function( index, value ){
		if(value != "mainPage"){
			popUpPageNo(value);
		}
	});
}

var closeOtherPage = function(){
	$.each( PageArray, function( index, value ){
		if(value != "mainPage"){
			setPageVisible(value,false);
		}
	});
}

var processPage = function (){	//處理底部toolbar and PageResize
			
	$('#bottom-toolbar').html("");			
	$.each( visiPageArray, function( index, value ) {
		  //alert( key + ": " + value );	
		  var title = $('#' + value + '_Title').html();	  
		  if(title.length > 15)
			  title = "<span title='" + title + "'>" + title.substr(0, 15) +"...</span>";// title.substr(0, 15)-->title.substr(0, 8)
		  
		  var btn;
		  if(value == "mainPage"){ // col-xs-2 --> col-xs-1 縮小頁籤的寬度
			  btn = '<div class="col-xs-2 ' + value + '" style="padding: 5px; ">' + 
			  		'<a href="#' + value +'" class="btn btn-info btn-block" id="a_' + value +'"><span id="X_' + value +'" class="pull-right glyphicon glyphicon-remove hide"></span>'+ title+'</a>'	+			
			  		'</div>';
			  $('#bottom-toolbar').append(btn);
				  
			  $('#a_' + value).click(function() {
				  hideOtherPage();
			  });  
		  }else{  //// col-xs-2 --> col-xs-1 縮小頁籤的寬度
			  btn = '<div class="col-xs-2 ' + value + '" style="padding: 5px;">' +
			  		'<a href="#' + value +'" class="btn btn-info btn-block" id="a_' + value +'"><span id="X_' + value +'" class="pull-right glyphicon glyphicon-remove"></span>'+ title+'</a>'	+			
			  		'</div>';
				 
			  $('#bottom-toolbar').append(btn);
				  
			  $('#a_' + value).click(function() {		
				  goTop(value);
				  popUpPageToggle(value,true); //the second parameter is for not hide when clicked; 
			  });
				  
			  $('#X_' + value).click(function() {
				  closePage(value);
			  });
		  }	
		  resizePage(value);		  
	});	
	resizeGrid();
};

var arrayPos =[];
var closePage = function(id){
	setPageVisible(id, false);
	collapseShow("mainPage");
	
	/**1070314**/
//	if(id=="labChartPage"){
//		$("#LabList").jqGrid('setSelection', $("#LabListRowKey").html(), true); //點完趨勢圖後，依然保留最後點擊的rowKey 位置 1070313 add by IvyLin
//	}
	
	//測試 關閉視窗一起關閉 已開啟視窗
	/**console.log("id=>"+id);
	var idSplit = id.substring(0,(id.length-4));
	console.log(idSplit.length);
	console.log(id.substring(0,(id.length-4)));	
	$.each( PopPanelArray, function(index,value){
//		console.log(value.substr(0, idSplit).toUpperCase().toString());
//		console.log(id.substring(0,(id.length-4)).toUpperCase().toString());
		if(value.substr(0, idSplit).toUpperCase().toString().indexOf(id.substring(0,(id.length-4)).toUpperCase().toString())){	
		    console.log("Index==>"+PopPanelArray.indexOf(value));
		    console.log("Value==>"+value);
//		    delete PopPanelArray[PopPanelArray.indexOf(value)];	
		    remove(PopPanelArray, PopPanelArray[PopPanelArray.indexOf(value)]);
//		    delete PopPanelArray[index];		    

//		    arrayPos.push(PopPanelArray.indexOf(value));
			$("#"+value).remove();
								
		}
					
	}); **/
	
	/***test****/
	
//	console.log("id=>"+id);
//	console.log(id.substring(0,(id.length-4)));

	
	
	
	
}

function equalsIgnoreCase(str1, str2)   
{    str1 = str1.toUpperCase();
     str2 = str2.toUpperCase();
    if(str1.startsWith(str2))   
    {   
        return true;   
    }   
    return false;   
}




//移除指定的 array value
function remove(arr, item) {
    for(var i = arr.length; i--;) {
        if(arr[i] === item) {
            arr.splice(i, 1);
        }
    }
}





var collapseHide = function(id){
	$('#collapse_' + id).collapse('hide');
}
var collapseShow = function(id){
	$('#collapse_' + id).collapse('show');
}




//過濾手術
var filterOpList = function(kind){
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"code",op:"eq",data:kind});	
	$("#OpList").setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid',[{page:1}]);
}



//ajax fail 查無資料 清除 jqGrid data
function noDataFound(ajaxErrMsg,tableID){			
	 if(ajaxErrMsg.includes('No Data Found')){
		  $("#" + tableID).jqGrid("clearGridData", true).trigger("reloadGrid");	 
	  }
}

//清除 jqGird Data
function clearGridData(tableID){
	$("#" + tableID).jqGrid("clearGridData", true).trigger("reloadGrid");		
}

var findSameCode = function(array,codeName){
	
	var count= 0;
	for(var i=0;i<array.length;i++){
		if(array[i]==codeName){
			count++;
		}
	}	
	return count;  
}





//設定 html 文字
function setHtml(tag,data){
	//用innerText 方可吃傳來字串中/n轉成<br/>
    try{
    	document.getElementById(tag).innerText=data; //data 可能會有null	
    }catch(e){
    	
    }
     

			

	
}

//過濾API 傳來的null空值
var filterNull = function(value) {
//	return value==null||value=="[object Window]"?"":value;
	return (value=="null"||value === undefined || value === null||value=="[object Window]"?"":value); 
}


///----測試中  動態新增
var giveMePanel = function(id,title){
	zIndex +=1;
	return  '<div id="' + id +'" class="freePage" onclick="goTop(\'' + id + '\');">' 
			+'<div class="panel panel-success">'
    		+ '<div class="panel-heading"><span class="EMRPurpleTitle" id="' + id + '_Title">' + title +'</span>'
    		+'<div class="pull-right">'
			+ '<button type="button" class="btn btn-link btn-popUp" onclick="popUpPageToggle(\'' + id + '\');"><span class="glyphicon glyphicon-new-window"></span></button>'
			+ '<button type="button" class="btn btn-link btn-close" onclick="closePage(\'' + id + '\');"><span class="glyphicon glyphicon-remove"></span></button>'
			+ '</div></div>'
    		+'<div class="panel-body"></div>'
    		+'</div>';
}

var cloneDivContent = function(event){
//	var parentId = $(event).parents('.page').attr('id');
	var windowId = $(event).parents('.panel-heading').attr('id');
	var body = $(event).parents('.panel-heading').siblings('.panel-body').attr('id');
	var divClone = document.getElementById(windowId).cloneNode(true);
	var divClone2 = document.getElementById(body).cloneNode(true);
	document.getElementById("PopPageContainer").appendChild(divClone);
	document.getElementById("PopPageContainer").appendChild(divClone2);
 
	
	
};


var removeHtml = function(id){
	$("#"+id).remove();//將動態產生的 div 刪除
	PopPanelArray.splice(PopPanelArray.indexOf(id), 1); //刪除動態產生該 PopPanelArray 的 值
};


var giveMepopUpPanel = function(id,title,body_html){
	zIndex +=1;
			
	return  '<div id="' + id +'" class="PopPanel" onclick="goTop(\'' + id + '\');">' 
			+'<div class="panel panel-info ">'
    		+ '<div class="panel-heading header"><span class="EMRPurpleTitle" id="' + id + '_Title">' + title +'</span>'
    		+'<div class="pull-right">'
			+ '<button type="button" class="btn btn-link btn-close" onclick="removeHtml(\'' + id + '\');"><span class="glyphicon glyphicon-remove"></span></button>'
			+ '</div></div>'
    		+'<div class="panel-body pre-scrollable">' + body_html
    		+'</div>'
    		+'</div>';
}

var iniJustPopUp = function(id,width,height,body_width){
	zIndex += 1;
//	PageArray.push(id);
	$('#' + id).css('top', '65px');  //固定位置  原 80px 1070411 modify
	$('#' + id).css('left', '15px'); //固定位置
//	$('#' + id).css('margin-left', pageWidth*0.16 +'px').css('margin-right', pageWidth*0.24+'px');
	//$('#' + id).css('height', pageHeight +'px').css('max-height', pageHeight +'px');
	$('#' + id).css('z-index', zIndex);				
	$('#' + id).draggable({ handle:'.header'});	
	$('#' + id).addClass('freePage').addClass('popUp');
	$('#' + id).show();
	$('#' + id).css('min-width', width +'px').css('max-width', width +'px');
	$('#' + id).css('min-height', height +'px').css('max-height', height +'px');
	$('#' + id).find('.panel-body').css('height',height -46 + 'px').css('max-height',height - 46 + 'px');
	$('#' + id).find('.panel-body').css('width','100%').css('max-width','100%');
	
//	$('#' + id).find('.panel-info').resizable();
	
	
	
}

var copyDivContentId = 0;
var copyDivContent = function(event){
	copyDivContentId += 1;
	var original_width = $('#' + $(event).parents('.panel-heading').attr('id')).parent().width();
	var parentWidth = $(event).parents('.page').width();
	var parentHeight = $(event).parents('.page').height();
	var windowId = $(event).parents('.panel-heading').attr('id') + copyDivContentId;
	var windowOutline = $(event).parents('.page').find(".panel .panel-info").html();;
//	var pullRight = $(event).parents('.page').find(".pull-right").html('<button type="button" class="btn btn-link btn-close" onclick="removeHtml(\'' + windowId + '\');"><span class="glyphicon glyphicon-remove"></span></button>');
	var pullRight = $(windowId).find(".pull-right").html('<button type="button" class="btn btn-link btn-close" onclick="removeHtml(\'' + windowId + '\');"><span class="glyphicon glyphicon-remove"></span></button>');
	$("#PopPageContainer").append(giveCopyPanel(windowId,windowOutline));
	$(windowId).clone(true);
	setTimeout(function(){ iniJustPopUp(windowId,original_width,parentHeight,parentWidth); }, 200);
};


var giveCopyPanel = function(id,body_html){
	zIndex +=1;
//	+'<div class="pull-right">'
//	+ '<button type="button" class="btn btn-link btn-close" onclick="removeHtml(\'' + id + '\');"><span class="glyphicon glyphicon-remove"></span></button>'
//	+ '</div></div>'		
	return  '<div id="' + id +'" class="PopPanel" onclick="goTop(\'' + id + '\');">' 
			+ body_html
    		+'</div>';
}


var justPopUpId = 0;
var justPopUp  = function(event){
	justPopUpId += 1;
	var original_width = $('#' + $(event).parents('.panel-heading').attr('id')).parent().width();
	var body_width = $('#' + $(event).parents('.panel-heading').attr('id')).siblings('.panel-body').width();
	var original_height = $('#' + $(event).parents('.panel-heading').attr('id')).parent().height();
	
	//測試  找到最外層的 父層Id
	var parentId = $(event).parents('.page').attr('id');
	var parentWidth = $(event).parents('.page').width();
	var parentHeight = $(event).parents('.page').height();


	var windowId = $(event).parents('.panel-heading').attr('id') + justPopUpId;
	var windowTitle = $(event).parents('.panel-heading').text();
	var body = $(event).parents('.panel-heading').siblings('.panel-body').html();

	$("#PopPageContainer").append(giveMepopUpPanel(windowId,windowTitle,body));//加在 最外圍
//	$("#"+parentId).append(giveMepopUpPanel(windowId,windowTitle,body)); //加在該Page Id 的 div中

	//測試 將PopUp的視窗加進 PopPanelArray 中
//	PopPanelArray.push(windowId);
	//$("#" + windowId).
//	setTimeout(function(){ iniJustPopUp(windowId,original_width,original_height,body_width); }, 200);	

	if(windowId.includes("OpdAcntDetailListHead1")||windowId.includes("OpdAcntDetailListHead2")||windowId.includes("OpdDiseaseSumListHead")){
		parentHeight = original_height+40;	
	}else {
		parentHeight = parentHeight;
	}
	setTimeout(function(){ iniJustPopUp(windowId,original_width,parentHeight,parentWidth); }, 200);
	
}
