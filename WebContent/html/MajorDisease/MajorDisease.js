/**
 * 重大疾病 
 */

var MajorDiseaseArray = [{cash_type:""}];

function renderMajorDisease(){
	$(document).on('click', '#btn_Majordiseases', function(event) {
		var majorCount = $("#btn_Majordiseases").find("span").html();
		if(majorCount!="0"){
			ajax_getMajorDiseaseData("CriticalService",2);
		}else {
			alert("病患: "+PatObj.chart_no + " "+PatObj.pt_name+" 無重大疾病記錄");
		}
	
	

	});

}

/***重大疾病 ajax   
 * ajax_getMajorDiseaseData("CriticalService",1);
 * flag 1 (抓count) ; 2(抓清單)
 * ***/
var ajax_getMajorDiseaseData = function(serviceName,flag){
	var MajorDiseaseArray = [];

	//參數需修改 
	var medicineDetailParam =  new EMRAllInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getCriticalByChartNo");	

	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(medicineDetailParam))).done(
				function(data) {
					if (data.status == "Success") {
//						showLoading();
						$.each(data.resultSet, function(index, obj) {
							
							if(index == "summary"){
								$("#btn_Majordiseases").find("span").html(obj);
							 }
							
							if(index =="critical_details"){
								$.each(obj, function(index, obj_d) {
									MajorDiseaseArray.push(obj_d);

								});
							 }										
						});
						
						if(flag==2){
							setPageVisible("majorDiseasePage", true);
							popUpPageFixPos("majorDiseasePage");
							$("#majorDiseasePage_Title").html("重大疾病記錄  - 病患:"+PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
							jqGrid_MajorDiseaseList("#MajorDiseaseList","#MajorDiseaseList_Pager",MajorDiseaseArray);	
						}

						
		
					} else {
						var ajaxErrMsg = data.errorMessage;	
						 if(ajaxErrMsg.includes('No Data Found')){
							 clearGridData("MajorDiseaseList");
							 $("#btn_Majordiseases").find("span").html("0");
							 
						  }
					}
//					hideLoading();
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
};


/**重大疾病清單 ***/
function jqGrid_MajorDiseaseList(tableName,pagerName,dataArray){
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 170,
	    colModel: [
	        { label: '類別', name: 'icd_type', width: 65,hidden:false,align:'left' },
	        { label: '疾病碼', name: 'code', width:600,hidden:false,align:'left',formatter: function(cellvalue, options, rowobject){
	        	return  '<span class="" >' + filterNull(rowobject.code) +" &nbsp;"+ filterNull(rowobject.title2) +'</span>';
//	        	return  '<span class="" >' + filterNull(rowobject.code) +" &nbsp;"+ filterNull(rowobject.title2) +" &nbsp;<br/>"+ filterNull(rowobject.title1)+'</span>';
	        } },
	        
	        { label: '起始日期', name: 'start_date',align:'center', width: 100,hidden:false },
	        { label: '結束日期', name: 'end_date',align:'center', width: 100,hidden:false },
	        
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
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
		}
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: dataArray});
	$(tableName).jqGrid('sortGrid','code', true, 'asc');
	$(tableName).trigger('reloadGrid');

	
	function getSelectedRow() {
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    if (rowKey){
    		    
	    }
	    else{
//	        alert("沒有資料被選擇");
	    }
	}
}



