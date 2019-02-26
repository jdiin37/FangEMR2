
var OpdOrderObj = {
	year : 5,
	sDate : "",
	eDate : "",
	viewType: "",
	serno:0
};

var getOpdacntByPatinpObj = function(empNo,sessionID,chartNo,serno,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.serno = serno;
	this.method = method;
	
};

var OpdOrderArray=[];

//var getUdd2Obj = function(empNo,sessionID,chartNo,serno,method){
//	this.empNo = empNo;
//	this.sessionID = sessionID;
//	this.chartNo = chartNo;
//	this.serno = serno;
//	this.method = method;
//	
//};

var acntDateObj = function(acnt_date){
	this.acnt_date = acnt_date;
	
}; 

function renderUD(){
	
	$(document).on('change', 'input:radio[name="opdRadio"]', function(event) {
		var radio = event.target;
		var radioValue ="";
		if(radio.checked){
			radioValue = radio.value;
//			console.log("UD"+radioValue);
//			document.getElementById("opdRadioValue").innerHTML = radioValue;
			switchOpdOrderPriceType(radioValue);
			
			

		}

	});
}

function switchOpdOrderPriceType(choice){
	
	switch(choice){
	case '全部':
		jqGrid_OpdOrderDetailList("#OpdOrderDetailList","#OpdOrderDetailList_Pager",OpdOrderArray);
    break;
	
	case '藥品':
		jqGrid_OpdOrderDetailList("#OpdOrderDetailList","#OpdOrderDetailList_Pager",setOpdOrderPriceTypeArray(OpdOrderArray,"1"));	
	break;
	
	case '處置':
		jqGrid_OpdOrderDetailList("#OpdOrderDetailList","#OpdOrderDetailList_Pager",setOpdOrderPriceTypeArray(OpdOrderArray,"2"));	
	break;
	
	case '材料':
		jqGrid_OpdOrderDetailList("#OpdOrderDetailList","#OpdOrderDetailList_Pager",setOpdOrderPriceTypeArray(OpdOrderArray,"3"));		
	break;
    default:
	
	}
}


// Call 門急轉住醫囑清單
var callOPDOrder = function(){

	$('input:radio[name="opdRadio"]:first').prop("checked", true).trigger('change');//切回radioButton 值 為 全部
	
	

	OpdOrderObj.year = PatObj.recentYear;
	OpdOrderObj.viewType = "INP";
	OpdOrderObj.serno = $("#inpRecordSerno").html();
	OpdOrderObj.sDate = $("#inpRecordStartDate").html();
	OpdOrderObj.eDate = $("#inpRecordEndDate").html();


	/**測試用 需刪除**/
//	 setPageVisible("opdOrderPage", true);
//	 popUpPageFixPos("opdOrderPage");
//	 zIndex -=1; //目的是為了要讓 ud移到 住院紀錄的上層
//	 $('#inpRecordPage').css('z-index', zIndex);
	 /**測試用 需刪除***/
	 
	ajax_getOpdOrderList("OpdacntService"); //門急轉住醫囑清單 需修改
		 
		 var title = OpdOrderObj.sDate + "-" +OpdOrderObj.eDate + "&nbsp;" + (OpdOrderObj.viewType == "OPD" ? '門急記錄':'住院記錄') + "-門急轉住醫囑";
		 title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age +" 歲" ;
		 $('#opdOrderPage_Title').html(title);	//設定title內容
		 //UD標頭

}


/**呼叫UD API**/
var ajax_getOpdOrderList = function(serviceName){
	showLoading();
	OpdOrderArray=[];
	var cmParam = new getOpdacntByPatinpObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,OpdOrderObj.serno,"getqueryOpdacntByPatinp");			

	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
			function(data) {
				
					if (data.status == "Success") {
						//console.log(data.resultSet.length);
						$.each(data.resultSet, function(index, obj) {
							OpdOrderArray.push(obj);

						});
						
//						var acntDateArray = [];
//						var acntDate = OpdOrderArray.map(function(obj) { return obj.acnt_date; }); 
//						
//						acntDate = acntDate.filter(function(v,i) { 
//							return acntDate.indexOf(v) == i; //過濾重複的日期，return true;
//							
//						});  
//						
//						for(var i=0;i<acntDate.length;i++){
//							var actObj = new acntDateObj(acntDate[i]);
//							acntDateArray.push(actObj);	
//						}
						
					
//							jqGrid_UdList("#UdList","#UdList_Pager",acntDateArray); //帳款日期
						jqGrid_OpdOrderDetailList("#OpdOrderDetailList","#OpdOrderDetailList_Pager",OpdOrderArray);
							hideLoading();
							 setPageVisible("opdOrderPage", true);
							 popUpPageFixPos("opdOrderPage");
							 zIndex -=1; //目的是為了要讓 ud移到 住院紀錄的上層
							 $('#inpRecordPage').css('z-index', zIndex);
						
						
						 
						
					} else {
					  hideLoading();
					  var ajaxErrMsg = data.errorMessage;					 
//					  noDataFound(ajaxErrMsg,"UdList");
					  noDataFound(ajaxErrMsg,"OpdOrderDetailList");
					  if(ajaxErrMsg.includes('No Data Found')){
						  alert("查無門急轉住醫囑");
					  }
					  
					}
					
					
			
						
			
					
					
					
					
					
					
				
			});

    request.onreadystatechange = null;
	request.abort = null;
	request = null;
	
}


var setOpdOrderDetailArray = function(originalArray,filterVal){
    
    var newArr = $.grep(originalArray,function(o,index){
//    	 console.log((o.acnt_date==filterVal));
        return (o.acnt_date==filterVal);
     });
    
    return newArr;
};

var setOpdOrderPriceTypeArray = function(originalArray,priceType){
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
			//$('input:radio[name="opdRadio"]:first').prop("checked", true).trigger('change');//切換帳款日期時 都先切回radioButton 值 為 全部
//			jqGrid_OpdOrderDetailList("#OpdOrderDetailList","#OpdOrderDetailList_Pager",setOpdOrderDetailArray(OpdOrderArray,acnt_date));
//	    	$('#UdListHead').html($(tableName).jqGrid('getCell',rowKey,'acnt_date') + " 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");    
//	    	document.getElementById("udAcntValue").innerText = acnt_date;
//	    	$("#udAcntValue").html(acnt_date);

		}else{
			 alert("沒有資料被選擇");
		}
  
	}
}



var jqGrid_OpdOrderDetailList = function(tableName,pagerName,arrayData){
	 var tableGrid = $(tableName);
	 	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 220,
	    colModel: [      
	    	    { label: '序', name: 'rec_count', width: 50,hidden:false,align:'center',frozen:true},
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
				{ label: '開始日期', name: 'start_date', width: 110,formatter: formatDateTime,align:'left'},
				{ label: '時間', name: 'start_time', width: 100,formatter: formatDateTime,align:'center'},
				{ label: 'DC日期', name: 'end_date', width: 110,formatter: formatDateTime,align:'left'},
				{ label: '時間', name: 'end_time', width: 100,formatter: formatDateTime,align:'center'},
				{ label: '加成', name: 'add_rate', width: 100,align:'right'},
				{ label: '金額', name: 'amt', width: 100,align:'right'},
				{ label: '自費', name: 'self', width: 50,align:'center'},
				{ label: '庫別', name: 'stock', width: 60,align:'left'},
				{ label: '醫師', name: 'doctor_name', width: 70,align:'center'},
//				{ label: '手術醫師', name: 'op_doctor_no', width: 70},
//				{ label: '開刀部位', name: 'order_pos', width: 80,align:'left'},
				{ label: '批價員', name: 'cashier_name', width: 70,align:'center'},
				{ label: '補差額', name: 'he_add_fee', width: 100,align:'right'},
//				{ label: '折扣', name: 'acnt_discount', width: 100},
//				{ label: '折扣註記', name: 'acnt_discount_remark', width: 100},
				{ label: '影像來源', name: 'dicom_flag', width: 100,align:'left'},
				{ label: '事前審查編號', name: 'project_no', width: 115,align:'left'},
			
	      
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    onSelectRow:getSelectedRow,
	    shrinkToFit: false,
	    sortable: false,
		pager: pagerName,
		width: null,
		pagerpos:'left',
		gridComplete: function () {

       }
		
		
	});
//	$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: arrayData});
//	$(tableName).jqGrid('setFrozenColumns');
	$(tableName).trigger('reloadGrid');
//	$(tableName).jqGrid("navGrid", pagerName,
//			{ add: false, edit: false, del: false, search: true, view: true, refresh: false });

	function getSelectedRow() {
		
		 var grid = $(tableName);
		 var rowKey = grid.jqGrid('getGridParam',"selrow");		
		if(rowKey){	    	
//			var reportNo = $(tableName).jqGrid('getCell',rowKey,'lab_reportno');
	    	
		}else{
//			 alert("沒有資料被選擇");
		}
   
	}
}




