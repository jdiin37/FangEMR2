
/**Focus **/
//var selectedRows = {};
var focusRowKey;
var NumOfRow = Math.floor(($(window).height()-255)/36);
function jqGrid_focusListData(tableName,pagerName,arrayData){
	var tableGrid = $(tableName);
	$(tableName).jqGrid({
	    datatype: "local",
	    rowNum:NumOfRow,
	    height: Math.floor($(window).height()-255),
	    colModel: [
	        { label: 'Date', name: 'progress_date', width: 40, formatter: formatDateTime },
	        { label: 'Time', name: 'progress_time', formatter: formatDateTime, width: 40 },
	        { label: 'Focus', name: 'focus', width: 50},
	        { label: 'D', name: 'content_d', width: 50,hidden:true},
	        { label: 'A', name: 'content_a', width: 50,hidden:true},
	        { label: 'R', name: 'content_r', width: 50,hidden:true},
	        { label: 'T', name: 'content_t', width: 50,hidden:true},
	        { label: '醫師', name: 'doctor_name', width: 50,hidden:true},
	        { label: '護士', name: 'keyin_clerk_name', width: 50,hidden:true},
	      
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    onSelectRow:getSelectedRow,
	    width: null,
	    shrinkToFit: true,
//	    sortable:true,  //可否拖曳排序
//	    caption: "Focus護理紀錄",
		pager: pagerName,
		gridComplete: function () {
			tableGrid.setSelection(focusRowKey, true);
          }
                  
	});
//	$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false});
//	searchOperators:true,defaultSearch: "cn"
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {data: arrayData});
	$(tableName).trigger('reloadGrid');
//	$('#currentList').show();
//	$('#chartBaseList').hide();
	
	function getSelectedRow(rowId,status,e) {
		
		if(status===true){
			setFocusData("content_D",$(tableName).jqGrid('getCell',rowId,'content_d'));
	    	setFocusData("content_A",$(tableName).jqGrid('getCell',rowId,'content_a'));
	    	setFocusData("content_R",$(tableName).jqGrid('getCell',rowId,'content_r'));
	    	setFocusData("content_T",$(tableName).jqGrid('getCell',rowId,'content_t'));
	    	
//	    	$("#content_D").html($(tableName).jqGrid('getCell',rowKey,'content_d'));
//	    	$("#content_A").html($(tableName).jqGrid('getCell',rowKey,'content_a'));
//	    	$("#content_R").html($(tableName).jqGrid('getCell',rowKey,'content_r'));
//	    	$("#content_T").html($(tableName).jqGrid('getCell',rowKey,'content_t'));
	    	
	    	$("#focusNurse").html($(tableName).jqGrid('getCell',rowId,'keyin_clerk_name'));
	    	$("#focusDoctor").html($(tableName).jqGrid('getCell',rowId,'doctor_name'));
	    	
	    	$("#focusDate").html($(tableName).jqGrid('getCell',rowId,'progress_date'));
	    	$("#focusTime").html($(tableName).jqGrid('getCell',rowId,'progress_time'));
	    	$("#focus").html($(tableName).jqGrid('getCell',rowId,'focus'));

//	    	console.log("onSelectedRow: "+rowId);
		}
		
		focusRowKey = rowId;
//		console.log("focusRowKey: "+focusRowKey);
}  
	
	/**function getSelectedRow() {
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    if (rowKey){        	    	
	    	
	    	setFocusData("content_D",$(tableName).jqGrid('getCell',rowKey,'content_d'));
	    	setFocusData("content_A",$(tableName).jqGrid('getCell',rowKey,'content_a'));
	    	setFocusData("content_R",$(tableName).jqGrid('getCell',rowKey,'content_r'));
	    	setFocusData("content_T",$(tableName).jqGrid('getCell',rowKey,'content_t'));
	    	
//	    	$("#content_D").html($(tableName).jqGrid('getCell',rowKey,'content_d'));
//	    	$("#content_A").html($(tableName).jqGrid('getCell',rowKey,'content_a'));
//	    	$("#content_R").html($(tableName).jqGrid('getCell',rowKey,'content_r'));
//	    	$("#content_T").html($(tableName).jqGrid('getCell',rowKey,'content_t'));
	    	
	    	$("#focusNurse").html($(tableName).jqGrid('getCell',rowKey,'keyin_clerk_name'));
	    	$("#focusDoctor").html($(tableName).jqGrid('getCell',rowKey,'doctor_name'));
	    	
	    	$("#focusDate").html($(tableName).jqGrid('getCell',rowKey,'progress_date'));
	    	$("#focusTime").html($(tableName).jqGrid('getCell',rowKey,'progress_time'));
	    	$("#focus").html($(tableName).jqGrid('getCell',rowKey,'focus'));
	    	selectedRows[rowKey] = true;
	    	console.log(rowKey);
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}  **/
	
//	$(tableName).jqGrid('setSelection', 1, true); //初始化 預設選中第一個
//	 tableGrid.setSelection(rowKey, true);
//	 console.log("SelectedRowKey: "+rowKey);
}

function setFocusData(tag,data){
	document.getElementById(tag).innerText=data
}



/***UD 用藥紀錄***/
// hidden:true
var udRowKey;
var NumOfRow = Math.floor(($(window).height()-255)/36);
 var jqGridUdData = function(tableName,pagerName,arrayData){
	 var tableGrid = $(tableName);
	 	$(tableName).jqGrid({
	    datatype: "local",
	    rowNum:NumOfRow,
	    height: Math.floor($(window).height()-255),
	    width:null,
	    colModel: [
	        { label: '序', name: 'rec_count', width: 40,search:false},
	    	{ label: '帳款日期',name: 'acnt_date', width: 100,formatter: formatDateTime},
	        { label: '1.藥品  2.處置  3.材料', name: 'price_type', width: 150,formatter:formatPriceType},
	        { label: '用藥名稱', name: 'full_name',width: 350},
	        { label: '單次量', name: 'qty', width: 40},
			{ label: '單位', name: 'unit', width: 50},
	        { label: '非常規', name: 'unuse', width: 70},
	        { label: '常規用法', name: 'use', width: 70},
			{ label: '單位', name: 'use_name_e', width: 50},
			{ label: '總量', name: 'tqty', width: 50},
			{ label: '單位', name: 'unit', width: 50},
			{ label: '途徑', name: 'method_name_e', width: 50},
			{ label: '開始日期', name: 'start_date', width: 100,formatter: formatDateTime},
			{ label: '時間', name: 'start_time', width: 100,formatter: formatDateTime},
			{ label: 'DC日期', name: 'end_date', width: 100,formatter: formatDateTime},
			{ label: '時間', name: 'end_time', width: 100,formatter: formatDateTime},
			{ label: '批價代號', name: 'code', width: 100},
			{ label: '自費', name: 'self', width: 100},
			{ label: '庫別', name: 'stock', width: 100},
			{ label: '醫師', name: 'doctor_no', width: 100},
			{ label: '輸入員', name: 'keyin_clerk', width: 100},
			{ label: '就醫科別', name: 'div_name', width: 100},
			{ label: '首日量', name: 'first_tqty', width: 100},
			{ label: '執行人員', name: 'exec_clerk', width: 100},
			{ label: '吃藥次數', name: 'do_status', width: 100,formatter: formatDoStatus},
			
	      
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    onSelectRow:getSelectedRow,
	    shrinkToFit: false,
//	    sortable:true,  //可否拖曳排序
		pager: pagerName,
		gridComplete: function () {
			tableGrid.setSelection(udRowKey, true);
          }
		
		
	});
	$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {data: arrayData});
	$(tableName).trigger('reloadGrid');
	$(tableName).jqGrid("navGrid", pagerName,
			{ add: false, edit: false, del: false, search: true, view: true, refresh: false });
//	$('#currentList').show();
//	$('#chartBaseList').hide();
	function getSelectedRow(rowId,status,e) {
		
		if(status===true){
			//須隨之改變的html
		}
		
		udRowKey = rowId;
      
	}
 }
 
 
 /**formatter 吃藥次數**/
 function formatDoStatus(cellValue, options, rowObject) {
	 
	 var total = cellValue.length;
	 var searchO = cellValue.indexOf("O");
	 var searchX = cellValue.indexOf("X");
//	 console.log(searchX);
	 
	 if(searchX==0){
		 return searchX+"/"+total;
	 }else if(searchX>1){
		 return searchX+"/"+total;
	 }else{
		 if(cellValue.indexOf("X")==-1){
			 return total+"/"+total;
		 }else{
			 return (searchO+1)+"/"+total;
		 }
	 }
//	 OOXX
	/** if(cellValue.indexOf("X")==-1){  //如果都沒X 表示都有吃藥  
		 return total+"/"+total;
	 }else if(cellValue.indexOf("O")==-1){  //如果都沒 O 表示都沒吃藥
		 return "0"+"/"+total;
	 }else{
		if(cellValue.){
			
		} 
	 }  **/
	 
	  
          };
          
/** 1.藥品/2.處置/3.材料**/
function formatPriceType(cellValue, options, rowObject) {
	
	switch(cellValue){
	case 1:
		return "藥品";
		break;
	case 2:
		return "處置";
		break;
	case 3:
		return "材料";
		break;
		default:
		
	}

        		  
     };
          
          
 
 /**STAT**/
var stRowKey;
 var NumOfRow = Math.floor(($(window).height()-255)/36);
 var jqGridSTATData = function(tableName,pagerName,arrayData){
	 var tableGrid = $(tableName);
	 	$(tableName).jqGrid({
	    datatype: "local",
//	    scrollOffset: 0,
	    rowNum:NumOfRow,
	    height: Math.floor($(window).height()-255),
	    width:null,
	    colModel: [
	    	{ label: '序', name: 'rec_count', width: 40,search:false},
	    	{ label: '帳款日期',name: 'acnt_date', width: 100,formatter: formatDateTime},
	        { label: '1.藥品  2.處置  3.材料', name: 'price_type', width: 150,formatter:formatPriceType},
	        { label: '用藥名稱', name: 'full_name',width: 350},
	        { label: '單次量', name: 'qty', width: 70},
	        { label: '用法', name: 'use_name_e', width: 70},
	        { label: '天數', name: 'day', width: 40},
			{ label: '單位', name: 'unit', width: 80},
	        { label: '常規用法', name: 'use', width: 70},
			{ label: '單位', name: 'use_name_e', width: 50},
			{ label: '總量', name: 'tqty', width: 50},
			{ label: '單位', name: 'unit', width: 50},
			{ label: '途徑', name: 'method_name_e', width: 70},
			{ label: '急', name: 'emg', width: 40},
			{ label: '出院帶藥 Y/N', name: 'take_home', width: 100,formatter: "checkbox",edittype: "checkbox", editoptions: {value: "Y:N"},formatoptions:{disabled: true}},
			{ label: '實用量', name: 'do_tqty', width: 70},
			{ label: '就醫科別', name: 'div_name', width: 100},
			{ label: '開始日期', name: 'start_date', width: 100,formatter: formatDateTime},
			{ label: '時間', name: 'start_time', width: 100,formatter: formatDateTime},
			{ label: 'DC日期', name: 'end_date', width: 100,formatter: formatDateTime},
			{ label: '時間', name: 'end_time', width: 100,formatter: formatDateTime},
			{ label: '批價代號', name: 'code', width: 100},
			{ label: '加成', name: 'add_rate', width: 100},
			{ label: '金額', name: 'amt', width: 100},
			{ label: '自費', name: 'self', width: 50},
			{ label: '庫別', name: 'stock', width: 60},
			{ label: '醫師', name: 'doctor_no', width: 70},
			{ label: '手術醫師', name: 'op_doctor_no', width: 70},
			{ label: '開刀部位', name: 'order_pos', width: 80},
			{ label: '批價員', name: 'cashier', width: 70},
			{ label: '補差額', name: 'he_add_fee', width: 100},
			{ label: '折扣', name: 'acnt_discount', width: 100},
			{ label: '折扣註記', name: 'acnt_discount_remark', width: 100},
			{ label: '影像來源', name: 'dicom_flag', width: 100},
			{ label: '事前審查編號', name: 'project_no', width: 100},
			
	      
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    onSelectRow:getSelectedRow,
	    width: null,
	    shrinkToFit: false,
//	    sortable:true,  //可否拖曳排序
		pager: pagerName,
		gridComplete: function () {
			tableGrid.setSelection(stRowKey, true);
          }
		
		
	});
	$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {data: arrayData});
	$(tableName).trigger('reloadGrid');
	$(tableName).jqGrid("navGrid", pagerName,
			{ add: false, edit: false, del: false, search: true, view: true, refresh: false });
//	$('#currentList').show();
//	$('#chartBaseList').hide();
	function getSelectedRow(rowId,status,e) {
		
		if(status===true){
			//須隨之改變的html
		}
		
		stRowKey = rowId;
      
	}
	/**function getSelectedRow() {
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	   if (rowKey){        
	    	PatObj.chart_no = rowKey;
	    	showLoading();
	    	ajax_getChartByChartNo();
	    	$('#collapseMain').collapse('show');
	    	setPageVisible("queryPage",false);
	    	setPageVisible("mainPage",true);
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}  **/
}
 

 
 
   function formatDateTime(cellValue, options, rowObject) {
	   if(cellValue === undefined || cellValue === null||cellValue=="[object Window]"){
		   return "";
		   
	   }else{
  			if(cellValue.length==7){
	   			 var y = cellValue.substring(0,3);
	   			 var m = cellValue.substring(3,5);
	   			 var d = cellValue.substring(5,7);
//	   			 console.log(y+"/"+m+"/"+d);
	   				return y+"/"+m+"/"+d;
	   				
	   			}else if(cellValue.length==6){
	   			 var hh = cellValue.substring(0,2);
	   			 var mm = cellValue.substring(2,4);
	   			 var ss = cellValue.substring(4,6);
//	   			 console.log(hh+":"+mm+":"+ss);
	   				return hh+":"+mm+":"+ss;
	   				
	   			}else{
	   			 var hh = cellValue.substring(0,2);
	   			 var mm = cellValue.substring(2,4);
//	   			 console.log(hh+":"+mm);
	   				return hh+":"+mm;
	   				
	   			}
	   }
	  
            };
						

function jqGrid_outNoteChangeBed(tableName,pagerName,arrayData){	//出院病摘轉床紀錄
	$(tableName).jqGrid({
	    datatype: "local",
	    height: 250,
	    colModel: [
	        { label: '轉床日期', name: 'change_date', width: 40, formatter: formatDateTime,searchoptions: {
                sopt: ["ge","le","eq","cn"] 
			} },
	        { label: '轉床時間', name: 'change_time', formatter: formatDateTime, width: 40 ,searchoptions: {
                // show search options
                sopt: ["ge","le","eq","cn"] 
			} },
	        { label: '科別', name: 'div_name', width: 50},
	        { label: '床位號碼', name: 'to_bed_no', width: 50 ,searchoptions: {
                // show search options
                sopt: ["ge","le","eq","cn"] 
			} },
	        { label: '醫師', name: 'to_doctor', width: 50}
	      
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
//	    onSelectRow:getSelectedRow,
	    width: null,
	    shrinkToFit: true,
//	    sortable:true,  //可否拖曳排序
	    caption: "轉科(床)",
		pager: pagerName
		
		
	});
	$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, searchOperators:true,defaultSearch: "cn" });
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {data: arrayData});
	$(tableName).trigger('reloadGrid');
//	$('#currentList').show();
//	$('#chartBaseList').hide();
	function getSelectedRow() {
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	  /**  if (rowKey){        
	    	PatObj.chart_no = rowKey;
	    	showLoading();
	    	ajax_getChartByChartNo();
	    	$('#collapseMain').collapse('show');
	    	setPageVisible("queryPage",false);
	    	setPageVisible("mainPage",true);
	    }
	    else{
	        alert("沒有資料被選擇");
	    }**/
	}
}

