/**
 * 入院病摘 專用 js檔
 */
var AdmissionObj = { // 入院病摘物件
	AdmissionYear : 5,
	AdmissionSDate : "",
	AdmissionEDate : "",
	viewType :"",
	serno:0
	
};

//入院病摘 input year 監聽器
function renderAdmission(){
			
	$(document).on('change', '#AdmissionYear', function(event) {
		if ($(this).val().length > 0 && years_regex.test($(this).val())) { // 驗證回傳值
			stateChange(true, '#AdmissionYear');
			AdmissionObj.AdmissionYear = $(this).val();
			//showLoading();
			AdmissionListByYear();	//尚未完成 1070125
		} else {
			stateChange(false, '#AdmissionYear', "請輸入1-100之間");
		}
	});	
}


/**
 * 病程紀錄 (尚未完成) 尚未接API
 * */
var callAdmission = function(flag){
	
	AdmissionObj.AdmissionYear = PatObj.recentYear;
	AdmissionObj.AdmissionSDate = ViewListObj.sdate;
	AdmissionObj.AdmissionEDate = ViewListObj.edate;
	AdmissionObj.viewType = ViewListObj.viewType;
	AdmissionObj.serno = ViewListObj.serno;
	
	if(flag == "date"){		
		$('#AdmissionMasterDate').show();
		document.getElementById('AdmissionMasterDate').setAttribute("title",AdmissionObj.AdmissionSDate+"-"+AdmissionObj.AdmissionEDate);
		AdmissionListByDate();
	}else if(flag =="year"){
//		PatObj.recentYear = $("#recentYear").val();
		$('#AdmissionMasterDate').hide();
		AdmissionListByYear();		
	}else{
		$('#AdmissionMasterDate').hide();		
		AdmissionListByAll();		
	}
	
	
	
		
		 setPageVisible("admissionPage", true);
		 popUpPageFixPos("admissionPage");
		 
		
	
};




//呼叫 入院病摘   日期範圍清單
var AdmissionListByDate = function(){
	//取得 日期範圍的入院病摘
	alert("建置中---AdmissionListByDate");
	$('#AdmissionYear').val(AdmissionObj.AdmissionYear);
	 var title = AdmissionObj.AdmissionSDate + "-" +AdmissionObj.AdmissionEDate + "&nbsp;" + (AdmissionObj.viewType == "OPD" ? '門急紀錄':'住院紀錄') + "-入院病摘";
	 title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;
	 $('#admissionPage_Title').html(title);	//設定title內容
//	ajax_getProgressListData("Date");
};

var AdmissionListByYear = function(){
	//取得 年範圍的 入院病摘

	$('#AdmissionMasterYear').html( AdmissionObj.AdmissionYear+ '年入院病摘&nbsp;<span class="badge">'+ "test" + '</span>');
	var title = "入院病摘" + $('#PatInfo').text();
	$('#admissionPage_Title').html(title);	//設定title內容
	alert("建置中---AdmissionListByYear");
//	ajax_getProgressListData("Year");
};

var AdmissionListByAll = function(){
	//取得 全部範圍的 入院病摘
	var title = "入院病摘" + $('#PatInfo').text();
	$('#admissionPage_Title').html(title);	//設定title內容
	alert("建置中---AdmissionListByAll");
//	ajax_getProgressListData("All");
};



//ajax 取得 入院病摘 清單資料 (尚未完成  需接API)
var ajax_getAdmissionListData = function(flag,serviceName,AdmissionYear){
	showLoading();
	var AdmissionArray = [];
	if(flag=="year"){
		var cmParam = new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,AdmissionYear,"getPatinpListByChartNoYears");	
	}else if(flag=="date"){		
		var cmParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ProgressObj.ProgressSDate,ProgressObj.ProgressEDate,"getLabCountByChartNoDateRangeGroupByKind");	
	}else{
		var cmParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getPatinpListByChartNo");//取得全部 病程紀錄
	}
	
	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(data) {
					if (data.status == "Success") {
						
						if(data.resultSet.length==0&&flag=="year"){
						$('#AdmissionMasterYear').html(InpYear + '年入院病摘&nbsp;<span class="badge">'+ 0 + '</span>');
						}else{
							$.each(data.resultSet, function(index, obj) {		
								AdmissionArray.push(obj);
								 if(flag=="year"){
								  $('#AdmissionMasterYear').html(InpYear + '年入院病摘&nbsp;<span class="badge">'+ data.resultSet.length + '</span>');
								 }											
								});	
						}
						
						
					} else {
						var ajaxErrMsg = data.errorMessage;
						 if(flag=="year"){
					     $('#AdmissionMasterYear').html(InpYear + '年入院病摘&nbsp;<span class="badge">'+ 0 + '</span>');
						}
						 noDataFound(ajaxErrMsg,"AdmissionList");
					}	

					jqGrid_AdmissionList("#AdmissionList","#AdmissionList_Pager",AdmissionArray);
					hideLoading();
					setPageVisible("admissionPage", true);
					popUpPageFixPos("admissionPage");		
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
	
};


// jqGrid 病程紀錄清單

function jqGrid_AdmissionList(tableName,pagerName,dataArray){		
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 220,
	    colModel: [
	        { label: '年分', name: 'years', width: 45 },
	        { label: '手術日期', name: 'op_date', width: 80 },
	        { label: '病歷號', name: 'chart_no', width: 90,hidden:true },
	        { label: '住院序號', name: 'serno', width: 90,hidden:true },
	        { label: '手術時間', name: 'times', width: 90,hidden:true },
	        { label: 'inp_opd', name: 'inp_opd', width: 90,hidden:true },
	        { label: 'code', name: 'code', width: 90,hidden:true },
	        { label: '手術名稱', name: 'full_name_c', width: 120,hidden:true },	       
	        { label: '手術名稱', name: 'full_name_c', width: 306 ,formatter: function(cellvalue, options, rowobject){
	        	if(cellvalue.length>25){
	        	return '<button type="button" class="btn btn-primary btn-sm">'+ cellvalue.substr(0, 25)+"..." +'</button>';
	        	}else{
		            return '<button type="button" class="btn btn-primary btn-sm">'+ cellvalue +'</button>';	
	        	}
//	            return '<button type="button"  onclick="XrayTypeBtnClick('+"\'" + rowobject.cat_type+"\'"+');" class="btn btn-primary btn-sm">'+ cellvalue +'</button>';
//	        	return '<button type="button"  onclick="XrayTypeBtnClick('+"\'" + rowobject.cat_type+"\'"+",\'"+rowobject.chart_no+"\'"+",\'"+rowobject.xray_type+"\'"+');"class="btn btn-primary btn-sm">'+ cellvalue +'</button>';
	        }},
	        
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
	    if (rowKey){
	    	$('#ProgressListHead').html($(tableName).jqGrid('getCell',rowKey,'op_date') + " " + $(tableName).jqGrid('getCell',rowKey,'full_name_c') + " 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");

	    		    		    
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}
}



