/**
 * 
 */

var UdObj = {
	UdYear : 5,
	UdSDate : "",
	UdEDate : "",
	viewType: "",
	serno:0
};

var UDArray=[];

var getUdd2Obj = function(empNo,sessionID,chartNo,serno,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.serno = serno;
	this.method = method;
	
};

var acntDateObj = function(acnt_date){
	this.acnt_date = acnt_date;
	
}; 

function renderUD(){
	
	$(document).on('change', 'input:radio[name="udRadio"]', function(event) {
		var radio = event.target;
		var radioValue ="";
		if(radio.checked){
			radioValue = radio.value;
//			console.log("UD"+radioValue);
//			document.getElementById("udRadioValue").innerHTML = radioValue;
			switchUdPriceType(radioValue);
			
			

		}

	});
}

function switchUdPriceType(choice){
	
	switch(choice){
	case '全部':
	jqGrid_UdDetailList("#UdDetailList","#UdDetailList_Pager",UDArray);
    break;
	
	case '藥品':
	jqGrid_UdDetailList("#UdDetailList","#UdDetailList_Pager",setUdPriceTypeArray(UDArray,"1"));	
	break;
	
	case '處置':
	jqGrid_UdDetailList("#UdDetailList","#UdDetailList_Pager",setUdPriceTypeArray(UDArray,"2"));	
	break;
	
	case '材料':
	jqGrid_UdDetailList("#UdDetailList","#UdDetailList_Pager",setUdPriceTypeArray(UDArray,"3"));		
	break;
    default:
	
	}
}


// Call ud用藥紀錄 (尚未完成) 尚未接上API
var callUD = function(flag,kind){
//	  console.log("EventTarget:"+event.target.id);
//	  console.log(zIndex);
	$('input:radio[name="udRadio"]:first').prop("checked", true).trigger('change');//切回radioButton 值 為 全部

	UdObj.UdYear = PatObj.recentYear;
	UdObj.viewType = "INP";
	UdObj.serno = $("#inpRecordSerno").html();
	UdObj.UdSDate = $("#inpRecordStartDate").html();
	UdObj.UdEDate = $("#inpRecordEndDate").html();
	
//	UdObj.UdSDate = ViewListObj.sdate;
//	UdObj.UdEDate = ViewListObj.edate;
//	UdObj.serno = ViewListObj.serno;

	 
	ajax_getUdList("Udd2Service");
		 
		 var title = UdObj.UdSDate + "-" +UdObj.UdEDate + "&nbsp;" + (UdObj.viewType == "OPD" ? '門急紀錄':'住院紀錄') + "-UD用藥紀錄";
		 title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age +" 歲" ;
		 $('#udPage_Title').html(title);	//設定title內容
		 //UD標頭
	     $('#UdListHead').html(" 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲 "+UdObj.UdSDate+"-"+UdObj.UdEDate+" UD用藥紀錄");    

		 	
	/**if(flag == "date"){		
		$('#LabMasterDate').show();
		LabListByDate();
	}else if(flag =="year"){
		PatObj.recentYear = $("#recentYear").val();
		$('#LabMasterDate').hide();
		LabListByYear();		
	}else{
		$('#LabMasterDate').hide();		
		LabListByAll();		
	}**/
		
	//$('#UDYear').val(PatObj.recentYear);
	//$('#UDMasterYear').html(PatObj.recentYear + '年檢驗&nbsp;<span class="badge">'+ $("#yearsLAB").html() + '</span>');
	//$('#UDMasterAll').find("span").html($("#allLAB").html());  //先帶入全部的count值
	
	//collapseHide("mainPage");
}


/**呼叫UD API**/
var ajax_getUdList = function(serviceName){
	showLoading();
	UDArray=[];
	var cmParam = new getUdd2Obj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,UdObj.serno,"getUdd2ByChartNoSerno");			

	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
			function(data) {
				
					if (data.status == "Success") {
						//console.log(data.resultSet.length);
						$.each(data.resultSet, function(index, obj) {
							UDArray.push(obj);

						});
						
						var acntDateArray = [];
						var acntDate = UDArray.map(function(obj) { return obj.acnt_date; }); 
						
						acntDate = acntDate.filter(function(v,i) { 
							return acntDate.indexOf(v) == i; //過濾重複的日期，return true;
							
						});  
						
						for(var i=0;i<acntDate.length;i++){
							var actObj = new acntDateObj(acntDate[i]);
							acntDateArray.push(actObj);	
						}
						
					
//							jqGrid_UdList("#UdList","#UdList_Pager",acntDateArray); //帳款日期
							jqGrid_UdDetailList("#UdDetailList","#UdDetailList_Pager",UDArray);
							hideLoading();
							 setPageVisible("udPage", true);
							 popUpPageFixPos("udPage");
							 zIndex -=1; //目的是為了要讓 ud移到 住院紀錄的上層
							 $('#inpRecordPage').css('z-index', zIndex);
						
						
						 
						
					} else {
					  hideLoading();
					  var ajaxErrMsg = data.errorMessage;					 
					  noDataFound(ajaxErrMsg,"UdList");
					  noDataFound(ajaxErrMsg,"UdDetailList");
					  if(ajaxErrMsg.includes('No Data Found')){
						  alert("查無UD用藥紀錄");
					  }
					  
					}
					
					
			
						
			
					
					
					
					
					
					
				
			});

    request.onreadystatechange = null;
	request.abort = null;
	request = null;
	
}

var filterUdList = function(kind){
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"price_type",op:"eq",data:kind});	
	$("#UdDetailList").setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid',[{page:1}]);
}
var setUdDetailArray = function(originalArray,filterVal){
    
    var newArr = $.grep(originalArray,function(o,index){
//    	 console.log((o.acnt_date==filterVal));
        return (o.acnt_date==filterVal);
     });
    
    return newArr;
};

var setUdPriceTypeArray = function(originalArray,priceType){
	  var newArr = $.grep(originalArray,function(o,index){
	        return (o.price_type==priceType);
	     });
	    
	    return newArr;
};


//UD 日期清單
var jqGrid_UdList = function(tableName,pagerName,arrayData){
	 var tableGrid = $(tableName);
	 	$(tableName).jqGrid({
	    datatype: "local",
//	    rowNum: Math.floor((pageHeight - 220)/33),
	    rowNum: 5000,
	    height: pageHeight - 220,
	    pagerpos:'left',
	    width:null,
	    viewrecords:false,
	    colModel: [
//	    { label: '帳款日期',name: 'acnt_date', width: 100,formatter: function(cellvalue, options, rowobject){
//            return '<span  onclick="filterUdList('+"\'" + rowobject.acnt_date+"\'"+');">'+ rowobject.acnt_date +'</span>';
//
//        }},
        {label: '帳款日期',name: 'acnt_date', width: 100},
        	       	      
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    onSelectRow:getSelectedRow,
	    shrinkToFit: false,
//	    sortable:true,  //可否拖曳排序
//		pager: pagerName,
		gridComplete: function () {
			$(this).jqGrid('setSelection', 1, true);
      }
		
		
	});
//	$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {data: arrayData});
	$(tableName).trigger('reloadGrid');
//	$(tableName).jqGrid("navGrid", pagerName,
//			{ add: false, edit: false, del: false, search: true, view: true, refresh: false });

	function getSelectedRow(rowId,status,e) {
		
		var grid = $(tableName);
		var rowKey = grid.jqGrid('getGridParam',"selrow");		
		if(rowKey){
			var acnt_date = $(tableName).jqGrid('getCell',rowKey,'acnt_date');
//			console.log("UD"+acnt_date);
//			filterUdList(acnt_date);
			//$('input:radio[name="udRadio"]:first').prop("checked", true).trigger('change');//切換帳款日期時 都先切回radioButton 值 為 全部
			jqGrid_UdDetailList("#UdDetailList","#UdDetailList_Pager",setUdDetailArray(UDArray,acnt_date));
//	    	$('#UdListHead').html($(tableName).jqGrid('getCell',rowKey,'acnt_date') + " 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");    
//	    	document.getElementById("udAcntValue").innerText = acnt_date;
//	    	$("#udAcntValue").html(acnt_date);

		}else{
			 alert("沒有資料被選擇");
		}
  
	}
}



/***UD 用藥紀錄***/
var udRowKey;
var jqGrid_UdDetailList = function(tableName,pagerName,arrayData){
	 var tableGrid = $(tableName);
	 	$(tableName).jqGrid({
	    datatype: "local",
//	    rowNum: Math.floor((pageHeight - 220)/33),
	    height: pageHeight - 220,
	    width:null,
	    sortcolumn: 'rec_count',
	    sortdirection: 'asc',
	    colModel: [
	        { label: '序', name: 'rec_count', width: 40,search:false,hidden:false,align:'center'},
//	    	{ label: '帳款日期',name: 'acnt_date', width: 100,hidden:true},
	        { label: '1.藥品  2.處置  3.材料', name: 'price_type', width: 150,hidden:true},
//	        { label: '1.藥品  2.處置  3.材料', name: 'price_type', width: 150,formatter:formatUDPriceType},
	        { label: '用藥名稱', name: 'full_name',width: 400,align:'left'},
	        { label: '單次量', name: 'qty', width: 70,align:'right'},
			{ label: '單位', name: 'unit', width: 70,align:'center'},
	        { label: '非常規', name: 'unuse', width: 70,align:'left'},
	        { label: '常規用法', name: 'use', width: 80,align:'left'},
//			{ label: '單位', name: 'use_name_e', width: 70,align:'left'},
			{ label: '總量', name: 'tqty', width: 50,align:'right'},
			{ label: '單位', name: 'unit', width: 60,align:'center'},
			{ label: '途徑', name: 'method_name_e', width: 60,align:'left'},
			{ label: '開始日期', name: 'start_date', width: 110,align:'left',formatter: formatDateTime},
			{ label: '時間', name: 'start_time', width: 70,align:'center',formatter: formatDateTime},
			{ label: 'DC日期', name: 'dc_date', width: 110,align:'left',formatter: formatDateTime},
			{ label: '時間', name: 'dc_time', width: 70,align:'center',formatter: formatDateTime},
			{ label: '批價代號', name: 'code', width: 100,align:'left'},
			{ label: '自費', name: 'self', width: 50,align:'center'},
			{ label: '庫別', name: 'stock', width: 60,align:'left'},
			{ label: '醫師', name: 'doctor_name', width: 100,align:'center'},
			{ label: '輸入員', name: 'keyin_clerk_name', width: 100,align:'center'},
			{ label: '就醫科別', name: 'div_name', width: 100,align:'center'},
			{ label: '首日量', name: 'first_tqty', width: 70,align:'right'},
//			{ label: '執行人員', name: 'exec_clerk', width: 100},
//			{ label: '吃藥次數', name: 'do_status', width: 100,formatter: formatDoStatus},
			
	      
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    onSelectRow:getSelectedRow,
	    shrinkToFit: false,
//	    sortable:true,  //可否拖曳排序
		pager: pagerName,
		gridComplete: function () {
			tableGrid.setSelection(udRowKey, true);
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
//			var reportNo = $(tableName).jqGrid('getCell',rowKey,'lab_reportno');
	    	
		}else{
			 alert("沒有資料被選擇");
		}
   
	}
}


/** 1.藥品/2.處置/3.材料**/
function formatUDPriceType(cellValue, options, rowObject) {
	
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

/**formatter 吃藥次數**/
function formatDoStatus(cellValue, options, rowObject) {
    	 
    	 var total = cellValue.length;
    	 var searchO = cellValue.indexOf("O");
    	 var searchX = cellValue.indexOf("X");
//    	 console.log(searchX);
    	 
    	 if(searchX==0){
    		 return searchX+"/"+total;
    	 }else if(searchX>1){
    		 return searchX+"/"+total;
    	 }else{
    		 if(cellValue.indexOf("X")==-1){
    			 return total+"/"+total;
    		 }else{
    			 return (searchO+1)+"/"+total;
    		 }
    	 }
//    	 OOXX
    	/** if(cellValue.indexOf("X")==-1){  //如果都沒X 表示都有吃藥  
    		 return total+"/"+total;
    	 }else if(cellValue.indexOf("O")==-1){  //如果都沒 O 表示都沒吃藥
    		 return "0"+"/"+total;
    	 }else{
    		if(cellValue.){
    			
    		} 
    	 }  **/
    	 
    	  
              };

