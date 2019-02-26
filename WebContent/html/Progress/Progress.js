/**
 * 病程紀錄畫面 專用 js檔
 */
var ProgressObj = { // 病程紀錄物件
	ProgressYear : 5,
	ProgressSDate : "",
	ProgressEDate : "",
	viewType :"",
	serno:0
	
};

var DrProgressKind;

//getDrProgressDataByPrimaryKeys
var EMRProgressPrimaryKeysInputObj = function(empNo,sessionID,chartNo,serno,progressDate,progressTime,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.serno = serno;
	this.progressDate = progressDate;
	this.progressTime = progressTime;
	this.method = method;
};

function renderProgress(){
			
	$(document).on('change', '#ProgressYear', function(event) {
		if ($(this).val().length > 0 && years_regex.test($(this).val())) { // 驗證回傳值
			stateChange(true, '#ProgressYear');
			ProgressObj.ProgressYear = $(this).val();
			//showLoading();
			ProgressListByYear();	//尚未完成 1070125
		} else {
			stateChange(false, '#ProgressYear', "請輸入1-100之間");
		}
	});	
}


/**
 * 病程紀錄 (尚未完成) 尚未接API
 * */
var callProgress = function(flag){
	
	ProgressObj.ProgressYear = PatObj.recentYear;
	ProgressObj.ProgressSDate = ViewListObj.sdate;
	ProgressObj.ProgressEDate = ViewListObj.edate;
	ProgressObj.viewType = ViewListObj.viewType;
	ProgressObj.serno = ViewListObj.serno;
	var extraBtn = "";
	extraBtn += '<div class="pull-right"><button  type="button" id="extraInp" class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
	$('#ProgressListHead').html(" 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲 " + extraBtn);
	
	if(flag == "date"){		
		$('#ProgressMasterDate').show();
		document.getElementById('ProgressMasterDate').setAttribute("title",ProgressObj.ProgressSDate+"-"+ProgressObj.ProgressEDate);
		ProgressListByDate();
		ajax_getProgressCountByYear("DrProgressService");
		ajax_getProgressCountAll("DrProgressService");
		
	}else if(flag =="year"){
		PatObj.recentYear = $("#recentYear").val();
		$('#ProgressMasterDate').hide();
		ProgressListByYear();		
	}else{
		$('#ProgressMasterDate').hide();		
		ProgressListByAll();		
	}
		
//		 setPageVisible("progressPage", true);
//		 popUpPageFixPos("progressPage");
		 	
};


//從 住院紀錄點擊的 病程紀錄 Button 1070308
var callInpRecordDrProgress = function(labDate,startDate,endDate){
		
	DrProgressKind = labDate;	
	/**將值改為 從住院紀錄傳來的 startDate & endDate**/
	ProgressObj.ProgressSDate = startDate;
	ProgressObj.ProgressEDate = endDate;
	ProgressObj.viewType = "INP";
	
	$('#ProgressMasterDate').show();
	document.getElementById('ProgressMasterDate').setAttribute("title",startDate+"-"+endDate);
	ProgressListByDate();
	ajax_getProgressCountByYear("DrProgressService");
	ajax_getProgressCountAll("DrProgressService");

	

	
};

// 過濾從  住院紀錄 點過去的 的病程紀錄日期篩選  1070308
var filterInpRecordProgressList = function(kind){
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"progress_date",op:"eq",data:kind});	
	$("#ProgressList").setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid',[{page:1}]);
};


/**ajax 取得病程紀錄 年範圍 count **/

var ajax_getProgressCountByYear = function(serviceName){
	
	var cmParam = new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ProgressObj.ProgressYear,"getDrProgressCountByChartNoYears");	
	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(data) {
					if (data.status == "Success") {
						var box = "";
						$.each(data.resultSet, function(index, obj) {				
							if(index == "count"){
								
								$('#ProgressMasterYear').html(ProgressObj.ProgressYear + '年病程紀錄&nbsp;<span class="badge">'+ obj + '</span>');
							}
							
						});

					} else {
						var ajaxErrMsg = data.errorMessage;
						$('#ProgressMasterYear').html(ProgressObj.ProgressYear + '年病程紀錄&nbsp;<span class="badge">'+ "0" + '</span>');
						hideLoading();
					}
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
		hideLoading();
	
};

//ajax 病程紀錄 全部範圍 count 
var ajax_getProgressCountAll = function(serviceName){
	
	var cmParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getDrProgressCountByChartNo");

	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(data) {
					
					if (data.status == "Success") {
						
						$.each(data.resultSet, function(index, obj) {				
							if(index == "count"){
								
								$('#ProgressMasterAll').find("span").html(obj);
							}
							
						});

						
					} else {
						var ajaxErrMsg = data.errorMessage;
						hideLoading();
						$('#ProgressMasterAll').find("span").html("0");//查無資料 count 為 0
					
					}
					
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
		hideLoading();
	
};


/**病程紀錄 日期範圍 **/
var ajax_getProgressCountDateRangeListData = function(serviceName){
	
//	showLoading();	
	var cmParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ProgressObj.ProgressSDate,ProgressObj.ProgressEDate,"getDrProgressCountByChartNoDateRange");	

		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(data) {
						if (data.status == "Success") {
							var box = "";
							$.each(data.resultSet, function(index, obj) {
								
								if(index == "count"){									
									$('#ProgressMasterDate').html('病程紀錄&nbsp;<span class="badge">'+ obj + '</span>');
								}
								
							});
							
							ajax_getProgressListData("date","DrProgressService");
						} else {
							$('#ProgressMasterDate').html('病程紀錄&nbsp;<span class="badge">'+ "0" + '</span>');
							ajaxErrMsg = data.errorMessage;
							noDataFound(ajaxErrMsg,"ProgressList");
							clearProgressDetailData();//需替換成病程紀錄的暫留文字清空
							setPageVisible("progressPage", true);
							popUpPageFixPos("progressPage");
							hideLoading();
						}	
												

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
		
	};
	
/**病程紀錄 年範圍 */
	var ajax_getProgressCountYearsListData = function(serviceName){
		
		
		var cmParam = new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ProgressObj.ProgressYear,"getDrProgressCountByChartNoYears");	
			 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
						function(data) {
							if (data.status == "Success") {
								var box = "";
								$.each(data.resultSet, function(index, obj) {				
									if(index == "count"){
										
										$('#ProgressMasterYear').html(ProgressObj.ProgressYear + '年病程紀錄&nbsp;<span class="badge">'+ obj + '</span>');
									}
									
								});
								
								
								var title ="病程紀錄 " + $('#PatInfo').text();			
								$('#progressPage_Title').html(title);	//設定title內容
								ajax_getProgressListData("year","DrProgressService",ProgressObj.ProgressYear);
							
								
							} else {
								var ajaxErrMsg = data.errorMessage;
								$('#ProgressMasterYear').html(ProgressObj.ProgressYear + '年病程紀錄&nbsp;<span class="badge">'+ "0" + '</span>');
								noDataFound(ajaxErrMsg,"ProgressList");
								clearProgressDetailData();
								hideLoading();
								
							
							}
													

						});
			 
			    request.onreadystatechange = null;
				request.abort = null;
				request = null;
				hideLoading();
			
		};	

/**取得全部的 病程紀錄 count & 清單 ajax_getProgressCountAllListData("DrProgressService",2);**/
		var ajax_getProgressCountAllListData = function(serviceName){
			
				
			var cmParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getDrProgressCountByChartNo");

				 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
							function(data) {
								
								if (data.status == "Success") {
									
									$.each(data.resultSet, function(index, obj) {				
										if(index == "count"){
											
											$('#ProgressMasterAll').find("span").html(obj);
										}
										
									});
																
									var title ="病程紀錄" + $('#PatInfo').text();			
									$('#progressPage_Title').html(title);	//設定title內容	
									ajax_getProgressListData("all","DrProgressService");
									
									
								} else {
									var ajaxErrMsg = data.errorMessage;
									noDataFound(ajaxErrMsg,"ProgressList");
									hideLoading();
									$('#ProgressMasterAll').find("span").html("0");//查無資料 count 為 0
									clearProgressDetailData();
								}
								
														

							});
				 
				    request.onreadystatechange = null;
					request.abort = null;
					request = null;
					hideLoading();
			
		};
		
		

//呼叫 病程紀錄   日期範圍清單
var ProgressListByDate = function(){
	$('#ProgressYear').val(ProgressObj.ProgressYear);
	var title = ProgressObj.ProgressSDate + "-" +ProgressObj.ProgressEDate + "&nbsp;" + (ProgressObj.viewType == "OPD" ? '門急紀錄':'住院紀錄') + "-病程紀錄";
	 title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;
	 $('#progressPage_Title').html(title);	//設定title內容
	 ajax_getProgressCountDateRangeListData("DrProgressService");
	 
};

//取得 年範圍的 病程紀錄
var ProgressListByYear = function(){
	showLoading();
	ajax_getProgressCountYearsListData("DrProgressService");
	var title = "病程紀錄" + $('#PatInfo').text();
	$('#progressPage_Title').html(title);	//設定title內容
	
};

//取得 全部範圍的 病程紀錄
var ProgressListByAll = function(){
	showLoading();
	var title = "病程紀錄" + $('#PatInfo').text();
	$('#progressPage_Title').html(title);	//設定title內容
	ajax_getProgressCountAllListData("DrProgressService",2);


};




//取得病程紀錄 清單
/**var getProgressList = function(range){
	
	var ProgressArray = [];
	$.when(ajax_getOutNoteListByChartNo(range)).done(function(data){			
		if (data.status == "Success") {
			$.each(data.resultSet, function(index, obj) {		
				ProgressArray.push(obj);
			});		
		} else {
			ajaxErrMsg = data.errorMessage;
		}	
		jqGrid_ProgressList("#ProgressList","#ProgressList_Pager",ProgressArray);		
//		hideLoading(); 
//		setPageVisible("progressPage", true);
//		popUpPageFixPos("progressPage");
	});
	
};**/

//ajax 取得 病程紀錄 清單資料 (尚未完成  需接API) 
var ajax_getProgressListData = function(flag,serviceName,ProgressYear){
	
	var ProgressArray = [];
	if(flag=="year"){
		var cmParam = new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ProgressYear,"getDrProgressListByChartNoYears");	
	}else if(flag=="date"){		
		var cmParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ProgressObj.ProgressSDate,ProgressObj.ProgressEDate,"getDrProgressListByChartNoDateRange");	
	}else{
		var cmParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getDrProgressListByChartNo");//取得全部 病程紀錄
	}
	
	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(data) {
					if (data.status == "Success") {
						
						if(data.resultSet.length==0&&flag=="year"){
						$('#ProgressMasterYear').html(ProgressYear + '年病程紀錄&nbsp;<span class="badge">'+ "0" + '</span>');
						}else{
							$.each(data.resultSet, function(index, obj) {		
								ProgressArray.push(obj);
								 if(flag=="year"){
								  $('#ProgressMasterYear').html(ProgressYear + '年病程紀錄&nbsp;<span class="badge">'+ data.resultSet.length + '</span>');
								 }											
								});	
						}
						
						
					} else {
						var ajaxErrMsg = data.errorMessage;
						 if(flag=="year"){
					     $('#ProgressMasterYear').html(ProgressYear + '年病程紀錄&nbsp;<span class="badge">'+ "0" + '</span>');
						}
						 noDataFound(ajaxErrMsg,"ProgressList");
					}	

					jqGrid_ProgressList("#ProgressList","#ProgressList_Pager",ProgressArray);
					
					if(DrProgressKind != undefined)
					{
						filterInpRecordProgressList(DrProgressKind);
						DrProgressKind = undefined;
					}
					
					
					hideLoading();
					setPageVisible("progressPage", true);
					popUpPageFixPos("progressPage");		
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
	
};

var ajax_getProgressDetailData = function(serviceName,chartNo,serno,progressDate,progressTime){
	
	var cmParam = new EMRProgressPrimaryKeysInputObj(UserObj.emp_no,UserObj.session_id,chartNo,serno,progressDate,progressTime,"getDrProgressDataByPrimaryKeys");

		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(data) {
						
						if (data.status == "Success") {
							
							$.each(data.resultSet, function(index, obj) {
								
								setProgressData("keyinPDr",filterNull(data.resultSet.keyin_clerk+" "+data.resultSet.keyin_clerk_name));
								setProgressData("progressTime",filterNull(data.resultSet.progress_time));
								setProgressData("progressDate",filterNull(data.resultSet.progress_date));
								setProgressData("contentP_S",filterNull(data.resultSet.content));
								setProgressData("contentP_O",filterNull(data.resultSet.content_o));
								setProgressData("contentP_A",filterNull(data.resultSet.content_a));
								setProgressData("contentP_P",filterNull(data.resultSet.content_p));
								setProgressData("orderPDr",filterNull(data.resultSet.order_dr+" "+data.resultSet.order_dr_name));
								setProgressData("progressMemo",filterNull(data.resultSet.memo));

								

								
								
							});
														
						
						} else {
							var ajaxErrMsg = data.errorMessage;
							clearProgressDetailData();
						}	
											

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
	
};

var clearProgressDetailData = function(){
	
	$('#contentP_S').html(""); //S
	$('#contentP_O').html(""); //O
	$('#contentP_A').html("");//A
	$('#contentP_P').html("");//P
	$('#progressDate').html("");//日期
	$('#progressTime').html("");//時間
	$('#keyinPDr').html("");//輸入員
	$('#orderPDr').html("");//Dr
	$('#progressMemo').html("");//memo

	


	
	
};


//設定 Focus 護理紀錄 DART內文
function setProgressData(tag,data){
	document.getElementById(tag).innerText=data
}


// jqGrid 病程紀錄清單

function jqGrid_ProgressList(tableName,pagerName,dataArray){		
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 220,
	    colModel: [
	    	    { label: '年份', name: 'years', width: 50 },
		        { label: '日期', name: 'progress_date', width: 110 },
		        { label: '時間', name: 'progress_time', width: 110},
		        { label: '住院序號', name: 'serno', width: 50,hidden:true},
		        { label: 'chartNo', name: 'chart_no', width: 50,hidden:true},       
	        
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	
        },
        width: null,
        rowNum: Math.floor((pageHeight - 220)/33),
	    shrinkToFit:false,
	    sortable: false,
		pager: pagerName,
		pagerpos:'left',
		loadComplete : function () {
			$(this).jqGrid('setSelection', 1, true);
		}
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: dataArray});
	$(tableName).trigger('reloadGrid');
	//$("#XrayList").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	
	function getSelectedRow() {
		
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
      if(rowKey){
			
			var chartNo = $(tableName).jqGrid('getCell',rowKey,'chart_no');
	    	var serno = $(tableName).jqGrid('getCell',rowKey,'serno');
	    	var progressDate = $(tableName).jqGrid('getCell',rowKey,'progress_date');	    	
	    	var progressTime = $(tableName).jqGrid('getCell',rowKey,'progress_time');
	    	
	    	ajax_getProgressDetailData("DrProgressService",chartNo,serno,progressDate,progressTime);
	    	

		}else{
			 alert("沒有資料被選擇");
		}
	}
}





