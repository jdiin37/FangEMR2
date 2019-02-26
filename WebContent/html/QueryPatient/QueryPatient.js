/**
 * 查詢病患頁面 專用 js檔
 */

//查詢病患 method

var callQuery = function(){
	//collapseHide("mainPage");	
	if ($('#currentList').is(":visible")
			|| $('#chartBaseList').is(":visible")) {	//以查詢過則不再查詢

	} else {
		changeQueryTable();
	}
}

var changeQueryTable = function(type) {
	if (type == "chart_base") {
		if (QueryObj.ptName == null && QueryObj.birth == null
				&& QueryObj.tel == null && QueryObj.chartNo == null) {
			alert("請至少輸入一項查詢資料");
		} else {
			showLoading();
			ajax_getChartByChartNoPtNameBirthDateTel();
		}		
	} else {
		if ($('#chk_queryOPD').is(":checked")) {
			if ($('#input_OPDdays').val().length > 0
					&& number_regex.test($('#input_OPDdays').val())) {
				QueryObj.chkopd = true;
				QueryObj.opddays = $('#input_OPDdays').val();
				stateChange(true, '#input_OPDdays');
			} else {
				stateChange(false, '#input_OPDdays', "請輸入數字");
			}
		} else {
			QueryObj.chkopd = false;
		}

		if ($('#chk_queryINP').is(":checked")) {
			QueryObj.chkinp = true;
			ajax_getPatientListDischarge();
		} else {
			QueryObj.chkinp = false;
		}

		if ($('#chk_queryDIS').is(":checked")) {
			if ($('#input_DISdays').val().length > 0
					&& number_regex.test($('#input_DISdays').val())) {
				QueryObj.chkdis = true;
				QueryObj.disdays = $('#input_DISdays').val();
				stateChange(true, '#input_DISdays');
			} else {
				stateChange(false, '#input_DISdays', "請輸入數字");
			}
		} else {
			QueryObj.chkdis = false;
		}
		mergeTable_PatList();
		
	}
}

var mergeTable_PatList = function() {
	showLoading();
	$.when(ajax_getPatientListOpd(), ajax_getPatientListInp(),
			ajax_getPatientListDischarge()).done(
			function(dataOpd, dataInp, dataDis) {
				QueryPatArray =[];
				if (QueryObj.chkopd) {
					if (dataOpd[0].status == "Success") {
						$.each(dataOpd[0].resultSet, function(index, obj) {
							QueryPatArray.push(obj);
						});
					} else {
						ajaxErrMsg = dataOpd[0].errorMessage;
					}
				}
				if (QueryObj.chkinp) {
					if (dataInp[0].status == "Success") {
						$.each(dataInp[0].resultSet, function(index, obj) {
							QueryPatArray.push(obj);
						});
					} else {
						ajaxErrMsg = dataInp[0].errorMessage;
					}
				}
				if (QueryObj.chkdis) {
					if (dataDis[0].status == "Success") {
						$.each(dataDis[0].resultSet, function(index, obj) {
							QueryPatArray.push(obj);
						});
					} else {
						ajaxErrMsg = dataDis[0].errorMessage;
					}
				}
				jqGrid_PatList();								
				hideLoading();
				setPageVisible("queryPage", true);
				popUpPageFixPos("queryPage");
			});
}

function jqGrid_PatList(){	//門診住院出院
	$("#PatList").jqGrid({
	    datatype: "local",
	    height: pageHeight - 320,
	    colModel: [
	        { label: '病歷號', name: 'chart_no', width: 90, key:true,align:'right' },
//	        { label: '就診類別', name: 'visit_type', width: 90,align:'center',formatter: function(cellvalue, options, rowobject){
//	        	     if(cellvalue=="INP"){
//	        	    	 return '<span class="ButtonfontSize">'+ "住院" +'</span>';
//	        	     }else if(cellvalue=="OPD"){
//	        	    	 return '<span class="ButtonfontSize">'+ "門診" +'</span>'; 
//	        	     }else{
//	        	    	 return '<span class="ButtonfontSize" style="color:green">'+ "出院" +'</span>';  
//	        	     }
//	          
//		        } },
		    { label: '就診類別', name: 'visit_type', width: 90,align:'center' },    
	        { label: '姓名', name: 'pt_name', width: 100,align:'left' },
	        { label: '性別', name: 'sex_name', width: 60,align:'center' },
	        { label: '年齡', name: 'age', width: 60,align:'right' },
	        { label: '身分證字號', name: 'id_no', width: 130 },
	        { label: '電話', name: 'tel', width: 120,align:'right' },
	        { label: '門診日期', name: 'view_date', width: 90 },
	        { label: '出生日期', name: 'birth_date', width: 90 },
	        { label: '住院日期', name: 'ckin_date', width: 90 },
	        { label: '出院日期', name: 'discharge_date', width: 90 },
	        { label: '主治醫師', name: 'doctor_name', width: 90,align:'center' },
	        { label: '科別', name: 'div_name', width: 120,align:'center' },
	        { label: '早/午/晚', name: 'apn_name', width: 90,align:'center' },
	        { label: '診間', name: 'clinic', width: 90,align:'right' },
	        { label: '床位', name: 'bed_no', width: 90 },
	        { label: '護理站', name: 'ns', width: 210,formatter:function(cellvalue, options, rowobject){
	        	return '<span class="ButtonfontSize">'+ filterNull(rowobject.ns) +"&emsp;"+filterNull(rowobject.ns_name)+'</span>';  
	        } }
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "門診、住院、出院",
//	    rowNum : "-1",
	    scrollOffset: 0,
	    rowNum: 100,
//	    rowList: [10, 20, 30],
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	PatObj.chart_no = rowId;
	    	showLoading();
	    	ajax_getChartByChartNo();
	    	popUpPageToggle("queryPage");	  
	    	closeOtherPage();
        },        
	    width: null,
	    shrinkToFit: false,
	    sortable: true,
		pager: "#PatList_Pager",
	});
	$("#PatList").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" ,clearSearch: false});
	$('#PatList').jqGrid('clearGridData');
	$("#PatList").jqGrid('setGridParam', {data: QueryPatArray});
	if(QueryPatArray.length==1){
		$("#PatList").setGridParam({rowNum:50});
	}
	$("#PatList").trigger('reloadGrid');
	$('#currentList').show();
	$('#chartBaseList').hide();
	function getSelectedRow() {
	    var grid = $("#PatList");
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    if (rowKey){        	    	
	    	$("#chart_no2").html($('#PatList').jqGrid('getCell',rowKey,'chart_no'));
	    	$("#pt_name2").html($('#PatList').jqGrid('getCell',rowKey,'pt_name'));
	    	$("#sex_name2").html($('#PatList').jqGrid('getCell',rowKey,'sex_name'));
	    	$("#age2").html($('#PatList').jqGrid('getCell',rowKey,'age'));
	    	$("#home_tel").html($('#PatList').jqGrid('getCell',rowKey,'tel'));
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}
}
/**
 * 
 * */
function jqGrid_PatList2(tableName,pagerName,dataArray){		//病歷主檔
//	console.log(dataArray);
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 320,
	    colModel: [
	        { label: '病歷號', name: 'chart_no', width: 90, key:true,align:'right' },
	        { label: '姓名', name: 'pt_name', width: 120 },
	        { label: '性別', name: 'sex_name', width: 60,align:'center' },
	        { label: '年齡', name: 'age', width: 60,align:'right' },
	        { label: '身分證字號', name: 'id_no', width: 130 },
	        { label: '出生日期', name: 'birth_date', width: 90 },
	        { label: '市話', name: 'home_tel', width: 120,align:'right' },
	        { label: '手機', name: 'mobile', width: 280,align:'right' },
	        { label: '地址', name: 'address', width: 570,align:'left',hidden:true }
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
//	    rowNum : "-1",
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	PatObj.chart_no = rowId;
	    	showLoading();
	    	ajax_getChartByChartNo();
	    	popUpPageToggle("queryPage");
	    	closeOtherPage();
        },
	    width: null,
	    scrollOffset: 0,
	    rowNum: Math.floor((pageHeight - 320)/26),
	    shrinkToFit: false,
	    sortable: true,
		pager: "#PatList2_Pager",
		pagerpos:'left'
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {data: dataArray});
	$(tableName).trigger('reloadGrid');
	$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	$('#currentList').hide();
	$('#chartBaseList').show();
	function getSelectedRow() {
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    if (rowKey){        
	    	//$('#queryChartbasebody').html(rowKey + '-' +$('#PatList2').jqGrid('getCell',rowKey,'pt_name'));	    
	    	$("#chart_no2").html($(tableName).jqGrid('getCell',rowKey,'chart_no'));
	    	$("#pt_name2").html($(tableName).jqGrid('getCell',rowKey,'pt_name'));
	    	$("#sex_name2").html($(tableName).jqGrid('getCell',rowKey,'sex_name'));
	    	$("#age2").html($(tableName).jqGrid('getCell',rowKey,'age'));
	    	$("#home_tel").html($(tableName).jqGrid('getCell',rowKey,'home_tel'));
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}
}

function renderQueryPatient(){
	
	
	$(document).on('click', '#btn_query1', function(event) {
		changeQueryTable();
	});

	$(document).on('click', '#btn_query2', function(event) {
		changeQueryTable("chart_base");
	});
	
	//搜尋姓名
	$(document).on('change', '#query_ptName', function(event) {
		if ($(this).val().length == 0 || char_regex.test($(this).val())) {
			stateChange(true, '#query_ptName');
			if ($(this).val().length > 0){
				QueryObj.ptName = $(this).val();
				changeQueryTable("chart_base");
			}else{
				QueryObj.ptName = null;
			}
				
		} else {
			stateChange(false, '#query_ptName', "請輸入字元");
		}
	});
	
	//搜尋出生日期
	$(document).on('change', '#query_birth', function(event) {
		if ($(this).val().length == 0 || ROCdata_regex.test($(this).val())) {
			stateChange(true, '#query_birth');
			if ($(this).val().length > 0){
				QueryObj.birth = $(this).val();
				changeQueryTable("chart_base");
			}else{
				QueryObj.birth = null;
			}
				
		} else {
			stateChange(false, '#query_birth', "請輸入正確的日期格式 範例:'1070101' ");
		}
	});

    //搜尋電話	
	$(document).on('change', '#query_tel', function(event) {
		if ($(this).val().length == 0 || number_regex.test($(this).val())) {
			stateChange(true, '#query_tel');
			if ($(this).val().length > 0){
				QueryObj.tel = $(this).val();
				changeQueryTable("chart_base");
			}else{
				QueryObj.tel = null;
			}
				
		} else {
			stateChange(false, '#query_tel', "請輸入數字");
		}
	});
	
	//搜尋病歷號
	$(document).on('change', '#query_chartNo', function(event) {
		if ($(this).val().length == 0 || number_regex.test($(this).val())) {
			stateChange(true, '#query_chartNo');
			if ($(this).val().length > 0){
				QueryObj.chartNo = $(this).val();
				changeQueryTable("chart_base");
			}else{
				QueryObj.chartNo = null;
			}
				
		} else {
			stateChange(false, '#query_chartNo', "請輸入數字");
		}
	})
	

	
}