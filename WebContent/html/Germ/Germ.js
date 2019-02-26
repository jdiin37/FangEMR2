/**
 * 檢驗畫面 專用 js檔
 */


var GermKind; //for filter 檢驗類別
var GermObj = {
		GermYear : 5,
		GermSDate : "",
		GermEDate : "",
	    viewType: ""	
};

function renderGerm(){
			
	$(document).on('change', '#GermYear', function(event) {
		if ($(this).val().length > 0 && years_regex.test($(this).val())) { // 驗證回傳值
			stateChange(true, '#GermYear');
			GermObj.GermYear = $(this).val();
			//showLoading();
			GermListByYear();
		} else {
			stateChange(false, '#GermYear', "請輸入1-100之間");
		}
	});
	
}
//GermAntibio //細菌報告表格 
var GermAntibioInputObj = function(empNo,sessionID,reportNo,method,germGroup,rptType){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.reportNo = reportNo;
	this.method = method;
	this.germGroup = germGroup;
	this.rptType = rptType;
};




var callGerm = function(flag,kind){
	clearGermDetailData();
	GermObj.GermYear = PatObj.recentYear;
	GermObj.GermSDate = ViewListObj.sdate;
	GermObj.GermEDate = ViewListObj.edate;
	GermObj.viewType = ViewListObj.viewType;
			
	GermKind = kind;	
	if(flag == "date"){		
		$('#GermMasterDate').show();
		document.getElementById('GermMasterDate').setAttribute("title",GermObj.GermSDate+"-"+GermObj.GermEDate); 
		GermListByDate();
	}else if(flag =="year"){
		PatObj.recentYear = $("#recentYear").val();
		$('#GermMasterDate').hide();
		GermListByYear();		
	}else{
		$('#GermMasterDate').hide();		
		GermListByAll();		
	}
		
	$('#GermYear').val(GermObj.GermYear);
	$('#GermMasterYear').html(GermObj.GermYear + '年細菌&nbsp;<span class="badge">'+ $("#yearsGERM").html() + '</span>');
	$('#GermMasterAll').find("span").html($("#allGERM").html());  //先帶入全部的count值
	
	//collapseHide("mainPage");
}

/**
 * 取得 檢驗年 數量 & 年清單
 * ajax_getLabCountYearsListData("LabRecordService");
 * */
var ajax_getGermCountYearsListData = function(serviceName){
	
	showLoading();	
	var cmParam = new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,GermObj.GermYear,"getGermCountByChartNoYearsGroupByGerm");	
		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(dataLab) {
						if (dataLab.status == "Success") {
							var box = "";
							$.each(dataLab.resultSet, function(index, obj) {				
								if(index == "summary"){
									//alert(obj);
									$('#GermYear').val(GermObj.GermYear);
									$('#GermMasterYear').html(GermObj.GermYear + '年細菌&nbsp;<span class="badge">'+ obj + '</span>');
								}else{
									$.each(obj, function(index, obj_d){
										box += '&nbsp;<button class="btn btn-primary" onclick="filterGermList(\'' + obj_d.germ_group + '\');">' + obj_d.germ_group_name +' <span class="badge">' + obj_d.count +'</span></button>';
									});
								}
								//alert(index + ":" + obj);
							});
							$('#GermDetail').html(box);
							box = null;
							
							var title ="細菌 " + $('#PatInfo').text();			
							$('#germPage_Title').html(title);	//設定title內容
							
							ajax_getGermList("GermResultService","Year");
						} else {
							ajaxErrMsg = dataLab.errorMessage;
							noDataFound(ajaxErrMsg,"GermList");
						}
												

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null; 
		
	};





/**Button onClick 監聽器 __年檢驗 **/
var GermListByYear = function(){
	
	ajax_getGermCountYearsListData("GermResultService");
	
}

/**取得 影像 日期範圍 數量 & 日期範圍 清單
 * serviceName=XrayReportService
 * ajax_getLabCountDateRangeListData("LabRecordService");
 * */
var ajax_getGermCountDateRangeListData = function(serviceName){
	
showLoading();	
var cmParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,GermObj.GermSDate,GermObj.GermEDate,"getGermCountByChartNoDateRangeGroupByGerm");	

	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(dataLab) {
					if (dataLab.status == "Success") {
						var box = "";
						$.each(dataLab.resultSet, function(index, obj) {
							
							if(index == "summary"){
								//alert(obj);
								$('#GermMasterDate').html('細菌&nbsp;<span class="badge">'+ obj + '</span>')
							}else{
								$.each(obj, function(index, obj_d){
									box += '&nbsp;<button class="btn btn-primary" onclick="filterGermList(\'' + obj_d.germ_group + '\');">' + obj_d.germ_group_name +' <span class="badge">' + obj_d.count +'</span></button>';
								});
							}
							//alert(index + ":" + obj);
						});
						$('#GermDetail').html(box);
						box = null;
						
						
						
						var title = GermObj.GermSDate + "-" +GermObj.GermEDate + "&nbsp;" + (GermObj.viewType == "OPD" ? '門急紀錄':'住院紀錄') + "-細菌";
						title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;		
						$('#germPage_Title').html(title);	//設定title內容
						

						ajax_getGermList("GermResultService","Date");
					} else {
						ajaxErrMsg = dataLab.errorMessage;
						noDataFound(ajaxErrMsg,"GermList");
					}	
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
};



/**Button onClick 監聽器 日期範圍檢驗 **/
var GermListByDate = function(){
	
	ajax_getGermCountDateRangeListData("GermResultService");
}

/**
 * ajax 取得檢驗全部數量 
 * */
var ajax_getGermCountAllListData = function(serviceName){
	
	showLoading();	
	var cmParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getGermCountByChartNoGroupByGerm");

		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(dataLab) {
						
						if (dataLab.status == "Success") {
							var box = "";
							$.each(dataLab.resultSet, function(index, obj) {				
								if(index == "summary"){
									//alert(obj);
									$('#GermMasterAll').find("span").html(obj);
								}else{
									$.each(obj, function(index, obj_d){
										box += '&nbsp;<button class="btn btn-primary" onclick="filterGermList(\'' + obj_d.germ_group + '\');">' + obj_d.germ_group_name +' <span class="badge">' + obj_d.count +'</span></button>';
									});
								}
								//alert(index + ":" + obj);
							});
							$('#GermDetail').html(box);											
							box = null;
							
							var title ="細菌 " + $('#PatInfo').text();			
							$('#germPage_Title').html(title);	//設定title內容	
							
//							
							ajax_getGermList("GermResultService","All");
						} else {
							ajaxErrMsg = dataLab.errorMessage;
							noDataFound(ajaxErrMsg,"GermList");
						}
						
												

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
	
};

/**Button onClick 監聽器 全部檢驗 **/
var GermListByAll = function(){
	ajax_getGermCountAllListData("GermResultService");
	

}




/**
 * 取得 細菌清單 range = Year,All,Date
 * serviceName = 
 * ajax_getGermList("","Year");
 * */
var ajax_getGermList = function(serviceName,range){
	if(range=="Year"){
		var cmParam = new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,GermObj.GermYear,"getGermListByChartNoYears");	
	}else if(range=="All"){
		var cmParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getGermListByChartNo");
	}else{
		//Date
		var cmParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,GermObj.GermSDate,GermObj.GermEDate,"getGermListByChartNoDateRange");			
	}
	
	var GermArray = [];
	$.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(function(dataXrayList){			
		if (dataXrayList.status == "Success") {
			$.each(dataXrayList.resultSet, function(index, obj) {		
				GermArray.push(obj);
			});		
		} else {
			ajaxErrMsg = dataXrayList.errorMessage;
			noDataFound(ajaxErrMsg,"GermList");
	    	$('#GermListHead').html(" 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	    	//清空暫存 右側畫面資料

		}	
		jqGrid_GermList("#GermList","#GermList_Pager",GermArray);		
		if(GermKind != undefined)
		{
			filterGermList(GermKind);
			GermKind = undefined;
		}
		hideLoading();
		setPageVisible("germPage", true);
		popUpPageFixPos("germPage");
	});
	
	
};




/**取得 細菌表格 數據資料   
 * 
 *  **/
var ajax_getGermAntibioList = function(serviceName,reportNo,germGroup,rptType){
	

	var cmParam = new GermAntibioInputObj(UserObj.emp_no,UserObj.session_id,reportNo,"getenterqryGermAntibio",germGroup,rptType);	
	var GermAntibioArray = [];
	$.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(function(dataXrayList){			
		if (dataXrayList.status == "Success") {
			$.each(dataXrayList.resultSet, function(index, obj) {		
				GermAntibioArray.push(obj);
			});		
		} else {
			ajaxErrMsg = dataXrayList.errorMessage;
			noDataFound(ajaxErrMsg,"GermAntibioList");
//	    	$('#labListHead').html(" 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	    	//清空暫存 右側畫面資料

		}	
		jqGrid_GermAntibioList("#GermAntibioList","#GermAntibioList_Pager",GermAntibioArray);		
		
	});
	
	
};


/**
 * 過濾細菌 germ_group 值
 * **/
var filterGermList = function(kind){
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"germ_group",op:"eq",data:kind});	
	$("#GermList").setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid',[{page:1}]);
}

/**細菌報告 清單**/
function jqGrid_GermList(tableName,pagerName,arrayData){		//檢驗清單
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 220,
	    colModel: [
	        { label: '單號', name: 'lab_reportno', width: 90,hidden:true },
	        { label: '病歷號', name: 'chart_no', width: 90,hidden:true },
	        { label: '年份', name: 'years', width: 45 },	        
	        { label: '簽收時間', name: 'lab_date', width: 80,hidden:false},
	        { label: '培養時間', name: 'res_date', width: 180,hidden:true },
	        { label: '報告日期', name: 'report_date', width: 80,hidden:true },
	        { label: 'conf_date', name: 'conf_date', width: 120,hidden:true },
	        { label: '細菌種類', name: 'germ_group_name', width: 140,hidden:true},
	        { label: '細菌種類', name: 'germ_group_name', width: 140,formatter: function(cellvalue, options, rowobject){
	            return '<button type="button" class="btn btn-primary btn-sm">'+ cellvalue +'</button>';
	        }},
	        { label: '細菌群組', name: 'germ_group', width: 90,hidden:true },	        
	        { label: '報告類別代號', name: 'rpt_type', width: 90,hidden:true },
	        { label: '報告類別', name: 'rpt_type_name', width: 90,hidden:true },
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
//	    scroll :true, //鼠標滾動翻頁,
//	    rownumbers: true, //count 序號
//	    rownumWidth:50,
//	    multiselect: true, //多選 checkBox
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	
        },
	    width: null,
	    rowNum: Math.floor((pageHeight - 220)/33),
	    shrinkToFit: false,
	    sortable: false,
		pager: pagerName,
		pagerpos:'left',
		loadComplete : function () {
			$(this).jqGrid('setSelection', 1, true);
		}
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: arrayData});
	$(tableName).trigger('reloadGrid');
	//$("#LabList").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	function getSelectedRow() {
	  
	var grid = $(tableName);
	var rowKey = grid.jqGrid('getGridParam',"selrow");		
		if(rowKey){
	    	$('#GermListHead').html($(tableName).jqGrid('getCell',rowKey,'lab_date') + " " + $(tableName).jqGrid('getCell',rowKey,'germ_group_name') + " 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");    
			var reportNo = $(tableName).jqGrid('getCell',rowKey,'lab_reportno');
			var germGroup = $(tableName).jqGrid('getCell',rowKey,'germ_group');
			var rptType = $(tableName).jqGrid('getCell',rowKey,'rpt_type');
			var rptTypeName = $(tableName).jqGrid('getCell',rowKey,'rpt_type_name');
			var germName = $(tableName).jqGrid('getCell',rowKey,'germ_group_name');
				
			ajax_getGermDetailData("LabReportService",reportNo,germGroup,rptType,rptTypeName,germName);
			
			
			setTimeout(function(){ 
				ajax_getGermAntibioList("LabReportService",reportNo,germGroup,rptType); 
			}, 200);
			
			
	    	
	    	
		}else{
			 alert("沒有資料被選擇");
		}
		
		
	}
}

var getLabValueColor = function(labValue,startValue,endValue) {
	
	if(startValue==null&&endValue==null){
		return false;
	}else if($.isNumeric(labValue)&&$.isNumeric(startValue)&&$.isNumeric(endValue)){
		if(labValue>endValue){  //檢驗數據超標 顏色為紅色 
			return "<span class='text-danger'>"+labValue + "</span>" 
		}else if(labValue<startValue){ //檢驗數據過低 顏色為紅色 
			return "<span class='text-danger'>"+labValue + "</span>" 
		}else{ //正常值 綠色
			return "<span class='text-success'>"+labValue + "</span>" 
		}
	}

	return (value === undefined || value === null||value=="[object Window]"?"":value); 
}



/***細菌報告 表格數據**/
function jqGrid_GermAntibioList(tableName,pagerName,arrayData){		
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 670,
//	    height: 250,
	    colModel: [
	    	{ label: '細菌名稱', name: 'germ_name', width: 260 },
	    	{ label: '菌1', name: 'anti_result1', width:200 },
	    	{ label: '菌2', name: 'anti_result2', width: 150 },
	        { label: '菌3', name: 'anti_result3', width: 120 },
	        { label: 'anti_flag1', name: 'anti_flag1', width: 90,hidden:true },
	        { label: 'anti_flag2', name: 'anti_flag2', width: 120,hidden:true },
	        { label: 'anti_flag3', name: 'anti_flag3', width: 90,hidden:true },
	       
	             
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
	    onSelectRow:getSelectedRow,
//	    multiselect: true, //多選 checkBox
	    ondblClickRow: function(rowId) {
	    	
        },
	    width: null,
	    rowNum: Math.floor((pageHeight - 220)/24),
	    shrinkToFit: false,
	    sortable: true,
		pager: pagerName,
		pagerpos:'left',
		loadComplete : function () {
//			$(this).jqGrid('setSelection', 1, true);
		}
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: arrayData});
	$(tableName).trigger('reloadGrid');
	//$("#LabList").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	function getSelectedRow() {
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    if (rowKey){
//	    	$('#labListHead').html($(tableName).jqGrid('getCell',rowKey,'lab_date') + " " + $(tableName).jqGrid('getCell',rowKey,'report_subtitle') + " 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
//	    	$('#labListBody').html(rowKey);
	    
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}
	
}

/**取得細菌上半部資料*
 * 1070302
 * **/
var ajax_getGermDetailData = function(serviceName,reportNo,germGroup,rptType,rptTypeName,germName){
	var cmParam = new GermAntibioInputObj(UserObj.emp_no,UserObj.session_id,reportNo,"getenterqryGermresult",germGroup,rptType);
	
	$.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(function(data){			
		if (data.status == "Success") {
			
			setGermData("germLabNo",filterNull(data.resultSet[0].lab_reportno));
			setGermData("germPtName",filterNull(data.resultSet[0].pt_name));
			setGermData("germRptName",filterNull(rptTypeName));
			setGermData("sampleDoc",filterNull(data.resultSet[0].sample_doc));
			setGermData("epiCell",filterNull(data.resultSet[0].epi_cell));
//			setGermData("germTitle",filterNull(data.resultSet[0].report_text));
			setGermData("germTitle",filterNull(germName));
			setGermData("germDocName",filterNull(data.resultSet[0].dr_id));
			setGermData("pmn",filterNull(data.resultSet[0].pmn));
			setGermData("germReqDate",filterNull(data.resultSet[0].req_date));
			setGermData("germLabDate",filterNull(data.resultSet[0].lab_date));
			setGermData("germResDate",filterNull(data.resultSet[0].res_date));

			setGermData("resisMark1",filterNull(data.resultSet[0].resistance_markers1));
			setGermData("resisMark2",filterNull(data.resultSet[0].resistance_markers2));
			setGermData("resisMark3",filterNull(data.resultSet[0].resistance_markers3));
			setGermData("resisGerm1",filterNull(data.resultSet[0].resistance_germ1));
			setGermData("resisGerm2",filterNull(data.resultSet[0].resistance_germ2));
			setGermData("resisGerm3",filterNull(data.resultSet[0].resistance_germ3));				
			setGermData("germName1",formatDateTime(data.resultSet[0].germ_name1));
			setGermData("germName2",formatDateTime(data.resultSet[0].germ_name2));
			setGermData("germName3",filterNull(data.resultSet[0].germ_name3));
			setGermData("germQty1",formatDateTime(data.resultSet[0].germ_qty1));
			setGermData("germQty2",formatDateTime(data.resultSet[0].germ_qty2));
			setGermData("germQty3",formatDateTime(data.resultSet[0].germ_qty3));				
			setGermData("germDoc1",filterNull(data.resultSet[0].germ_doc1));
			setGermData("germDoc2",filterNull(data.resultSet[0].germ_doc2));
			setGermData("germDoc3",filterNull(data.resultSet[0].germ_doc3));

				
				
//			});		
		} else {
			var ajaxErrMsg = data.errorMessage;
			clearGermDetailData();
//			console.log("getOpDetailErrMsg="+ajaxErrMsg);//如查無資料須清除所有文字
			
			
		}	
		
		
		hideLoading();
		
	});
	
	
};



//設定  細菌 內文
function setGermData(tag,data){
	document.getElementById(tag).innerText=data
}


var clearGermDetailData = function(){
	$('#resisMark1').html(""); 
	$('#resisMark2').html("");
	$('#resisMark3').html("");
	$('#resisGerm1').html("");
	$('#resisGerm2').html("");	
	$('#resisGerm3').html("");
	$('#germName1').html(""); 
	$('#germName2').html("");
	$('#germName3').html("");
	$('#germQty1').html("");	
	$('#germQty2').html(""); 
	$('#germQty3').html(""); 
	$('#germDoc1').html("");
	$('#germDoc2').html("");
	$('#germDoc3').html("");	
	
	$('#germLabNo').html(""); 
	$('#germPtName').html(""); 
	$('#germRptName').html("");
	$('#sampleDoc').html("");	
	$('#epiCell').html(""); 
	$('#germTitle').html(""); 
	$('#germDocName').html("");
	$('#pmn').html("");
	$('#germReqDate').html("");	
	$('#germLabDate').html(""); 
	$('#germResDate').html(""); 


				
	

};

