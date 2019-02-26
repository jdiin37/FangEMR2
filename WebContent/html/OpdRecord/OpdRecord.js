/**
 * 門急診
 */

var OpdObj = { // 影像物件
		OpdYear : 5,
		OpdSDate : "",
		OpdEDate : "",
		viewType: "",
		serno:0,
		showTitle:"",
		showKindTitle:""
	};

//var OpdRecordArray = 
//	[ {years:105,record_date:1010101,view_type:"門診",chart_no:912473,dis_cat:"570-579",name_c:"急性及亞急性肝壞死",name_e:"ACUTE AND SUBACUTE NECROSIS OF LIVER",cat_type:"B",start_date:"1051124",end_date:"1051206",cat_name:"影像",report_subtitle:"檢驗",kind_id:"A2",labCount:10,xrayCount:2},
//	  {years:105,record_date:1010102,view_type:"急診",chart_no:912473,dis_cat:"350-359",name_c:"三叉神經疾患",name_e:"TRIGEMINAL NERVE DISORDERS",cat_type:"A",start_date:"1051213",end_date:"1051217",cat_name:"影像",report_subtitle:"檢驗",kind_id:"A3",labCount:7,xrayCount:3}
//	];
	 

var OpdRecordKind;
var OpdRecordTypeName;
var OpdRange;
var OpdDetailRange;
var OpdDiseaseSumListArray;


var OpdSumDateRangeInputObj = function(empNo,sessionID,chartNo,startDate,endDate,cashType,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.startDate = startDate;
	this.endDate = endDate;
	this.cashType=cashType;
	this.method = method;
};

var OpdSumYearsInputObj = function(empNo,sessionID,chartNo,years,cashType,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.years = years;
	this.cashType = cashType;
	this.method = method;		
};


var OpdSumAllInputObj = function(empNo,sessionID,chartNo,cashType,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.cashType = cashType;
	this.method = method;
};

/**醫令彙總左側 日期範圍 / 年範圍  /全部範圍
 *  medtype 1 藥品 ; 2 處置
 * ***/
var OpdAcntDateRangeInputObj = function(empNo,sessionID,chartNo,startdate,enddate,medtype,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.startdate = startdate;
	this.enddate = enddate;
	this.medtype = medtype;
	this.method = method;
};

var OpdAcntYearsInputObj = function(empNo,sessionID,chartNo,syear,medtype,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.syear = syear;
	this.medtype = medtype;
	this.method = method;
};


var OpdAcntAllInputObj = function(empNo,sessionID,chartNo,medtype,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.medtype = medtype;
	this.method = method;
};

/**醫令彙總 右側 1070412 add ***/
var OpdAcntDetailDateRangeInputObj = function(empNo,sessionID,chartNo,startdate,enddate,code,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.startdate = startdate;
	this.enddate = enddate;
	this.code = code;
	this.method = method;
};

var OpdAcntDetailYearsInputObj = function(empNo,sessionID,chartNo,syear,code,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.syear = syear;
	this.code = code;
	this.method = method;
};


var OpdAcntDetailAllInputObj = function(empNo,sessionID,chartNo,code,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.code = code;
	this.method = method;
};

/**查詢醫藥囑 1070418 add     ***/
var OpdViewDateMedicineInputObj = function(empNo,sessionID,chartNo,viewdate,duplicateno,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.viewdate = viewdate;
	this.duplicateno = duplicateno;
	this.method = method;
};





/**主訴 理學 診斷 病史 OBJ
 * Chart1Service***/ 
//* {"empNo":"ORCL","sessionID":1,"viewDate":"1051209","chartNo":912473,"duplicateNo":1,"method":"getChart1ByPrimaryKeys"}
var OpdDARTInputObj = function(empNo,sessionID,viewDate,chartNo,duplicateNo,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.viewDate = viewDate;
	this.chartNo = chartNo;
	this.duplicateNo = duplicateNo;
	this.method = method;
};


function renderOpd(){
	
	$(document).on('change', '#OpdYear', function(event) {
		if ($(this).val().length > 0 && years_regex.test($(this).val())) { // 驗證回傳值
			stateChange(true, '#OpdYear');
			OpdObj.OpdYear = $(this).val();
			//showLoading();
			ajax_getOpdRecordInfoData('year','ALL'); //修改 1070411 cashType => ALL (全部)
		} else {
			stateChange(false, '#OpdYear', "請輸入1-100之間");
		}
	});
	
/**1070417 add 查詢該日期的醫藥囑明細**/	
	$(document).on('click', '#btn_opdSearchMedicine', function(event) {
		
		
		var grid = $("#OpdRecordList");
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    var viewDate = grid.jqGrid('getCell',rowKey,'view_date');
	    var duplicateNo = grid.jqGrid('getCell',rowKey,'duplicate_no');
	    
	    
	    if(viewDate!=undefined){
	    	
		    setPageVisible("opdMedicineDetailPage", true);
			popUpPageFixPos("opdMedicineDetailPage");
			ajax_getMedicineDetailData("OpdacntService",viewDate,duplicateNo);
			$("#opdMedicineDetailPage_Title").html(viewDate+"- 醫藥囑明細   病患:"+PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	    }


	});
	
	/**1070503 add 從疾病彙總 開啟DART 點該日期的醫藥囑明細**/	
	$(document).on('click', '#btn_opdSearchMedicine-2', function(event) {
		
		
		var grid = $("#OpdDiseaseSumDetailList");
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    var viewDate = grid.jqGrid('getCell',rowKey,'view_date');
	    var duplicateNo = grid.jqGrid('getCell',rowKey,'duplicate_no');
	    
	    
	    if(viewDate!=undefined){
	    	
		    setPageVisible("opdMedicineDetailPage", true);
			popUpPageFixPos("opdMedicineDetailPage");
			ajax_getMedicineDetailData("OpdacntService",viewDate,duplicateNo);
			$("#opdMedicineDetailPage_Title").html(viewDate+"- 醫藥囑明細   病患:"+PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	    }


	});

}



//--call OPD  門急  for 過濾疾病代碼  undefined
var callOPD = function(flag,typeName,kind,cashType){
	OpdRecordTypeName = cashType;
	OpdRecordKind = kind;
//	OpdRecordTypeName = typeName;
	$("#opdRecordPage_Title").html("門急記錄 - 病史彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	OpdObj.OpdYear = PatObj.recentYear;
	OpdObj.OpdSDate = ViewListObj.sdate;
	OpdObj.OpdEDate = ViewListObj.edate;
	OpdObj.viewType = "OPD";
	
	
	if(flag=="date"){
		$("#OpdMasterDate").show();
		$("#OpdMasterDate1").show();
		$("#OpdMasterDate2").show();
		ajax_getOpdRecordInfoData("date",typeName,cashType);
		document.getElementById('OpdMasterDate').setAttribute("title",OpdObj.OpdSDate+"-"+OpdObj.OpdEDate);
		$("#opdRecordPage_Title").html(OpdObj.OpdSDate+"-"+OpdObj.OpdEDate+" 門急記錄 - 病史彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
		OpdObj.showTitle = OpdObj.OpdSDate+"-"+OpdObj.OpdEDate+" 門急記錄 - 病史彙總";
		OpdObj.showKindTitle = OpdObj.OpdSDate+"-"+OpdObj.OpdEDate+" 門急記錄 - 病史彙總";

	}else if(flag=="year"){
		$("#OpdMasterDate").hide();
		$("#OpdMasterDate1").hide();
		$("#OpdMasterDate2").hide();
		ajax_getOpdRecordInfoData("year",typeName,cashType);
		$("#opdRecordPage_Title").html(OpdObj.OpdYear+"年 門急記錄 - 病史彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
		OpdObj.showTitle = OpdObj.OpdYear+"年 門急記錄 - 病史彙總";
		OpdObj.showKindTitle = OpdObj.OpdYear+"年 門急記錄 - 病史彙總";
	}else if(flag=="all"){
		$("#OpdMasterDate").hide();
		$("#OpdMasterDate1").hide();
		$("#OpdMasterDate2").hide();
		ajax_getOpdRecordInfoData("all",typeName,cashType);
		$("#opdRecordPage_Title").html("全部 門急記錄 - 病史彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
		OpdObj.showTitle = "全部 門急記錄 - 病史彙總";
		OpdObj.showKindTitle = "全部 門急記錄 - 病史彙總";
	}
	
	 $('#OpdYear').val(OpdObj.OpdYear);
	
}

//--call OPD  門急  for 過濾疾病代碼
var callOPDType = function(flag,typeName,kind,cashType){
	OpdRecordTypeName = cashType;
	OpdRecordKind = kind;
	$("#opdRecordPage_Title").html("門急記錄 - 病史彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
//	OpdObj.OpdYear = PatObj.recentYear;
//	OpdObj.OpdSDate = ViewListObj.sdate;
//	OpdObj.OpdEDate = ViewListObj.edate;
//	OpdObj.viewType = "OPD";
	
	if(flag=="date"){
		$("#OpdMasterDate").show();
		$("#OpdMasterDate1").show();
		$("#OpdMasterDate2").show();
		ajax_getOpdRecordInfoData("date",typeName,cashType);
		document.getElementById('OpdMasterDate').setAttribute("title",OpdObj.OpdSDate+"-"+OpdObj.OpdEDate);
		$("#opdRecordPage_Title").html(OpdObj.OpdSDate+"-"+OpdObj.OpdEDate+" 門急記錄 - 病史彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
		OpdObj.showTitle = OpdObj.OpdSDate+"-"+OpdObj.OpdEDate+" 門急記錄 - 病史彙總";
		OpdObj.showKindTitle = OpdObj.OpdSDate+"-"+OpdObj.OpdEDate+" 門急記錄 - 病史彙總";
	}else if(flag=="year"){
//		$("#OpdMasterDate").hide();
//		$("#OpdMasterDate1").hide();
//		$("#OpdMasterDate2").hide();
		$("#opdRecordPage_Title").html(OpdObj.OpdYear+"年 門急記錄 - 病史彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
		OpdObj.showTitle = OpdObj.OpdYear+"年 門急記錄 - 病史彙總";
		OpdObj.showKindTitle = OpdObj.OpdYear+"年 門急記錄 - 病史彙總";
		ajax_getOpdRecordInfoData("year",typeName,cashType);
	}else if(flag=="all"){
//		$("#OpdMasterDate").hide();
//		$("#OpdMasterDate1").hide();
//		$("#OpdMasterDate2").hide();
		$("#opdRecordPage_Title").html("全部 門急記錄 - 病史彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
		OpdObj.showTitle = "全部 門急記錄 - 病史彙總";
		OpdObj.showKindTitle = "全部 門急記錄 - 病史彙總";
		ajax_getOpdRecordInfoData("all",typeName,cashType);
	}
	
	 $('#OpdYear').val(OpdObj.OpdYear);
	
}




/**取得 門急紀錄 日期範圍/年/全部 InfoData***/	
var ajax_getOpdRecordInfoData = function(range,typeName,cashType){
	$("#OpdRecordCol").show(); //顯示門急診日期清單
	$("#OpdDiseaseSumCol").hide(); //隱藏 疾病彙總清單
	$("#OpdOrderSumCol").hide();//隱藏  醫令彙總清單
	
	
	    $("#opdRecordInfo").html(""); //先清空  門急診button資訊
		$("#OpdIcd10Name").html("");
		var OpdRecordArray=[];
		showLoading();
		//取得門急診資訊
		
		var diseaseTitle = "";
		var orderTitle = "";
		var xrayTitle = "";
		var labTitle = "";
		
		if(range=="date"){
			diseaseTitle = (OpdObj.OpdSDate)+" ~ "+(OpdObj.OpdEDate)+" 疾病彙總";
			orderTitle = (OpdObj.OpdSDate)+" ~ "+(OpdObj.OpdEDate)+" 醫令彙總";
			xrayTitle = (OpdObj.OpdSDate)+" ~ "+(OpdObj.OpdEDate)+" 影像";
			labTitle = (OpdObj.OpdSDate)+" ~ "+(OpdObj.OpdEDate)+" 檢驗";
		}else if(range=="year"){
			diseaseTitle = OpdObj.OpdYear+"年疾病彙總 ";
			orderTitle = OpdObj.OpdYear+"年醫令彙總 ";
			xrayTitle = OpdObj.OpdYear+"年影像 ";
			labTitle = OpdObj.OpdYear+"年檢驗 ";
		}else if(range=="all"){
			diseaseTitle = "全部疾病彙總 ";
			orderTitle = "全部醫令彙總";
			xrayTitle = "全部影像";
			labTitle = "全部檢驗";
		}
		
			
	    
		if(range=="date"){
			var xrayParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdSDate,OpdObj.OpdEDate,"OPD","getXrayCountByChartNoDateRangeVisitTypeGroupByType");
		}else if(range=="year"){
			var xrayParam =  new EMRYearsVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdYear,"OPD","getXrayCountByChartNoYearsVisitTypeGroupByType");	
		}else if(range=="all"){
			var xrayParam =  new EMRAllVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"OPD","getXrayCountByChartNoVisitTypeGroupByType");	
		}
		
		
		if(range=="date"){
			var labParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdSDate,OpdObj.OpdEDate,"OPD","getLabCountByChartNoDateRangeVisitTypeGroupByKind");
		}else if(range=="year"){
			var labParam =  new EMRYearsVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdYear,"OPD","getLabCountByChartNoYearsVisitTypeGroupByKind");	
		}else if(range=="all"){
			var labParam =  new EMRAllVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"OPD","getLabCountByChartNoVisitTypeGroupByKind");	
		}
		
		/**if(range=="date"){
			var opdParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdSDate,OpdObj.OpdEDate,"getPatopdSummaryByChartNoDateRange");
		}else if(range=="year"){
			var opdParam = new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdYear,"getPatopdSummaryByChartNoYears");	

		}else if(range=="all"){
			var opdParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getPatopdSummaryByChartNo");	

		}**/
		if(range=="date"){
			var opdParam = new OpdSumDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdSDate,OpdObj.OpdEDate,typeName,"getPatopdSummaryByChartNoDateRange");
		}else if(range=="year"){
			var opdParam = new OpdSumYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdYear,typeName,"getPatopdSummaryByChartNoYears");	
		}else if(range=="all"){
			var opdParam = new OpdSumAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,typeName,"getPatopdSummaryByChartNo");	

		}
		
		if(range=="date"){
			var opdListParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdSDate,OpdObj.OpdEDate,"getPatopdListByChartNoDateRange");
		}else if(range=="year"){
			var opdListParam =  new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdYear,"getPatopdListByChartNoYears");	
		}else if(range=="all"){
			var opdListParam =  new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getPatopdListByChartNo");	
		}
		
		
		//取得 全部   1.日期  2.年範圍 & 3.全部的 門急診 count 1070403 add opdDateParam()
		var opdDateParam = new OpdSumDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdSDate,OpdObj.OpdEDate,"ALL","getPatopdSummaryByChartNoDateRange");	
		var opdYearParam = new OpdSumYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdYear,"ALL","getPatopdSummaryByChartNoYears");	
		var opdAllParam = new OpdSumAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"ALL","getPatopdSummaryByChartNo");	

	
		var box ="";
		var contentBox = "";
		 var request = $.when(ajax_setPostData("PatopdService",JSON.stringify(opdDateParam)),ajax_setPostData("PatopdService",JSON.stringify(opdParam)),ajax_setPostData("XrayReportService",JSON.stringify(xrayParam)),ajax_setPostData("LabRecordService",JSON.stringify(labParam)),ajax_setPostData("PatopdService",JSON.stringify(opdYearParam)),ajax_setPostData("PatopdService",JSON.stringify(opdAllParam)),ajax_setPostData("PatopdService",JSON.stringify(opdListParam))).done(
					function(opdDateData,opddata,xraydata,labdata,opdYearData,opdAllData,opdListData) {
						
						//門急診日期範圍  1070403 add 
						if(opdDateData[0].status == "Success"){
							var SummaryBtnWidth = 86;
							$.each(opdDateData[0].resultSet, function(index, obj) {
								
								if(range=="date"){
									
									if(index == "summary"){
										//alert(obj);
										if(obj >=1000){
											SummaryBtnWidth += 8;
										}
										$('#OpdMasterDate').find("span").html(obj);
									}
									
									if(index =="visit_details"){
										$.each(obj, function(index, obj_d) {
											
											if(obj.length==2){
												if(obj_d.cash_type=="OPD"){
													$('#OpdMasterDate1').find("span").html(obj_d.count);
												}else {
													$('#OpdMasterDate2').find("span").html(obj_d.count);
												}
											}else if(obj.length==1&&obj_d.cash_type=="OPD"){
												$('#OpdMasterDate1').find("span").html(obj_d.count);
												$('#OpdMasterDate2').find("span").html("0");
												
											}else if(obj.length==1&&obj_d.cash_type=="EMG"){
												$('#OpdMasterDate2').find("span").html(obj_d.count);
												$('#OpdMasterDate1').find("span").html("0");
											}else{
												$('#OpdMasterDate1').find("span").html("0");
												$('#OpdMasterDate2').find("span").html("0");
											}

										});
									}
									
								}
																
//								if(index =="dis_details"){
//									$.each(obj, function(index, obj_d) {
//										if(index%4 == 0 ){
////											contentBox += '<hr class="hr_noline" /><span style="margin-right:' + SummaryBtnWidth + 'px"></span>'
//										}
////										box += '&nbsp;<button class="btn btn-primary" onclick="alert(' + "'門急'" +' )">' + obj_d.dis_cat + " "+ obj_d.name_c +' <span class="badge">' + obj_d.count +'</span></button>';
////										contentBox += '<button class="OpdIcd10">' + obj_d.range_no2 + " "+ obj_d.range_name_c +' <span class="OpdIcd10Count">(' + obj_d.count +')</span></button>';
////										contentBox += '&nbsp;<button class="OpdIcd10" onclick="filterOpdRangeNo2List(\'' + obj_d.range_no2 + '\');">' + obj_d.range_no2 + " "+ obj_d.range_name_c +' <span class="OpdIcd10Count">' + obj_d.count +'</span></button>';
//										contentBox += '<button class="OpdIcd10" value="' + obj_d.range_no2 +'">' + obj_d.range_no2 + " "+ obj_d.range_name_c +' <span class="OpdIcd10Count">' + obj_d.count +'</span></button>';
//
//									});
//								}
							
							});
//							box += '<br/>';
						}else {
							var ajaxErrMsg = opddata[0].errorMessage;
							$('#OpdMasterDate').find("span").html("0");
							$('#OpdMasterDate1').find("span").html("0");
							$('#OpdMasterDate2').find("span").html("0");
						}
						
						//門急診 日期範圍	/年/全部					
						if(opddata[0].status == "Success"){
							var SummaryBtnWidth = 86;
							$.each(opddata[0].resultSet, function(index, obj) {
								
																
								if(index =="dis_details"){
									$.each(obj, function(index, obj_d) {
										if(index%4 == 0 ){
//											contentBox += '<hr class="hr_noline" /><span style="margin-right:' + SummaryBtnWidth + 'px"></span>'
										}
//										box += '&nbsp;<button class="btn btn-primary" onclick="alert(' + "'門急'" +' )">' + obj_d.dis_cat + " "+ obj_d.name_c +' <span class="badge">' + obj_d.count +'</span></button>';
//										contentBox += '<button class="OpdIcd10">' + obj_d.range_no2 + " "+ obj_d.range_name_c +' <span class="OpdIcd10Count">(' + obj_d.count +')</span></button>';
//										contentBox += '&nbsp;<button class="OpdIcd10" onclick="filterOpdRangeNo2List(\'' + obj_d.range_no2 + '\');">' + obj_d.range_no2 + " "+ obj_d.range_name_c +' <span class="OpdIcd10Count">' + obj_d.count +'</span></button>';
										contentBox += '<button class="OpdIcd10" value="' + obj_d.range_no2 +'">' + obj_d.range_no2 + " "+ obj_d.range_name_c +' <span class="OpdIcd10Count">' + obj_d.count +'</span></button>';

									});
								}
							
							});
//							box += '<br/>';
						}else {
							var ajaxErrMsg = opddata[0].errorMessage;
						}
						
						//門急診 年範圍
						if(opdYearData[0].status == "Success"){
							var SummaryBtnWidth = 86;
							$.each(opdYearData[0].resultSet, function(index, obj) {
								if(index == "summary"){
									//alert(obj);
									if(obj >=1000){
										SummaryBtnWidth += 8;
									}
//									$('#OpdMasterYear').find("span").html(obj);
									$('#OpdMasterYear').html(OpdObj.OpdYear + '年門急&nbsp;<span class="badge">'+ obj + '</span>');
//									box += '<button class="btn btn-primary" onclick="alert(' + "'門急'" +' )">門急 <span class="badge">' + obj +'</span></button>';
								}
								
								if(index =="visit_details"){
									$.each(obj, function(index, obj_d) {
//										var viewtype = obj_d.cash_type =="OPD"? '門診' : '急診';
										/**if(obj_d.cash_type=="OPD"){
//											$('#OpdMasterYear1').find("span").html(obj_d.count);
											$('#OpdMasterYear1').html(OpdObj.OpdYear + '年門診&nbsp;<span class="badge">'+ obj_d.count + '</span>');
										}else {
//											$('#OpdMasterYear2').find("span").html(obj_d.count);
											$('#OpdMasterYear2').html(OpdObj.OpdYear + '年急診&nbsp;<span class="badge">'+ obj_d.count + '</span>');

										}**/
										
										
										if(obj.length==2){
											if(obj_d.cash_type=="OPD"){
												$('#OpdMasterYear1').html(OpdObj.OpdYear + '年門診&nbsp;<span class="badge">'+ obj_d.count + '</span>');
											}else {
												$('#OpdMasterYear2').html(OpdObj.OpdYear + '年急診&nbsp;<span class="badge">'+ obj_d.count + '</span>');
											}
										}else if(obj.length==1&&obj_d.cash_type=="OPD"){
											$('#OpdMasterYear1').html(OpdObj.OpdYear + '年門診&nbsp;<span class="badge">'+ obj_d.count + '</span>');
											$('#OpdMasterYear2').html(OpdObj.OpdYear + '年急診&nbsp;<span class="badge">'+ "0" + '</span>');
											
										}else if(obj.length==1&&obj_d.cash_type=="EMG"){
											$('#OpdMasterYear2').html(OpdObj.OpdYear + '年門診&nbsp;<span class="badge">'+ obj_d.count + '</span>');
											$('#OpdMasterYear1').html(OpdObj.OpdYear + '年急診&nbsp;<span class="badge">'+ "0" + '</span>');
											
										}else{
											$('#OpdMasterYear1').html(OpdObj.OpdYear + '年門診&nbsp;<span class="badge">'+ "0" + '</span>');
											$('#OpdMasterYear2').html(OpdObj.OpdYear + '年急診&nbsp;<span class="badge">'+ "0" + '</span>');
										}
										
										
										
//										box += '&nbsp;<button class="btn btn-primary" onclick="alert(' + "'門急'" +' )">' + viewtype +' <span class="badge">' + obj_d.count +'</span></button>';
									});
//									box+= '&nbsp;<input value="5" id="OpdYear" type="text" class="form-control input-sm input-center" style="max-width: 48px;"><label class="EMRLabel" for="OpdYear">&nbsp;年&nbsp;</label>'+
//										'<button class="btn btn-primary" id="OpdMasterYear">'+OpdObj.OpdYear+'年門急 <span class="badge">'+ $("#yearsOPD").html()+'</span></button>'+
//										'&nbsp;<button class="btn btn-primary" id="OpdMasterAll">全部門急 <span class="badge">'+$("#allOPD").html()+'</span></button>';
								}
							
							
							});
//							box += '<br/>';
						}else {
							var ajaxErrMsg = opddata[0].errorMessage;
							$('#OpdMasterYear').html(OpdObj.OpdYear + '年門急&nbsp;<span class="badge">'+ "0" + '</span>');
							$('#OpdMasterYear1').html(OpdObj.OpdYear + '年門診&nbsp;<span class="badge">'+ "0" + '</span>');
							$('#OpdMasterYear2').html(OpdObj.OpdYear + '年急診&nbsp;<span class="badge">'+ "0" + '</span>');
						}
						
						
						//門急診全部範圍
						if(opdAllData[0].status == "Success"){
							var SummaryBtnWidth = 86;
							$.each(opdAllData[0].resultSet, function(index, obj) {
								if(index == "summary"){
									//alert(obj);
									if(obj >=1000){
										SummaryBtnWidth += 8;
									}
									$('#OpdMasterAll').find("span").html(obj);
//									box += '<button class="btn btn-primary" onclick="alert(' + "'門急'" +' )">門急 <span class="badge">' + obj +'</span></button>';
								}
								
								if(index =="visit_details"){
									$.each(obj, function(index, obj_d) {
//										var viewtype = obj_d.cash_type =="OPD"? '門診' : '急診';
										/**if(obj_d.cash_type=="OPD"){
											$('#OpdMasterAll1').find("span").html(obj_d.count);
										}else {
											$('#OpdMasterAll2').find("span").html(obj_d.count);
										}**/
										
										if(obj.length==2){
											if(obj_d.cash_type=="OPD"){
												$('#OpdMasterAll1').find("span").html(obj_d.count);
											}else {
												$('#OpdMasterAll2').find("span").html(obj_d.count);
											}
										}else if(obj.length==1&&obj_d.cash_type=="OPD"){
											$('#OpdMasterAll1').find("span").html(obj_d.count);
											$('#OpdMasterAll2').find("span").html("0");
											
										}else if(obj.length==1&&obj_d.cash_type=="EMG"){
											$('#OpdMasterAll2').find("span").html(obj_d.count);
											$('#OpdMasterAll1').find("span").html("0");
										}else{
											$('#OpdMasterAll1').find("span").html("0");
											$('#OpdMasterAll2').find("span").html("0");
										}
										
										
//										box += '&nbsp;<button class="btn btn-primary" onclick="alert(' + "'門急'" +' )">' + viewtype +' <span class="badge">' + obj_d.count +'</span></button>';
									});
//									box+= '&nbsp;<input value="5" id="OpdYear" type="text" class="form-control input-sm input-center" style="max-width: 48px;"><label class="EMRLabel" for="OpdYear">&nbsp;年&nbsp;</label>'+
//										'<button class="btn btn-primary" id="OpdMasterYear">'+OpdObj.OpdYear+'年門急 <span class="badge">'+ $("#yearsOPD").html()+'</span></button>'+
//										'&nbsp;<button class="btn btn-primary" id="OpdMasterAll">全部門急 <span class="badge">'+$("#allOPD").html()+'</span></button>';
								}
							
							
							});
//							box += '<br/>';
						}else {
							var ajaxErrMsg = opddata[0].errorMessage;
							$('#OpdMasterAll').find("span").html("0");
							$('#OpdMasterAll1').find("span").html("0");
							$('#OpdMasterAll2').find("span").html("0");
						}
						
						//醫令彙總; 疾病彙總 ;  主訴、理學、診斷、病史彙總
//						box += '<hr class="hr_noline" />';
						
						box += '<span class="EMRPurpleTitle" id="showOpdSubTitle">'+""+OpdObj.showTitle+""+'</span>&emsp;';

						box += '<div class="right">';						
//						box += '<button class="btn btn-primary" title="'+orderTitle+'">醫令彙總</button>';
						box += '<button class="btn btn-primary" onclick="OpdAcntOrderListSummary('+"'"+range+"'"+');" title="'+orderTitle+'">醫令彙總</button>';
//						box += '&nbsp;<button class="btn btn-primary" onclick="DiseaseSummary();">疾病彙總</button>';
						box += '&nbsp;<button class="btn btn-primary"  onclick="DiseaseSummary('+"'"+range+"'"+');" title="'+diseaseTitle+'">疾病彙總</button>';
//						box += '&nbsp;<button class="btn btn-primary">主訴、理學、診斷、病史彙總</button>&nbsp;';
						box += '</div>';
						
						

						
						//影像
						if (xraydata[0].status == "Success") {
							$.each(xraydata[0].resultSet, function(index, obj) {
								if(index == "summary"){
									
									if(range=="date"){
										box += '&emsp;<button class="btn btn-primary" title="'+xrayTitle+'" onclick="callOPDXray(' + "'date'" +' )">影像 <span class="badge">' + obj +'</span></button>';
										}else if(range=="year"){
											box += '&emsp;<button class="btn btn-primary" title="'+xrayTitle+'" onclick="callOPDXray(' + "'year'" +' )">影像 <span class="badge">' + obj +'</span></button>';
										}else if(range=="all"){
											box += '&emsp;<button class="btn btn-primary" title="'+xrayTitle+'" onclick="callOPDXray(' + "'all'" +' )">影像 <span class="badge">' + obj +'</span></button>';

										}
								}
								/**else{
									$.each(obj, function(index, obj_d){
										box += '&nbsp;<button class="btn btn-primary" onclick="callXray(' + "'date',\'" + obj_d.cat_type + "\'" +')">' + obj_d.cat_name +' <span class="badge">' + obj_d.count +'</span></button>';
									});
								}**/
								//alert(index + ":" + obj);
							});
//							box += '<hr/>';
						} else {
						  var ajaxErrMsg = xraydata[0].errorMessage;
						}
						
						//檢驗
						
						if (labdata[0].status == "Success") {
							$.each(labdata[0].resultSet, function(index, obj) {
								if(index == "summary"){
									//alert(obj);
									if(range=="date"){
								    box += '&nbsp;<button class="btn btn-primary btn-lab" title="'+labTitle+'" onclick="callOPDLab(' + "'date'" +' )">檢驗 <span class="badge">' + obj +'</span></button>';
									}else if(range=="year"){
									box += '&nbsp;<button class="btn btn-primary btn-lab" title="'+labTitle+'" onclick="callOPDLab(' + "'year'" +' )">檢驗 <span class="badge">' + obj +'</span></button>';
									}else if(range=="all"){
									box += '&nbsp;<button class="btn btn-primary btn-lab" title="'+labTitle+'" onclick="callOPDLab(' + "'all'" +' )">檢驗 <span class="badge">' + obj +'</span></button>';

									}
								}
								/**else{
									$.each(obj, function(index, obj_d){
										box += '&nbsp;<button class="btn btn-primary btn-lab" onclick="callLab(' + "'date',\'" + obj_d.kind_id + "\'" +' )">' + obj_d.report_subtitle +' <span class="badge">' + obj_d.count +'</span></button>';
									});
								}**/
				
							});
							
						} else {
							var ajaxErrMsg = labdata[0].errorMessage;
						}
						
						
						$("#opdRecordInfo").append(box);
						$("#OpdIcd10Name").append(contentBox);
						
						/**門診日期清單 1070331 add***/						
						if (opdListData[0].status == "Success") {
							$.each(opdListData[0].resultSet, function(index, obj) {
								OpdRecordArray.push(obj);

							});

							OpdRange = range;							
							cashType = OpdRecordTypeName;
							
							jqGrid_OpdRecordList("#OpdRecordList","#OpdRecordList_Pager",OpdRecordArray);
							
							if(OpdRecordKind != undefined)
							{
								jqGrid_OpdRecordList("#OpdRecordList","#OpdRecordList_Pager",setRangeNo2NewArray(OpdRecordArray,OpdRecordKind,cashType));
								OpdRecordKind = undefined;
							}

							
							if(OpdRecordTypeName != undefined)
							{   var typeArray = setTypeNameNewArray(OpdRecordArray,OpdRecordTypeName);
								jqGrid_OpdRecordList("#OpdRecordList","#OpdRecordList_Pager",typeArray);					
								OpdRecordTypeName = undefined;
								
							}

							//如果門診清單為0 將主訴、理學、診斷、病史 欄位清空 1070417 add
							if($("#OpdRecordList").getRowData().length==0){								
								setTimeout(function(){ clearOpdDARTData(); }, 200);

							}

						} else {
							var ajaxErrMsg = opdListData[0].errorMessage;
							setTimeout(function(){ clearOpdDARTData(); }, 200); //清空 DART Detail 資料
							if(ajaxErrMsg.includes('No Data Found')){
								 clearGridData("OpdRecordList");
							  }
						}
									
						
						hideLoading();
						setPageVisible("opdRecordPage", true);
						popUpPageFixPos("opdRecordPage");
						
						/**點下門診紀錄的 疾病代碼 監聽器**/
						$(document).on('click', '.OpdIcd10', function(event) {
							
							 $(this).addClass("OpdIcd10-active").siblings().removeClass("OpdIcd10-active");
							 jqGrid_OpdRecordList("#OpdRecordList","#OpdRecordList_Pager",setRangeNo2NewArray(OpdRecordArray,$(this).val(),cashType));
							 $("#OpdRecordCol").show(); // show 門急記錄清單
							 $("#OpdDiseaseSumCol").hide(); // hide 疾病彙總
							 $("#OpdOrderSumCol").hide();//hide 醫令彙總
							 $("#showOpdSubTitle").html(OpdObj.showKindTitle);//如果使用者切至其他頁籤 再換回病史彙總 須將SubTitle文字替換
//							 jqGrid_OpdRecordList("#OpdRecordList","#OpdRecordList_Pager",setRangeNo2NewArray(setTypeNameNewArray(OpdRecordArray,cashType),$(this).val()));

							 
						});
							

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
		
		
	};

/**過濾 疾病碼中文 key= "code_name_c"**/
var setCodeNameCNewArray = function(originalArray,diseaseCode){
			  var newArr = $.grep(originalArray,function(o,index){
			        return (o.disease_code==diseaseCode);
			     });
			    
			    return newArr;
		};	
	

/**過濾 疾病碼 key= "range_no2"**/
//var setRangeNo2NewArray = function(originalArray,rangeNo2){
//		  var newArr = $.grep(originalArray,function(o,index){
//		        return (o.range_no2==rangeNo2);
//		     });
//		    
//		    return newArr;
//	};

/***修改過濾條件 1070403 依據門急診&疾病代碼過濾**/		
var setRangeNo2NewArray = function(originalArray,rangeNo2,typeName){
	
	if(typeName=="E"){
		 var newArr = $.grep(originalArray,function(o,index){
			   if(o.cash_type==(typeName)&&o.range_no2==rangeNo2){
				  return typeName;	
			  }
	
		     });
		    
		    return newArr;		 
	 }else if(typeName=="門診"){		 
		 var newArr = $.grep(originalArray,function(o,index){
			   if(o.cash_type_name.indexOf(typeName)!==-1&&o.range_no2==rangeNo2){
				  return typeName;	
			  }
	
		     });
		    
		    return newArr;
		 
	 }else{
		 
		 var newArr = $.grep(originalArray,function(o,index){
		        return (o.range_no2==rangeNo2);
		     });
		    
		    return newArr;
	 }
	
	
		  
	};
	
/**過濾 門急診 key="cash_type_name" ***/	
var setTypeNameNewArray = function(originalArray,typeName){
	if(typeName=="E"){
		 var newArr = $.grep(originalArray,function(o,index){
			   if(o.cash_type==(typeName)){
				  return typeName;	
			  }
	
		     });
		    
		    return newArr;		 
	 }else if(typeName=="門診"){		 
		 var newArr = $.grep(originalArray,function(o,index){
			   if(o.cash_type_name.indexOf(typeName)!==-1){
				  return typeName;	
			  }
	
		     });
		    
		    return newArr;
		 
	 }
		
		 
		
};	

//過濾疾病彙總 
var setDiseaseCodeNewArray = function(originalArray,diseaseCode){
	var diseaseArray = [];
//	console.log("diseaseCode="+diseaseCode+";Array=>"+originalArray);
		  var newArr = $.grep(originalArray,function(o,index){
//			     console.log("o.disease_code=>"+o.disease_code);
			     if(o.disease_code==diseaseCode){
			    	 
//			    	 for(var i=0;i<o.detailData.length;i++){
//			    		 diseaseArray.push(o.detailData[i]); 
//			    	 }
			    	 
			    	 $.each(o.detailData, function(index, obj) {
			    		 
			    		 diseaseArray.push(obj);
						 
					                   });
			    	 
			    	
			     }

		     });
//		     console.log(diseaseArray);
		    return diseaseArray;
	};


	
/**門急看診日期清單***/
function jqGrid_OpdRecordList(tableName,pagerName,dataArray){
		$(tableName).jqGrid({
		    datatype: "local",
		    height: pageHeight - 220,
		    colModel: [
		        { label: '病歷號', name: 'chart_no', width: 45,hidden:true },
		        { label: 'duplicate_no', name: 'duplicate_no', width: 45,hidden:true },  
		        { label: '年份', name: 'years', width: 45 },
		        { label: '日期', name: 'view_date', width: 90 },
		        { label: '序', name: 'duplicate_no', width: 35,align:'left' },	        
		        { label: '門|急', name: 'cash_type', width: 55,align:'left',formatter: function(cellvalue, options, rowobject){
		        	if(rowobject.cash_type=="E"){
		        		return  '<span class="" >急診</span>';
		        	}else{
		        		return  '<span class="" >門診</span>';
		        	}
		        	
		        	
		        }},
		        { label: '醫師', name: 'doctor_name', width: 95,hidden:false,align:'center' },
		        { label: '科別', name: 'div_name', width: 115,hidden:false },	
//		        
		        { label: '病歷號', name: 'chart_no', width: 90,hidden:true },
		        { label: '疾病代碼名稱', name: 'range_no2', width:440,hidden:true,formatter: function(cellvalue, options, rowobject){
		        	return  '<span class="" >' + filterNull(rowobject.range_no2) +" "+ filterNull(rowobject.range_name_c) +'</span>';
		        } },
		        { label: '疾病代碼名稱', name: 'disease_code', width:200,hidden:false,formatter: function(cellvalue, options, rowobject){
		        	return  '<span class="" >' + filterNull(rowobject.disease_code) +" "+ filterNull(rowobject.code_name_c) +'</span>';
		        } },
		        
		        { label: '中文', name: 'range_name_c', width: 90,hidden:true },
		        { label: '英文', name: 'range_name_e', width: 90,hidden:true },
		        { label: '疾病代碼名稱', name: 'range_no2', width: 500,hidden:true },
		        { label: '影像', name: 'XRAY', width: 105,align:'center',formatter: function(cellvalue, options, rowobject){
		        	
		        	if(cellvalue!=null&&cellvalue!=""){
//		        		return  '<button class="btn btn-primary btn-lab">影像 <span class="badge">' + cellvalue +'</span></button>';
		        		return  '<button class="btn btn-primary btn-lab" onclick="callOPDXray(' +"\'"+ OpdRange + "\',\'" + rowobject.view_date + "\'" +')">影像 <span class="badge">' + cellvalue +'</span></button>';


		        	}else{
		        		return'';
		        	} 
		        	
//	        		return  '<button class="btn btn-primary btn-lab " onclick="callInpRecordXray('+"\'" + rowobject.cat_type + "\',\'"+rowobject.start_date+"\',\'"+rowobject.end_date+"\'"+' )"><img alt="影像" src="/FangEmrServices/img/24_xray.png"> ' + obj.cat_name +'X光</button>&nbsp;';

	
		        } },
		        
		        { label: '檢驗', name: 'LAB', width: 105,align:'center',formatter: function(cellvalue, options, rowobject){
		        	if(cellvalue!=null&&cellvalue!=""){
		        		return  '<button class="btn btn-primary btn-lab" onclick="callOPDLab(' +"\'"+ OpdRange + "\',\'" + rowobject.view_date + "\'" +')">檢驗 <span class="badge">' + cellvalue +'</span></button>';
		        	}else{
		        		return'';
		        	}
//			        return '<button class="btn btn-primary btn-lab " onclick="callInpRecordLab('+"\'" + rowobject.kind_id + "\',\'"+rowobject.start_date+"\',\'"+rowobject.end_date+"\'"+' )"><img alt="檢驗" src="/FangEmrServices/img/24_lab.png">' + obj.report_subtitle +'</button>&nbsp;';

		        } },
		       
		      
		        
		    ],
		    viewrecords: true, // show the current page, data rang and total records on the toolbar
		    //caption: "病歷主檔",
		    onSelectRow:getSelectedRow,
		    ondblClickRow: function(rowId) {
		    	
	        },
	        width: null,
//	        rowNum: Math.floor((pageHeight - 220)/33),
		    shrinkToFit:false,
		    sortable: false,
			pager: pagerName,
			pagerpos:'left',
			loadComplete : function () {
				$(this).jqGrid('setSelection', 1, true);
			}
		});
		$(tableName).jqGrid('clearGridData');
		$(tableName).jqGrid('setGridParam', {multiSort: true,search: false, postData: { "filters": ""},data: dataArray});
	
		//依 view_date(desc) & duplicate_no(asc) 排序
		$(tableName).jqGrid('sortGrid','view_date', true, 'desc').jqGrid('sortGrid', 'duplicate_no', true, 'asc');
		$(tableName).trigger('reloadGrid');

		
		function getSelectedRow() {
		    var grid = $(tableName);
		    var rowKey = grid.jqGrid('getGridParam',"selrow");
		    if (rowKey){
		    	var recordDate = $(tableName).jqGrid('getCell',rowKey,'view_date');
		    	var viewType = $(tableName).jqGrid('getCell',rowKey,'cash_type');
		    	var viewDate = $(tableName).jqGrid('getCell',rowKey,'view_date');
		    	var chartNo = $(tableName).jqGrid('getCell',rowKey,'chart_no');
		    	var duplicateNo = $(tableName).jqGrid('getCell',rowKey,'duplicate_no');
		    	var extraBtn="";
		    	extraBtn += '<div class="pull-right"><button  type="button" id="extraInp" class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
		    	$('#OpdRecordListHead').html(recordDate +" "+ viewType+" 【主訴、理學、診斷、病史彙總 】  病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲 " +extraBtn);
		    	ajax_getOpdDARTDetailData("Chart1Service",viewDate,chartNo,duplicateNo);
		    		    		    
		    }
		    else{
		        alert("沒有資料被選擇");
		    }
		}
		

	}
/**過濾 opdRecordList ***/		
var filterOpdRangeNo2List = function(type){
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"range_no2",op:"eq",data:type});	
	$("#OpdRecordList").setGridParam({
	postData: { filters: JSON.stringify(myfilter)},
	search:true
	}).trigger('reloadGrid',[{page:1}]);
		}

/** 疾病彙總 ***/
function DiseaseSummary(range){
	$("#OpdRecordCol").hide(); // hide 門急記錄清單
	$("#OpdDiseaseSumCol").show(); // show 疾病彙總
	$("#OpdOrderSumCol").hide();//hide 醫令彙總

	if(range=="date"){
		$("#opdRecordPage_Title").html(OpdObj.OpdSDate+"-"+OpdObj.OpdEDate+" 門急記錄 - 疾病彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");	
		OpdObj.showTitle = OpdObj.OpdSDate+"-"+OpdObj.OpdEDate+" 門急記錄 - 疾病彙總";
	}else if(range=="year"){
		$("#opdRecordPage_Title").html(OpdObj.OpdYear+"年 門急記錄 - 疾病彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
		OpdObj.showTitle = OpdObj.OpdYear+"年 門急記錄 - 疾病彙總"; 
	}else if(range=="all"){
		$("#opdRecordPage_Title").html("全部 門急記錄 - 疾病彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
		OpdObj.showTitle ="全部 門急記錄 - 疾病彙總";
	}
	
	$("#showOpdSubTitle").html(OpdObj.showTitle);
	

	ajax_getDiseaseSummaryData("PatopdDisService",range);
}

/**ajax 取得 疾病彙總資料 ***/
var ajax_getDiseaseSummaryData = function(serviceName,range){
	var OpdDiseaseSumList = [];
	OpdDiseaseSumListArray = [];
	OpdDiseaseSumListArray = OpdDiseaseSumList;
	if(range=="date"){
		var diseaseSumParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdSDate,OpdObj.OpdEDate,"getOpdDisSummaryByChartNoDateRange");
//		$("#opdRecordPage_Title").html(OpdObj.OpdSDate+"-"+OpdObj.OpdEDate+" 門急記錄 - 病史彙總 -疾病彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	}else if(range=="year"){
		var diseaseSumParam =  new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdYear,"getOpdDisSummaryByChartNoYears");	
	}else if(range=="all"){
		var diseaseSumParam =  new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getOpdDisSummaryByChartNo");	
	}
	
	
	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(diseaseSumParam))).done(
				function(data) {
					if (data.status == "Success") {
						showLoading();
						$.each(data.resultSet, function(index, obj) {
							OpdDiseaseSumList.push(obj);
																			
								});
						OpdDiseaseSumListArray = OpdDiseaseSumList;

				
						 jqGrid_OpdDiseaseSumList("#OpdDiseaseSumList","#OpdDiseaseSumList_Pager");
		
					} else {
						var ajaxErrMsg = data.errorMessage;	
						 if(ajaxErrMsg.includes('No Data Found')){
							 clearGridData("OpdDiseaseSumList");
							
						  }
					}
					hideLoading();
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
};

/***取得疾病彙總 清單 jsonTest 1070402 測試***/
var getDiseaseSummaryJson = function(){
	var OpdDiseaseSumList = [];
	
	try{
		$.getJSON("/FangEmrServices/html/OpdRecord/Temp.txt").done(function(data){
			 $.each(data, function(index, obj) {
				 OpdDiseaseSumList.push(obj);
				 
			                   });
//			 console.log(OpdDiseaseSumList.length);
//			 jqGrid_OpdDiseaseSumList("#OpdDiseaseSumList","#OpdDiseaseSumList_Pager",OpdDiseaseSumList);
			
		}).fail(function(jqXHR,textStatus,errorThrown){
		        alert("OpdDiseaseSumListError: " + jqXHR.responseText+" ;"+errorThrown);
		});
	}catch(e){
//	 alert(e);	
	}
	
};


/**門急 疾病彙總 表格***/
function jqGrid_OpdDiseaseSumList(tableName,pagerName){
		$(tableName).jqGrid({
		    datatype: "local",
		    height: pageHeight - 380,
		    colModel: [
		    	{ label: 'disease_code', name: 'disease_code', width: 45,hidden:true },
		    	{ label: 'code_name_c', name: 'code_name_c', width: 45,hidden:true },
		    	{ label: 'summary', name: 'summary', width: 45,hidden:true },
		        { label: '疾病代碼名稱', name: 'disease_code', width:780,hidden:false,formatter: function(cellvalue, options, rowobject){
		        	return  '<span class="" >' + filterNull(rowobject.disease_code) +" "+ filterNull(rowobject.code_name_c)+" ("+ filterNull(rowobject.summary) +')</span>';
		        } },
		        { label: ' ', name: 'disease_code', hidden:true, width: 50,formatter: function(cellvalue, options, rowobject){ 	
		            return '<button type="button" class="btn btn-primary btn-sm ButtonfontSize pickDisease" value="' + cellvalue +'"></button>';
		        } },
//				contentBox += '<button class="OpdIcd10" value="' + obj_d.range_no2 +'">' + obj_d.range_no2 + " "+ obj_d.range_name_c +' <span class="OpdIcd10Count">' + obj_d.count +'</span></button>';

		        
		       
		    ],
		    viewrecords: true, // show the current page, data rang and total records on the toolbar
		    //caption: "病歷主檔",
		    rownumbers: true, //count 序號
		    rownumWidth:50,
		    sortcolumn: 'disease_code',
		    sortdirection: 'asc',
		    onSelectRow:getSelectedRow,
		    ondblClickRow: function(rowId) {
		    	
	        },
	        width: null,
//	        rowNum: Math.floor((pageHeight - 220)/33),
		    shrinkToFit:false,
		    sortable: false,
			pager: pagerName,
			pagerpos:'left',
			loadComplete : function () {
				$(this).jqGrid('setSelection', 1, true);
				$(this).jqGrid('setLabel', 0, "序號");
			}
		});
		$(tableName).jqGrid('clearGridData');
//		$(tableName).jqGrid('sortGrid','disease_code', true, 'asc');
		$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: OpdDiseaseSumListArray});
		$(tableName).trigger('reloadGrid');

		
		function getSelectedRow() {
			
		    var grid = $(tableName);
		    var rowKey = grid.jqGrid('getGridParam',"selrow");
		    if (rowKey){
		    	var diseaseCode = $(tableName).jqGrid('getCell',rowKey,'disease_code');
		    	var codeNameC = $(tableName).jqGrid('getCell',rowKey,'code_name_c');
		    	var summary = $(tableName).jqGrid('getCell',rowKey,'summary');
		    	var extraBtn="";
		    	extraBtn += '<div class="pull-right"><button  type="button"  class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
		    	$('#OpdDiseaseSumListHead').html(diseaseCode+" "+codeNameC+"("+summary+")"+" 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲"+extraBtn);

		    	
		    	var diseaseCodeNewArray = setDiseaseCodeNewArray(OpdDiseaseSumListArray,diseaseCode);
		    	jqGrid_OpdDiseaseSumDetailList("#OpdDiseaseSumDetailList","#OpdDiseaseSumDetailList_Pager",diseaseCodeNewArray);	    	
		    		    		    
		    }
		    else{
//		        alert("沒有資料被選擇");
		    }
		}
		

	}

/**疾病彙總 點疾病彙總 顯示 主訴理學診斷病史  細項***/
function jqGrid_OpdDiseaseSumDetailList(tableName,pagerName,dataArray){
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 380,
	    colModel: [
	       { label: '日期', name: 'view_date', width: 130 ,formatter: function(cellvalue, options, rowobject){           
	        	return cellvalue;

	        }},
	        
	        { label: 'duplicate_no', name: 'duplicate_no', width: 50,hidden:true},        
	        
	        { label: '門|急診', name: 'cash_type_name', width: 130,align:'center' ,formatter: function(cellvalue, options, rowobject){           
	        	return cellvalue;

	        }},
	        
	        { label: '醫師', name: 'doctor_name', width: 130 ,align:'center',formatter: function(cellvalue, options, rowobject){           
	        	return cellvalue;

	        }},
	        
	        { label: '科別', name: 'div_name', width: 160 ,formatter: function(cellvalue, options, rowobject){           
	        	return cellvalue;

	        }},
	        
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
	    rownumbers: true, //count 序號
	    rownumWidth:50,
	    sortcolumn: 'view_date',
	    sortdirection: 'desc',
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
//			$(this).jqGrid('setSelection', 1, true);
			$(this).jqGrid('setLabel', 0, "序號");
		}
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: dataArray});
	$(tableName).trigger('reloadGrid');
//	$(tableName).jqGrid('sortGrid','view_date', true, 'desc');
//	$(tableName).jqGrid('hideCol','view_date');
	$('#gbox_OpdDiseaseSumDetailList .ui-jqgrid-hdiv').hide(); //隱藏 Table 的  th
	
	function getSelectedRow() {
		
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    if (rowKey){
	    	var viewDate = $(tableName).jqGrid('getCell',rowKey,'view_date');
	    	var duplicateNo = $(tableName).jqGrid('getCell',rowKey,'duplicate_no');
	    	 setPageVisible("opdDiseaseDARTPage", true);
			 popUpPageFixPos("opdDiseaseDARTPage");
			 zIndex -=1; //目的是為了要讓  inpPage 移到 住院紀錄的上層
			 $('#opdRecordPage').css('z-index', zIndex); 
			 
			 $("#opdDiseaseDARTPage_Title").html(viewDate +" 主訴、理學、診斷、病史彙總");
	    	 ajax_getOpdDiseaseDARTlData("Chart1Service",viewDate,duplicateNo);
	    		    		    
	    }
	    else{
//	        alert("沒有資料被選擇");
	    }
	}
	

}


/**1070403 ajax 取得主訴、理學、診斷、病史資料
 * ***/
var ajax_getOpdDARTDetailData = function(serviceName,viewDate,chartNo,duplicateNo){
	
	var opdDARTParam = new OpdDARTInputObj(UserObj.emp_no,UserObj.session_id,viewDate,chartNo,duplicateNo,"getChart1ByPrimaryKeys");
	
		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(opdDARTParam))).done(
					function(data) {
						
						if (data.status == "Success") {
							
							$.each(data.resultSet, function(index, obj) {
								
								setOpdDARTData("opdComplaint",filterNull(data.resultSet.complaint));
								setOpdDARTData("opdDiagnosis",filterNull(data.resultSet.diagnosis));
								setOpdDARTData("opdDiagnosis1",filterNull(data.resultSet.diagnosis1));
								setOpdDARTData("opdChartHistory",filterNull(data.resultSet.chart_history));
							
								
							});
														
						
						} else {
							var ajaxErrMsg = data.errorMessage;
							setTimeout(function(){ 
								clearOpdDARTData();
						    }, 200);
							
						}	
											

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
	
};


/**1070503 ajax 點擊 疾病彙總 Detail 細項 取得主訴、理學、診斷、病史資料
 * ***/
var ajax_getOpdDiseaseDARTlData = function(serviceName,viewDate,duplicateNo){
	
//	var opdDARTParam = new OpdDARTInputObj(UserObj.emp_no,UserObj.session_id,viewDate,chartNo,duplicateNo,"getChart1ByPrimaryKeys");	
	var opdDARTParam = new OpdDARTInputObj(UserObj.emp_no,UserObj.session_id,viewDate,PatObj.chart_no,duplicateNo,"getChart1ByPrimaryKeys");

	
	
		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(opdDARTParam))).done(
					function(data) {
						
						if (data.status == "Success") {
							
							$.each(data.resultSet, function(index, obj) {
								
								setOpdDARTData("opdComplaint-2",filterNull(data.resultSet.complaint));
								setOpdDARTData("opdDiagnosis-2",filterNull(data.resultSet.diagnosis));
								setOpdDARTData("opdDiagnosis1-2",filterNull(data.resultSet.diagnosis1));
								setOpdDARTData("opdChartHistory-2",filterNull(data.resultSet.chart_history));
							
								
							});
														
						
						} else {
							var ajaxErrMsg = data.errorMessage;
							
							setTimeout(function(){ 
								clearOpdDiseaseDARTData();
						    }, 200);
							
							
						}	
											

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
	
};


function clearOpdDARTData(){
	$("#opdComplaint").html(""); //主訴
	$("#opdDiagnosis").html(""); //理學
	$("#opdDiagnosis1").html("");//診斷
	$("#opdChartHistory").html("");//病史
	
}

function clearOpdDiseaseDARTData(){
	$("#opdComplaint-2").html(""); //主訴
	$("#opdDiagnosis-2").html(""); //理學
	$("#opdDiagnosis1-2").html("");//診斷
	$("#opdChartHistory-2").html("");//病史
	
}


function setOpdDARTData(tag,data){
	try{
		document.getElementById(tag).innerText=data	
	}catch(e){
		
	}
	
}


/** 醫令彙總 按鈕
 * range (date year all)
 * ***/
function OpdAcntOrderListSummary(range){
	
	$("#OpdRecordCol").hide(); // hide 門急記錄清單
	$("#OpdDiseaseSumCol").hide(); // hide 疾病彙總
	$("#OpdOrderSumCol").show();//show 醫令彙總
	
	if(range=="date"){
		$("#opdRecordPage_Title").html(OpdObj.OpdSDate+"-"+OpdObj.OpdEDate+" 門急記錄 - 醫令彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");	
		OpdObj.showTitle = OpdObj.OpdSDate+"-"+OpdObj.OpdEDate+" 門急記錄 - 醫令彙總";
	}else if(range=="year"){
		$("#opdRecordPage_Title").html(OpdObj.OpdYear+"年 門急記錄 - 醫令彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
		OpdObj.showTitle = OpdObj.OpdYear+"年 門急記錄 - 醫令彙總";
	}else if(range=="all"){
		$("#opdRecordPage_Title").html("全部 門急記錄 - 醫令彙總  病患 : "+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
		OpdObj.showTitle = "全部 門急記錄 - 醫令彙總";
	}
	$("#showOpdSubTitle").html(OpdObj.showTitle);
	ajax_getOpdAcntOrderListData("OpdacntService",range);
}


/**ajax 取得 醫令彙總左側 ***/
var ajax_getOpdAcntOrderListData = function(serviceName,range){
	var OpdAcntOrderList = []; //醫令
	var OpdAcntDisposalList = []; //處置、檢驗、檢查
	clearGridData("OpdAcntOrderDetailList1");//先清空Grid1
	clearGridData("OpdAcntOrderDetailList2");//先清空Grid2
	$('#OpdAcntDetailListHead1').html("");//清空Head1文字
	$('#OpdAcntDetailListHead2').html("");//清空 Head2 文字

	//清空heading 文字
	showLoading();
		if(range=="date"){
			var orderParam = new OpdAcntDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdSDate,OpdObj.OpdEDate,1,"getOpdacntBystartdateenddateChartNo");
			var disposalParam = new OpdAcntDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdSDate,OpdObj.OpdEDate,2,"getOpdacntBystartdateenddateChartNo");

		}else if(range=="year"){		
			var orderParam =  new OpdAcntYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdYear,1,"getqueryOpdacntByChartNoyear");
			var disposalParam =  new OpdAcntYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdYear,2,"getqueryOpdacntByChartNoyear");
		
		}else if(range=="all"){			
			var orderParam =  new OpdAcntAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,1,"getqueryOpdacntByChartNoall");
			var disposalParam =  new OpdAcntAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,2,"getqueryOpdacntByChartNoall");
		}
		
//		console.log(JSON.stringify(orderParam)+";"+JSON.stringify(disposalParam));

	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(orderParam)),ajax_setPostData(serviceName,JSON.stringify(disposalParam))).done(
				function(data,data2) {
					
					// data 醫令左側上 
					if (data[0].status == "Success") {
						
						$.each(data[0].resultSet, function(index, obj) {
							OpdAcntOrderList.push(obj);
																			
								});
						OpdDetailRange = range;
						jqGrid_OpdAcntOrderList("#OpdAcntOrderList1","#OpdAcntOrderList1_Pager",OpdAcntOrderList,1,OpdDetailRange);

					} else {
						var ajaxErrMsg = data.errorMessage;	
//						 if(ajaxErrMsg.includes('No Data Found')){
//							//查無資料
//							 clearGridData("OpdAcntOrderList1");
//							
//						  }
					}
					
					// data 醫令左側下 
					if (data2[0].status == "Success") {
					
						$.each(data2[0].resultSet, function(index, obj) {
							OpdAcntDisposalList.push(obj);
																			
								});
						
						jqGrid_OpdAcntOrderList("#OpdAcntOrderList2","#OpdAcntOrderList2_Pager",OpdAcntDisposalList,2,OpdDetailRange);

					} else {
						var ajaxErrMsg = data2.errorMessage;	
//						 if(ajaxErrMsg.includes('No Data Found')){
//							//查無資料
//							 clearGridData("OpdAcntOrderList2");
//						  }
					}
					
					hideLoading();

											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
		
	
};





/***
 * tableName TableId
 * pagerName TablePagerId
 * dataArray data
 * flag  1 醫令 ; 2 處置、檢驗、檢查
 * range (date year all)
 * **/
function jqGrid_OpdAcntOrderList(tableName,pagerName,dataArray,flag,range){
	   var orderTypeName = flag==1?"醫令":"處置、檢驗、檢查";
		$(tableName).jqGrid({
			
		    datatype: "local",
		    height: pageHeight - 600,
		   
		    colModel: [
		        { label: 'code', name: 'code', width: 45,hidden:true },
		        { label: '醫令', name: 'full_name', width: 120,hidden:true },  
		        { label: 'full_name_c', name: 'full_name_c', width: 45,hidden:true },
		        { label: 'medcount', name: 'medcount', width: 45,hidden:true },
		        { label: orderTypeName, name: 'full_name',hidden:false, width:450,align:'left',formatter: function(cellvalue, options, rowobject){
		        	return  '<span class="" >' + filterNull(rowobject.full_name) +" ("+ filterNull(rowobject.medcount)+")"+'</span>';
		        } },

		    ],
		    viewrecords: true, // show the current page, data rang and total records on the toolbar
		    //caption: "病歷主檔",
		    sortcolumn: 'full_name',
		    sortdirection: 'asc',
		    onSelectRow:getSelectedRow,
		    ondblClickRow: function(rowId) {
		    	
	        },
	        width: null,
//	        rowNum: Math.floor((pageHeight - 220)/33),
//	        rowNum : "-1",
	        rownumbers: true, //count 序號
		    rownumWidth:50,
		    shrinkToFit:false,
		    sortable: false,
//			pager: pagerName,
			pagerpos:'left',
			loadComplete : function () {
//				$(this).jqGrid('setSelection', 1, true);
				$(this).jqGrid('setLabel', 0, "序號");
			}
		});
		$(tableName).jqGrid('clearGridData');
		$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: dataArray});
//		$(tableName).jqGrid('sortGrid','full_name', true, 'asc');
		$(tableName).setGridParam({rowNum:dataArray.length});
		$(tableName).trigger('reloadGrid');
		//$("#XrayList").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
		
		function getSelectedRow() {
			
		    var grid = $(tableName);
		    var rowKey = grid.jqGrid('getGridParam',"selrow");
		    if (rowKey){
		    	
		    	if(flag==1||flag==2){ //醫令
		    		var fullName1 = $(tableName).jqGrid('getCell',rowKey,'full_name');
			    	var medCount1 = $(tableName).jqGrid('getCell',rowKey,'medcount');
			    	var code1 = $(tableName).jqGrid('getCell',rowKey,'code');
			    	var extraBtn="";
			    	extraBtn += '<div class="pull-right"><button  type="button"  class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
			    	$('#OpdAcntDetailListHead1').html("藥品名稱: "+fullName1+" ("+medCount1+")"+"&emsp;病患:"+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲 " +extraBtn);
			    	ajax_getOpdAcntOrderDetailListData("OpdacntService",OpdDetailRange,flag,code1);//取得醫令彙總右側明細
		    	}
		    	
		    	/**else if(flag==2){//處置、檢驗、檢查
		    		var fullName2 = $(tableName).jqGrid('getCell',rowKey,'full_name');
			    	var medCount2 = $(tableName).jqGrid('getCell',rowKey,'medcount');
			    	var code2 = $(tableName).jqGrid('getCell',rowKey,'code');
			    	var extraBtn="";
			    	extraBtn += '<div class="pull-right"><button  type="button"  class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
			    	$('#OpdAcntDetailListHead2').html("藥品名稱: "+fullName2+" ("+medCount2+")"+"&emsp;病患:"+ PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲 " +extraBtn);
			    	ajax_getOpdAcntOrderDetailListData("OpdacntService",OpdDetailRange,flag,code2);////取得醫令彙總右側明細
		    	}**/
		    	   	
		    		    		    
		    }
		    else{
		        alert("沒有資料被選擇");
		    }
		}
		

	}





/**醫令彙總 Detail ajax ***/
var ajax_getOpdAcntOrderDetailListData = function(serviceName,range,flag,code){
	var OpdAcntOrderDetailList = [];
	 showLoading();
		if(range=="date"){
			var orderParam = new OpdAcntDetailDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdSDate,OpdObj.OpdEDate,code,"getqueryOpdacntshowdetaildate");
		}else if(range=="year"){
			var orderParam =  new OpdAcntDetailYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdObj.OpdYear,code,"getqueryOpdacntshowdetailyear");	
		}else if(range=="all"){
			var orderParam =  new OpdAcntDetailAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,code,"getqueryOpdacntshowdetailall");	
		}

	
	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(orderParam))).done(
				function(data) {
					
					if (data.status == "Success") {
						
						$.each(data.resultSet, function(index, obj) {
							OpdAcntOrderDetailList.push(obj);
																			
								});
						
						if(flag==1||flag==2){
							jqGrid_OpdAcntOrderDetailList("#OpdAcntOrderDetailList1","#OpdAcntOrderDetailList1_Pager",OpdAcntOrderDetailList);
						}
						
						/**else if(flag==2) {
							jqGrid_OpdAcntOrderDetailList("#OpdAcntOrderDetailList2","#OpdAcntOrderDetailList2_Pager",OpdAcntOrderDetailList);

						}**/
						

					} else {
						var ajaxErrMsg = data.errorMessage;	
						 if(ajaxErrMsg.includes('No Data Found')){
							//查無資料
							 if(flag==1||flag==2){
								 clearGridData("OpdAcntOrderDetailList1"); 
							 }
							 
							 /**else if(flag==2){
								 clearGridData("OpdAcntOrderDetailList2");
							 }**/
							 
							
						  }
					}
					hideLoading();
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
};


/***醫令彙總 Detail 資料***/
var jqGrid_OpdAcntOrderDetailList = function(tableName,pagerName,arrayData){
	
	var opdHeading = $('#opdRecordPage').find('.clearfix').height();
		var OpdMaster = $("#OpdMaster").height();
		var OpdIcd10Name = $("#OpdIcd10Name").height();
		var opdRecordInfo = $("#opdRecordInfo").height();
		var OpdAcntDetailListHead1 =  41;
		var OpdAcntDetailListHead2 =  41;

	
	 var tableGrid = $(tableName);
	 	$(tableName).jqGrid({
	    datatype: "local",
//	    rowNum: Math.floor((pageHeight - 220)/33),
	    height: pageHeight - (OpdMaster+OpdIcd10Name+opdRecordInfo+OpdAcntDetailListHead1+200),
	    width:null,
	    rownumbers: true, //count 序號
	    rownumWidth:70,
	    sortcolumn: 'view_date',
	    sortdirection: 'desc',
	    colModel: [
//	        { label: '序', name: 'rec_count', width: 40,search:false,align:'center'},
	    	{ label: '看診日期',name: 'view_date', width: 100},
//	        { label: '醫令代碼', name: 'code', width: 150,hidden:true},
	        { label: '用藥名稱', name: 'full_name',width: 400,align:'left'},
	        { label: '單次量', name: 'qty', width: 70,align:'right'},
	        { label: '用法', name: 'use_name_e', width: 70,align:'left'},
	        { label: '天數', name: 'day', width: 60,align:'right',formatter: function(cellvalue, options, rowobject){
	        	return  '<span class="" >' + filterNull(rowobject.day) +"天 "+'</span>';
	        }},
	        { label: '常規用法', name: 'use', width: 80,align:'left'},
	        { label: '非常規', name: 'unuse', width: 70,align:'left'},
			{ label: '單位', name: 'unit', width: 70,align:'center'},
			{ label: '總量', name: 'tqty', width: 50,align:'right'},
			{ label: '途徑', name: 'method_name_e', width: 60,align:'left'},
			{ label: '急', name: 'emg', width: 40,align:'center'},
			{ label: '開始日期', name: 'start_date', width: 110,align:'left',formatter: formatDateTime},
			{ label: '時間', name: 'start_time', width: 70,align:'center',formatter: formatDateTime},
			{ label: '結束日期', name: 'end_date', width: 110,align:'left',formatter: formatDateTime},
			{ label: '時間', name: 'end_time', width: 70,align:'center',formatter: formatDateTime},
			{ label: '批價代號', name: 'code', width: 100,align:'left'},
	        { label: '加成', name: 'add_rate', width: 90,align:'right'},
	        { label: '金額', name: 'amt', width: 90,align:'right'},
	        { label: '自費', name: 'self', width: 50,align:'center'},
	        { label: '庫別', name: 'stock', width: 60,align:'center'},
	        { label: '醫師', name: 'doctor_name', width: 70,align:'center'},
	        { label: '開刀部位', name: 'order_pos', width: 80,align:'left'},
	        { label: '批價員', name: 'cashier_name', width: 70,align:'center'},
	        { label: '補差額', name: 'he_add_fee', width: 90,align:'right'},
	        { label: '影像來源', name: 'dicom_flag', width: 100,align:'left'},
			{ label: '事前審查編號', name: 'project_no', width: 115,align:'left'},

	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
//	    onSelectRow:getSelectedRow,
	    shrinkToFit: false,
//	    sortable:true,  //可否拖曳排序
		pager: pagerName,
		
		gridComplete: function () {
			$(this).jqGrid('setLabel', 0, "序號");
      }
		
		
	});
//	$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
//	$(tableName).jqGrid('sortGrid','view_date', true, 'desc');
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {data: arrayData});
	$(tableName).trigger('reloadGrid');
//	$('#gbox_OpdAcntOrderDetailList1 .ui-jqgrid-hdiv').hide(); //隱藏 Table 的  th
//	$('#gbox_OpdAcntOrderDetailList2 .ui-jqgrid-hdiv').hide(); //隱藏 Table 的  th
//	$(tableName).jqGrid("navGrid", pagerName,
//			{ add: false, edit: false, del: false, search: true, view: true, refresh: false });

	/**function getSelectedRow() {
		
		 var grid = $(tableName);
		 var rowKey = grid.jqGrid('getGridParam',"selrow");		
		if(rowKey){	    	
//			var reportNo = $(tableName).jqGrid('getCell',rowKey,'lab_reportno');
	    	
		}else{
			 alert("沒有資料被選擇");
		}
  
	}**/
}



/** ajax 查詢醫藥囑明細 (1070418 add)  ajax_getMedicineDetailData("OpdacntService",viewdate,duplicateno)***/
var ajax_getMedicineDetailData = function(serviceName,viewdate,duplicateno){
	var OpdMedicineDetailList = [];
	clearGridData("OpdMedicineDetailList");
	var medicineDetailParam =  new OpdViewDateMedicineInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,viewdate,duplicateno,"getqqueryOpdacntByViewDateChartNoDuplicateNo");	

	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(medicineDetailParam))).done(
				function(data) {
					if (data.status == "Success") {
						showLoading();
						$.each(data.resultSet, function(index, obj) {
							OpdMedicineDetailList.push(obj);
																			
								});

						jqGrid_OpdMedicineDetailList("#OpdMedicineDetailList","#OpdMedicineDetailList_Pager",OpdMedicineDetailList);
		
					} else {
						var ajaxErrMsg = data.errorMessage;	
						 if(ajaxErrMsg.includes('No Data Found')){
							 clearGridData("OpdMedicineDetailList");
							
						  }
					}
					hideLoading();
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
};

/** 查詢醫藥囑明細表格**/
function jqGrid_OpdMedicineDetailList(tableName,pagerName,dataArray){
	   
		$(tableName).jqGrid({			
		    datatype: "local",
		    height: pageHeight - 170,
		    colModel: [
		        { label: 'rec_count', name: 'rec_count', width: 50,hidden:false,align:'center',frozen:true},
		        { label: '批價代號', name: 'code', width: 120,hidden:false,align:'left',frozen:true },  
		        { label: '藥品名稱', name: 'full_name_c', width: 350,hidden:false,frozen:true },
//		        { label: 'price_type', name: 'price_type', width: 50,formatter:formatViewDateMedicinePriceType},
		        { label: '單次量', name: 'qty', width: 70,align:'right'},
		        { label: '單位', name: 'unit', width: 90,align:'center'},
		        { label: '用法', name: 'use_name_e', width: 220,align:'left',formatter: function(cellvalue, options, rowobject){
		        	return  '<span class="" >' + filterNull(rowobject.use) +" "+ filterNull(rowobject.use_name_c) +'</span>';

		        }},
		        
		        { label: '天數', name: 'day', width: 45,align:'right'},
		        
		        { label: '常規用法', name: 'use', width: 80,align:'left'},
//				{ label: '單位', name: 'use_name_e', width: 50,align:'left'},
				{ label: '總量', name: 'tqty', width: 80,align:'right',formatter: function(cellvalue, options, rowobject){
		        	return  '<span class="" >' + filterNull(rowobject.tqty) +" "+ filterNull(rowobject.unit) +'</span>';

		        }},
//				{ label: '單位', name: 'unit', width: 50,align:'center'},
				{ label: '途徑', name: 'method_name_e', width: 70,align:'left'},
				{ label: '急', name: 'emg', width: 40,align:'center'},
//				{ label: '出院帶藥 Y/N', name: 'take_home', width: 100,formatter: "checkbox",edittype: "checkbox", editoptions: {value: "Y:N"},formatoptions:{disabled: true}},
				{ label: '實用量', name: 'do_tqty', width: 70,align:'right'},
				{ label: '就醫科別', name: 'div_name', width: 120,align:'center'},
//				{ label: '開始日期', name: 'start_date', width: 100,formatter: formatDateTime,align:'left'},
//				{ label: '時間', name: 'start_time', width: 100,formatter: formatDateTime,align:'center'},
//				{ label: 'DC日期', name: 'end_date', width: 100,formatter: formatDateTime,align:'left'},
//				{ label: '時間', name: 'end_time', width: 100,formatter: formatDateTime,align:'center'},
				{ label: '加成', name: 'add_rate', width: 100,align:'right'},
				{ label: '金額', name: 'amt', width: 100,align:'right'},
				{ label: '自費', name: 'self', width: 50,align:'center'},
				{ label: '庫別', name: 'stock', width: 60,align:'left'},
				{ label: '醫師', name: 'doctor_name', width: 80,align:'center'},
//				{ label: '手術醫師', name: 'op_doctor_no', width: 70},
				{ label: '開刀部位', name: 'order_pos', width: 80,align:'left'},
				{ label: '批價員', name: 'cashier_name', width: 80,align:'center'},
				{ label: '補差額', name: 'he_add_fee', width: 100,align:'right'},
//				{ label: '折扣', name: 'acnt_discount', width: 100},
//				{ label: '折扣註記', name: 'acnt_discount_remark', width: 100},
				{ label: '影像來源', name: 'dicom_flag', width: 100,align:'left'},
				{ label: '事前審查編號', name: 'project_no', width: 115,align:'left'},

		    ],
		    viewrecords: true, // show the current page, data rang and total records on the toolbar
		    //caption: "病歷主檔",
		    onSelectRow:getSelectedRow,
		    ondblClickRow: function(rowId) {
		    	
	        },
	        width: null,
//	        rowNum: Math.floor((pageHeight - 220)/33),
//	        rownumbers: true, //count 序號
//		    rownumWidth:50,
		    shrinkToFit:false,
		    sortable: false,
			pager: pagerName,
			pagerpos:'left',
			loadComplete : function () {
				$(this).jqGrid('setLabel', 0, "序號");
			}
		});
		$(tableName).jqGrid('clearGridData');
		$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: dataArray});
		$(tableName).jqGrid('setFrozenColumns');
//		$(tableName).jqGrid('sortGrid','view_date', true, 'desc');
		$(tableName).trigger('reloadGrid');
		
		function getSelectedRow() {
			
		    var grid = $(tableName);
		    var rowKey = grid.jqGrid('getGridParam',"selrow");
		    if (rowKey){

		    	   	
		    		    		    
		    }
		    else{
//		        alert("沒有資料被選擇");
		    }
		}
		

	}

function formatViewDateMedicinePriceType(cellValue, options, rowObject) {
 	
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




