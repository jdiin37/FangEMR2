function ajax_checkPasswd() {
	var request = $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("checkPasswd"),
		dataType : "json"
	}).done(function(data) {
		if (data.status == "Success") {
			UserObj.emp_no = data.emp_no;
			UserObj.emp_name = data.emp_name;
			UserObj.session_id = data.session_id;
			render_checkPasswd(true);
			ajax_getHospName(); // 取得醫院資料
			ajax_getChartByChartNo(); // 取得客戶基本資料
			
			
		} else {
			render_checkPasswd(false);
			ajaxErrMsg = data.errorMessage;
//			alert(ajaxErrMsg);
		}
		hideLoading();
	});
	request.onreadystatechange = null;
	request.abort = null;
	request = null;
	
}

function render_checkPasswd(isOk) {

	var LoginObj = JSON.parse(localStorage.getItem("LoginObj"));  //getItem
	var empNo = getQueryVariable("empNo");
	var password = getQueryVariable("password");
	var chartNo = getQueryVariable("chartNo");
	
//	PatObj.chart_no = chartNo;
	
	if(LoginObj){
		
		if(empNo){
			ajax_getLoginInfo("AuthService","checkPasswd",empNo.toLocaleUpperCase(),password,true);
//			window.location.href="/FangEmrServices/html/mainEMR/mainEMR.html?chartNo="+getQueryVariable("chartNo");
		}else{
			var LoginObj = JSON.parse(localStorage.getItem("LoginObj"));  //getItem			
			UserObj.emp_no = LoginObj.emp_no;
			UserObj.password = LoginObj.password;
			UserObj.emp_name = LoginObj.emp_name;
			ajax_getLoginInfo("AuthService","checkPasswd",LoginObj.emp_no,LoginObj.password,false);
		}
		
		

//		$('#user_info').html("使用者: "+ UserObj.emp_name);

		if (getQueryVariable("chartNo").length > 0) {
			PatObj.chart_no = getQueryVariable("chartNo");//取得QueryString			
			 setTimeout(function(){
				ajax_getHospName(); // 取得醫院資料
				ajax_getChartByChartNo(); // 取得客戶基本資料	
		     }, 400);
						
		}else{
			 setTimeout(function(){ 
				 callQuery();
		     }, 400);
		}
		
	}else if(empNo){
		
		ajax_getLoginInfo("AuthService","checkPasswd",empNo.toLocaleUpperCase(),password,true);
//		window.location.href="/FangEmrServices/html/mainEMR/mainEMR.html?chartNo="+getQueryVariable("chartNo");
		if (getQueryVariable("chartNo").length > 0) {
			PatObj.chart_no = getQueryVariable("chartNo");//取得QueryString	
			setTimeout(function(){
			ajax_getHospName(); // 取得醫院資料
			ajax_getChartByChartNo(); // 取得客戶基本資料	
			}, 400);
		}else{
			 setTimeout(function(){ 
				 callQuery();
		     }, 400);
		}
		
	}else{
		window.location.href="/FangEmrServices/html/login/Login.html";
	}
	
	PacsViewObj.idNo = UserObj.emp_no;
	PacsViewObj.password = UserObj.password;
	
	

	/**if (isOk) {
		$('#user_info').html("使用者:" + UserObj.emp_name);
		$('#user_log').html("登出");
	} else {
		$('#user_info').html("您尚未登入");
		$('#user_log').html("登入");
	}**/
}

var ajax_getLoginInfo = function(serviceName,method,empNo,password,flag){

	
	var Authdata = new authObj(method,empNo,password);
	
	var request = $.when(ajax_setPostData(serviceName,JSON.stringify(Authdata))).done(function(data) {                                
		if (data.status == "Success") {
			
			UserObj.emp_no = data.emp_no;
			UserObj.emp_name = data.emp_name;
			UserObj.session_id = data.session_id;
			UserObj.password = password;
			
			if(UserObj.session_id){ //如果成功取得SessionId 時
				
				$('#user_info').html("使用者: "+ UserObj.emp_name);
				window.localStorage.setItem("LoginObj",JSON.stringify(UserObj));  //setItem
								
				if(flag==true){
					if(getQueryVariable("chartNo")==false){
						window.location.href="/FangEmrServices/html/mainEMR/mainEMR.html";
					}else{
						window.location.href="/FangEmrServices/html/mainEMR/mainEMR.html?chartNo="+getQueryVariable("chartNo");
					}
					
				}
				
			}else{
				alert("無法取得SessionId");
				window.location.href="/FangEmrServices/html/login/Login.html";
			}
			
			

		} else {
		  var ajaxErrMsg = data.errorMessage;
		  alert(ajaxErrMsg);
		  window.location.href="/FangEmrServices/html/login/Login.html";

		}
		
		
		
    });

    request.onreadystatechange = null;
    request.abort = null;
    request = null;
};

function ajax_getHospName() {
	var request = $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getHospName"),
		dataType : "json"
	}).done(function(data) {
		if (data.status == "Success") {
			$.each(data.resultSet, function(index, obj) {
				render_getHospName(index, this);
			});
		} else {
			ajaxErrMsg = data.errorMessage;
		}
		hideLoading();
	});
	request.onreadystatechange = null;
	request.abort = null;
	request = null;
}

function render_getHospName(index, value) {
	if (index == "no") {
	} else if (index == "name") {
	} else if (index == "value") {
		$("#hospName").html(value);
	}
}

function ajax_getChartByChartNo() {
	// $('#LoadingModal').modal('show');
	var request = $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getChartByChartNo"),
		dataType : "json"
	}).done(function(data) {
		if (data.status == "Success") {
			PatObj = data.resultSet;
			$.each(PatObj, function(index, obj) {
				render_getChartByChartNo(index, this);
			});
			PatObj.recentYear = 5;
			$("#recentYear").val("5");
			ajax_getChartEMRSummaryByChartNoAndYears(); // 取得查詢範圍筆數 預設5年
			ajax_getChartEMRSummaryByChartNo(); // 取得查詢範圍筆數 全部
			ajax_getPASViewerURL("PacsSettingService");//取得PASViewer URL 1070418 add	
			ajax_getMajorDiseaseData("CriticalService",1);//取得重大疾病count
			ajax_getAllergyData("AllergyService",1);//取得過敏資料
			
		} else {
			ajaxErrMsg = data.errorMessage;
		}		
	});
	request.onreadystatechange = null;
	request.abort = null;
	request = null;
}

function render_getChartByChartNo(index, value) {
	if (index == "chart_no") {
		$("#chart_no").html(value);
		$("#chart_no2").html(value);
	} else if (index == "pt_name") {
		$("#pt_name").html(value);
		$("#pt_name2").html(value);
	} else if (index == "sex_name") {
		$("#sex_name").html(value);
		$("#sex_name2").html(value);
	} else if (index == "age") {
		$("#age").html(value);
		$("#age2").html(value);
	} else if (index == "first_view_date") {
		$("#first_view_date").html(value);
	} else if (index == "last_view_date") {
		$("#last_view_date").html(value);
	} else if (index == "first_div_name") {
		$("#first_div_name").html(value);
	} else if (index == "last_div_name") {
		$("#last_div_name").html(value);
	} else if (index == "home_tel") {
		$("#home_tel").html(value);
	}
}

//查詢總數 
function ajax_getChartEMRSummaryByChartNoAndYears() {
	var request = $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getChartEMRSummaryByChartNoAndYears"),
		dataType : "json"
	}).done(function(data) {
		if (data.status == "Success") {
			$.each(data.resultSet, function(index, obj) {
				render_getChartEMRSummaryByChartNoAndYears(index, this); // 範圍內
			});
						
			$.when(ajax_getEmrViewListByYearsChartNo()).done(function(dataViewList){
				$("#timeLine").html("");
				if (dataViewList.status == "Success") {
					$.each(dataViewList.resultSet, function(index, obj) {		
						render_getEmrViewListByYearsChartNo(index, obj);
					});		
				} else {
					ajaxErrMsg = dataViewList.errorMessage;
				}	
				hideLoading();
			});
		} else {
			ajaxErrMsg = data.errorMessage;
		}
	});
	request.onreadystatechange = null;
	request.abort = null;
	request = null;
}

function render_getChartEMRSummaryByChartNoAndYears(index, value) {
	if (index == "OPD") {
		$("#yearsOPD").html(value);
	} else if (index == "INP") {
		$("#yearsINP").html(value);
	} else if (index == "OR") {
		$("#yearsOR").html(value);
	} else if (index == "LAB") {
		$("#yearsLAB").html(value);
	} else if (index == "XRAY") {
		$("#yearsXRAY").html(value);
	}
	
	
}

//查詢總數(全)
function ajax_getChartEMRSummaryByChartNo() {
	var request = $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getChartEMRSummaryByChartNo"),
		dataType : "json"
	}).done(function(data) {
		if (data.status == "Success") {
			$.each(data.resultSet, function(index, obj) {
				render_getChartEMRSummaryByChartNo(index, this); // 全部
			});
			$("#LoadingModal").modal('hide');
		} else {
			ajaxErrMsg = data.errorMessage;
		}
	});
	request.onreadystatechange = null;
	request.abort = null;
	request = null;
}

function render_getChartEMRSummaryByChartNo(index, value) {
	if (index == "OPD") {
		$("#allOPD").html(value);
	} else if (index == "INP") {
		$("#allINP").html(value);
	} else if (index == "OR") {
		$("#allOR").html(value);
	} else if (index == "LAB") {
		$("#allLAB").html(value);
	} else if (index == "XRAY") {
		$("#allXRAY").html(value);
	}
}
//查詢門診 住院 出院病人
function ajax_getPatientListOpd() {	
	if (QueryObj.chkopd) {
		return $.ajax({
			method : "POST",
			url : ajax_url(1),
			data : getAjaxData("getPatientListOpd"),
			dataType : "json"
		});
	}
}

function ajax_getPatientListInp() {
	if (QueryObj.chkinp) {
		return $.ajax({
			method : "POST",
			url : ajax_url(1),
			data : getAjaxData("getPatientListInp"),
			dataType : "json"
		});
	}
}

function ajax_getPatientListDischarge() {
	if (QueryObj.chkdis) {
		return $.ajax({
			method : "POST",
			url : ajax_url(1),
			data : getAjaxData("getPatientListDischarge"),
			dataType : "json"
		});
	}
}
//查詢病歷主檔
function ajax_getChartByChartNoPtNameBirthDateTel() {
	// var sendDate = (new Date()).getTime();
	var PatListArray2 = [];
	var request = $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getChartByChartNoPtNameBirthDateTel"),
		dataType : "json"
	}).done(function(data) {
		QueryPatArray =[];
		if (data.status == "Success") {
			$.each(data.resultSet, function(index, obj) {
				PatListArray2.push(obj);
			});
		} else {
			ajaxErrMsg = data.errorMessage;
		}
//		jqGrid_PatList2();
		jqGrid_PatList2("#PatList2","#PatList2_Pager",PatListArray2);
		hideLoading();
	});
	request.onreadystatechange = null;
	request.abort = null;
	request = null;
}

//查詢病人門住歷次紀錄
function ajax_getEmrViewListByYearsChartNo() {
	return $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getEmrViewListByYearsChartNo"),
		dataType : "json"
	})
}

//過濾 主治醫師值為 null  (add By IvyLin 1070119)
var setNullText = function(text){  
	return text==null?"":text;
};

var ViewYear = "";

function render_getEmrViewListByYearsChartNo(index, obj) {	//***************產生ViewList**********
	// alert("index:" +index + " obj:" + obj.dis_details + " this:" +this);
	var newTimeDivision = "";
	var title = "<img class='pull-right menu-down' src='/FangEmrServices/img/24_close.png'></img>";
//	var title = "<span class='pull-right glyphicon glyphicon-menu-down'></span>";
	var opMsg = "";
	var year;
	
	//1070507 add 未避免只有一個記錄 導致 隱藏民國年 只顯示 月份
	var index0 = "<span style='min-width:40px;display: inline-block;'>"+obj.start_date.substr(0, 3)+ "&nbsp;"+"</span>";

		if(obj.start_date.substr(0, 3) == ViewYear){
			year= "";
		}else{
			year = obj.start_date.substr(0, 3) + "&nbsp;";
		}
		
		
		var index2 = "<span style='min-width:40px;display: inline-block;'>" + year+ "</span>";
//		index==0?index0:index2;
//		index==0?"<span style='min-width:40px;display: inline-block;'>"+obj.start_date.substr(0, 3)+ "&nbsp;"+"</span>":year;
	
		
	if (obj.visit_type == "OPD") {				
		title += "<span class='EMRfont'>";
//		title += "<span style='min-width:40px;display: inline-block;'>" + index==0?index0:index2;+ "</span>";  //備註:1070507 modify 原:(year)
		title += index==0?index0:index2;//1070507modify
		title += obj.start_date.substr(3, 2);
//		title += "&emsp;<span class='type' name='OPD'>&emsp;&nbsp;門急記錄</span>"; //修改位置 與 住院紀錄對齊
		title += "&emsp;<span class='type' name='OPD'><img alt='門急' src='/FangEmrServices/img/24_emg.png'>門急記錄</span>"; //修改位置 與 住院紀錄對齊
		title += "<span class='sdate'>" + obj.start_date + "</span>";
		title += "-";
		title += "<span class='edate'>" + obj.end_date + "</span>";
		title += "&emsp;(" + obj.count +"次)"; 	
		// newTimeDivision += "<div class='panel panel-default'>";

		
		if (obj.dis_details != undefined) {
			$.each(obj.dis_details, function(index, obj) {
				// title += " 診斷碼:" + obj.disease_code;
				// title += " 診斷名稱:" + obj.code_name_c;
//				title += "&emsp;" + obj.code_name_c;
				title += "&emsp;" + obj.code_name_c;

			});
		}
		if (obj.op_details != undefined) {
			$.each(obj.op_details,function(index, obj) {
				// title +='<img src="img/40_Surgery.png"
				// class="img-responsive"
				// alt="..." >';
				title += '&emsp;<img alt="手術" src="/FangEmrServices/img/24_op.png">';
				title += "手術日期:" + obj.op_date;
				// title += " 手術碼:" + obj.op_code;
				title += "&emsp;手術名稱:" + obj.op_name;	
				opMsg += "手術日期:" + obj.op_date + " 手術名稱:" + obj.op_name + "\n";
			});
		}

	} else if (obj.visit_type == "INP") {
		title += "<span class='EMRfont'>";
//		title += "<span style='min-width:40px;display: inline-block;'>" + index==0?index0:index2;+ "</span>";  //備註:1070507 modify 原:(year)
		title += index==0?index0:index2;//1070507 modify
		title += obj.start_date.substr(3, 2);
		title += "&emsp;<img alt='住院' src='/FangEmrServices/img/24_inp.png'><span class='type' name='INP'>住院記錄</span>";
		title += "<span class='sdate'>" + obj.start_date + "</span>";
		title += "-";
		if(obj.end_date == null){
			title += "<span style='display:none;' class='edate'>" + today + "</span>"; //尚未出院 住院中 end_date 隱藏
//			title += "<span class='edate'>" + "" + "</span>"; //尚未出院 住院中 end_date 給空值即可 1070427修改
//			title += "<span class='edate'>" + today + "</span>";	
			title += "&emsp;&emsp;&emsp;&emsp;&emsp;(住院中)";
		}else{
			title += "<span class='edate'>" + obj.end_date + "</span>";			
		}
		
		title += "<span class='serno hide'>" + obj.serno + "</span>";		
		
		title += "&emsp;(" + obj.admit_days +"天)";
		// newTimeDivision += "<div class='panel panel-warning'>";
		if (obj.dis_details != undefined) {
			$.each(obj.dis_details, function(index, obj) {
				// title += " 診斷碼:" + obj.disease_code;
				// title += " 診斷名稱:" + obj.code_name_c;
//				title += "&emsp;" + obj.code_name_c;
				title += "&emsp;" + obj.code_name_c;
			});
		}

		title += "&emsp;主治醫師:" + setNullText(obj.doctor_name);
		if (obj.op_details != undefined) {
			$
					.each(
							obj.op_details,
							function(index, obj) {
								// title +='<img src="img/40_Surgery.png"
								// class="img-responsive"
								// alt="..." >';
								title += '&emsp;<img alt="手術" src="/FangEmrServices/img/24_op.png">';
								title += "手術日期:" + obj.op_date;
								// title += " 手術碼:" + obj.op_code;
								title += "&emsp;手術名稱:" + obj.op_name;
								opMsg += "手術日期:" + obj.op_date + " 手術名稱:" + obj.op_name + "\n";
							});
		}
	}

	title += "</span>";
		
	newTimeDivision += "<div class='panel panel-info'>"
			+ "<div class='panel-heading'>"
			+ "<a data-toggle='collapse' id='newTime_" + index
			+ "' data-parent='#timeLine' href='#time_" + index + "'>"
			+ "<div class='panel-title ellipsis'>" + title + "</div>" + "</a></div>" 
			+ "<div id='time_" + index+ "' class='panel-collapse collapse'>" + "<div class='panel-body'>"
			+ "" + "</div>" + "</div>"
	"</div>";	
	
	$("#timeLine").append(newTimeDivision);
			
	ViewYear = obj.start_date.substr(0, 3);
			
	
	//binding event Start
	$('#newTime_' + index).attr('title', opMsg); //設tooltip
	$('#newTime_' + index).click(function(){
		
//		$(this).find(".glyphicon-menu-down").removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up');
		$(this).find(".menu-down").removeClass('menu-down').addClass('menu-up').attr("src","/FangEmrServices/img/24_open.png");

		if($("#time_" + index).hasClass("in")){
			return;
		}
		
		
		$("#time_" + index).children().html("資料讀取中..");
		ViewListObj.sdate = $(this).find('.sdate').html();
		ViewListObj.edate = $(this).find('.edate').html();
		ViewListObj.viewType = $(this).find('.type').attr('name');
		ViewListObj.serno = $(this).find('.serno').html();	
		ViewListObj.desc = $(this).html().replace('<img class="pull-right menu-up" src="/FangEmrServices/img/24_open.png">',"");//複製 html 至 住院紀錄的標頭,刪除 img
		
		var box ="";
		//日期範圍 細菌報告 數量
		var cmParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ViewListObj.sdate,ViewListObj.edate,"getGermCountByChartNoDateRangeGroupByGerm");
		
		
		if(ViewListObj.viewType=="OPD"){
			var xrayCountParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ViewListObj.sdate,ViewListObj.edate,ViewListObj.viewType,"getXrayCountByChartNoDateRangeVisitTypeGroupByType");	//影像DateRangeCount
			var LabCountParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ViewListObj.sdate,ViewListObj.edate,ViewListObj.viewType,"getLabCountByChartNoDateRangeVisitTypeGroupByKind");//檢驗DateRangeCount

		}else{
			var xrayCountParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ViewListObj.sdate,ViewListObj.edate,"ALL","getXrayCountByChartNoDateRangeVisitTypeGroupByType");	//影像DateRangeCount
			var LabCountParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ViewListObj.sdate,ViewListObj.edate,"ALL","getLabCountByChartNoDateRangeVisitTypeGroupByKind");//檢驗DateRangeCount

		}
		

		
		if(ViewListObj.viewType=="OPD"){
			var opdParam = new OpdSumDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ViewListObj.sdate,ViewListObj.edate,"ALL","getPatopdSummaryByChartNoDateRange");
			var serviceName = "PatopdService";
		}else{
			var serviceName="PatinpService";
			var opdParam = new EMRSernoInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ViewListObj.serno,"getPatinpSummaryByChartNoSerno");
		}
		
		
//		XrayReportService  ajax_setPostData("XrayReportService",JSON.stringify(xrayCountParam))

		$.when(ajax_setPostData(serviceName,JSON.stringify(opdParam)),ajax_getPatOPDataByChartNoDateRange(ViewListObj.viewType),ajax_setPostData("XrayReportService",JSON.stringify(xrayCountParam)),ajax_setPostData("LabRecordService",JSON.stringify(LabCountParam))).done(
				function(dataSum,dataOP,dataXray,dataLab){
					
					if(ViewListObj.viewType =="OPD"){
						if(dataSum[0].status == "Success"){
							var SummaryBtnWidth = 86+32;//因為加入icon 所以寬度需加寬 +26
							$.each(dataSum[0].resultSet, function(index, obj) {
								if(index == "summary"){
									//alert(obj);
									if(obj >=1000){
										SummaryBtnWidth += 8;
									}
									
									box += '<button class="btn btn-primary" onclick="callOPD(' + "'date',\'ALL\'" +' )"><img alt="門急" src="/FangEmrServices/img/24_emg.png">門急 <span class="badge">' + obj +'</span></button>';
								}
								
								if(index =="visit_details"){
									$.each(obj, function(index, obj_d) {
										var viewtype = obj_d.cash_type =="OPD"? '門診' : '急診';
										if(viewtype=="門診"){
											box += '&nbsp;<button class="btn btn-primary" onclick=callOPD("date","OPD","undefined","門診");><img alt="門急" src="/FangEmrServices/img/24_emg.png">' + viewtype +' <span class="badge">' + obj_d.count +'</span></button>';

										}else if(viewtype=="急診"){
											box += '&nbsp;<button class="btn btn-primary" onclick="callOPD(' + "'date',\'EMG\',\'undefined\',\'E\'" +' )"><img alt="門急" src="/FangEmrServices/img/24_emg.png">' + viewtype +' <span class="badge">' + obj_d.count +'</span></button>';
//											box += '&nbsp;<button class="btn btn-primary" onclick="callOPDType(' + "'date'" +' )"><img alt="門急" src="/FangEmrServices/img/24_emg.png">' + viewtype +' <span class="badge">' + obj_d.count +'</span></button>';

										}
									});
								}
								if(index =="dis_details"){
									$.each(obj, function(index, obj_d) {
										if(index%4 == 0 ){
											box += '<hr class="hr_noline" /><span style="margin-right:' + SummaryBtnWidth + 'px"></span>'
										}
//										box += '&nbsp;<button class="btn btn-primary" onclick="callOPD(' + "'date'" +' )">' + obj_d.range_no2 + " "+ obj_d.range_name_c +' <span class="badge">' + obj_d.count +'</span></button>';
										box += '&nbsp;<button class="btn btn-primary" onclick="callOPD('+"'date',\'ALL\',\'"+obj_d.range_no2+"\'"+')">' + obj_d.range_no2 + " "+ obj_d.range_name_c +' <span class="badge">' + obj_d.count +'</span></button>';

									});
								}
							
							});
							box += '<hr/>';
						}else {
							ajaxErrMsg = dataSum[0].errorMessage;
						}
					}else{
						if(dataSum[0].status == "Success"){
							box += '<div class="well well-sm">';
							box += '<button class="btn btn-primary" onclick="callINPrecord()"><img alt="住院" src="/FangEmrServices/img/24_inp.png"> 住院</button>';
							$.each(dataSum[0].resultSet, function(index, obj) {
								
								if(index == "admission"){
									box += '&nbsp;<button class="btn btn-primary" name="admission" onclick="callInp(' + "'admission'" +' )"><img alt="入院病摘" src="/FangEmrServices/img/24_AdmissionSummary.png"> 入院病摘 <span class="badge">' + obj +'</span></button>';
								}
								if(index == "outnote"){
									box += '&nbsp;<button class="btn btn-primary" name="outnote" onclick="callInp(' + "'outnote'" +' )"><img alt="出院病摘" src="/FangEmrServices/img/24_DischargeSummary.png"> 出院病摘 <span class="badge">' + obj +'</span></button>';
								}
								if(index == "chgbed"){
									box += '&nbsp;<button class="btn btn-primary" name="chgbed" onclick="callChgBed(' + "'date'" +' )"> <img alt="病房" src="/FangEmrServices/img/24_bed.png"> 病房記錄 <span class="badge">' + obj +'</span></button>';
								}
								if(index == "nurseprogress"){
									box += '&nbsp;<button class="btn btn-primary" name="nurseprogress" onclick="callFocus(' + "'date'" +' )"> <img alt="護理記錄" src="/FangEmrServices/img/24_focus.png"> 護理記錄 <span class="badge">' + obj +'</span></button>';
								}
								if(index == "drprogress"){
									box += '&nbsp;<button class="btn btn-primary" name="drprogress" onclick="callProgress(' + "'date'" +' )"> <img alt="病程記錄" src="/FangEmrServices/img/24_progress.png"> 病程記錄 <span class="badge">' + obj +'</span></button>';
								}												
							});
							box += '</div>';
						}else {
							ajaxErrMsg = dataSum[0].errorMessage;
						}
					}
										
					
					if (dataOP[0].status == "Success") {
						$.each(dataOP[0].resultSet, function(index, obj) {
//							box += '<button class="btn btn-primary">手術</button><span class="">';
//							box += '<button class="btn btn-primary" onclick="callOp('+"'date'"+')">手術</button><span class="">';//1070119 修改 by IvyLin
							box += '<button class="btn btn-primary" onclick="callOp('+"'date',\'"+obj.code1+"\'"+')"><img alt="手術" src="/FangEmrServices/img/24_op.png">手術</button><span class="EMRLabel">';//1070119 修改 by IvyLin
							box += '&ensp;' + obj.op_date + '&ensp;' + obj.op_start_time +'-'+ obj.op_date +'&ensp;' +obj.op_end_time;
							box += '&ensp;' + obj.op_durat + 'HR';
							if(obj.full_name_1 != null)
								box += '&ensp;' + obj.full_name_1;
							if(obj.full_name_2 != null)
								box += '&ensp;' + obj.full_name_2;
							if(obj.full_name_3 != null)
								box += '&ensp;' + obj.full_name_3;
							
							box += "&ensp;主刀醫師:" + obj.op_doctor_name;
							box += "&ensp;科別:" + obj.div_name + "</span><hr/>";
														
							//alert(index + ":" + obj);
						});
						
					} else {
						ajaxErrMsg = dataOP[0].errorMessage;
					}
					
					if (dataXray[0].status == "Success") {
						$.each(dataXray[0].resultSet, function(index, obj) {
							if(index == "summary"){
								//alert(obj);
								box += '<div class="right">'
								box += '<button class="btn btn-primary" onclick="callXray(' + "'date'" +' )"><img alt="影像" src="/FangEmrServices/img/24_xray.png"> 影像 <span class="badge">' + obj +'</span></button>';
							}else{
								$.each(obj, function(index, obj_d){
									box += '&nbsp;<button class="btn btn-primary" onclick="callXray(' + "'date',\'" + obj_d.cat_type + "\'" +')"><img alt="影像" src="/FangEmrServices/img/24_xray.png"> ' + obj_d.cat_name +' <span class="badge">' + obj_d.count +'</span></button>';
								});
							}
							box += '</div>'
							//alert(index + ":" + obj);
						});
						box += '<hr/>';
					} else {
						ajaxErrMsg = dataXray[0].errorMessage;
					}			
					
					if (dataLab[0].status == "Success") {
						$.each(dataLab[0].resultSet, function(index, obj) {
							if(index == "summary"){
								//alert(obj);
								box += '<div class="right">'
								box += '<button class="btn btn-primary btn-lab" onclick="callLab(' + "'date'" +' )"><img alt="檢驗" src="/FangEmrServices/img/24_lab.png">檢驗 <span class="badge">' + obj +'</span></button>';								

							}else{
								$.each(obj, function(index, obj_d){
									box += '&nbsp;<button class="btn btn-primary btn-lab" onclick="callLab(' + "'date',\'" + obj_d.kind_id + "\'" +' )"><img alt="檢驗" src="/FangEmrServices/img/24_lab.png">' + obj_d.report_subtitle +' <span class="badge">' + obj_d.count +'</span></button>';
								});
							}
							box += '</div>'
							//alert(index + ":" + obj);
							
						});
						box += '<hr/>';
					} else {
						ajaxErrMsg = dataLab[0].errorMessage;
					}
					
					
					
//					//測試加上細菌報告 button count ↓ 測試完成記得刪除
//					box += '<hr/>';
//					box += '<button class="btn btn-primary btn-lab" onclick="callGerm(' + "'date'" +' )">細菌 <span class="badge">' + "0" +'</span></button>';
//					//--- 測試完成記得刪除---↑
					
					$("#time_" + index).children().html(box).hide().fadeIn();
				});
		
	})
		
	$("#time_" + index).on('shown.bs.collapse', function () {	
	    //	   	    
	});
	
	$("#time_" + index).on('hidden.bs.collapse', function () {
//	    $(this).prev().find(".glyphicon-menu-up").removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
	    $(this).prev().find(".menu-up").removeClass('menu-up').addClass('menu-down').attr("src","/FangEmrServices/img/24_close.png");;

	});
	//binding event End
}

function ajax_getLabCountByChartNoDateRangeGroupByKind() {	//抓檢驗 日期區間
	return $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getLabCountByChartNoDateRangeGroupByKind"),
		dataType : "json"
	});
}

function ajax_getLabCountByChartNoYearsGroupByKind() {	//抓檢驗 年
	return $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getLabCountByChartNoYearsGroupByKind"),
		dataType : "json"
	});
}

function ajax_getLabCountByChartNoGroupByKind(){  //抓檢驗 全部
	return $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getLabCountByChartNoGroupByKind"),
		dataType : "json"
	});
}

function ajax_getLabListByChartNo(range){	//抓檢驗清單
	if(range =="All"){
		return $.ajax({
			method : "POST",
			url : ajax_url(1),
			data : getAjaxData("getLabListByChartNo"),
			dataType : "json"
		});		
	}else if(range =="Year"){
		return $.ajax({
			method : "POST",
			url : ajax_url(1),
			data : getAjaxData("getLabListByChartNoYears"),
			dataType : "json"
		});	
	}else if(range == "Date"){		//用日期
		return $.ajax({
			method : "POST",
			url : ajax_url(1),
			data : getAjaxData("getLabListByChartNoDateRange"),
			dataType : "json"
		});	
	}		
}


function ajax_getPatOPDataByChartNoDateRange(viewType) {	//抓手術
	if(viewType == "OPD"){	//抓門診
	return $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getPatopdOPDataByChartNoDateRange"),
		dataType : "json"
	});
	}else if(viewType == "INP"){ //抓住院
		return $.ajax({			
			method : "POST",
			url : ajax_url(1),
			data : getAjaxData("getPatinpOPDataByChartNoDateRange"),
			dataType : "json"
		});
	}
}

function ajax_getXrayCountByChartNoDateRangeGroupByType() {	//抓影像 日期區間
	return $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getXrayCountByChartNoDateRangeGroupByType"),
		dataType : "json"
	});
}

function ajax_getXrayCountByChartNoYearsGroupByType() {	//抓影像 年
	return $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getXrayCountByChartNoYearsGroupByType"),
		dataType : "json"
	});
}

function ajax_getXrayCountByChartNoGroupByType() {	//抓影像 全部
	return $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getXrayCountByChartNoGroupByType"),
		dataType : "json"
	});
}

function ajax_getXrayListByChartNo(range){	//抓影像清單
	if(range =="All"){
		return $.ajax({
			method : "POST",
			url : ajax_url(1),
			data : getAjaxData("getXrayListByChartNo"),
			dataType : "json"
		});		
	}else if(range =="Year"){
		return $.ajax({
			method : "POST",
			url : ajax_url(1),
			data : getAjaxData("getXrayListByChartNoYears"),
			dataType : "json"
		});	
	}else if(range == "Date"){		//用日期
		return $.ajax({
			method : "POST",
			url : ajax_url(1),
			data : getAjaxData("getXrayListByChartNoDateRange"),
			dataType : "json"
		});	
	}		
}


function ajax_getPatSummaryByChartNoDateRange(viewType){	//抓門急資料/住院資料 by one ViewList
	if(viewType == "OPD"){
		return $.ajax({
			method : "POST",
			url : ajax_url(1),
			data : getAjaxData("getPatopdSummaryByChartNoDateRange"),
			dataType : "json"
		});
	}else{
		return $.ajax({
			method : "POST",
			url : ajax_url(1),
			data : getAjaxData("getPatinpSummaryByChartNoSerno"),
			dataType : "json"
		});
	}
	
}

/**1070418 add 抓 PASViewer's URL    **/
var ajax_getPASViewerURL = function(serviceName){	

	var pasViewerParam =  new PacsSettingInputObj(UserObj.emp_no,UserObj.session_id,"getPacsSetting");	
	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(pasViewerParam))).done(
				function(data) {
					if (data.status == "Success") {
					    var pacsURL = data.resultSet.pacs_server_ip;
					    var pacsCompany =  data.resultSet.pacs_company;
					    var web_call_string = data.resultSet.client_call_string;//院方使用 client_call_string
//					    getQueryVariable("idNo");
//					    getQueryVariable("password");
//					    localStorage.setItem(name,value);
//					    localStorage.getItem(name);
//					    console.log("pacsURL= "+pacsURL+" ;Company= "+pacsCompany);
					    
					    var httpIndex = web_call_string.indexOf("http://"); //回傳 位置
						var PASURL = web_call_string.substring(httpIndex, (web_call_string.length));
					    
					    window.localStorage.setItem("pacsURL",PASURL);  //setItem
					    PacsViewObj.url = PASURL;
					    
//					    PacsViewObj.url = "http://"+pacsURL+"+"+PacsViewObj.idNo+"+"+PacsViewObj.password+"++S+";
//					    console.log(PacsViewObj.url+";pacsCompany=>"+pacsCompany);
		
					} else {
						var ajaxErrMsg = data.errorMessage;	
						
					}		

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
};










