/**
 * 住院畫面 專用 js檔
 * InpListHead 加上 extraBtn
 */

var InpObj = { // 手術物件
	InpYear : 5,
	InpSDate:"",
	InpEDate:"",
	viewType: "",
	serno:0
		
};

var inpPageName = "inpPage";

var outNoteIndex=0;
var Index = 0;

function renderInp(){
			
	$(document).on('change', '#InpYear', function(event) {
		if ($(this).val().length > 0 && years_regex.test($(this).val())) { // 驗證回傳值
			stateChange(true, '#InpYear');
			InpObj.InpYear = $(this).val();
			//showLoading();
			InpListByYear();	
		} else {
			stateChange(false, '#InpYear', "請輸入1-100之間");
		}
	});
	
//	$(document).on('click', '#extraInp', function(event) {
//		extraOutNoteContent();
//	});
 	
 	
 	

	
}

var EMROutNoteInputObj = function(empNo,sessionID,chartNo,serno,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.serno = serno;
	this.method = method;
};

// OutNoteService
//ajax_getOutNoteData("OutNoteService",chartNo,serno);
var ajax_getOutNoteData = function(serviceName,chartNo,serno){
	//點 出院病摘時 先刪除 入院病摘的暫留資料	
	clearAdmissionData();
	clearGridData("InpAdmissionList");//清除入院病摘 清單
	

	var OutNoteArray = [];
	
	var outNoteParam = new EMROutNoteInputObj(UserObj.emp_no,UserObj.session_id,chartNo,serno,"getOutnoteListByChartNoSerno");
	
	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(outNoteParam))).done(
				function(data) {
					if (data.status == "Success") {
//						showLoading();
						$.each(data.resultSet, function(index, obj) {		
//							render_getOutNote(index, obj);
							OutNoteArray.push(obj);											
								});	
				
						jqGrid_InpOutNoteList("#InpOutNoteList","#InpOutNoteList_Pager",OutNoteArray);
						
					} else {
						var ajaxErrMsg = data.errorMessage;	
						 if(ajaxErrMsg.includes('No Data Found')){
							alert("查無資料"); 
							clearOutNoteData();
							noDataFound(ajaxErrMsg,"InpOutNoteList");
							//清空資料
						  }
					}
					hideLoading();
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
};

// 入院病摘 ajax 
//AdmissionService
//ajax_getAdmissionData("AdmissionService",chartNo,serno);
var ajax_getAdmissionData = function(serviceName,chartNo,serno){
	
	//點 入院病摘時 先刪除 出院病摘的暫存資料
	clearOutNoteData();
	clearGridData("InpOutNoteList");//清除出院病摘清單
	var AdmissionArray = [];
	var admiParam = new EMROutNoteInputObj(UserObj.emp_no,UserObj.session_id,chartNo,serno,"getAdmissionListByChartNoSerno");
	
	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(admiParam))).done(
				function(data) {
					if (data.status == "Success") {
//						showLoading();
						$.each(data.resultSet, function(index, obj) {		
//							render_getAdmission(index, obj);
							AdmissionArray.push(obj);									
								});
				
							jqGrid_InpAdmissionList("#InpAdmissionList","#InpAdmissionList_Pager",AdmissionArray);
				
						
						
					} else {
						var ajaxErrMsg = data.errorMessage;	
						 if(ajaxErrMsg.includes('No Data Found')){
							alert("查無資料"); 
							clearAdmissionData();
							noDataFound(ajaxErrMsg,"InpAdmissionList");
							//清空資料
						  }
					}
					
					
					
					hideLoading();
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
};



//serviceName = PatinpService
var ajax_getInpListData = function(flag,serviceName,InpYear){
	clearGridData("InpAdmissionList");//清除入院病摘 清單
    clearGridData("InpOutNoteList");//清除出院病摘清單
	showLoading();
	var InpArray = [];
	if(flag=="year"){
		var cmParam = new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,InpYear,"getPatinpListByChartNoYears");	
	}else if(flag=="date"){
		var cmParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,InpObj.InpSDate,InpObj.InpEDate,"getPatinpListByChartNoDateRange");
	}else{
		var cmParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getPatinpListByChartNo");
	}
	
	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(data) {
					if (data.status == "Success") {
						
						if(data.resultSet.length==0&&flag=="year"){
						$('#InpMasterYear').html(InpYear + '年住院&nbsp;<span class="badge">'+ 0 + '</span>');
						}else if (data.resultSet.length==0&&flag=="date"){
						$('#InpMasterDate').html('住院&nbsp;<span class="badge">'+ 0 + '</span>');
						}else{
							$.each(data.resultSet, function(index, obj) {		
								InpArray.push(obj);
								 if(flag=="year"){
								  $('#InpMasterYear').html(InpYear + '年住院&nbsp;<span class="badge">'+ data.resultSet.length + '</span>');
								 }else if(flag=="date"){
								  $('#InpMasterDate').html('住院&nbsp;<span class="badge">'+ data.resultSet.length + '</span>'); 
								 }											
								});	
						}
						
						if(data.resultSet.length==0){
							 clearGridData("InpAdmissionList");//清除入院病摘 清單
						     clearGridData("InpOutNoteList");//清除出院病摘清單
						}
						
						
					} else {
						ajaxErrMsg = data.errorMessage;
						 if(flag=="year"){
					     $('#InpMasterYear').html(InpYear + '年住院&nbsp;<span class="badge">'+ 0 + '</span>');
						}else if(flag=="date"){
						 $('#InpMasterDate').html('住院&nbsp;<span class="badge">'+ 0 + '</span>'); 	
						}
						 noDataFound(ajaxErrMsg,"InpList");
						 
					}	

					jqGrid_InpList("#InpList","#InpList_Pager",InpArray);
					hideLoading();
					setPageVisible("inpPage", true);
					popUpPageFixPos("inpPage");		
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
	
};



var callInp = function(flag){
	clearOutNoteData();
	clearAdmissionData();
	clearGridData("InpAdmissionList");//清除入院病摘 清單
	clearGridData("InpOutNoteList");//清除出院病摘清單
	$("#InpOutNoteContent").show();
	$("#InpAdmissionContent").hide();
	InpObj.InpYear  = PatObj.recentYear;
	InpObj.InpSDate = ViewListObj.sdate;
	InpObj.InpEDate = ViewListObj.edate;
	InpObj.viewType = ViewListObj.viewType;
	InpObj.serno = ViewListObj.serno;
	var extraBtn = "";
//	extraBtn += '<div class="pull-right"><button style="display:none;"  type="button" id="extraInp" class="btn btn-link btn-popUp" onclick="justPopUp(this)"><span class="glyphicon glyphicon-new-window"></span></button></div>';
	extraBtn += '<div class="pull-right"><button  type="button" id="extraInp" class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
	$("#InpListHead").html("病患: "+PatObj.pt_name+"  "+PatObj.chart_no +"  "+PatObj.sex_name+"  "+ PatObj.age+" 歲 " +extraBtn);

	
	 if(flag =="year"){
		   $('#InpMasterDate').hide();			
			InpListByYear();
		}else if(flag=="date"){
			document.getElementById('InpMasterDate').setAttribute("title",InpObj.InpSDate+"-"+InpObj.InpEDate);
			InpListByDate();
			$('#InpMasterDate').show();
			
		}else if(flag=="outnote"){ //出院病摘 從首頁點擊
			document.getElementById('InpMasterDate').setAttribute("title",InpObj.InpSDate+"-"+InpObj.InpEDate);
			InpListByDate();
			$('#InpMasterDate').show();
			showOutNoteBtnClick(PatObj.chart_no,InpObj.serno,InpObj.InpSDate,InpObj.InpEDate);
			
		}else if(flag=="admission"){ //入院病摘  從首頁點擊
			document.getElementById('InpMasterDate').setAttribute("title",InpObj.InpSDate+"-"+InpObj.InpEDate);
			InpListByDate();
			$('#InpMasterDate').show();
			showAdmissionBtnClick(PatObj.chart_no,InpObj.serno,InpObj.InpSDate,InpObj.InpEDate);
			
		//從住院紀錄點過來的 入院病摘
		}else if(flag=="inpRecordAdmission"){
		    InpObj.serno = $("#inpRecordSerno").html();		    
			InpObj.InpSDate = $("#inpRecordStartDate").html();
	 		InpObj.InpEDate = $("#inpRecordEndDate").html();
	 		document.getElementById('InpMasterDate').setAttribute("title",InpObj.InpSDate+"-"+InpObj.InpEDate);
			InpListByDate();
			$('#InpMasterDate').show();
			showAdmissionBtnClick(PatObj.chart_no,InpObj.serno,InpObj.InpSDate,InpObj.InpEDate);
	 		
		//從住院紀錄點過來的 出院病摘	
		}else if(flag=="inpRecordOutnote"){
			InpObj.serno = $("#inpRecordSerno").html();		    
			InpObj.InpSDate = $("#inpRecordStartDate").html();
		 	InpObj.InpEDate = $("#inpRecordEndDate").html();
		 	document.getElementById('InpMasterDate').setAttribute("title",InpObj.InpSDate+"-"+InpObj.InpEDate);
			InpListByDate();
			$('#InpMasterDate').show();
			showOutNoteBtnClick(PatObj.chart_no,InpObj.serno,InpObj.InpSDate,InpObj.InpEDate);
			
		}else{			
			InpListByAll();
			$('#InpMasterDate').hide();
		}
	 
	 $('#InpYear').val(InpObj.InpYear);
	 $('#InpMasterYear').html(InpObj.InpYear + '年住院&nbsp;<span class="badge">'+ $("#yearsINP").html() + '</span>');
	 $('#InpMasterAll').find("span").html($("#allINP").html());  //先帶入全部的count值
	
}


//主頁點下 該 年 範圍 住院資料  
var InpListByYear = function(){
	clearOutNoteData();//更改年 範圍時 清空 出院病摘 暫留資料
	clearAdmissionData();//更改年 範圍時 清空 入院病摘 暫留資料
//	clearGridData("InpAdmissionList");//清除入院病摘 清單
//    clearGridData("InpOutNoteList");//清除出院病摘清單
	
	var extraBtn = "";
	extraBtn += '<div class="pull-right"><button  type="button" id="extraInp" class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
	$("#InpListHead").html("病患: "+PatObj.pt_name+"  "+PatObj.chart_no +"  "+PatObj.sex_name+"  "+ PatObj.age+" 歲 " +extraBtn);
	
//	$("#InpListHead").html("病患: "+PatObj.pt_name+"  "+PatObj.chart_no +"  "+PatObj.sex_name+"  "+ PatObj.age+"歲 ");//更改年範圍 重設標頭
	ajax_getInpListData("year","PatinpService",InpObj.InpYear);
	var title = InpObj.InpYear+"年-住院" + $('#PatInfo').text();
	$('#inpPage_Title').html(title);	//設定title內容

};

var InpListByAll = function(){
//	console.log("InpListAll");
	var title = "全部住院" + $('#PatInfo').text();
	$('#inpPage_Title').html(title);	//設定title內容
	//呼叫 該年全部 住院日期清單
	ajax_getInpListData("all","PatinpService");

};

var InpListByDate = function(){
	ajax_getInpListData("date","PatinpService");
	var title = InpObj.InpSDate + "-" +InpObj.InpEDate + "&nbsp;" + (InpObj.viewType == "OPD" ? '門急紀錄':'住院紀錄') + "-住院";
	title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;
	$('#inpPage_Title').html(title);	//設定title內容
};

//顯示出院病摘  add By IvyLin
var showOutNoteBtnClick = function(chartNo,serno,startDate,endDate){
//	 alert("資料建置中... startDate="+startDate+";endDate="+endDate);
	$("#InpOutNoteContent").show();
	$("#InpAdmissionContent").hide();
	var extraBtn = "";
//	extraBtn += '<div class="pull-right"><button style="display:none;" type="button" class="btn btn-link btn-popUp" onclick="justPopUp(this)"><span class="glyphicon glyphicon-new-window"></span></button></div>';
	extraBtn += '<div class="pull-right"><button  type="button" id="extraInp" class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
	$("#InpListHead").html(filterNull(startDate)+" - "+filterNull(endDate)+"  住院紀錄-出院病摘: 病患: "+PatObj.pt_name+"  "+PatObj.chart_no +"  "+PatObj.sex_name+"  "+ PatObj.age+"歲 " + extraBtn);
	ajax_getOutNoteData("OutNoteService",chartNo,serno);
	
	 
};

//顯示入院病摘 add By IvyLin 進行中
var showAdmissionBtnClick = function(chartNo,serno,startDate,endDate){
	$("#InpOutNoteContent").hide();
	$("#InpAdmissionContent").show();
	var extraBtn = "";
//	extraBtn += '<div class="pull-right"><button style="display:none;" type="button" class="btn btn-link btn-popUp" onclick="justPopUp(this)"><span class="glyphicon glyphicon-new-window"></span></button></div>';
	extraBtn += '<div class="pull-right"><button  type="button" id="extraInp" class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
	$("#InpListHead").html(filterNull(startDate)+" - "+filterNull(endDate)+"  住院紀錄-入院病摘: 病患: "+PatObj.pt_name+"  "+PatObj.chart_no +"  "+PatObj.sex_name+"  "+ PatObj.age+"歲 " +extraBtn);
	ajax_getAdmissionData("AdmissionService",chartNo,serno);
	
};

var clearOutNoteData = function(){
	$("#outNote_ptName").html("");//患者姓名
	$("#outNote_idNo").html("");//身分證字號
	$("#outNote_birthDate").html("");//生日	
	$("#outNoteOutName").html("");//出院時情況	
	$("#outNote_sourceName").html("");//住院來源
	

	$('#outNote_chartNo').html(""); //病歷號
	$('#outNote_serno').html(""); //住院序號
	$('#outNote_transIn').html("");//轉入醫院
	$('#outNote_mfinishDay').html("");//主治醫師完成日期
	$('#outNote_ifinishDay').html("");//住院醫師完成日期
	$('#outNote_ckinDate').html("");//入院日期
	$('#outNote_divName').html("");//主治醫師
	$('#outNote_bedNo').html("");//床位
	$('#outNoteDisDate').html("");//出院日期
	$('#outNoteInoutDay').html("");//住院天數
	$('#outNoteInDia').html("");//入院診斷
	$('#outNoteOutDia').html("");//出院診斷	
	$('#outNoteCC').html("");//主訴
	$('#outNotePH').html("");//病史
	$('#outNotePE').html("");//體檢發現	
	$('#outNoteOrDesc').html("");//手術日期
	$('#outNoteTreatment').html("");//住院治療經過
	$('#outNoteComp').html("");//合併症	
	$('#outNoteGeneraLab').html("");//一般檢查	
	$('#outNoteSpecialLab').html("");//特殊檢查
	
	$('#outNoteXrayRep').html("");//放射線報告
	$('#outNoteXrayRep2').html("");//放射線報告
	$('#outNoteXrayRep3').html("");//放射線報告
	
	$('#outNotePathologicRep').html("");//病理報告
	$('#outNoteOther').html("");//其他
	$('#outNoteOutDirec').html("");//出院指示
	$("#outNote_vsName").html("");//主治醫師
	$("#outNote_rName").html("");//住院醫師
	$("#outNote_beginDay").html("");//申報起日
	$("#outNote_endDay").html("");//申報迄日
	$("#outNote_duringDay").html("");//申報天數 


	
	
};

//轉換 出院時情況為中文
var transOutStatus = function(status){
	var outStatus="";
	
	if(status!=null||status!=""||status!=undefined){
		
		switch(status){
		case '0':
		outStatus = "其它";	
		break;
		
		case '1':
		outStatus = "治療出院";	
		break;
		
		case '2':
		outStatus = "繼續住院";
		break;
		
		case '3':
		outStatus = "改門診治療出院";
		break;
		
		case '4':
		outStatus =	"死亡";
		break;
		
		case '5':
		outStatus =	"一般自動出院";
		break;
		
		case '6':
		outStatus =	"轉院";
		break;
		
		case '7':
		outStatus =	"身份變更";
		break;
		
		case '8':
		outStatus =	"潛逃";
		break;
		
		case '9':
		outStatus =	"自殺";
		break;
		
		case 'A':
		outStatus =	"病危自動出院";
		break;
		
		case 'B':
		outStatus =	"淨死亡";
		break;
		
		case 'C':
		outStatus =	"粗死亡";	
		break;
		default:
		
		}
	}else{
		outStatus =  "";
	}
	
	return outStatus;
	
};


//轉換住院來源為中文
var transSource = function(source){
	
	var sourceName = "";
	
	if(source!=null||source!=""||source!=undefined){
		
		switch(source){
		case '1':
		sourceName = "門診住院";	
		break;
		
		case '2':
		sourceName = "急診住院";	
		break;
		
		case '3':
		sourceName = "轉院";	
		break;
		
		case '4':
		sourceName = "同一疾病14天內住院";	
		break;
		default:
		
		}
				
	}else{
		sourceName = "";
	}
	
	return sourceName;
};


//使用者點下 出院病摘清單中的某一行 後 呼叫API 取得該次出院病摘的詳細資料
function render_getOutNote(index, value) {
	$("#outNote_ptName").html(PatObj.pt_name);//患者姓名
	$("#outNote_idNo").html(PatObj.id_no);//身分證字號
	$("#outNote_birthDate").html(formatDateTime(PatObj.birth_date));//生日


	switch(index){
		case "chart_no":
		setHtml("outNote_chartNo",filterNull(value));
		break;
		
		case "serno":
		setHtml("outNote_serno",filterNull(value));
		break;
	
		case "trans_in":
		setHtml("outNote_transIn",filterNull(value));
//		setHtml("outNote_transIn",(value));
		break;
		
		case "source":
		setHtml("outNote_sourceName",transSource(value));
		break;
		
		
		
//		case "address":
//		setHtml("outNote_address",filterNull(value));
//		break;
		
		
		case "vs_complete_date":
		setHtml("outNote_mfinishDay",filterNull(formatDateTime(value)));//主治醫師完成日期
		break;
		
		case "r_complete_date":
		setHtml("outNote_ifinishDay",filterNull(formatDateTime(value)));//住院醫師完成日期
		break;
		
		case "ckin_date":
		setHtml("outNote_ckinDate",filterNull(formatDateTime(value)));//入院日期
		break;
			
		case "div_name":
		setHtml("outNote_divName",filterNull(value));//主治醫師
		break;
		
		case "bed_no":
		setHtml("outNote_bedNo",filterNull(value));//床位
		break;
		
		case "discharge_date":
		setHtml("outNoteDisDate",filterNull(formatDateTime(value)));//出院日期
		break;
			
		case "inout_day":
		setHtml("outNoteInoutDay",filterNull(value));//住院天數
		break;
			
		case "out_status":
		setHtml("outNoteOutName",transOutStatus(filterNull(value)));//出院時情況
		break;
			
		case "in_diagnosis":
			setHtml("outNoteInDia",filterNull(value));//入院診斷
		break;
			
		case "out_diagnosis":
		setHtml("outNoteOutDia",filterNull(value));//出院診斷
		break;
		
		case "cc":
		setHtml("outNoteCC",filterNull(value));//主訴
		break;
			
		case "ph":
		setHtml("outNotePH",filterNull(value));//病史
		break;
			
//		case "ph1":
//		setHtml("outNotePH1",filterNull(value));
//		break;
			
		case "pe":
		setHtml("outNotePE",filterNull(value));//體檢發現
		break;
		
		case "or_desc":
		setHtml("outNoteOrDesc",filterNull(value));//手術日期
		break;
			
		case "treatment":
		setHtml("outNoteTreatment",filterNull(value));//住院治療經過
		break;
			
		case "complication":
		setHtml("outNoteComp",filterNull(value));//合併症
		break;
			
		case "general_lab":
		setHtml("outNoteGeneraLab",filterNull(value));//一般檢查
		break;
			
		case "special_lab":
		setHtml("outNoteSpecialLab",filterNull(value));//特殊檢查
		break;

		case "xray_rep":
		setHtml("outNoteXrayRep",filterNull(value));//放射線報告
		break;
		
		case "xray_rep2":
		setHtml("outNoteXrayRep2",filterNull(value));//放射線報告2
		break;
			
		case "xray_rep3":
		setHtml("outNoteXrayRep3",filterNull(value));//放射線報告3
		break;
			
		case "pathologic_rep":
		setHtml("outNotePathologicRep",filterNull(value));//病理報告
		break;
			
		case "other":
		setHtml("outNoteOther",filterNull(value));//其他
		break;
			
		case "out_directory":
		setHtml("outNoteOutDirec",filterNull(value));//出院指示
		break;	
		
		case "vs_name":
		setHtml("outNote_vsName",filterNull(value));//主治醫師
		break;
		
		case "r_name":
		setHtml("outNote_rName",filterNull(value));//住院醫師
		break;
		
		case "begin_date":
		setHtml("outNote_beginDay",filterNull(formatDateTime(value)));//申報起日
		break;
		
		case "end_date":
		setHtml("outNote_endDay",filterNull(formatDateTime(value)));//申報迄日
		break;
		
//		case "end_date":
//		setHtml("outNote_endDay",filterNull(value));//申報天數
//		break;
		
		
			
default:
break;
			
	}
}

//入院病摘資料


//入院病摘 1070208

//使用者點下 出院病摘清單中的某一行 後 呼叫API 取得該次出院病摘的詳細資料
function render_getAdmission(index, value) {
	$("#admin_ptName").html(PatObj.pt_name);//患者姓名
	$("#admin_birthDate").html(formatDateTime(PatObj.birth_date));//生日


	switch(index){
		case "chart_no":
		setHtml("admin_chartNo",filterNull(value));
		break;
		
		case "serno":
		setHtml("admin_serno",filterNull(value));
		break;
	
		
		case "ckin_date":
		setHtml("admin_ckinDate",filterNull(formatDateTime(value)));//住院日期
		break;
			
		case "div_name":
		setHtml("admin_divName",filterNull(value));//科別
		break;
		
		case "bed_no":
		setHtml("admin_bedNo",filterNull(value));//床位
		break;
		
		case "vs_name":
		setHtml("admin_vsName",filterNull(value));//主治醫師
		break;
							
		case "complaint":
		setHtml("adminComplaint",filterNull(value));//主訴
		break;
			
		case "path_h":
		setHtml("adminPathH",filterNull(value));//過去史
		break;
		
		case "system_review":
		setHtml("adminSystemReview",filterNull(value));//系統檢閱
		break;				
			
		case "charth":
		setHtml("adminCharth",filterNull(value));//病史
		break;
			
			
		case "diagnosis":
		setHtml("adminDiagnosis",filterNull(value));//理學檢查摘要
		break;
		
		case "diagnosis_o":
		setHtml("adminDiagnosisO",filterNull(value));//診斷
		break;
			
		case "labdata":
		setHtml("adminLabData",filterNull(value));//檢驗檢查
		break;
			
		case "plan":
		setHtml("adminPlan",filterNull(value));//計畫
		break;
			
		default:
        break;
			
	}
}



//清空 入院病摘 暫存資料 (尚未修改完)
var clearAdmissionData = function(){
	$("#admin_chartNo").html("");//病歷號
	$("#admin_serno").html("");//住院序號	
	$("#admin_bedNo").html("");//床位	
	$("#admin_ptName").html("");//姓名	
	$("#admin_birthDate").html("");//生日
	$('#admin_ckinDate').html(""); //住院日期	
	$('#admin_divName').html(""); //科別	
	$('#admin_vsName').html("");//主治醫師	
	$('#adminComplaint').html("");//主訴	
	$('#adminPathH').html("");//過去史		
	$('#adminSystemReview').html("");//系統檢閱	
	$('#adminCharth').html("");//病史	
	$('#adminDiagnosis').html("");//理學檢查摘要	
	$('#adminDiagnosisO').html("");//診斷	
	$('#adminLabData').html("");//檢驗檢查	
	$('#adminPlan').html("");//計劃
		
	
};

//住院清單
function jqGrid_InpList(tableName,pagerName,dataArray){		
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 220,
	    colModel: [
	        { label: '病歷號', name: 'chart_no', width: 90,hidden:true },
	        { label: '住院序號', name: 'serno', width: 90,hidden:true },
	        { label: '年份', name: 'start_date', width: 45,formatter:function(cellvalue, options, rowobject){
	        	return cellvalue.substr(0, 3);
	        } },	        
	        //合併欄位 住院期間(start-end) 住院期間 end_date有可能會是null 需用 filterNull 方法去過濾 null值
		    { label: '住院期間', name: 'start_date' ,width: 180,formatter:function(cellvalue, options, rowobject){	    		    	
		    	return "<span class=''>"+cellvalue + "</span> - " +
		    	"<span class=''>"+filterNull(rowobject.end_date) + "</span>";
		    }},
	        { label: '主因', name: 'code_name_c', width: 250 },//title2->code_name_c  title1->code_name_e
	        { label: '主治醫師', name: 'doctor_name', width: 90 },
	        { label: '科別', name: 'div_name', width: 120 },
	        { label: '入院病摘', name: 'disease_code', width: 140 ,formatter: function(cellvalue, options, rowobject){
             return '<button type="button"  onclick="showAdmissionBtnClick('+"\'" + rowobject.chart_no+"\',"+"\'"+rowobject.serno+"\',"+"\'"+rowobject.start_date+"\',"+"\'"+rowobject.end_date+"\'"+');" class="btn btn-primary btn-sm ButtonfontSize">'+ "入院病摘" +' <span class="badge">' + rowobject.admission_count +'</span></button>';
	        }},
	        { label: '出院病摘', name: 'disease_code', width: 140 ,formatter: function(cellvalue, options, rowobject){

		     return '<button type="button"  onclick="showOutNoteBtnClick('+"\'" + rowobject.chart_no+"\',"+"\'"+rowobject.serno+"\',"+"\'"+rowobject.start_date+"\',"+"\'"+rowobject.end_date+"\'"+');" class="btn btn-primary btn-sm ButtonfontSize">'+ "出院病摘" +' <span class="badge">' + rowobject.outnote_count +'</span></button>';
	        }},
	      
	        
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
//	    scroll :true, //隨著滾輪改變頁數
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	
        },
        width: null,
        rowNum: Math.floor((pageHeight - 220)/33),
	    shrinkToFit:false,
	    sortable: false,
//	    loadtext:"資料載入中...",
		pager: pagerName,
		pagerpos:'left',
		loadComplete : function () {
//			$(this).jqGrid('setSelection', 1, true);
		}
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: dataArray});
	$(tableName).trigger('reloadGrid');
	//$("#XrayList").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	
	function getSelectedRow() {
		
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    if (rowKey){
	    	//alert($('#XrayList').jqGrid('getCell',rowKey,'cat_name'));
//	    	$('#XrayListHead').html($(tableName).jqGrid('getCell',rowKey,'view_date') + " " + $('#XrayList').jqGrid('getCell',rowKey,'cat_name') + " 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age)
//	    	$('#XrayListBody').html(rowKey);
//	    	$('#xray_ReportDate').html(date_format($(tableName).jqGrid('getCell',rowKey,'view_date'))); //報告日期
//	    	$('#xray_ReportMan').html(); //報告人員
//	    	$('#xray_ReportType').html();//X光類別
	    		    		    
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}
}

/**入院病摘 清單  1070503 add
 * 
 * jqGrid_InpAdmissionList("#InpAdmissionList","#InpAdmissionList_Pager",);
 * ****/
function jqGrid_InpAdmissionList(tableName,pagerName,dataArray){		
	$(tableName).jqGrid({
	    datatype: "local",
	    height: userHeight - (800),
	    colModel: [
	        { label: '病歷號', name: 'chart_no', width: 90,hidden:false},
	        { label: '住院序號', name: 'serno', width: 90,hidden:false },	      
	        { label: '住院日期', name: 'ckin_date', width: 120 },
	        { label: '主治醫師', name: 'vs_name', width: 90 },
	        { label: '科別', name: 'div_name', width: 150 },	        
	        { label: 'bed_no', name: 'bed_no', width: 90,hidden:true },
	        { label: 'complaint', name: 'complaint', width: 90,hidden:true },
	        { label: 'path_h', name: 'path_h', width: 90,hidden:true },
	        { label: 'system_review', name: 'system_review', width: 90,hidden:true },
	        { label: 'charth', name: 'charth', width: 90,hidden:true },
	        { label: 'diagnosis', name: 'diagnosis', width: 90,hidden:true },
	        { label: 'diagnosis_o', name: 'diagnosis_o', width: 90,hidden:true },
	        { label: 'labdata', name: 'labdata', width: 90,hidden:true },
	        { label: 'plan', name: 'plan', width: 90,hidden:true },

	        
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
//	    scroll :true, //隨著滾輪改變頁數
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	
        },
        width: null,
        rowNum : 5000,
	    shrinkToFit:false,
	    sortable: false,
//		pager: pagerName,
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
	    if (rowKey){
	    	
	    	var chart_no =  $(tableName).jqGrid('getCell',rowKey,'chart_no');
	    	var serno =  $(tableName).jqGrid('getCell',rowKey,'serno');
	    	var ckin_date = $(tableName).jqGrid('getCell',rowKey,'ckin_date');
	    	var div_name =  $(tableName).jqGrid('getCell',rowKey,'div_name');
	    	var bed_no = $(tableName).jqGrid('getCell',rowKey,'bed_no');
	    	var vs_name = $(tableName).jqGrid('getCell',rowKey,'vs_name');
	    	var complaint =  $(tableName).jqGrid('getCell',rowKey,'complaint');
	    	var path_h =  $(tableName).jqGrid('getCell',rowKey,'path_h');
	    	var system_review =  $(tableName).jqGrid('getCell',rowKey,'system_review');
	    	var charth =  $(tableName).jqGrid('getCell',rowKey,'charth');
	    	var diagnosis =  $(tableName).jqGrid('getCell',rowKey,'diagnosis');
	    	var diagnosis_o =  $(tableName).jqGrid('getCell',rowKey,'diagnosis_o');
	    	var labdata =  $(tableName).jqGrid('getCell',rowKey,'labdata');
	    	var plan =  $(tableName).jqGrid('getCell',rowKey,'plan');
	    	
	    	$("#admin_ptName").html(PatObj.pt_name);//患者姓名
	    	$("#admin_birthDate").html(formatDateTime(PatObj.birth_date));//生日
	    	
	    	setHtml("admin_chartNo",filterNull(chart_no));
	    	setHtml("admin_serno",filterNull(serno));
	    	setHtml("admin_ckinDate",filterNull(formatDateTime(ckin_date)));//住院日期
	    	setHtml("admin_divName",filterNull(div_name));//科別
	    	setHtml("admin_bedNo",filterNull(bed_no));//床位
	    	setHtml("admin_vsName",filterNull(vs_name));//主治醫師
	    	setHtml("adminComplaint",filterNull(complaint));//主訴
	    	setHtml("adminPathH",filterNull(path_h));//過去史
	    	setHtml("adminSystemReview",filterNull(system_review));//系統檢閱
			setHtml("adminCharth",filterNull(charth));//病史
			setHtml("adminDiagnosis",filterNull(diagnosis));//理學檢查摘要
			setHtml("adminDiagnosisO",filterNull(diagnosis_o));//診斷
			setHtml("adminLabData",filterNull(labdata));//檢驗檢查
			setHtml("adminPlan",filterNull(plan));//計畫
			
    		    
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}
}

//
/**出院病摘清單 1070503 add
 * 
 * 
 * ****/
function jqGrid_InpOutNoteList(tableName,pagerName,dataArray){		
	$(tableName).jqGrid({
	    datatype: "local",
	    height: userHeight - (800),
	    colModel: [
	        { label: '病歷號', name: 'chart_no', width: 90,hidden:false},
	        { label: '住院序號', name: 'serno', width: 90,hidden:false },	      
	        { label: '住院日期', name: 'ckin_date', width: 120 },
	        { label: '出院日期', name: 'discharge_date', width: 90,hidden:false },
	        { label: '主治醫師', name: 'vs_name', width: 90 },
	        { label: '科別', name: 'div_name', width: 150 },	         
	        { label: 'trans_in', name: 'trans_in', width: 90,hidden:true },
	        { label: 'source', name: 'source', width: 90,hidden:true },
	        { label: 'vs_complete_date', name: 'vs_complete_date', width: 90,hidden:true },
	        { label: 'r_complete_date', name: 'r_complete_date', width: 90,hidden:true },
	        { label: 'inout_day', name: 'inout_day', width: 90,hidden:true },
	        { label: 'bed_no', name: 'bed_no', width: 90,hidden:true },	        
	        { label: 'out_status', name: 'out_status', width: 90,hidden:true },
	        { label: 'in_diagnosis', name: 'in_diagnosis', width: 90,hidden:true },
	        { label: 'out_diagnosis', name: 'out_diagnosis', width: 90,hidden:true },
	        { label: 'cc', name: 'cc', width: 90,hidden:true },
	        { label: 'ph', name: 'ph', width: 90,hidden:true },
	        { label: 'pe', name: 'pe', width: 90,hidden:true },
	        { label: 'or_desc', name: 'or_desc', width: 90,hidden:true },
	        { label: 'treatment', name: 'treatment', width: 90,hidden:true },	        
	        { label: 'complication', name: 'complication', width: 90,hidden:true },
	        { label: 'general_lab', name: 'general_lab', width: 90,hidden:true },	        
	        { label: 'special_lab', name: 'special_lab', width: 90,hidden:true },	        
	        { label: 'xray_rep', name: 'xray_rep', width: 90,hidden:true },
	        { label: 'xray_rep2', name: 'xray_rep2', width: 90,hidden:true },
	        { label: 'xray_rep3', name: 'xray_rep3', width: 90,hidden:true },
	        { label: 'pathologic_rep', name: 'pathologic_rep', width: 90,hidden:true },
	        { label: 'other', name: 'other', width: 90,hidden:true },
	        { label: 'out_directory', name: 'out_directory', width: 90,hidden:true },	        
	        { label: 'r_name', name: 'r_name', width: 90,hidden:true },
	        { label: 'begin_date', name: 'begin_date', width: 90,hidden:true },
	        { label: 'end_date', name: 'end_date', width: 90,hidden:true },
	        
	       
//	        trans_in
	        
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
//	    scroll :true, //隨著滾輪改變頁數
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	
        },
        width: null,
        rowNum : 5000,
	    shrinkToFit:false,
	    sortable: false,
//		pager: pagerName,
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
	    if (rowKey){

	    	var chart_no =  $(tableName).jqGrid('getCell',rowKey,'chart_no');
	    	var serno =  $(tableName).jqGrid('getCell',rowKey,'serno');
	    	var trans_in = $(tableName).jqGrid('getCell',rowKey,'trans_in');
	    	var source = $(tableName).jqGrid('getCell',rowKey,'source');
	    	var vs_complete_date = $(tableName).jqGrid('getCell',rowKey,'vs_complete_date');
	    	var r_complete_date = $(tableName).jqGrid('getCell',rowKey,'r_complete_date');
	    	var ckin_date = $(tableName).jqGrid('getCell',rowKey,'ckin_date');
	    	var div_name =  $(tableName).jqGrid('getCell',rowKey,'div_name');	    	
	    	var bed_no = $(tableName).jqGrid('getCell',rowKey,'bed_no');
	    	var discharge_date = $(tableName).jqGrid('getCell',rowKey,'discharge_date');
	    	var inout_day = $(tableName).jqGrid('getCell',rowKey,'inout_day');
	    	var out_status = $(tableName).jqGrid('getCell',rowKey,'out_status');
	    	var in_diagnosis = $(tableName).jqGrid('getCell',rowKey,'in_diagnosis');
	    	var out_diagnosis = $(tableName).jqGrid('getCell',rowKey,'out_diagnosis');
	    	var cc = $(tableName).jqGrid('getCell',rowKey,'cc');
	    	var ph = $(tableName).jqGrid('getCell',rowKey,'ph');	    	
	    	var pe = $(tableName).jqGrid('getCell',rowKey,'pe');	    	
	    	var or_desc = $(tableName).jqGrid('getCell',rowKey,'or_desc');
	    	

	    	var treatment = $(tableName).jqGrid('getCell',rowKey,'treatment');
	    	var complication = $(tableName).jqGrid('getCell',rowKey,'complication');	    	
	    	var general_lab = $(tableName).jqGrid('getCell',rowKey,'general_lab');	    	
	    	var special_lab = $(tableName).jqGrid('getCell',rowKey,'special_lab');	    	
	    	var xray_rep = $(tableName).jqGrid('getCell',rowKey,'xray_rep');	    	
	    	var xray_rep2 = $(tableName).jqGrid('getCell',rowKey,'xray_rep2');	    	
	    	var xray_rep3 = $(tableName).jqGrid('getCell',rowKey,'xray_rep3');	    	
	    	var pathologic_rep = $(tableName).jqGrid('getCell',rowKey,'pathologic_rep');	    	
	    	var other = $(tableName).jqGrid('getCell',rowKey,'other');    	
	    	var out_directory = $(tableName).jqGrid('getCell',rowKey,'out_directory');	    	
	    	var vs_name = $(tableName).jqGrid('getCell',rowKey,'vs_name');	    	
	    	var r_name = $(tableName).jqGrid('getCell',rowKey,'r_name');	    	
	    	var begin_date = $(tableName).jqGrid('getCell',rowKey,'begin_date');
	    	var end_date = $(tableName).jqGrid('getCell',rowKey,'end_date');
	    	
	    	
	    	$("#outNote_ptName").html(PatObj.pt_name);//患者姓名
	    	$("#outNote_idNo").html(PatObj.id_no);//身分證字號
	    	$("#outNote_birthDate").html(formatDateTime(PatObj.birth_date));//生日
	    	
	    	setHtml("outNote_chartNo",filterNull(chart_no));
	    	setHtml("outNote_serno",filterNull(serno));
			setHtml("outNote_transIn",filterNull(trans_in));
			setHtml("outNote_sourceName",transSource(source));
			setHtml("outNote_mfinishDay",filterNull(formatDateTime(vs_complete_date)));//主治醫師完成日期
			setHtml("outNote_ifinishDay",filterNull(formatDateTime(r_complete_date)));//住院醫師完成日期
			setHtml("outNote_ckinDate",filterNull(formatDateTime(ckin_date)));//入院日期
			setHtml("outNote_divName",filterNull(div_name));//主治醫師
			setHtml("outNote_bedNo",filterNull(bed_no));//床位
			setHtml("outNoteDisDate",filterNull(formatDateTime(discharge_date)));//出院日期
			setHtml("outNoteInoutDay",filterNull(inout_day));//住院天數
			setHtml("outNoteOutName",transOutStatus(filterNull(out_status)));//出院時情況
		    setHtml("outNoteInDia",filterNull(in_diagnosis));//入院診斷
			setHtml("outNoteOutDia",filterNull(out_diagnosis));//出院診斷
			setHtml("outNoteCC",filterNull(cc));//主訴
			setHtml("outNotePH",filterNull(ph));//病史
			setHtml("outNotePE",filterNull(pe));//體檢發現			
			setHtml("outNoteOrDesc",filterNull(or_desc));//手術日期
			
			
			setHtml("outNoteTreatment",filterNull(treatment));//住院治療經過
			setHtml("outNoteComp",filterNull(complication));//合併症
			setHtml("outNoteGeneraLab",filterNull(general_lab));//一般檢查
			setHtml("outNoteSpecialLab",filterNull(special_lab));//特殊檢查
			setHtml("outNoteXrayRep",filterNull(xray_rep));//放射線報告
			setHtml("outNoteXrayRep2",filterNull(xray_rep2));//放射線報告2
			setHtml("outNoteXrayRep3",filterNull(xray_rep3));//放射線報告3
			setHtml("outNotePathologicRep",filterNull(pathologic_rep));//病理報告
			setHtml("outNoteOther",filterNull(other));//其他
			setHtml("outNoteOutDirec",filterNull(out_directory));//出院指示
			setHtml("outNote_vsName",filterNull(vs_name));//主治醫師
			setHtml("outNote_rName",filterNull(r_name));//住院醫師
			setHtml("outNote_beginDay",filterNull(formatDateTime(begin_date)));//申報起日
			setHtml("outNote_endDay",filterNull(formatDateTime(end_date)));//申報迄日
    		    
	    }
	    else{
//	        alert("沒有資料被選擇");
	    }
	}
}




function duplicate(PageName,CopyFromId,HeadTitle) {
	 var parent = document.getElementById("pageContainer"); 
	 Index++;
	 PageArray.push(PageName+Index);
	 
	 var Page = document.createElement("div");
	 Page.setAttribute('class',"page");
	 Page.setAttribute('id',PageName+Index);
	 
	 var Panel = document.createElement("div");
	 Panel.setAttribute('class',"panel panel-info header");
	 Panel.setAttribute('id',PageName+"Copy"+Index);
	 
	 var contentHtml = $("#"+CopyFromId).html();
	 Panel.innerHTML=contentHtml;
//	 $("#"+PageName+"Copy"+Index).html(contentHtml);
	 console.log(contentHtml);
	 
	 
	 var SpanTitle = document.createElement("span");
	 SpanTitle.setAttribute('class',"panel panel-info header");
	 SpanTitle.setAttribute('id',PageName+Index+"_Title");
	 SpanTitle.setAttribute('style',"display:none;");
	 var heddTitle = $("#"+HeadTitle).html();
	 SpanTitle.innerHTML = heddTitle;
	 
	 var PouBtnDiv = document.createElement("div");
	 PouBtnDiv.setAttribute('class',"pull-right");
	 
	 var Btn = document.createElement("button");
	 Btn.setAttribute('class',"btn btn-link btn-popUp");
	 Btn.setAttribute('id',PageName+"btnClose");
	
//	 var copyContent = document.getElementById(CopyFromId); 
	 	
	 
	 Page.appendChild(Panel);	 
	 Panel.appendChild(SpanTitle);
	 
	 SpanTitle.appendChild(PouBtnDiv);
	 PouBtnDiv.appendChild(Btn);	
	 
	 parent.appendChild(Page);//加到主頁
	 
	
	 
//	 $("#"+CopyFromId).append($('#'+PageName+"Copy"+Index).html());
//	 $('#'+PageName+"Copy"+Index).append( $("#"+CopyFromId).innerHTML);
//	 console.log($('#'+PageName+"Copy"+Index).html());
	 
//	 console.log($("#"+CopyFromId).html());
	 var elem = document.getElementById("#"+PageName+"Copy"+Index); 
	 
	 if (typeof(elem) !== 'undefined') {
		 console.log("Exist");
	 }else{
		 console.log("NotExist");
	 }
		 
	   
	 
	    setPageVisible(PageName+Index, true);
		popUpPageFixPos(PageName+Index);
		zIndex -=1; //目的是為了要讓  inpPage 移到 住院紀錄的上層
		$('#'+PageName).css('z-index', zIndex);  
 	
 	//PageToolBar
 	$(document).on('click', '#'+PageName+Index, function(event) {
 		goTop(PageName+Index);
	});
 	
// 	extraInp
 	
 	//關閉畫面
	$(document).on('click', '#'+PageName+"btnClose", function(event) {
// 		goTop(PageName+Index);
	});
 	
 	
     
     
}



//測試 抽出 div
var extraOutNoteContent = function(){
	
	//way 3
	

	
	
	//way1
	/**var CopyId = "InpCopy";
	duplicate(inpPageName,CopyId,"InpListHead");**/
	  
//	$("#"+CopyId).clone().appendTo(inpPageName+"Copy"+Index);
	
	//way2
/**	outNoteIndex++;
	var outNoteBox ="";
	
	outNoteBox += '<div id="inpPage'+outNoteIndex+'" class="page" onclick="goTop('+"\'inpPage"+outNoteIndex+"\'"+');">';
	outNoteBox += '<div class="panel panel-info header" id="InpCopy_'+outNoteIndex+'">';
	outNoteBox += '<span style="display:none;" id="inpPage'+outNoteIndex+'_Title">'+$("#InpListHead").html()+'</span>';
	var  InpCopy = "";
	InpCopy = $('#InpCopy').html();
//	$('#InpCopy').clone().appendTo('#InpCopy_'+outNoteIndex);
	outNoteBox += InpCopy;
	outNoteBox += '</div></div>';
	
	$("#pageContainer").append(outNoteBox);//加到主頁
	PageArray.push('inpPage'+outNoteIndex);
	
	setPageVisible('inpPage'+outNoteIndex, true);
	popUpPageFixPos('inpPage'+outNoteIndex);
	zIndex -=1; //目的是為了要讓  inpPage 移到 住院紀錄的上層
	$('#inpPage').css('z-index', zIndex);  **/
	
	
	
	
	
	
};





