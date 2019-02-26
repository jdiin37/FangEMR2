/**
 * 出院病摘
 */


var url = "http://172.16.2.189:8080/SHSFangEmrServices/servlets/ServletAgent";
//var url = "http://61.221.172.7:8888/SHSFangEmrServices/servlets/ServletAgent";


var ajax_url = function(path) {
	if (path == 1)
		return url;
	else if (path == 2)
		return 'servlets/ServletAgent';
}

/**
 * method : 要傳入的 API Method 名稱
 * 
 * */

function ajax_setPostData(method){
	return $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData(method),
		dataType : "json"
	});
	
}

var OutNoteInputObj = function(idNo,sessionID,chartNo,serno,method){
	this.idNo = idNo;
	this.sessionID =  parseInt(sessionID);
	this.chartNo = parseInt(chartNo);
	this.serno = parseInt(serno);
	this.method= method;
	
};

var getAjaxData = function(method) {
	var outNoteParam = new OutNoteInputObj("ORCL",1806,150408,293445,"getOutnoteByChartNoSerno");
	var outNoteChangeBedParam = new OutNoteInputObj("ORCL",1806,150408,293445,"getChgbedUnionChgdocByChartNoSerno");
	var UDParam = new OutNoteInputObj("ORCL",1806,176007,138853,"getInpcht2UDByChartNoSerno");
	var STATParam = new OutNoteInputObj("ORCL",1806,176007,297348,"getInpcht2StateByChartNoSerno");
	var FocusParam = new OutNoteInputObj("ORCL",1806,176007,297348,"getNurseProgressByChartNoSerno");
	//console.log(JSON.stringify(UDParam));
//	console.log(JSON.stringify(outNoteParam));//JS物件轉JSON
//	console.log(JSON.stringify(outNoteChangeBedParam));//JS物件轉JSON
	switch (method) {
	case "getOutnoteByChartNoSerno":
		return {
			serviceName : "OutnoteService",
			parameters : JSON.stringify(outNoteParam)
		};
		break;
	case "getChgbedUnionChgdocByChartNoSerno":
		return {
			serviceName : "OutnoteService",
			parameters : JSON.stringify(outNoteChangeBedParam)
		};
		break;
	case "getInpcht2UDByChartNoSerno":
		return {
			serviceName : "Inpcht2Service",
			parameters : JSON.stringify(UDParam)
		};
		break;
	case "getInpcht2StateByChartNoSerno":
		return {
			serviceName : "Inpcht2Service",
			parameters : JSON.stringify(STATParam)
		};
		break;
	case "getNurseProgressByChartNoSerno":
		return {
			serviceName : "NurseProgressService",
			parameters : JSON.stringify(FocusParam)
		};
		break;
	default:
		return false;
	}
}



function ajax_getOutNote() {
	
 var request = $.when(ajax_setPostData("getOutnoteByChartNoSerno")).done(
			function(data) {
					if (data.status == "Success") {
						$.each(data.resultSet, function(index, obj) {
							render_getOutNote(index, this);
						});
					} else {
					  var ajaxErrMsg = data.errorMessage;
					}							
//				hideLoading();
			});
 
    request.onreadystatechange = null;
	request.abort = null;
	request = null;
	
	

/**	var request = $.ajax({
		method : "POST",
		url : ajax_url(1),
		data : getAjaxData("getOutnoteByChartNoSerno"),
		dataType : "json"
	}).done(function(data) {
		if (data.status == "Success") {

			$.each(data.resultSet, function(index, obj) {
			
				render_getOutNote(index, this);

				
			}); 
//			setHtml("outNote_chartNo",filterNull(data.resultSet.chart_no));
		} else {
			var ajaxErrMsg = data.errorMessage;
		}
//		hideLoading();
	});
	
	request.onreadystatechange = null;
	request.abort = null;
	request = null;   **/

}


var QueryOutNoteChangeBedArray= [];
var getOutNoteChangeBedList = function() {
//	showLoading();

 var request = $.when(ajax_setPostData("getChgbedUnionChgdocByChartNoSerno")).done(
			function(dataChangeBed) {
				QueryOutNoteChangeBedArray =[];
					if (dataChangeBed.status == "Success") {
						$.each(dataChangeBed.resultSet, function(index, obj) {
							QueryOutNoteChangeBedArray.push(obj);
						});
					} else {
					  var ajaxErrMsg = dataChangeBed.errorMessage;
					}

					jqGrid_outNoteChangeBed("#changeBed","#changeBedPager",QueryOutNoteChangeBedArray);								
//				hideLoading();
			});
 
    request.onreadystatechange = null;
	request.abort = null;
	request = null;
}


var QueryFocusArray= [];
var getFocusList = function() {
//	showLoading();

 var request = $.when(ajax_setPostData("getNurseProgressByChartNoSerno")).done(
			function(focusData) {
				QueryFocusArray =[];
					if (focusData.status == "Success") {
						$.each(focusData.resultSet, function(index, obj) {
							QueryFocusArray.push(obj);
						});
					} else {
					  var ajaxErrMsg = focusData.errorMessage;
					}
					
					jqGrid_focusListData("#focusDateTable","#focusDateTablePager",QueryFocusArray);
					$("#focusDateTable").jqGrid('setSelection', 1, true); //初始化 預設選中第一個
					
//				hideLoading();
			});
 
    request.onreadystatechange = null;
	request.abort = null;
	request = null;
}



//STAT
var STATObj = {resultSet:[]};
var stAcntDateList = [];
var filterStAcntDate=[];

//UD
var UDObj = {resultSet:[]};
var udAcntDateList = [];
var filterUdAcntDate=[];

//UD全
var UDAllArray=[];
//STAT全
var STATArray=[];


/**呼叫UD API**/
var ajax_getUDDataList = function(){
	
	 var request = $.when(ajax_setPostData("getInpcht2UDByChartNoSerno")).done(
			function(data) {
				UDAllArray=[];
					if (data.status == "Success") {
						//console.log(data.resultSet.length);
						$.each(data.resultSet, function(index, obj) {
							//將 UDList放入 物件 UDObj 中
							UDAllArray.push(obj);
							render_UDDataList(index, obj);
							//console.log(obj.acnt_date);
							//console.log(obj);
						});
					} else {
					  var ajaxErrMsg = data.errorMessage;
					}
//					sortObj(UDAllArray,"desc");
//					jqGridUdData("#udTableList","#udTableListPager",UDAllArray);
					

					
					/** 將 UDObj裡的 resultSet陣列 Log出來
					$.each(UDObj.resultSet,function(index,value){
						console.log(value.acnt_date+";"+value.code+";"+value.doctor_name+";"+value.full_name+";"+value.method_name_c+";"+value.use_name_c);
					});   **/
					
					//取得 物件 UDObj  resultSet陣列  acnt_date的所有值
					
					for(var i=0;i<UDObj.resultSet.length;i++){
						//console.log(UDObj.resultSet[i]["acnt_date"]);
						udAcntDateList.push(UDObj.resultSet[i]["acnt_date"]);
					}
					
					
					//過濾 物件 UDObj  resultSet陣列  acnt_date的重複值
					filterUdAcntDate = udAcntDateList.filter(function(element,index,arr){
						return arr.indexOf(element)===index;
					});
					
					//重新排序 asc 正序  desc 倒序
					sortObj(filterUdAcntDate,"desc");
					
					//console.log(filterUdAcntDate);
					//測試將 過濾的帳款日期塞進select的option中
					//var spinn = document.getElementById("udAcnt");
					var acnttable;
					for(var i=0;i<filterUdAcntDate.length;i++){
					  	//var spinOption = new Option(filterUdAcntDate[i],filterUdAcntDate[i]);
						//spinn.options.add(spinOption); 
						//將 值動態填入table中
						//addUdAcnttr(filterUdAcntDate[i]);
						
//						acnttable+= '<tr id='+"Udacnt_"+i+""+'onclick="filterUDAcntDate(\"Udacnt_\"'+i+');><td>'+filterUdAcntDate[i]+'</td></tr>';
						acnttable+= "<tr id="+"udacnt_"+i+' onclick="getFilterUDListData('+i+ ');">'+'<td>'+filterUdAcntDate[i]+'</td></tr>';
						
						
							

					}  
					$("#udAcntTable").append(acnttable);
//					 $("#udAcntTable >tr:odd").addClass("tr_odd");
//					 $("#udAcntTable > tr:even").addClass("tr_even");
					 setOddEventColor("#udAcntTable"); //設定 tr 奇偶數背景色
					
					
					
					try{
//						jqGridUdData("#udTableList","#udTableListPager",UDAllArray);
					}catch(e){
						console.log(e);
					}
					//先按下第一筆UD
					getFilterUDListData(0);
				
//				hideLoading();
			});

  request.onreadystatechange = null;
	request.abort = null;
	request = null;
	
}

/**呼叫STAT API**/
var ajax_getSTATDataList = function(){
	
	 var request = $.when(ajax_setPostData("getInpcht2StateByChartNoSerno")).done(
			function(data) {
				STATArray=[];
					if (data.status == "Success") {
						//console.log(data.resultSet.length);
						$.each(data.resultSet, function(index, obj) {					
							STATArray.push(obj);
							render_STATDataList(index, obj);
							
						});
					} else {
					  var ajaxErrMsg = data.errorMessage;
					}
					
					
					for(var i=0;i<STATObj.resultSet.length;i++){
						//console.log(UDObj.resultSet[i]["acnt_date"]);
						stAcntDateList.push(STATObj.resultSet[i]["acnt_date"]);
					}
					
					
					//過濾 物件 UDObj  resultSet陣列  acnt_date的重複值
					filterStAcntDate = stAcntDateList.filter(function(element,index,arr){
						return arr.indexOf(element)===index;
					});
					
					//重新排序 asc 正序  desc 倒序
					sortObj(filterStAcntDate,"desc");
					
					//console.log(filterUdAcntDate);
					//測試將 過濾的帳款日期塞進select的option中
					//var spinn = document.getElementById("udAcnt");
					var acnttable;
					for(var i=0;i<filterStAcntDate.length;i++){
					  	//var spinOption = new Option(filterUdAcntDate[i],filterUdAcntDate[i]);
						//spinn.options.add(spinOption); 
						//將 值動態填入table中
						//addUdAcnttr(filterUdAcntDate[i]);
						
//						acnttable+= '<tr id='+"Udacnt_"+i+""+'onclick="filterUDAcntDate(\"Udacnt_\"'+i+');><td>'+filterUdAcntDate[i]+'</td></tr>';
						acnttable+= "<tr id="+"stacnt_"+i+' onclick="getFilterSTListData('+i+ ');">'+'<td>'+filterStAcntDate[i]+'</td></tr>';
						
						
							

					}  
					$("#stAcntTable").append(acnttable);
					setOddEventColor("#stAcntTable");
					
//					jqGridSTATData("#statTableList","#statTableListPager",STATArray);
					//先按下 STAT 第一筆資料
					getFilterSTListData(0);
//				hideLoading();
			});

request.onreadystatechange = null;
	request.abort = null;
	request = null;
	
}




/**取得過濾後的UD Detail 清單**/
function getFilterUDListData(position){
	udRowKey = -1; //重新過濾條件時，將rowKey 設為-1 表示不選擇任何的row
	setSelectedTrColor('udacnt_'+position);
	var filterUDDataList=[];
	
	$.each(UDObj.resultSet,function(index,value){
						
						if(value.acnt_date==filterUdAcntDate[position]){
							filterUDDataList.push(UDObj.resultSet[index]);
						
//							console.log(filterUDDataList[position].full_name);
							

						} 
						
					});
	                 jqGridUdData("#udTableList","#udTableListPager",filterUDDataList);
	                 //重新篩選後，將selected 的值 改為 -1 ，即為不選中任何一列
//	             	$("#udTableList").jqGrid('setSelection', udRowKey, true); //初始化 預設選中第一個
//					return filterUDDataList;
}

/**取得過濾後的STAT Detail 清單**/
function getFilterSTListData(position){
	stRowKey = -1; //重新過濾條件時，將rowKey 設為-1 表示不選擇任何的row
	setSelectedTrColor('stacnt_'+position);
	var filterSTDataList=[];
	
	$.each(STATObj.resultSet,function(index,value){
						
						if(value.acnt_date==filterStAcntDate[position]){
							filterSTDataList.push(STATObj.resultSet[index]);
						
//							console.log(filterUDDataList[position].full_name);

						} 
						
					});
	     jqGridSTATData("#statTableList","#statTableListPager",filterSTDataList);
	     
//					return filterUDDataList;
}

//設定點擊 tr bgColor
function setSelectedTrColor(id){
	 $('#'+id).addClass("tr_selected").siblings().removeClass("tr_selected");
//	 console.log("addSelected");
}

//設定 奇偶數tr bgColor
function setOddEventColor(id){
	 $(id+" > tr:odd").addClass("tr_odd");
	 $(id+"> tr:even").addClass("tr_even");

	
}



/**var filterUDList = function(kind){
	$(this)
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"acnt_date",op:"eq",data:kind});	
	$("#udTableList").setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid');
} **/



/**STAT***/





/**
order by asc || desc
*/
function sortObj(arrayObj,orderBy){
	arrayObj.sort(function(a,b){
		if(orderBy=="asc"){
			return a-b;
		}else{
			return b-a;
		}
	});
		
	}


function render_UDDataList(index,obj){
	UDObj.resultSet.push(obj);
	
}

function render_STATDataList(index,obj){
	STATObj.resultSet.push(obj);
	
}

function addUdAcnttr(UdAcnt) {
	//先取得目前的row數
	var num = document.getElementById("udAcntTable").rows.length;
	//建立新的tr 因為是從0開始算 所以目前的row數剛好為目前要增加的第幾個tr
	var Tr = document.getElementById("udAcntTable").insertRow(num);
	//建立新的td 而Tr.cells.length就是這個tr目前的td數
	Td = Tr.insertCell(Tr.cells.length);
	//而這個就是要填入td中的innerHTML
	Td.innerHTML=UdAcnt;
	/**這裡也可以用不同的變數來辨別不同的td (我是用同一個比較省事XD)
	Td = Tr.insertCell(Tr.cells.length);
	Td.innerHTML='<input name="content[]" type="text" size="12">';
	//這樣就好囉 記得td數目要一樣 不然會亂掉~  **/
	}


function setHtml(tag,data){
	//用innerText 方可吃傳來字串中/n轉成<br/>
	document.getElementById(tag).innerText=data;
//	document.getElementById("tag").innerHTML = data;
//	$('#'+tag).html(data);	
}


var filterNull = function(value) {
//	return value==null||value=="[object Window]"?"":value;
	return (value === undefined || value === null||value=="[object Window]"?"":value); 
}

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
//		console.log(value);
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



