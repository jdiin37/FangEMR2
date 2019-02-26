
var StatObj = {
	StatYear : 5,
	StatSDate : "",
	StatEDate : "",
	viewType: "",
	serno:0
};

var StatArray=[];


var getInpStatObj = function(empNo,sessionID,chartNo,serno,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.serno = serno;
	this.method = method;
	
};

var acntDateObj = function(acnt_date){
	this.acnt_date = acnt_date;
	
}; 


function renderSTAT(){
//	var stRadio = document.getElementsByName('stRadio');
//	var rate_value;
//	for(var i = 0; i < stRadio.length; i++){
//	    if(stRadio[i].checked){
//	        rate_value = stRadio[i].value;
//	    }
//	}
//	console.log(rate_value);
	
	$(document).on('change', 'input:radio[name="stRadio"]', function(event) {
		var radio = event.target;
		var radioValue ="";
		if(radio.checked){
			radioValue = radio.value;
			document.getElementById("stRadioValue").innerHTML = radioValue;
			switchStPriceType(radioValue);
			
			

		}

	});

	
}

function switchStPriceType(choice){
	var acntDate =  document.getElementById("stAcntValue").innerHTML;
//	console.log("switchStPriceType="+acntDate);
	switch(choice){
	case '全部':
    jqGrid_StatDetailList("#StatDetailList","#StatDetailList_Pager",setStatDetailArray(StatArray,acntDate));
    break;
	
	case '藥品':
	jqGrid_StatDetailList("#StatDetailList","#StatDetailList_Pager",setStPriceTypeArray(StatArray,acntDate,1));	
	break;
	
	case '處置':
	jqGrid_StatDetailList("#StatDetailList","#StatDetailList_Pager",setStPriceTypeArray(StatArray,acntDate,2));	
	break;
	
	case '材料':
	jqGrid_StatDetailList("#StatDetailList","#StatDetailList_Pager",setStPriceTypeArray(StatArray,acntDate,3));		
	break;
    default:
	
	}
}









//call STAT用藥紀錄   (尚未完成) 尚未接上API by IvyLin
var callST = function(){
	
	StatObj.StatYear = PatObj.recentYear;
	StatObj.viewType = "INP";
	
	StatObj.serno = $("#inpRecordSerno").html();
	StatObj.StatSDate = $("#inpRecordStartDate").html();
	StatObj.StatEDate = $("#inpRecordEndDate").html();
	
//	StatObj.StatSDate = ViewListObj.sdate;
//	StatObj.StatEDate = ViewListObj.edate;
//	StatObj.serno = ViewListObj.serno;

	
	ajax_getStatList("Inpcht2Service");
	
	
	

	 
	 var title = StatObj.StatSDate + "-" +StatObj.StatEDate + "&nbsp;" + (StatObj.viewType == "OPD" ? '門急紀錄':'住院紀錄') + "-STAT用藥紀錄";
	 title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age+" 歲" ;
	 $('#stPage_Title').html(title);	//設定title內容
}

/**呼叫STAT API **/
var ajax_getStatList = function(serviceName){
	showLoading();
//	UserObj.emp_no,UserObj.session_id,chartNo,serno,"getAdmissionDataByPrimaryKeys"
//	getInpStatObj = function(empNo,sessionID,chartNo,serno,method)
	var cmParam = new getInpStatObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,StatObj.serno,"getInpcht2StateByChartNoSerno");			
	StatArray=[];
	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
			function(data) {
				
					if (data.status == "Success") {
						//console.log(data.resultSet.length);
						$.each(data.resultSet, function(index, obj) {
							StatArray.push(obj);

						});
						
						var acntDateArray = [];
						var acntDate = StatArray.map(function(obj) { return obj.acnt_date; }); 
						
						acntDate = acntDate.filter(function(v,i) { 
							return acntDate.indexOf(v) == i; //過濾重複的日期，return true;
							
						});  

						
						for(var i=0;i<acntDate.length;i++){
							var actObj = new acntDateObj(acntDate[i]);
							acntDateArray.push((actObj));	
						}
									
						jqGrid_StatList("#StatList","#StatList_Pager",acntDateArray); //帳款日期
//						jqGrid_StatDetailList("#StatDetailList","#StatDetailList_Pager",StatArray);
						hideLoading();
						setPageVisible("stPage", true);
						popUpPageFixPos("stPage");
						zIndex -=1; //目的是為了要讓 st移到 住院紀錄的上層
						$('#inpRecordPage').css('z-index', zIndex);
						
					
						 
						
						
					} else {
					  var ajaxErrMsg = data.errorMessage;
					  hideLoading();
					  noDataFound(ajaxErrMsg,"StatList");
					  noDataFound(ajaxErrMsg,"StatDetailList");
					  if(ajaxErrMsg.includes('No Data Found')){
						  alert("查無STAT用藥紀錄");
					  }
					  
					  
					  
					}
					
					
					 
					 
					
					
					
					
				
			});

    request.onreadystatechange = null;
	request.abort = null;
	request = null;
	
}
//
var filterStatList = function(tableId,columnName,kind){
//	console.log("filterStatList");
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:columnName,op:"eq",data:kind});	
	$('#'+tableId).setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid',[{page:1}]);
	
}




var setStatDetailArray = function(originalArray,filterVal){
    
    var newArr = $.grep(originalArray,function(o,index){
//    	 console.log((o.acnt_date==filterVal));
        return (o.acnt_date==filterVal);
     });
    
    return newArr;
};

var setStPriceTypeArray = function(originalArray,acntDate,priceType){
	  var newArr = $.grep(originalArray,function(o,index){
//	    	 console.log((o.acnt_date==filterVal));
	        return (o.acnt_date==acntDate&&o.price_type==priceType);
	     });
	    
	    return newArr;
};


//Stat 日期清單
var jqGrid_StatList = function(tableName,pagerName,arrayData){
	 var tableGrid = $(tableName);
	 	$(tableName).jqGrid({
	    datatype: "local",
//	    rowNum: Math.floor((pageHeight - 220)/33),
	    rowNum:5000,
	    rownumbers: true,
	    rownumWidth:40,
	    height: pageHeight - 220,
	    pagerpos:'left',
	    viewrecords:false,
	    width:null,
	    colModel: [
//	    { label: '帳款日期',name: 'acnt_date', width: 100,formatter: function(cellvalue, options, rowobject){
//            return '<span  onclick="filterStatList('+"\'" + rowobject.acnt_date+"\'"+');">'+ rowobject.acnt_date +'</span>';
//
//        }},
        {label: '帳款日期',name: 'acnt_date', width: 90},
        	       	      
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    onSelectRow:getSelectedRow,
	    shrinkToFit: false,
//	    sortable:true,  //可否拖曳排序
//		pager: pagerName,
		gridComplete: function () {
			$(this).jqGrid('setSelection', 1, true);
//			$(this).jqGrid('setLabel',0, '序');
      }
		
		
	});
//	$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {data: arrayData});
	$(tableName).trigger('reloadGrid');
//	$(tableName).jqGrid("navGrid", pagerName,
//			{ add: false, edit: false, del: false, search: true, view: true, refresh: false });

	function getSelectedRow() {
		
		var grid = $(tableName);
		var rowKey = grid.jqGrid('getGridParam',"selrow");		
		if(rowKey){
			var acnt_date = $(tableName).jqGrid('getCell',rowKey,'acnt_date');

//			filterStatList(acnt_date);
//			setStatDetailArray(StatArray,acnt_date);
			$('input:radio[name="stRadio"]:first').prop("checked", true).trigger('change');//切換帳款日期時 都先切回radioButton 值 為 全部
			jqGrid_StatDetailList("#StatDetailList","#StatDetailList_Pager",setStatDetailArray(StatArray,acnt_date));
	    	$('#StatListHead').html($(tableName).jqGrid('getCell',rowKey,'acnt_date') + " 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");    
	    	document.getElementById("stAcntValue").innerText = acnt_date;	
	    
	    	
	    	/**$('input:radio[name="stRadio"]').change(function() {
	    		console.log($(this).val());
	    	   if ($(this).val() == '全部') {
	    	        console.log("first");
	    	    } else {
	    	    	console.log("second");
	    	    }
	    	});**/

		}else{
			 alert("沒有資料被選擇");
		}
  
	}
}


/**STAT**/
var stRowKey;
// var NumOfRow = Math.floor(($(window).height()-255)/36);
 var jqGrid_StatDetailList = function(tableName,pagerName,arrayData){
	 var tableGrid = $(tableName);
	 	$(tableName).jqGrid({
	    datatype: "local",
//	    scrollOffset: 0,
//	    rowNum:NumOfRow,
	    sortcolumn: 'rec_count',
	    sortdirection: 'asc',
	    height: Math.floor($(window).height()-255),
	    width:null,
	    colModel: [
	    	{ label: '序', name: 'rec_count', width: 40,search:false,hidden:false,align:'center'},
	    	{ label: '帳款日期',name: 'acnt_date', width: 100,hidden:true},
	        { label: '1.藥品  2.處置  3.材料', name: 'price_type', width: 150,hidden:true},
//	        { label: '1.藥品  2.處置  3.材料', name: 'price_type', width: 150,formatter:formatStatPriceType},
	        { label: '用藥名稱', name: 'full_name',width: 400,align:'left'},
	        
	        { label: '單次量', name: 'qty', width: 70,align:'right'},
	        { label: '用法', name: 'use_name_e', width: 70,align:'left'},
	        { label: '天數', name: 'day', width: 45,align:'right'},
			{ label: '單位', name: 'unit', width: 80,align:'center'},
	        { label: '常規用法', name: 'use', width: 80,align:'left'},
//			{ label: '單位', name: 'use_name_e', width: 70,align:'left'},
			{ label: '總量', name: 'tqty', width: 50,align:'right'},
//			{ label: '單位', name: 'unit', width: 60,align:'center'},
			{ label: '途徑', name: 'method_name_e', width: 70,align:'left'},
			{ label: '急', name: 'emg', width: 40,align:'center'},
//			{ label: '出院帶藥 Y/N', name: 'take_home', width: 100,formatter: "checkbox",edittype: "checkbox", editoptions: {value: "Y:N"},formatoptions:{disabled: true}},
			{ label: '實用量', name: 'do_tqty', width: 70,align:'right'},
			{ label: '就醫科別', name: 'div_name', width: 100,align:'center'},
			{ label: '開始日期', name: 'start_date', width: 110,formatter: formatDateTime,align:'left'},
			{ label: '時間', name: 'start_time', width: 100,formatter: formatDateTime,align:'center'},
			{ label: 'DC日期', name: 'end_date', width: 110,formatter: formatDateTime,align:'left'},
			{ label: '時間', name: 'end_time', width: 100,formatter: formatDateTime,align:'center'},
			{ label: '批價代號', name: 'code', width: 100,align:'left'},
			{ label: '加成', name: 'add_rate', width: 100,align:'right'},
			{ label: '金額', name: 'amt', width: 100,align:'right'},
			{ label: '自費', name: 'self', width: 50,align:'center'},
			{ label: '庫別', name: 'stock', width: 60,align:'left'},
			{ label: '醫師', name: 'doctor_name', width: 70,align:'center'},
//			{ label: '手術醫師', name: 'op_doctor_no', width: 70},
			{ label: '開刀部位', name: 'order_pos', width: 80,align:'left'},
			{ label: '批價員', name: 'cashier_name', width: 70,align:'center'},
			{ label: '補差額', name: 'he_add_fee', width: 100,align:'right'},
//			{ label: '折扣', name: 'acnt_discount', width: 100},
//			{ label: '折扣註記', name: 'acnt_discount_remark', width: 100},
			{ label: '影像來源', name: 'dicom_flag', width: 100,align:'left'},
			{ label: '事前審查編號', name: 'project_no', width: 115,align:'left'},
			
	      
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    onSelectRow:getSelectedRow,
	    width: null,
	    shrinkToFit: false,
//	    sortable:true,  //可否拖曳排序
		pager: pagerName,
		gridComplete: function () {
			tableGrid.setSelection(stRowKey, true);
          }
		
		
	});
//	$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {data: arrayData});
	$(tableName).trigger('reloadGrid');
//	$(tableName).jqGrid("navGrid", pagerName,
//			{ add: false, edit: false, del: false, search: true, view: true, refresh: false });

	function getSelectedRow(rowId,status,e) {
		
		if(status===true){
			//須隨之改變的html
		}
		
		stRowKey = rowId;
      
	}
	/**function getSelectedRow() {
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	   if (rowKey){        
	    	PatObj.chart_no = rowKey;
	    	showLoading();
	    	ajax_getChartByChartNo();
	    	$('#collapseMain').collapse('show');
	    	setPageVisible("queryPage",false);
	    	setPageVisible("mainPage",true);
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}  **/
}
 
 
 /** 1.藥品/2.處置/3.材料**/
 function formatStatPriceType(cellValue, options, rowObject) {
 	
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
 

 