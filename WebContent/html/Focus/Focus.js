/**
 * 護理紀錄畫面 專用 js檔
 */

var FocusObj = { // 出院病摘物件
		FocusYear : 5,
		FocusSDate : "",
		FocusEDate : "",
	    viewType :"",
	    serno:0
	
};

var NurseProgressKind;


function renderFocus(){
			
	$(document).on('change', '#FocusYear', function(event) {
		if ($(this).val().length > 0 && years_regex.test($(this).val())) { // 驗證回傳值
			stateChange(true, '#FocusYear');
			FocusObj.FocusYear = $(this).val();
			//showLoading();
			FocusListByYear();	//尚未完成 1070125
		} else {
			stateChange(false, '#FocusYear', "請輸入1-100之間");
		}
	});
	
	
}
//getNurseProgressDataByPrimaryKeys
var EMRFocusPrimaryKeysInputObj = function(empNo,sessionID,chartNo,serno,progressDate,progressTime,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.serno = serno;
	this.progressDate = progressDate;
	this.progressTime = progressTime;
	this.method = method;
};


//call focus護理紀錄  1070119 add by IvyLin  (尚未完成)
var callFocus = function(flag,kind){
	NurseProgressKind = kind;
	clearFocusDetailData();
	
	FocusObj.FocusYear = PatObj.recentYear;
	FocusObj.FocusSDate = ViewListObj.sdate;
	FocusObj.FocusEDate = ViewListObj.edate;
	FocusObj.viewType = ViewListObj.viewType;
	FocusObj.serno = ViewListObj.serno;
	
	ajax_getFocusCountByYear("NurseProgressService");//先抓 年範圍 count
	ajax_getFocusCountByAll("NurseProgressService");//先抓 全部範圍 count
	
	var extraBtn="";
	extraBtn += '<div class="pull-right"><button  type="button" id="extraInp" class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
	$("#FocusListHead").html("病患: "+PatObj.pt_name+"  "+PatObj.chart_no +"  "+PatObj.sex_name+"  "+ PatObj.age+" 歲 " +extraBtn);
	
//	$("#FocusListHead").html("病患: "+PatObj.pt_name+"  "+PatObj.chart_no +"  "+PatObj.sex_name+"  "+ PatObj.age+" 歲 ");

	
if(flag == "date"){		
	$('#FocusMasterDate').show();
	document.getElementById('FocusMasterDate').setAttribute("title",FocusObj.FocusSDate+"-"+FocusObj.FocusEDate);
	FocusListByDate();
	$('#FocusYear').val($("#recentYear").val());
}else if(flag =="year"){	
	FocusListByYear();	
	$('#FocusMasterDate').hide();
}else{			
	FocusListByAll();		
	$('#FocusMasterDate').hide();
}
	
};


//從 住院紀錄點擊的 護理紀錄 Button 
var callInpRecordNurseProgress = function(labDate,startDate,endDate){
	showLoading();	
	NurseProgressKind = labDate;	
	/**將值改為 從住院紀錄傳來的 startDate & endDate**/
	FocusObj.FocusSDate = startDate;
	FocusObj.FocusEDate = endDate;
	FocusObj.viewType = "INP";
	
	$('#FocusMasterDate').show();
	document.getElementById('FocusMasterDate').setAttribute("title",startDate+"-"+endDate);
	ajax_getFocusCountByDateRange("NurseProgressService"); //先抓 日期範圍 count
	ajax_getFocusCountByYear("NurseProgressService");//先抓 年範圍 count
	ajax_getFocusCountByAll("NurseProgressService");//先抓 全部範圍 count
	
	var title = FocusObj.FocusSDate + "-" +FocusObj.FocusEDate + "&nbsp;" + (FocusObj.viewType == "OPD" ? '門急紀錄':'住院紀錄') + "-護理紀錄";
	title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;		
	$('#focusPage_Title').html(title);	//設定title內容
	
	var extraBtn="";
	extraBtn += '<div class="pull-right"><button  type="button" id="extraInp" class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
	$("#FocusListHead").html("病患: "+PatObj.pt_name+"  "+PatObj.chart_no +"  "+PatObj.sex_name+"  "+ PatObj.age+" 歲 " +extraBtn);
	
	ajax_getFocusList("NurseProgressService","Date","filterDate"); //再抓 日期範圍  List 

	
};

/**護理紀錄 修改 1070309 call Count Only DateRange**/
var ajax_getFocusCountByDateRange = function(serviceName){
	
	var cmParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,FocusObj.FocusSDate,FocusObj.FocusEDate,"getNurseProgressCountByChartNoDateRange");	

		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(data) {
						if (data.status == "Success") {
							var box = "";
							$.each(data.resultSet, function(index, obj) {
								
								if(index == "count"){									
									$('#FocusMasterDate').html('護理紀錄&nbsp;<span class="badge">'+ obj + '</span>');
								}
								
							});
						
						} else {
							$('#FocusMasterDate').html('護理紀錄&nbsp;<span class="badge">'+ "0" + '</span>');
							ajaxErrMsg = data.errorMessage;
							hideLoading();
						}	
												

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
};

/**護理紀錄 修改 1070309 call Count Only Year**/
var ajax_getFocusCountByYear = function(serviceName){
	
	var cmParam = new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,FocusObj.FocusYear,"getNurseProgressCountByChartNoYears");	
		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(data) {
						if (data.status == "Success") {
							var box = "";
							$.each(data.resultSet, function(index, obj) {				
								if(index == "count"){
									
									$('#FocusMasterYear').html(FocusObj.FocusYear + '年護理紀錄&nbsp;<span class="badge">'+ obj + '</span>');
								}
								
							});
							
						} else {
							var ajaxErrMsg = data.errorMessage;
							$('#FocusMasterYear').html(FocusObj.FocusYear + '年護理紀錄&nbsp;<span class="badge">'+ "0" + '</span>');
							hideLoading();
						}
												

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
	
};

var ajax_getFocusCountByAll = function(serviceName){
	
	var cmParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getNurseProgressCountByChartNo");

	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(data) {
					
					if (data.status == "Success") {
						
						$.each(data.resultSet, function(index, obj) {				
							if(index == "count"){
								
								$('#FocusMasterAll').find("span").html(obj);
							}
							
						});

					} else {
						var ajaxErrMsg = data.errorMessage;
						$('#FocusMasterAll').find("span").html("0");//查無資料 count 為 0
						hideLoading();
					
					}
					
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
};




//呼叫 Focus 單次住院紀錄  日期範圍清單
var FocusListByDate = function(){
	showLoading();
	ajax_getFocusCountByDateRange("NurseProgressService"); // 日期範圍 count 
	ajax_getFocusList("NurseProgressService","Date"); // 日期範圍  List

	
	var title = FocusObj.FocusSDate + "-" +FocusObj.FocusEDate + "&nbsp;" + (FocusObj.viewType == "OPD" ? '門急紀錄':'住院紀錄') + "-護理紀錄";
	title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;		
	$('#focusPage_Title').html(title);	//設定title內容
};

	
/**重新給 護理紀錄清單 日期篩選結果 Array 1070309 add by IvyLin**/	
var setFocusDateArray = function(originalArray,filterVal){
	    
	    var newArr = $.grep(originalArray,function(o,index){
	        return (o.progress_date==filterVal);
	     });
	    
	    return newArr;
};


	

var ajax_getFocusList = function(serviceName,range,flag){
	if(range=="Year"){
		var cmParam = new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,FocusObj.FocusYear,"getNurseProgressListByChartNoYears");	
	}else if(range=="All"){
		var cmParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getNurseProgressListByChartNo");
	}else{
		//Date
		var cmParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,FocusObj.FocusSDate,FocusObj.FocusEDate,"getNurseProgressListByChartNoDateRange");			
	}
	
	var FocusArray = [];
	$.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(function(dataList){			
		if (dataList.status == "Success") {
			$.each(dataList.resultSet, function(index, obj) {		
				FocusArray.push(obj);
			});
			
			jqGrid_focusList("#FocusList","#FocusList_Pager",FocusArray);
		
//			console.log("FocusArrayLength=>"+FocusArray.length);
			
			if(flag=="filterDate"){
				if(NurseProgressKind != undefined)
				{
				jqGrid_focusList("#FocusList","#FocusList_Pager",setFocusDateArray(FocusArray,NurseProgressKind));
				console.log("FocusArrayLength=>"+setFocusDateArray(FocusArray,NurseProgressKind).length);
				}
			}
			
			
		} else {
			var ajaxErrMsg = dataList.errorMessage;
			noDataFound(ajaxErrMsg,"FocusList");
			hideLoading();
			clearFocusDetailData();
	    	$('#FocusListHead').html(" 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	    	//清空暫存 右側畫面資料

		}

			
		hideLoading();
		setPageVisible("focusPage", true);
		popUpPageFixPos("focusPage");
	});
	
	
};	

//取得 年範圍的 護理紀錄
var FocusListByYear = function(){
	var title ="護理紀錄 " + $('#PatInfo').text();			
	$('#focusPage_Title').html(title);	//設定title內容
	showLoading();
	ajax_getFocusCountByYear("NurseProgressService");//先抓 count 
	ajax_getFocusList("NurseProgressService","Year");// 再 抓 List 年範圍 
	
	
};


var FocusListByAll = function(){
	//取得 全部範圍的 護理紀錄
	var title ="護理紀錄 " + $('#PatInfo').text();			
	$('#focusPage_Title').html(title);	//設定title內容
	showLoading();
	ajax_getFocusCountByAll("NurseProgressService");//先抓 count
	ajax_getFocusList("NurseProgressService","All");// 再 抓 List

};


/**Focus **/
//var selectedRows = {};
var focusRowKey;
var NumOfRow = Math.floor(($(window).height()-255)/36);
function jqGrid_focusList(tableName,pagerName,arrayData){
	var tableGrid = $(tableName);
	$(tableName).jqGrid({
	    datatype: "local",
//	    rowNum:NumOfRow,
	    height: Math.floor($(window).height()-255),
	    colModel: [
	        { label: '年份', name: 'years', width: 50 },
	        { label: '日期', name: 'progress_date', width: 120 },
	        { label: '時間', name: 'progress_time', width: 120},
	        { label: '住院序號', name: 'serno', width: 50,hidden:true},
	        { label: 'chartNo', name: 'chart_no', width: 50,hidden:true},
//	        { label: 'A', name: 'content_a', width: 50,hidden:true},
//	        { label: 'R', name: 'content_r', width: 50,hidden:true},
//	        { label: 'T', name: 'content_t', width: 50,hidden:true},
//	        { label: '醫師', name: 'doctor_name', width: 50,hidden:true},
//	        { label: '護士', name: 'keyin_clerk_name', width: 50,hidden:true},
	      
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    onSelectRow:getSelectedRow,
	    pagerpos:'left',
//	    width: null,
//	    shrinkToFit: true,
//	    sortable:true,  //可否拖曳排序
//	    caption: "Focus護理紀錄",
		pager: pagerName,
		gridComplete: function () {
//			tableGrid.setSelection(focusRowKey, true);
			$(this).jqGrid('setSelection', 1, true);
        }
                
	});
//	$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false});
//	searchOperators:true,defaultSearch: "cn"
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {data: arrayData});
	$(tableName).trigger('reloadGrid');
//	$('#currentList').show();
//	$('#chartBaseList').hide();
	
	function getSelectedRow() {
		
		 var grid = $(tableName);
		 var rowKey = grid.jqGrid('getGridParam',"selrow");
		
		if(rowKey){
			
			var chartNo = $(tableName).jqGrid('getCell',rowKey,'chart_no');
	    	var serno = $(tableName).jqGrid('getCell',rowKey,'serno');
	    	var progressDate = $(tableName).jqGrid('getCell',rowKey,'progress_date');	    	
	    	var progressTime = $(tableName).jqGrid('getCell',rowKey,'progress_time');
	    	
	    	ajax_getFocusDetailData("NurseProgressService",chartNo,serno,progressDate,progressTime);
	    	

		}else{
			 alert("沒有資料被選擇");
		}
		
	}  	
}

//設定 Focus 護理紀錄 DART內文
function setFocusData(tag,data){
	document.getElementById(tag).innerText=data
}


//取得護理紀錄 畫面右側資料 
var clearFocusDetailData = function(){
	
	$('#focusNurse').html(""); //護士
	$('#focusDate').html(""); //日期
	$('#focusTime').html("");//時間
	$('#content_D').html("");//內容
	$('#focusDoctor').html("");//keyin 人員
	
};

var ajax_getFocusDetailData = function(serviceName,chartNo,serno,progressDate,progressTime){
	
	var cmParam = new EMRFocusPrimaryKeysInputObj(UserObj.emp_no,UserObj.session_id,chartNo,serno,progressDate,progressTime,"getNurseProgressDataByPrimaryKeys");

		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(data) {
						
						if (data.status == "Success") {
							
							$.each(data.resultSet, function(index, obj) {
								
								setFocusData("focusNurse",filterNull(data.resultSet[0].nurse_no+" "+data.resultSet[0].nurse_name));
								setFocusData("focusDate",filterNull(data.resultSet[0].progress_date));
								setFocusData("focusTime",filterNull(data.resultSet[0].progress_time));
								setFocusData("content_D",filterNull(data.resultSet[0].content));
								setFocusData("focusDoctor",filterNull(data.resultSet[0].keyin_clerk+" "+data.resultSet[0].keyin_clerk_name));

								
								
							});
														
						
						} else {
							var ajaxErrMsg = data.errorMessage;
							clearFocusDetailData();
						}	
											

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
	
};






