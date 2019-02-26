/**
 * 影像畫面 專用 js檔
 */ 


var XrayKind; //for filter 影像類別
var OpdXrayDate; //for filter 門急診 點過來的影像日期

var XrayObj = { // 影像物件
		XrayYear : 5,
		XraySDate : "",
		XrayEDate : "",
		viewType: "",
		serno:0,
		XrayVisitType:""
	};


var EMRXrayReportPrimaryKeysInputObj = function(empNo,sessionID,xrayType,inpOpd,viewDate,chartNo,serno,seqNo,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.xrayType = xrayType;
	this.inpOpd = inpOpd;
	this.viewDate = viewDate;
	this.chartNo = chartNo;
	this.serno = serno;
	this.seqNo = seqNo;	
	this.method = method;
};

function renderXray(){
	
	$(document).on('change', '#XrayYear', function(event) {
		if ($(this).val().length > 0 && years_regex.test($(this).val())) { // 驗證回傳值
			stateChange(true, '#XrayYear');
			XrayObj.XrayYear = $(this).val();
			//showLoading();
			XrayListByYear();
		} else {
			stateChange(false, '#XrayYear', "請輸入1-100之間");
		}
	});
	
	
	
}

var testShowXray = function(){

				
	$(document).on('mouseover', '.showXrayPos img', function(event) {
		var i = $(this).index();
		var showImage = document.getElementById("show-image");
		showImage.setAttribute("src",$(this).attr('src'));		
		var i = $(this).index();
		$(".showXrayPos>img:eq("+i+")").addClass("active-Xray").siblings().removeClass("active-Xray");
		var xrayPosDetail = document.getElementById("xrayPosDetail");
		xrayPosDetail.innerHTML = "第"+(i+1)+"張圖:\n src="+$(this).attr('src')

	});
	
	
	
	$(document).on('click', '.showXrayPos img', function(event) {
		var showImage = document.getElementById("show-image");
//		showImage.setAttribute("src",$(this).attr('src'));		
		
		alert("你點了第"+(i+1)+"張圖:\n src="+$(this).attr('src'));
		
		return false;
	});
	
	
	
};

/**關閉 趨勢圖 彈跳視窗 **/
function close_XrayModal(){
	$('#XrayModal').css('display',"none");
}


//從 住院紀錄點擊的 影像Button 1070308 
var callInpRecordXray = function(labDate,kind,startDate,endDate){
	
	XrayKind = kind;	
	/**將值改為 從住院紀錄傳來的 startDate & endDate**/
	XrayObj.XraySDate = startDate;
	XrayObj.XrayEDate = endDate;
	XrayObj.viewType = "INP";
	XrayObj.XrayVisitType = "ALL";
	
	$('#XrayYear').val(XrayObj.XrayYear);
	$('#XrayMasterYear').html(XrayObj.XrayYear + '年影像&nbsp;<span class="badge">'+ $("#yearsXRAY").html() + '</span>');
	$('#XrayMasterAll').find("span").html($("#allXRAY").html());  //先帶入全部的count值
	
	$('#XrayMasterDate').show();
	document.getElementById('XrayMasterDate').setAttribute("title",XrayObj.XraySDate+"-"+XrayObj.XrayEDate);   
	ajax_getXrayCountDateRangeListData("XrayReportService",1); //先抓count 數量
	
  //再抓 List 清單
  var cmParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,startDate,endDate,XrayObj.XrayVisitType,"getXrayListByChartNoDateRangeVisitType");			
  var XrayArray = [];
	$.when(ajax_setPostData("XrayReportService",JSON.stringify(cmParam))).done(function(dataXrayList){			
		if (dataXrayList.status == "Success") {
			$.each(dataXrayList.resultSet, function(index, obj) {		
				XrayArray.push(obj);
			});		
		} else {
			ajaxErrMsg = dataXrayList.errorMessage;
			noDataFound(ajaxErrMsg,"XrayList");
			//影像 右側 標題 
	    	$('#XrayListHead').html(" 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	    	//清空 右側 所有data
	    	clearXrayData();

		}
		
		jqGrid_XrayList("#XrayList","#XrayList_Pager",XrayArray);		
		if(XrayKind != undefined)
		{
			filterInpRecordXrayList(kind,labDate);
			XrayKind = undefined;
		}
		hideLoading();
		setPageVisible("xrayPage", true);
		popUpPageFixPos("xrayPage");
		
	});
	
};



var callXray = function(flag,kind){
	
	XrayObj.XrayYear = PatObj.recentYear;
	XrayObj.XraySDate = ViewListObj.sdate;
	XrayObj.XrayEDate = ViewListObj.edate;
	XrayObj.viewType = ViewListObj.viewType;
	XrayObj.serno = ViewListObj.serno;
	
	
//	document.getElementById('XrayMasterAll').setAttribute("title","全部影像"); 
	//collapseHide("mainPage");
	
	//先清空 影像照射位置的 暫留data
//	clearGridData("XrayPosList");
	XrayKind = kind;
	if(flag == "date"){
		XrayObj.XrayVisitType = XrayObj.viewType;
		$('#XrayMasterDate').show();
		document.getElementById('XrayMasterDate').setAttribute("title",XrayObj.XraySDate+"-"+XrayObj.XrayEDate);   
		XrayListByDate();
		ajax_getXrayCountYearsListData("XrayReportService",1);
		ajax_getXrayCountAllListData("XrayReportService",1);
	}else if(flag =="year"){
		XrayObj.XrayVisitType = "ALL";
		PatObj.recentYear = $("#recentYear").val();
		$('#XrayMasterDate').hide();
		ajax_getXrayCountAllListData("XrayReportService",1);
		XrayListByYear();		
	}else{
		XrayObj.XrayVisitType = "ALL";
		$('#XrayMasterDate').hide();
		ajax_getXrayCountYearsListData("XrayReportService",1);
		XrayListByAll();		
	}
		
	$('#XrayYear').val(XrayObj.XrayYear);
//	$('#XrayMasterYear').html(XrayObj.XrayYear + '年影像&nbsp;<span class="badge">'+ $("#yearsXRAY").html() + '</span>');
//	$('#XrayMasterAll').find("span").html($("#allXRAY").html());  //先帶入全部的count值
			
}


var callVisitTypeXrayAll = function(flag){
	
	XrayObj.XrayYear = PatObj.recentYear;
	XrayObj.viewType = "ALL";

     if(flag =="year"){
		XrayObj.XrayVisitType = "ALL";
		PatObj.recentYear = $("#recentYear").val();
		$('#XrayMasterDate').hide();
		ajax_getXrayCountAllListData("XrayReportService",1);
		XrayListByYear();		
	}else{
		XrayObj.XrayVisitType = "ALL";
		$('#XrayMasterDate').hide();
		ajax_getXrayCountYearsListData("XrayReportService",1);
		XrayListByAll();		
	}
		
	$('#XrayYear').val(XrayObj.XrayYear);
//	$('#XrayMasterYear').html(XrayObj.XrayYear + '年影像&nbsp;<span class="badge">'+ $("#yearsXRAY").html() + '</span>');
//	$('#XrayMasterAll').find("span").html($("#allXRAY").html());  //先帶入全部的count值
			
}


/**callOPDXray 從門急點過來的 影像**/
var callOPDXray = function(flag,xrayDate){
	OpdXrayDate = xrayDate;
	XrayObj.viewType = OpdObj.viewType;
	XrayObj.XrayVisitType = "OPD";
//	document.getElementById('XrayMasterAll').setAttribute("title","全部影像"); 
	//collapseHide("mainPage");
	
	//先清空 影像照射位置的 暫留data
//	clearGridData("XrayPosList");
	if(flag == "date"){		
		XrayObj.XraySDate = OpdObj.OpdSDate
		XrayObj.XrayEDate = OpdObj.OpdEDate
		$('#XrayMasterDate').show();
		document.getElementById('XrayMasterDate').setAttribute("title",XrayObj.XraySDate+"-"+XrayObj.XrayEDate);   
		XrayListByDate();
		XrayObj.XrayYear = OpdObj.OpdYear;
		ajax_getXrayCountYearsListData("XrayReportService",1);
		ajax_getXrayCountAllListData("XrayReportService",1);
	}else if(flag =="year"){
		XrayObj.XrayYear = OpdObj.OpdYear;
		$('#XrayMasterDate').hide();
		ajax_getXrayCountAllListData("XrayReportService",1);
		XrayListByYear();
		
	}else{
		XrayObj.XrayYear = OpdObj.OpdYear;
		ajax_getXrayCountYearsListData("XrayReportService",1);
		$('#XrayMasterDate').hide();
		XrayListByAll();		
	}
		
	$('#XrayYear').val(XrayObj.XrayYear);
//	$('#XrayMasterYear').html(XrayObj.XrayYear + '年影像&nbsp;<span class="badge">'+ $("#yearsXRAY").html() + '</span>');
//	$('#XrayMasterAll').find("span").html($("#allXRAY").html());  //先帶入全部的count值
			
}
/**過濾從 門急診 點過來的影像日期
 * */
var filterOpdRecordXrayDateXrayList = function(XrayDate){
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"view_date",op:"eq",data:XrayDate});	
	$("#XrayList").setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid',[{page:1}]);
}


/**
 * 取得 影像年 數量 & 年清單
 * ajax_getXrayCountYearsListData("XrayReportService");
 * */
var ajax_getXrayCountYearsListData = function(serviceName,flag){
	
	if(XrayObj.viewType=="OPD"){
		XrayObj.XrayVisitType = "OPD";
	}else {
		XrayObj.XrayVisitType = "ALL";
	}
	
	showLoading();	
	var cmParam = new EMRYearsVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,XrayObj.XrayYear,XrayObj.XrayVisitType,"getXrayCountByChartNoYearsVisitTypeGroupByType");	
		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(dataXray) {
						if (dataXray.status == "Success") {
							var box = "";
							$.each(dataXray.resultSet, function(index, obj) {				
								if(index == "summary"){
									//alert(obj);
									$('#XrayYear').val(XrayObj.XrayYear);
									$('#XrayMasterYear').html(XrayObj.XrayYear + '年影像&nbsp;<span class="badge">'+ obj + '</span>');
									 
								}else{
									$.each(obj, function(index, obj_d){
										box += '&nbsp;<button class="btn btn-primary" onclick="filterXrayList(\'' + obj_d.cat_type + '\');">' + obj_d.cat_name +' <span class="badge">' + obj_d.count +'</span></button>';
										//加入title
//										box += '&nbsp;<button class="btn btn-primary" onclick="filterXrayList(\'' + obj_d.cat_type + '\');"title='+obj_d.cat_name+'>' + obj_d.cat_name +' <span class="badge">' + obj_d.count +'</span></button>';

									});
								}
								//alert(index + ":" + obj);
							});
							
//							var title = "影像" + $('#PatInfo').text();
//							$('#xrayPage_Title').html(title);	//設定title內容
							if(flag==2){
								$('#XrayDetail').html(box);
								box = null;
								if(XrayObj.XrayVisitType=="OPD"){
//									var title = XrayObj.XrayYear+"年 門急-影像" + $('#PatInfo').text();
									var title = XrayObj.XrayYear+"年 門急-影像" + "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;
								}else {
//									var title = XrayObj.XrayYear+"年影像" + $('#PatInfo').text();
									var title = XrayObj.XrayYear+"年影像"+"&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;
								}
								
								$('#xrayPage_Title').html(title);	//設定title內容
								ajax_getXrayList("XrayReportService","Year");
							}
							
						} else {
							ajaxErrMsg = dataXray.errorMessage;
						}
												

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
		
	};

/**Button onClick 事件  XrayListByYear() 取得影像年**/
var XrayListByYear = function(){
	
	ajax_getXrayCountYearsListData("XrayReportService",2);
}

/**取得 影像 日期範圍 數量 & 日期範圍 清單
 * serviceName=XrayReportService
 * ajax_getXrayCountDateRangeListData("XrayReportService");
 * serviceName 
 * flag = 1 抓 count ; flag = 2 抓 count+List
 * */
var ajax_getXrayCountDateRangeListData = function(serviceName,flag){
	
	if(XrayObj.viewType=="OPD"){
		XrayObj.XrayVisitType = "OPD";
	}else {
		XrayObj.XrayVisitType = "ALL";
	}
	
showLoading();	
var cmParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,XrayObj.XraySDate,XrayObj.XrayEDate,XrayObj.XrayVisitType,"getXrayCountByChartNoDateRangeVisitTypeGroupByType");	

	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(dataXray) {
					if (dataXray.status == "Success") {
						var box = "";
						$.each(dataXray.resultSet, function(index, obj) {
							
							if(index == "summary"){
								//alert(obj);
								$('#XrayMasterDate').html('影像&nbsp;<span class="badge">'+ obj + '</span>');
//								document.getElementById('XrayMasterYear').setAttribute("title",XrayObj.XrayYear+"年影像");
							}else{
								$.each(obj, function(index, obj_d){
									box += '&nbsp;<button class="btn btn-primary" onclick="filterXrayList(\'' + obj_d.cat_type + '\');">' + obj_d.cat_name +' <span class="badge">' + obj_d.count +'</span></button>';
									//加入title
//									box += '&nbsp;<button class="btn btn-primary" onclick="filterXrayList(\'' + obj_d.cat_type + '\');"title='+obj_d.cat_name+'>' + obj_d.cat_name +' <span class="badge">' + obj_d.count +'</span></button>';
								});
							}
							//alert(index + ":" + obj);
						});
						
						
						var title = XrayObj.XraySDate + "-" +XrayObj.XrayEDate + "&nbsp;" + (XrayObj.viewType == "OPD" ? '門急記錄':'住院記錄') + "-影像";
						title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;
						$('#xrayPage_Title').html(title);	//設定title內容
						
						if(flag==2){
							$('#XrayDetail').html(box);
							box = null;
							ajax_getXrayList("XrayReportService","Date");
						}
						
					} else {
						ajaxErrMsg = dataXray.errorMessage;
					}
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
};



/***/
var XrayListByDate = function(){

	ajax_getXrayCountDateRangeListData("XrayReportService",2);
	
}

var ajax_getXrayCountAllListData = function(serviceName,flag){
	
	if(XrayObj.viewType=="OPD"){
		XrayObj.XrayVisitType = "OPD";
	}else {
		XrayObj.XrayVisitType = "ALL";
	}
	
	showLoading();	
	var cmParam = new EMRAllVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,XrayObj.XrayVisitType,"getXrayCountByChartNoVisitTypeGroupByType");

		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(dataXray) {
						
						if (dataXray.status == "Success") {
							var box = "";
							$.each(dataXray.resultSet, function(index, obj) {				
								if(index == "summary"){
									//alert(obj);
									$('#XrayMasterAll').find("span").html(obj);
									
								}else{
									$.each(obj, function(index, obj_d){
										box += '&nbsp;<button class="btn btn-primary" onclick="filterXrayList(\'' + obj_d.cat_type + '\');">' + obj_d.cat_name +' <span class="badge">' + obj_d.count +'</span></button>';
										//加入 title
//										box += '&nbsp;<button class="btn btn-primary" onclick="filterXrayList(\'' + obj_d.cat_type + '\');" title='+obj_d.cat_name+'>' + obj_d.cat_name +' <span class="badge">' + obj_d.count +'</span></button>';

									});
								}
								//alert(index + ":" + obj);
							});
							
							if(flag==2){
								$('#XrayDetail').html(box);
								box = null;
								
								if(XrayObj.XrayVisitType=="OPD"){
//									var title = "全部 門診-影像" + $('#PatInfo').text();
									var title = "全部門急-影像" + "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;
								}else{
//									var title = "全部影像" + $('#PatInfo').text();
									var title = "全部影像"+"&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;
								}

								$('#xrayPage_Title').html(title);	//設定title內容
								ajax_getXrayList("XrayReportService","All");	
							}
							
						} else {
							ajaxErrMsg = dataXray.errorMessage;
						}	
						
												

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
	
};

var XrayListByAll = function(){
	
	ajax_getXrayCountAllListData("XrayReportService",2);	
}

// modify by IvyLin serviceName = XrayReportService
/**
 * ajax_getXrayList("XrayReportService","Year");
 * */
var ajax_getXrayList = function(serviceName,range){
	if(range=="Year"){
		var cmParam = new EMRYearsVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,XrayObj.XrayYear,XrayObj.XrayVisitType,"getXrayListByChartNoYearsVisitType");	
	}else if(range=="All"){
		var cmParam = new EMRAllVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,XrayObj.XrayVisitType,"getXrayListByChartNoVisitType");
	}else{
		//Date
		var cmParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,XrayObj.XraySDate,XrayObj.XrayEDate,XrayObj.XrayVisitType,"getXrayListByChartNoDateRangeVisitType");			
	}
	
	var XrayArray = [];
	$.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(function(dataXrayList){			
		if (dataXrayList.status == "Success") {
			$.each(dataXrayList.resultSet, function(index, obj) {		
				XrayArray.push(obj);
			});		
		} else {
			ajaxErrMsg = dataXrayList.errorMessage;
			noDataFound(ajaxErrMsg,"XrayList");
			//影像 右側 標題 
	    	$('#XrayListHead').html(" 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	    	//清空 右側 所有data
	    	clearXrayData();

		}	
		jqGrid_XrayList("#XrayList","#XrayList_Pager",XrayArray);		
		if(XrayKind != undefined)
		{
			filterXrayList(XrayKind);
			XrayKind = undefined;
		}
		if(OpdXrayDate != undefined)
		{
			filterOpdRecordXrayDateXrayList(OpdXrayDate);
			OpdXrayDate = undefined;
		}
		hideLoading();
		setPageVisible("xrayPage", true);
		popUpPageFixPos("xrayPage");
	});
	
	
};


//取得影像 畫面右側資料 1070131 
// XrayReportService 
var ajax_getXrayDetailData = function(serviceName,xrayType,inpOpd,viewDate,serno,seqNo){
	
	var cmParam = new EMRXrayReportPrimaryKeysInputObj(UserObj.emp_no,UserObj.session_id,xrayType,inpOpd,viewDate,PatObj.chart_no,serno,seqNo,"getXrayReportByPrimaryKeys");
//	var cmParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getXrayCountByChartNoGroupByType");

		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(data) {
						
						if (data.status == "Success") {
							
//							$('#xray_ReportDate').html(formatDateTime(data.resultSet.report_date)+"  "+formatDateTime(data.resultSet.report_time)); //格式化報告日期
							$('#xray_ReportDate').html(data.resultSet.report_date+"  "+data.resultSet.report_time); //報告日期
							$('#xray_ReportMan').html(data.resultSet.reporter_name); //報告人員
							$('#xray_ReportType').html(data.resultSet.xray_type+"  "+data.resultSet.xray_name);//X光類別
							$('#xray_ReportDoctor').html(data.resultSet.doctor_name);//醫師
							$('#xray_dianoReason').html(data.resultSet.diagnosis);//醫囑原因
							$('#xray_findingReason').html(data.resultSet.report);//報告內容
							
							
							
						
						} else {
							var ajaxErrMsg = data.errorMessage;
							clearXrayData();
						}	
											

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
	
};


//取得影像 照射位置 1070202 
//XrayReportService 
var ajax_getXrayPosListData = function(serviceName,xrayType,inpOpd,viewDate,serno,seqNo){
	
	var XrayPosArray = [];
	
	
	var cmParam = new EMRXrayReportPrimaryKeysInputObj(UserObj.emp_no,UserObj.session_id,xrayType,inpOpd,viewDate,PatObj.chart_no,serno,seqNo,"getXrayordByXrayTypeInpOPdViewDateChartNoSerNoSeqNo");

		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(data) {
						
						if (data.status == "Success") {
							
							$.each(data.resultSet, function(index, obj) {		
								XrayPosArray.push(obj);
																	
								});	
						
						} else {
							var ajaxErrMsg = data.errorMessage;
							noDataFound(ajaxErrMsg,"XrayPosList");
							
						}
						
						jqGrid_XrayPosList("#XrayPosList","#XrayPosList_Pager",XrayPosArray);
						
												

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
   	
	
};


var filterXrayList = function(kind){
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"cat_type",op:"eq",data:kind});	
	$("#XrayList").setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid',[{page:1}]);
};

var filterInpRecordXrayList = function(kind,labDate){
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"cat_type",op:"eq",data:kind},{field:"view_date",op:"eq",data:labDate});	
	$("#XrayList").setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid',[{page:1}]);
};


function jqGrid_XrayList(tableName,pagerName,arrayData){		//影像清單
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 220,
	    colModel: [
	    	{ label: '門/急/住', name: 'inp_opd', width: 90,hidden:true },
	    	{ label: 'access_no', name: 'access_no', width: 90,hidden:true },
	        { label: '序號', name: 'seq_no', width: 90,hidden:true },
	        { label: '病歷號', name: 'chart_no', width: 90,hidden:true },	        
	        { label: 'inp_opd', name: 'inp_opd', width: 90,hidden:true },
	        { label: '住院序號', name: 'serno', width: 90,hidden:true },
	        { label: '影像類型代碼', name: 'xray_type', width: 90,hidden:true },
	        { label: '年份', name: 'years', width: 45 },
	        { label: '日期', name: 'view_date', width: 90 },
	        { label: '影像表單名稱', name: 'form_name', width: 160,hidden:false },
	        { label: '種類id', name: 'cat_type', width: 60,hidden:true },
	        { label: '種類', name: 'cat_name', width: 120,hidden:true,align:'center' },
	        //需改為access_no
	        { label: '種類', name: 'cat_name', width: 120,hidden:false,align:'center',formatter: function(cellvalue, options, rowobject){
//	            return '<button type="button" class="btn btn-primary btn-sm">'+ cellvalue +'</button>';
	            return '<button type="button"  onclick="showXrayBtnClick('+"\'"+rowobject.access_no+"\'"+');" class="btn btn-primary btn-sm ButtonfontSize">'+ cellvalue +'</button>';
//	        	return '<button type="button"  onclick="XrayTypeBtnClick('+"\'" + rowobject.cat_type+"\'"+",\'"+rowobject.chart_no+"\'"+",\'"+rowobject.xray_type+"\'"+');"class="btn btn-primary btn-sm">'+ cellvalue +'</button>';
	        }},
	        
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	
        },
        width: null,
//        rowNum: Math.floor((pageHeight - 220)/33),
	    shrinkToFit:false,
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
	//$("#XrayList").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	
	function getSelectedRow() {
		
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    if (rowKey){
	    	var xrayType = $(tableName).jqGrid('getCell',rowKey,'xray_type');
	    	var inpOpd = $(tableName).jqGrid('getCell',rowKey,'inp_opd');
	    	var viewDate = $(tableName).jqGrid('getCell',rowKey,'view_date');	    	
	    	var seqNo = $(tableName).jqGrid('getCell',rowKey,'seq_no');
	    	var serno = $(tableName).jqGrid('getCell',rowKey,'serno');
	    	
	    	ajax_getXrayDetailData("XrayReportService",xrayType,inpOpd,viewDate,serno,seqNo);
	    	ajax_getXrayPosListData("XrayReportService",xrayType,inpOpd,viewDate,serno,seqNo);
	    	
//	    	//alert($('#XrayList').jqGrid('getCell',rowKey,'cat_name'));
	    	
	    	var extraBtn="";
	    	extraBtn += '<div class="pull-right"><button  type="button" id="extraInp" class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
	    	$('#XrayListHead').html($(tableName).jqGrid('getCell',rowKey,'view_date') + " " + $(tableName).jqGrid('getCell',rowKey,'cat_name') + " 病患: " + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲 "+extraBtn);
////	    	$('#XrayListBody').html(rowKey);
////	    	$('#xray_ReportDate').html(date_format($('#XrayList').jqGrid('getCell',rowKey,'view_date'))); //報告日期
//	    	$('#xray_ReportDate').html($('#XrayList').jqGrid('getCell',rowKey,'view_date')); //報告日期
//	    	$('#xray_ReportMan').html(); //報告人員
//	    	$('#xray_ReportType').html($('#XrayList').jqGrid('getCell',rowKey,'xray_type')+"  "+$('#XrayList').jqGrid('getCell',rowKey,'form_name'));//X光類別
	    	
	    		    		    
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}
}

var getXrayData = function(){
	
	$('#xray_ReportDate').html($('#XrayList').jqGrid('getCell',rowKey,'view_date')); //報告日期
	$('#xray_ReportMan').html(); //報告人員
	$('#xray_ReportType').html($('#XrayList').jqGrid('getCell',rowKey,'xray_type')+"  "+$('#XrayList').jqGrid('getCell',rowKey,'form_name'));//X光類別
	$('#xray_ReportDoctor').html();//醫師
	$('#xray_dianoReason').html();//醫囑原因
	$('#xray_findingReason').html();//報告內容
	

};

/**如果 影像清單為空 則清除暫存資料***/
var clearXrayData = function(){
	
	$('#xray_ReportDate').html(""); //報告日期
	$('#xray_ReportMan').html(""); //報告人員
	$('#xray_ReportType').html("");//X光類別
	$('#xray_ReportDoctor').html("");//醫師
	$('#xray_dianoReason').html("");//醫囑原因
	$('#xray_findingReason').html("");//報告內容
	//清除 照射位置 jqGird Data
	clearGridData("XrayPosList");//清除影像照射位置的jqGrid data
	
};


var XrayTypeBtnClick = function(value,chartNo,xrayType){
	alert("chartNo="+chartNo+" ; type="+value+" ; xrayType="+xrayType);
};

/**顯示 影像圖片 **/
var showXrayBtnClick = function(access_no){
	 /**setPageVisible("xrayPosPage", true);
	 popUpPageFixPos("xrayPosPage");
	 zIndex -=1; //目的是為了要讓 ud移到 住院紀錄的上層
	 $('#xrayPage').css('z-index', zIndex);**/ //假資料頁面先關閉
	  
	 var pacsURL = localStorage.getItem("pacsURL");  //getItem
//	 http://192.168.0.235/pkg_pacs/external_interface.aspx?MX=9&LID=USER&LPW=USER&AN=1201609249225 //Web專用
	 if(!pacsURL){
		
		 ajax_getPASViewerURL("PacsSettingService");//取得PASViewer URL 1070418 add
//		 var callPac =  "http://"+PacsViewObj.url+"+"+UserObj.emp_no+"+"+UserObj.password+"++S+"+access_no+"+";
		 var callPac = PacsViewObj.url + "&LID="+UserObj.emp_no+"&LPW="+UserObj.password+"&AN="+access_no;

	 }else{
		 var pacsURL = localStorage.getItem("pacsURL");  //getItem 
//		 var callPac =  "http://"+pacsURL+"+"+UserObj.emp_no+"+"+UserObj.password+"++S+"+access_no+"+";
		 var callPac = pacsURL+"&LID="+UserObj.emp_no+"&LPW="+UserObj.password+"&AN="+access_no;

		 

	 }

//	 window.open(callPac);//開啟呼叫外部網頁 

	 window.open(callPac, "影像", config='height='+userHeight+',width='+pageWidth); //另開視窗


};


/**1070131 影像照射位置***/
function jqGrid_XrayPosList(tableName,pagerName,arrayData){		//影像清單
	$(tableName).jqGrid({
	    datatype: "local",
	    height: 100,
	    colModel: [
	        { label: '序號', name: 'rec_count', width: 45,hidden:false },
	        { label: 'X光影像', name: 'access_no', width: 80,hidden:true,align:'center',formatter: function(cellvalue, options, rowobject){
//	            return '<button type="button"  onclick="showXrayBtnClick();" class="btn btn-primary btn-sm ButtonfontSize">'+ cellvalue +'</button>';
	            return '<button type="button"  onclick="showXrayBtnClick('+"\'"+cellvalue+"\'"+');" class="btn btn-link btn-img24 img24_Preview" title="'+cellvalue+'"></button>';
//	        	return '<button type="button"  onclick="XrayTypeBtnClick('+"\'" + rowobject.cat_type+"\'"+",\'"+rowobject.chart_no+"\'"+",\'"+rowobject.xray_type+"\'"+');"class="btn btn-primary btn-sm">'+ cellvalue +'</button>';
	        }},
	        
	        { label: 'X光流水號', name: 'seq_no', width: 120},	        
	        { label: '照射位置', name: 'xray_pos', width: 200 },
	        { label: '部位角度名稱', name: 'angle_name', width: 430 },
	        { label: '片子種類', name: 'xray_size', width: 100},
	        { label: 'X光片尺寸', name: 'size_name', width: 120 },
	        { label: '片數', name: 'qty', width: 70 },
	        { label: '廢片數量', name: 'bad_qty', width: 90 },
	        { label: 'access_no', name: 'access_no', width: 160,hidden:true },

	        
	     
//	        { label: '種類', name: 'cat_name', width: 140 ,formatter: function(cellvalue, options, rowobject){
//	            return '<button type="button" class="btn btn-primary btn-sm">'+ cellvalue +'</button>';
////	            return '<button type="button"  onclick="XrayTypeBtnClick('+"\'" + rowobject.cat_type+"\'"+');" class="btn btn-primary btn-sm">'+ cellvalue +'</button>';
////	        	return '<button type="button"  onclick="XrayTypeBtnClick('+"\'" + rowobject.cat_type+"\'"+",\'"+rowobject.chart_no+"\'"+",\'"+rowobject.xray_type+"\'"+');"class="btn btn-primary btn-sm">'+ cellvalue +'</button>';
//	        }},
//	        
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	
        },
        width: null,
        rowNum: Math.floor((pageHeight - 220)/33),
	    shrinkToFit:false,
//	    sortable: true,
		pager: pagerName,
		pagerpos:'left',
		loadComplete : function () {
//			$(this).jqGrid('setSelection', 1, true);
		}
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: arrayData});
	$(tableName).trigger('reloadGrid');
	//$("#XrayList").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	
	function getSelectedRow() {
		
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    if (rowKey){
	    	//alert($('#XrayList').jqGrid('getCell',rowKey,'cat_name'));
//	    	$('#XrayListHead').html($('#XrayList').jqGrid('getCell',rowKey,'view_date') + " " + $('#XrayList').jqGrid('getCell',rowKey,'cat_name') + " 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age)
//	    	$('#XrayListBody').html(rowKey);
//	    	$('#xray_ReportDate').html(date_format($('#XrayList').jqGrid('getCell',rowKey,'view_date'))); //報告日期
//	    	$('#xray_ReportDate').html($('#XrayList').jqGrid('getCell',rowKey,'view_date')); //報告日期
//	    	$('#xray_ReportMan').html(); //報告人員
//	    	$('#xray_ReportType').html($('#XrayList').jqGrid('getCell',rowKey,'xray_type')+"  "+$('#XrayList').jqGrid('getCell',rowKey,'form_name'));//X光類別
	    	
	    		    		    
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}
}










