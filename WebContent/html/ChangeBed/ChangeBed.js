/**
 * 病房紀錄(尚未完成) 尚未接API
 */

var ChgBedObj = { // 病房紀錄物件
	ChgBedYear : 5,
	ChgBedSDate : "",
	ChgBedEDate : "",
	viewType :"",
	serno:0
	
};



var callChgBed = function(flag,kind){
	
	ChgBedObj.ChgBedYear = PatObj.recentYear;
	ChgBedObj.ChgBedSDate = ViewListObj.sdate;
	ChgBedObj.ChgBedEDate = ViewListObj.edate;
	ChgBedObj.viewType = ViewListObj.viewType;
	ChgBedObj.serno = ViewListObj.serno;
	
	
	if(flag == "date"){		
//		$('#ChgBedMasterDate').show();
//		document.getElementById('AdmissionMasterDate').setAttribute("title",AdmissionObj.AdmissionSDate+"-"+AdmissionObj.AdmissionEDate);
//		ChgBedListByDate();
		var title = ChgBedObj.ChgBedSDate + "-" +ChgBedObj.ChgBedEDate + "&nbsp;" + (ChgBedObj.viewType == "OPD" ? '門急紀錄':'住院紀錄') + "-查詢病房紀錄";
		 title += "<br/>&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;
		 $('#chgBedPage_Title').html(title);	//設定title內容
		 
		ajax_getChgBedListData("ChgbedService");//轉床紀錄		 
	}
	
	/**else if(flag =="year"){
		$('#AdmissionMasterDate').hide();
		ChgBedListByYear();		
	}else{
		$('#AdmissionMasterDate').hide();		
		ChgBedListByAll();		
	}**/
			
		
		 
		
	
};

var EMRChangeBedInputObj = function(empNo,sessionID,chartNo,serno,roomType,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.serno = serno;
	this.roomType = roomType;
	this.method = method;
};


//轉床紀錄 ajax ChgBedList Data
//{"empNo":"ORCL","sessionID":1,"chartNo":912473,"serno":94771,"method":"getChgbedDataByChartNoSerno"}
// ajax_getChgBedListData("ChgbedService");
var ajax_getChgBedListData = function(serviceName){
	showLoading();
	var ChgBedArray = [];
//	if(flag=="year"){
//		var cmParam = new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,AdmissionYear,"getPatinpListByChartNoYears");	
//	}else if(flag=="date"){		
		var cmParam = new EMRChangeBedInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,ChgBedObj.serno,"All","getChgbedDataByChartNoSerno");	
//	}else{
//		var cmParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getPatinpListByChartNo");//取得全部 病程紀錄
//	}
	
	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(data) {
					if (data.status == "Success") {
						$.each(data.resultSet, function(index, obj) {		
							ChgBedArray.push(obj);
						});	
						
						
																		
					} else {
						var ajaxErrMsg = data.errorMessage;						
						 noDataFound(ajaxErrMsg,"ChgBedList");
					}	

					jqGrid_ChgBedList("#ChgBedList","#ChgBedList_Pager",ChgBedArray);
					
//					if(BedKind != undefined)
//					{
//						filterBedList(BedKind);
//						BedKind = undefined;
//					}
					
					hideLoading();
					setPageVisible("chgBedPage", true);
					popUpPageFixPos("chgBedPage");		
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
	
};



//病房紀錄  jqGrid 
function jqGrid_ChgBedList(tableName,pagerName,dataArray){		
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 220,
	    colModel: [	        
	        { label: '日期', name: 'change_date', width: 100 },
	        { label: '時間', name: 'change_time', width: 100,hidden:true },
	        { label: '病歷號', name: 'chart_no', width: 90,hidden:true },
	        { label: '住院序號', name: 'serno', width: 90,hidden:true },
	        { label: '床號', name: 'bed_no', width: 120 },
	        { label: 'categories', name: 'categories', width: 120,hidden:true  },
	        { label: 'room_type', name: 'room_type', width: 120,hidden:true  },
	        { label: 'admit_days', name: 'admit_days', width: 120,hidden:true  },
	        { label: '床位類型', name: 'room_type_name', width: 140  },
//	        { label: '床位類型', name: 'room_type_name', width: 140 ,formatter: function(cellvalue, options, rowobject){
//	            return '<button type="button" class="btn btn-primary btn-sm ButtonfontSize">'+ cellvalue +'</button>';
//	           
//	        }},
	        { label: 'he_bed_no', name: 'he_bed_no', width: 100,hidden:true },	        
	        
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
	    rownumbers: true, //count 序號
	    rownumWidth:50,
		pager: pagerName,
		pagerpos:'left',
		loadComplete : function () {
//			$(this).jqGrid('setSelection', 1, true);
			$(this).jqGrid('setLabel',0, '序號');
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
//	    	$('#ProgressListHead').html($(tableName).jqGrid('getCell',rowKey,'op_date') + " " + $(tableName).jqGrid('getCell',rowKey,'full_name_c') + " 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");

	    		    		    
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}
}
