/**
 * 住院紀錄
 */


var InpRecordObj = {
	InpRecordYear : 5,
	InpRecordSDate : "",
	InpRecordEDate : "",
	viewType: "",
	serno:0
};


var InpRecordSerno;
var InpRecordStartDate;
var InpRecordEndDate;
var BedKind;
var BedNoKind;

var inpRecordArray = [{seq_no:1,date:1010101,items:["手術","住院病摘","醫囑紀錄","護理紀錄","病程紀錄","一般X光","血液","尿液"]},
					  {seq_no:2,date:1010102,items:["住院病摘","護理紀錄"]},
					  {seq_no:3,date:1010103,items:["一般X光","血液"]},
					  {seq_no:4,date:1010104,items:["醫囑紀錄","護理紀錄"]},
					  {seq_no:5,date:1010105,items:["病程紀錄","血液"]},
					  {seq_no:6,date:1010106,items:["手術","一般X光"]}];

//getPatinpSummaryByChartNoSerno 取得入出院病摘 count 
var InpRecordInOutNoteObj = function(empNo,sessionID,chartNo,serno,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.serno = serno;
	this.method = method;
};




var InpRecordJsonlObj =[];
//getAdmitMatrixByChartNoAndDateRange 
var getInpRecordJson = function(){
	InpRecordJsonlObj =[];

	try{
		$.getJSON("/FangEmrServices/html/InpRecord/matrix.txt").done(function(data){
			//var result = JSON.stringify(data);
			 $.each(data, function(index, obj) {
				 InpRecordJsonlObj.push(obj);
				 
			                   });
			jqGrid_inpRecordList("#inpRecordList","#inpRecordList_Pager",InpRecordJsonlObj);
		}).fail(function(jqXHR,textStatus,errorThrown){
		        alert("InpRecordTestError: " + jqXHR.responseText+" ;"+errorThrown);
		});
	}catch(e){
//	 alert(e);	
	}
	
	
	
	
	
};
// PatinpMatrixService  
//ajax 住院紀錄 清單
var ajax_getInpRecordListData = function(serviceName){
	

	var InpRecordArray = [];
	var cmParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,InpRecordObj.InpRecordSDate ,InpRecordObj.InpRecordEDate ,"getAdmitMatrixByChartNoAndDateRange");			

	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(data) {
					if (data.status == "Success") {
						$.each(data.resultSet, function(index, obj) {		
							InpRecordArray.push(obj);
						});	
						
						
																		
					} else {
						 var ajaxErrMsg = data.errorMessage;						
						 noDataFound(ajaxErrMsg,"inpRecordList");
					}	

					jqGrid_inpRecordList("#inpRecordList","#inpRecordList_Pager",InpRecordArray);

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
	
};

/**住院紀錄 病房 篩選**/
var ajax_getInpRecordChgBedListData = function(serviceName,BedKind,bedNo){
//	showLoading();
	var ChgBedArray = [];
	var cmParam = new EMRChangeBedInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,InpRecordObj.serno,BedKind,"getChgbedDataByChartNoSerno");	

	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(data) {
					if (data.status == "Success") {
						$.each(data.resultSet, function(index, obj) {		
							ChgBedArray.push(obj);
						});	
						
						var title = InpRecordObj.InpRecordSDate + "-" +InpRecordObj.InpRecordEDate + "&nbsp;" + "住院記錄-查詢病房紀錄";
						 title += "<br/>&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;
						 $('#chgBedPage_Title').html(title);	//設定title內容
																		
					} else {
						var ajaxErrMsg = data.errorMessage;						
						 noDataFound(ajaxErrMsg,"ChgBedList");
					}	

					jqGrid_ChgBedList("#ChgBedList","#ChgBedList_Pager",ChgBedArray);
					
//					if(BedKind != undefined)
//					{
//						filterBedList(BedKind,bedNo);
//						BedKind = undefined;
//						bedNo = undefined;
//					}
					
					hideLoading();
					setPageVisible("chgBedPage", true);
					popUpPageFixPos("chgBedPage");		
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
	
};

/**過濾 病床 room_type**/
var filterBedList = function(kind,bedNo){
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"room_type",op:"eq",data:kind},{field:"bed_no",op:"eq",data:bedNo});	
	$("#ChgBedList").setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid',[{page:1}]);
};


/**入出院病摘 按鈕***/

//病床紀錄 篩選  getChgbedCountByChartNoDateRangeGroupByRoomType  ChgbedService
//inp 入出院病摘  PatinpService getPatinpSummaryByChartNoSerno
//ajax_getInpRecordAdmissionOutNote("PatinpService");
var  ajax_getInpRecordAdmissionOutNote = function(serviceName){

//	showLoading();	
	
	var inpParam = new  InpRecordInOutNoteObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,$("#inpRecordSerno").html(),"getPatinpSummaryByChartNoSerno");//取得入出院病摘 count

	var request = $.when(ajax_setPostData(serviceName,JSON.stringify(inpParam))).done(
				 
				 function(data) {
						if (data.status == "Success") {
							var box = "";	
							
						     $.each(data.resultSet, function(index, obj) {
									
									if(index == "admission"){
										box += '&nbsp;<button class="btn btn-primary" name="admission" onclick="callInp(' + "'inpRecordAdmission'" +' )"><img alt="入院病摘" src="/FangEmrServices/img/24_AdmissionSummary.png"> 入院病摘 <span class="badge">' + obj +'</span></button>';
									}
									if(index == "outnote"){
										box += '&nbsp;<button class="btn btn-primary" name="outnote" onclick="callInp(' + "'inpRecordOutnote'" +' )"><img alt="出院病摘" src="/FangEmrServices/img/24_DischargeSummary.png"> 出院病摘 <span class="badge">' + obj +'</span></button>';
									}												
								});
//							
						
							$('#InpRecordDetail').append(box);
							box = null;
							

						} else {
							ajaxErrMsg = data.errorMessage;
//							hideLoading();
						}						

					});
	
//		    hideLoading();
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
			
};






//病床紀錄 篩選  getChgbedCountByChartNoDateRangeGroupByRoomType  ChgbedService
// inp 入出院病摘  PatinpService getPatinpSummaryByChartNoSerno
var  ajax_getChgBedCountByRoomType = function(serviceName){

	showLoading();	
	
//	var inpParam = new  InpRecordInOutNoteObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,$("#inpRecordSerno").html(),"getPatinpSummaryByChartNoSerno");//取得入出院病摘 count
	var cmParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,InpRecordObj.InpRecordSDate,InpRecordObj.InpRecordEDate,"getChgbedCountByChartNoDateRangeGroupByRoomType");	
//	console.log(JSON.stringify(inpParam)+";"+JSON.stringify(cmParam));	 
	var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				 
				 function(data,inpData) {
						if (data.status == "Success") {
							var box = "";	
							$.each(data.resultSet, function(index, obj) {				
								if(index == "summary"){
									box += '<button class="btn btn-primary" name="chgbed" onclick="callINPrecordChgBed(' + "'date',\'All\'" +' )"><img alt="病房" src="/FangEmrServices/img/24_bed.png"> 病房 <span class="badge">' + obj +'</span></button>';

								}else{
									$.each(obj, function(index, obj_d){
//										box += '&nbsp;<button class="btn btn-primary btn-lab" onclick="callINPrecordChgBed(' + "'date',\'" + obj_d.room_type + "\',\'"+obj_d.bed_no+"\'"+' )"><img alt="病房" src="/FangEmrServices/img/24_bed.png"> ' + obj_d.room_type_name +' <span class="badge">' + obj_d.count +'</span></button>';
										box += '&nbsp;<button class="btn btn-primary btn-lab" onclick="callINPrecordChgBed(' + "'date',\'" + obj_d.room_type + "\'" +' )"><img alt="病房" src="/FangEmrServices/img/24_bed.png"> ' + obj_d.room_type_name +' <span class="badge">' + obj_d.count +'</span></button>';
//										box += '&nbsp;<button class="btn btn-primary" onclick="filterBedList(\'' + obj_d.room_type + '\');">' + obj_d.room_type_name +' <span class="badge">' + obj_d.count +'</span></button>';
									});
								}
								//alert(index + ":" + obj);
							});
							$('#InpRecordDetail').html(box);
							box = null;
							

						} else {
							ajaxErrMsg = data.errorMessage;
							hideLoading();
						}
						
						ajax_getInpRecordAdmissionOutNote("PatinpService");//取得入出院病摘 
						
//						if(inpData[0].status == "Success"){
//                              $.each(inpData[0].resultSet, function(index, obj) {
//								
//								if(index == "admission"){
//									box += '&nbsp;<button class="btn btn-primary" name="admission" onclick="callInp(' + "'inpRecordAdmission'" +' )">入院病摘 <span class="badge">' + obj +'</span></button>';
//								}
//								if(index == "outnote"){
//									box += '&nbsp;<button class="btn btn-primary" name="outnote" onclick="callInp(' + "'inpRecordOutnote'" +' )">出院病摘 <span class="badge">' + obj +'</span></button>';
//								}												
//							});
//						}
						
												

					});
		    hideLoading();
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
			
};

var callINPrecordChgBed = function(flag,kind){
	
	InpRecordObj.serno = $("#inpRecordSerno").html();
	
	if(flag=="date"){
		ajax_getInpRecordChgBedListData("ChgbedService",kind);
	}
	
};


// call INPrecord
var callINPrecord = function(flag,kind,bedNo){
	InpRecordSerno = ViewListObj.serno;
    InpRecordStartDate = ViewListObj.sdate;
	InpRecordEndDate  = ViewListObj.edate;
	$("#inpRecordSerno").html(InpRecordSerno);
	$("#inpRecordStartDate").html(InpRecordStartDate);
	$("#inpRecordEndDate").html(InpRecordEndDate);

	

	
	BedKind = kind;	
	BedNoKind = bedNo;
	
	InpRecordObj.InpRecordYear = PatObj.recentYear;
	InpRecordObj.InpRecordSDate = ViewListObj.sdate;
	InpRecordObj.InpRecordEDate = ViewListObj.edate;
	InpRecordObj.viewType = ViewListObj.viewType;
//	InpRecordObj.serno = ViewListObj.serno;
	ajax_getChgBedCountByRoomType("ChgbedService");
	
	//取得入出院病摘 count
//	getInpRecordJson();fcallInpRecordXray
//	$('#inpRecordPatInfo').html("最初門診日期:" + PatObj.first_view_date +"&emsp;" + PatObj.first_div_name +"&emsp;最近門診日期:"+ PatObj.last_view_date +"&emsp;" + PatObj.last_div_name );
	$('#inpRecordPatInfo').html($("#PatInfo").html());

	
	var title = ViewListObj.desc;
	var inpRercordInfo = "<div class='panel panel-info'>"
		+ "<div class='panel-heading EMRfont'>"+title+"</div></div>";	
		
	$('#inpRecordInfo').html(inpRercordInfo);
	
	ajax_getInpRecordListData("PatinpMatrixService");//取得 住院紀錄清單
	
	setPageVisible("inpRecordPage", true);
	popUpPageFixPos("inpRecordPage");
	
//	if(flag=="date"){
//		ajax_getInpRecordChgBedListData("ChgbedService",kind,bedNo);
//	}

	
	
}

//住院紀錄
function jqGrid_inpRecordList(tableName,pagerName,arrayData){		//住院紀錄
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 340,
	    colModel: [
	        { label: '開始日期', name: 'start_date', width: 60,hidden:true },
	        { label: '結束日期', name: 'end_date', width: 60,hidden:true },
	        { label: '日期', name: 'record_date', width: 90 },
	        { label: '病程記錄', name: 'detailData', width: 130 ,title:false,formatter: function(cellvalue, options, rowobject){
	            var test="";
	        	$.each(cellvalue, function(index, obj) {
	        		
	        		if(obj.record_type=="DRPROGRESS"){
	        			if(obj.record_value!=null&&obj.record_value!=""){
//			        		test += '<button class="btn btn-primary btn-lab" onclick="callProgress(' + "'date',\'" + rowobject.record_date + "\'" +' )">病程記錄</button>';
			        		test += '<button class="btn btn-primary btn-lab" onclick="callInpRecordDrProgress(' +"\'"+ rowobject.record_date +"\'" + ",\'"+rowobject.start_date+"\',\'"+rowobject.end_date+"\'"+' )">' + "<img alt='病程記錄' src='/FangEmrServices/img/24_progress.png'>病程記錄" +'</button>';
	        				
	        			}
	        			
	        			
	        		}

				});
	        	
	        	return test;
	        }},
	        { label: '護理記錄', name: 'detailData', width: 130 ,title:false,formatter: function(cellvalue, options, rowobject){
	        	   var test="";
		        	$.each(cellvalue, function(index, obj) {
		        		if(obj.record_type=="NURSEPROGRESS"){
		        			if(obj.record_value!=null&&obj.record_value!=""){
//		        				test += '&nbsp;<button class="btn btn-primary" name="nurseprogress" onclick="callFocus(' + "'date'" +' )"></button>';
				        		test += '<button class="btn btn-primary btn-lab" onclick="callInpRecordNurseProgress(' +"\'"+ rowobject.record_date +"\'" + ",\'"+rowobject.start_date+"\',\'"+rowobject.end_date+"\'"+' )">' + "<img alt='護理記錄' src='/FangEmrServices/img/24_focus.png'>護理記錄" +'</button>';
//				        		test += '<button class="btn btn-primary btn-lab" onclick="callFocus(' + "'date',\'" + rowobject.record_date + "\'" +' )">護理記錄</button>';
		        			}
		        			
		        		}

					});
		        	
		        	return test;
	        }},
	        { label: '手術', name: 'detailData', width: 110 ,title:false,formatter: function(cellvalue, options, rowobject){
	        	 var test="";
		        	$.each(cellvalue, function(index, obj) {
		        		if(obj.record_type=="ORRECORD"){
		        			if(obj.record_value!=null&&obj.record_value!=""){
//								test += '<button class="btn btn-primary" onclick="callOp('+"'date'"+')">手術</button><span class="">';
				        		test += '<button class="btn btn-primary btn-lab" onclick="callInpRecordOp(' +"\'"+ rowobject.record_date +"\'" + ",\'"+rowobject.start_date+"\',\'"+rowobject.end_date+"\'"+' )">' + "<img alt='手術' src='/FangEmrServices/img/24_op.png'>手術" +'</button>';

		        			}
		        			
		        		}
					});
		        	
		        	return test;
	        }},
	        { label: '檢驗 | 影像', name: 'detailData', width: 1000 ,title:false,formatter: function(cellvalue, options, rowobject){
	        	 var test="";
		        	$.each(cellvalue, function(index, obj) {
		        		if(obj.report_subtitle){
//			        		test += '<button class="btn btn-primary btn-lab" onclick="callInpRecordLab(' + "'date',\'" + obj.kind_id + "\'" +' )">' + obj.report_subtitle +'</button>';
			        		test += '<button class="btn btn-primary btn-lab " onclick="callInpRecordLab(' +"\'"+ rowobject.record_date +"\',\'" + obj.kind_id + "\',\'"+rowobject.start_date+"\',\'"+rowobject.end_date+"\'"+' )"><img alt="檢驗" src="/FangEmrServices/img/24_lab.png">' + obj.report_subtitle +'</button>&nbsp;';

		        		}
		        		
		        		
		        		if(obj.cat_name){
//			        		test += '<button class="btn btn-primary btn-lab" onclick="callXray(' + "'date',\'" + obj.cat_type + "\'" +' )">' + obj.cat_name +'X光</button>';
			        		test += '<button class="btn btn-primary btn-lab " onclick="callInpRecordXray(' +"\'"+ rowobject.record_date +"\',\'" + obj.cat_type + "\',\'"+rowobject.start_date+"\',\'"+rowobject.end_date+"\'"+' )"><img alt="影像" src="/FangEmrServices/img/24_xray.png"> ' + obj.cat_name +'X光</button>&nbsp;';
			        		
		        		}	

					});
		        	
		        	return test;
	        }},
//	        { label: '其他 影像 檢驗', name: 'detailData', width: 880 ,title:false,formatter: function(cellvalue, options, rowobject){
//	            var test="";
//	        	$.each(cellvalue,function(index,value){	        		
//	        		if(value != "住院病摘" && value != "護理記錄" && value != "醫囑記錄" && value != "手術"){ 
//	        			test +='<button type="button" class="btn btn-primary" style="width:90px;">'+ value +'</button>';
//	        		}	        		
//	            })
//	        	return test;
//	        }}
	        
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	
        },
        hoverrows:false,
        width: null,
//        rowNum: Math.floor((pageHeight - 300)/33),
	    shrinkToFit:false,
	    //sortable: true,
		//pager: pagerName,
		pagerpos:'left'
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: arrayData});
	$(tableName).trigger('reloadGrid');
	//$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	
	function getSelectedRow() {
	    
	}
}