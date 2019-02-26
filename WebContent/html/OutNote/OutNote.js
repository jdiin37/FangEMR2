/**
 * 出院病摘畫面 專用 js檔
 */
var OutNoteObj = { // 出院病摘物件
	OutNoteYear : 5,
	OutNoteSDate : "",
	OutNoteEDate : "",
	viewType :"",
	serno:0
	
};

function renderOutNote(){
			
	$(document).on('change', '#OutNoteYear', function(event) {
		if ($(this).val().length > 0 && years_regex.test($(this).val())) { // 驗證回傳值
			stateChange(true, '#OutNoteYear');
			OutNoteObj.OutNoteYear = $(this).val();
			//showLoading();
			OutNoteListByYear();	//尚未完成 1070125
		} else {
			stateChange(false, '#OutNoteYear', "請輸入1-100之間");
		}
	});	
}


/**
 * 出院病摘 (尚未完成) 尚未接API
 * */
var callOutNote = function(flag){
	
	OutNoteObj.OutNoteYear = PatObj.recentYear;
	OutNoteObj.OutNoteSDate = ViewListObj.sdate;
	OutNoteObj.OutNoteEDate = ViewListObj.edate;
	OutNoteObj.viewType = ViewListObj.viewType;
	OutNoteObj.serno = ViewListObj.serno;
	
	if(flag == "date"){		
		$('#OutNoteMasterDate').show();
		document.getElementById('OutNoteMasterDate').setAttribute("title",OutNoteObj.OutNoteSDate+"-"+OutNoteObj.OutNoteEDate);
		OutNoteListByDate();
	}else if(flag =="year"){
//		PatObj.recentYear = $("#recentYear").val();
//		$('#OutNoteMasterDate').hide();
		OutNoteListByYear();		
	}else{
//		$('#OutNoteMasterDate').hide();		
		OutNoteListByAll();		
	}
		
	 $('#OutNoteYear').val(OutNoteObj.OutNoteYear);
//	 $('#OutNoteMasterYear').html(OutNoteObj.OutNoteYear + '年出院病摘&nbsp;<span class="badge">'+ $("#yearsINP").html() + '</span>');
//	 $('#OutNoteMasterAll').find("span").html($("#allINP").html());  //先帶入全部的count值
		 
		
	
};




//呼叫 OutNote 單次住院紀錄  日期範圍清單
var OutNoteListByDate = function(){
	//取得 日期範圍的 OutNote
	ajax_getOutNoteListData("date","PatinpService");
	 var title = OutNoteObj.OutNoteSDate + "-" +OutNoteObj.OutNoteEDate + "&nbsp;" + (OutNoteObj.viewType == "OPD" ? '門急紀錄':'住院紀錄') + "-出院病摘";
	 title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;
	 $('#outNotePage_Title').html(title);	//設定title內容
};

var OutNoteListByYear = function(){
	
	ajax_getOutNoteListData("year","PatinpService",OutNoteObj.OutNoteYear);
	var title = OutNoteObj.OutNoteYear+"年-出院病摘" + $('#PatInfo').text();
	$('#outNotePage_Title').html(title);	//設定title內容
	
//	var title = "出院病摘" + $('#PatInfo').text();
//	$('#outNotePage_Title').html(title);	//設定title內容
//	$('#OutNoteMasterYear').html( OutNoteObj.OutNoteYear+ '年出院病摘&nbsp;<span class="badge">'+ "test" + '</span>');
//	alert("建置中---OutNoteListByYear");
//	getOutNoteList("Year");
};

var OutNoteListByAll = function(){
	//取得 全部範圍的 OutNote
	ajax_getOutNoteListData("all","PatinpService");
	var title = "全部出院病摘" + $('#PatInfo').text();
	$('#outNotePage_Title').html(title);
//	alert("建置中---OutNoteListByAll");
//	getOutNoteList("All");
};

//取得住院清單  
var ajax_getOutNoteListData = function(flag,serviceName,InpYear){
	showLoading();
	var OutNoteArray = [];
	if(flag=="year"){
		var cmParam = new EMRYearsInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,InpYear,"getPatinpListByChartNoYears");	
	}else if(flag=="date"){
		var cmParam = new EMRDateRangeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OutNoteObj.OutNoteSDate,OutNoteObj.OutNoteEDate,"getPatinpListByChartNoDateRange");
	}else{
		var cmParam = new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getPatinpListByChartNo");
	}
	
	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(data) {
					if (data.status == "Success") {
						
							$.each(data.resultSet, function(index, obj) {		
								OutNoteArray.push(obj);								
								 
								});	
					
						
						
					} else {
						ajaxErrMsg = data.errorMessage;
						 noDataFound(ajaxErrMsg,"OutNoteList");
					}	

					jqGrid_OutNoteList("#OutNoteList","#OutNoteList_Pager",OutNoteArray);
					hideLoading();
					setPageVisible("outNotePage", true);
					popUpPageFixPos("outNotePage");		
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
	
};



//jqGrid 出院病摘 
function jqGrid_OutNoteList(tableName,pagerName,dataArray){		
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
		    { label: '住院期間', name: 'start_date' ,width: 160,formatter:function(cellvalue, options, rowobject){	    		    	
		    	return "<span class=''>"+cellvalue + "</span> - " +
		    	"<span class=''>"+filterNull(rowobject.end_date) + "</span>";
		    }},
//	        { label: '主因', name: 'title2', width: 200 },
	        { label: '主治醫師', name: 'doctor_name', width: 75 },
	        { label: '科別', name: 'div_name', width: 100 },
//	        { label: '出院病摘', name: 'code', width: 80 ,formatter: function(cellvalue, options, rowobject){
//	            return '<button type="button" class="btn btn-primary btn-sm">'+ "出院病摘" +'</button>';
//	            return '<button type="button"  onclick="showOutNoteBtnClick();" class="btn btn-primary btn-sm">'+ "出院病摘" +'</button>';
//	            return '<button type="button"  onclick="showOutNoteBtnClick('+"\'" + rowobject.start_date+"\',"+"\'"+rowobject.end_date+"\'"+');" class="btn btn-primary btn-sm">'+ "出院病摘" +'</button>';

//	        }},
	        
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
//	    scroll :true, //隨著滾輪改變頁數
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	
        },
        width: null,
//        rowNum: Math.floor((pageHeight - 220)/33),
	    shrinkToFit:false,
	    sortable: false,
	    rownumbers: true, //count 序號
	    rownumWidth:50,
//	    loadtext:"資料載入中...",
		pager: pagerName,
		pagerpos:'left',
		loadComplete : function () {
			$(this).jqGrid('setSelection', 1, true);
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



//使用者點下 出院病摘清單中的某一行 後 呼叫API 取得該次出院病摘的詳細資料
function render_getOutNote(index, value) {
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
		
		case "pt_name":
		setHtml("outNote_ptName",filterNull(value));
		break;
		
		case "id_no":
		setHtml("outNote_idNo",filterNull(value));
		break;
		
		case "address":
		setHtml("outNote_address",filterNull(value));
		break;
		
		case "birth_date":
		setHtml("outNote_birthDate",filterNull(formatDateTime(value)));
		break;
		
		case "complete_date":
		setHtml("outNote_finishDay",filterNull(formatDateTime(value)));
		break;
		
		case "ckin_date":
		setHtml("outNote_ckinDate",filterNull(formatDateTime(value)));
		break;
			
		case "div_name":
		setHtml("outNote_divName",filterNull(value));
		break;
		
		case "bed_no":
		setHtml("outNote_bedNo",filterNull(value));
		break;
		
		case "discharge_date":
		setHtml("outNoteDisDate",filterNull(formatDateTime(value)));
		break;
			
		case "inout_day":
		setHtml("outNoteInoutDay",filterNull(value));
		break;
			
		case "out_name":
		setHtml("outNoteOutName",filterNull(value));
		break;
			
		case "in_diagnosis":
			setHtml("outNoteInDia",filterNull(value));
		break;
			
		case "out_diagnosis":
		setHtml("outNoteOutDia",filterNull(value));
		break;
		
		case "cc":
		setHtml("outNoteCC",filterNull(value));
		break;
			
		case "ph":
		setHtml("outNotePH",filterNull(value));
		break;
			
		case "ph1":
		setHtml("outNotePH1",filterNull(value));
		break;
			
		case "pe":
		setHtml("outNotePE",filterNull(value));
		break;
		
		case "or_desc":
		setHtml("outNoteOrDesc",filterNull(value));
		break;
			
		case "treatment":
		setHtml("outNoteTreatment",filterNull(value));
		break;
			
		case "complication":
		setHtml("outNoteComp",filterNull(value));
		break;
			
		case "general_lab":
		setHtml("outNoteGeneraLab",filterNull(value));
		break;
			
		case "special_lab":
		setHtml("outNoteSpecialLab",filterNull(value));
		break;

		case "xray_rep":
		setHtml("outNoteXrayRep",filterNull(value));
		break;
			
		case "pathologic_rep":
		setHtml("outNotePathologicRep",filterNull(value));
		break;
			
		case "other":
		setHtml("outNoteOther",filterNull(value));
		break;
			
		case "out_directory":
		setHtml("outNoteOutDirec",filterNull(value));
		break;	
default:
break;
			
	}
}



