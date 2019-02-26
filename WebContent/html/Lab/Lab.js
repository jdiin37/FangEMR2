/**
 * 檢驗畫面 專用 js檔
 */


var LabKind; //for filter 檢驗類別
var LabObj = {
	LabYear : 5,
	LabSDate : "",
	LabEDate : "",
	viewType: "",
	radioSDate:"",
	radioEDate:"",
	LabVisitType:""
		
	
};
var OpdLabDate; //過濾從 門急紀錄點過來的 該檢驗日期


/**日期驗證***/
function checkDate(str) {
	  var t = Date.parse(str);
	  if(isNaN(t)) {
	    alert('你輸入的不是日期');
	    return;
	  }
	  return str;
	}

function renderLab(){
	
//	 $("#inputLabSumStartDate").attr("placeholder", "Type an ID").placeholder();
//	 $("#inputLabSumEndDate").attr("placeholder", "Type an Name").placeholder();
	
	/**var startlen = $("#inputLabSumStartDate").length;
	var endlen = $("#inputLabSumEndDate").length;
	var labRadioVal = $('input:radio[name="labSumRadio"]:checked').val();
//	console.log("日期範圍:"+labRadioVal);
	if(labRadioVal=="自訂"){
		if(startlen==0||endlen==0){
			$('#btnLabLineChart1,#btnLabSummary1').prop('disabled', true);
		}else {
			$('#btnLabLineChart1,#btnLabSummary1').prop('disabled', false);
			
		}
	}else{
		$('#btnLabLineChart1,#btnLabSummary1').prop('disabled', false);
	}**/
	
//	$("#sliderLabTime").slider({
//	    ticks: [0, 100, 200, 300, 400],
//	    ticks_labels: ['$0', '$100', '$200', '$300', '$400'],
//	    ticks_snap_bounds: 30,
//	    id: "sliderLabTime", 
//	    range: true, 
//	});
	
//	var mySlider = $("#sliderLabTime").slider();
	
	
	/**$('#sliderLabDate').slider({  
	    formatter: function (value) {  
	        return 'Current value: ' + value;  
	    }  
	}).on('slide', function (slideEvt) {  
	    //当滚动时触发  
	    //console.info(slideEvt);  
	    //获取当前滚动的值，可能有重复  
	    // console.info(slideEvt.value);  
	}).on('change', function (e) {  
	    //当值发生改变的时候触发  
	    //console.info(e);  
	    //获取旧值和新值  
	    console.info(e.value.oldValue + '--' + e.value.newValue);  
	});**/
	

	
	
	
	
			
	$(document).on('change', '#LabYear', function(event) {
		if ($(this).val().length > 0 && years_regex.test($(this).val())) { // 驗證回傳值
			stateChange(true, '#LabYear');
			LabObj.LabYear = $(this).val();
			//showLoading();
			LabListByYear();
		} else {
			stateChange(false, '#LabYear', "請輸入1-100之間");
		}
	});
	
	/**檢驗趨勢圖 日期範圍 RadioButton 監聽器***/
	$(document).on('change', 'input:radio[name="labRadio"]', function(event) {
		var radio = event.target;
		var radioValue ="";
		if(radio.checked){
			radioValue = radio.value;

			var startD = $("#inputLabStartDate").val();//開始日期
			var endD = $("#inputLabEndDate").val();//開始日期
			if(radioValue=="自訂"){
				
				if(startD.length==7&&endD.length==7){
					stateChange(true, '#inputLabStartDate');
					stateChange(true, '#inputLabEndDate');
					ajax_getLineChartData("LabRecordService","LabChart");
				}else{
					stateChange(false, '#inputLabStartDate', "請輸入正確的日期格式");
					stateChange(false, '#inputLabEndDate', "請輸入正確的日期格式");
					$("#LabLineChart").hide();
					$("#lineChartMsg").show();
					$("#lineChartMsg").html("查無資料");
				}
			}else{
				
				if(isCheckedSelectedRow()){
					stateChange(true, '#inputLabStartDate');
					stateChange(true, '#inputLabEndDate');
					ajax_getLineChartData("LabRecordService","LabChart");
				}
				
				
			}
			
			

		}

	});
	
/** 檢驗彙總趨勢圖 radioButton 日期切換
 * **/	
	$(document).on('change', 'input:radio[name="labSumChartRadio"]', function(event) {
		var radio = event.target;
		var radioValue ="";
		if(radio.checked){
			radioValue = radio.value;

			var startD = $("#inputLabSumChartStartDate").val();//開始日期
			var endD = $("#inputLabSumChartEndDate").val();//開始日期
			if(radioValue=="自訂"){
				
				if(startD.length==7&&endD.length==7){
//					ajax_getLabSumLineChartData("LabRecordService");//取得檢驗彙總趨勢圖 
					getLabSumDetailSelectedRow();
					stateChange(true, '#inputLabSumChartStartDate');
					stateChange(true, '#inputLabSumChartEndDate');
				}else{
					stateChange(false, '#inputLabSumChartStartDate', "請輸入正確的日期格式");
					stateChange(false, '#inputLabSumChartEndDate', "請輸入正確的日期格式");
					
				}
			}else{
//				ajax_getLabSumLineChartData("LabRecordService");//取得檢驗彙總趨勢圖 
				getLabSumDetailSelectedRow();
				stateChange(true, '#inputLabSumChartStartDate');
				stateChange(true, '#inputLabSumChartEndDate');
			}
		}

	});
	
	


// 彙總頁面   日期範圍  監聽器	
	$(document).on('change', 'input:radio[name="sumRadio"]', function(event) {
		var radio = event.target;
		var radioValue ="";
		if(radio.checked){
			radioValue = radio.value;
			
			
			var startD = $("#inputSumSDate").val();//開始日期
			var endD = $("#inputSumEDate").val();//開始日期
			if(radioValue=="自訂"){
				
				if(startD.length==7&&endD.length==7){
					ajax_getLabSummaryData("LabRecordService","Sum");
					$("#labSumPage_Title").html("檢驗彙總表  日期範圍&emsp;"+ startD+" ~ "+ endD);
					stateChange(true, '#inputSumSDate');
					stateChange(true, '#inputSumEDate');
				}else{
					stateChange(false, '#inputSumSDate', "請輸入正確的日期格式");
					stateChange(false, '#inputSumEDate', "請輸入正確的日期格式");
					
				}
			}else{
				
				if(isCheckedSelectedRow()){
					ajax_getLabSummaryData("LabRecordService","Sum");
					stateChange(true, '#inputSumSDate');
					stateChange(true, '#inputSumEDate');
				}
				
				
			}
			
		}
		
//		if(radioValue!="自訂"){
//			ajax_getLabSummaryData("LabRecordService","Sum");
//		}
		


	});


	
	//輸入 起始日
	$(document).on('change', '#inputLabStartDate', function(event) {
		
		/**民國年*/
		var y =(parseInt($(this).val().substring(0, 3))+1911);
		var m = $(this).val().substring(3, 5);
		var d = $(this).val().substring(5, 7);
//		console.log(y+m+d+"");
		var startD = $("#inputLabStartDate").val();//開始日期
		if(startD.length==7){
			
		if(moment(y+m+d+"","YYYYMMDD").isValid()){
			stateChange(true, '#inputLabStartDate');
			ajax_getLineChartData("LabRecordService","LabChart");
		}else{
			stateChange(false, '#inputLabStartDate', "請輸入正確的日期格式");
		}
		
		}else {
			stateChange(false, '#inputLabStartDate', "請輸入正確的日期格式");
		}
				

	});
	
	//輸入結束日
	$(document).on('change', '#inputLabEndDate', function(event) {
		
		/***民國年**/
		var y =(parseInt($(this).val().substring(0, 3))+1911);
		var m = $(this).val().substring(3, 5);
		var d = $(this).val().substring(5, 7);
//		console.log(y+m+d+"");
		var endD = $("#inputLabEndDate").val();//開始日期
		if(endD.length==7){
			
			if(moment(y+m+d+"","YYYYMMDD").isValid()){
				stateChange(true, '#inputLabEndDate');
				ajax_getLineChartData("LabRecordService","LabChart");
			}else{
				stateChange(false, '#inputLabEndDate', "請輸入正確的日期格式");
			}
			
		}else{
			stateChange(false, '#inputLabEndDate', "請輸入正確的日期格式");
		}
	


	});  
	
/**點下檢驗趨勢圖按鈕 ***/	
	$(document).on('click', '#btnLabLineChart1', function(event) {
		
       var labRadioChoice = $('input:radio[name="labSumRadio"]:checked').val();
		
		var startDate = $("#inputLabSumStartDate").val();
		var endDate = $("#inputLabSumEndDate").val();
		
		$("#inputLabStartDate").val(startDate);
		$("#inputLabEndDate").val(endDate);

		
		if(labRadioChoice=="自訂"){
			if(startDate.length==0||endDate.length==0){
				
				alert("請輸入日期範圍");
			}else{
				 var radioValue = $('input:radio[name=labSumRadio]:checked').val();
			     $('input:radio[name="labRadio"]').val([radioValue]).trigger('change');
				getLabSelectedRow();
			}
		}else{
			var radioValue = $('input:radio[name=labSumRadio]:checked').val();
		    $('input:radio[name="labRadio"]').val([radioValue]).trigger('change');
			getLabSelectedRow();
		}
		
		
		
		

	});
	

/**檢驗彙總 趨勢圖***/	
	$(document).on('click', '#labSumLineChart', function(event) {
		
		 var labRadioChoice = $('input:radio[name="labSumChartRadio"]:checked').val();
//			
			var startDate = $("#inputSumSDate").val();
			var endDate = $("#inputSumEDate").val();
			
			
			$("#inputLabSumChartStartDate").val(startDate);
			$("#inputLabSumChartEndDate").val(endDate);
			

			if(labRadioChoice=="自訂"){
				if(startDate.length==0||endDate.length==0){
					
					alert("請輸入日期範圍");
				}else{
//					$('input:radio[name="labSumChartRadio"]:last').prop("checked", true).trigger('change');//預設自訂日期
					 var radioValue = $('input:radio[name=sumRadio]:checked').val();
				     $('input:radio[name="labSumChartRadio"]').val([radioValue]).trigger('change');
					getLabSumDetailSelectedRow();
				}
			}else{
				var radioValue = $('input:radio[name=sumRadio]:checked').val();
			    $('input:radio[name="labSumChartRadio"]').val([radioValue]).trigger('change');
				getLabSumDetailSelectedRow();
			}
			
				
		



	});
	
	
//點下彙總表 按鈕 1070320
	$(document).on('click', '#btnLabSummary1', function(event) {
//		$('input:radio[name="labRadio"]:first').prop("checked", true).trigger('change');//預設1個月
		
		
		var labRadioChoice = $('input:radio[name="labSumRadio"]:checked').val();
		
		var startDate = $("#inputLabSumStartDate").val();
		var endDate = $("#inputLabSumEndDate").val();
		
		$("#inputSumSDate").val(startDate);
		$("#inputSumEDate").val(endDate);
		
		if(labRadioChoice=="自訂"){
			if(startDate.length==0||endDate.length==0){
				
				alert("請輸入日期範圍");
			}else{
				var radioValue = $('input:radio[name=labSumRadio]:checked').val();
		    	$('input:radio[name="sumRadio"]').val([radioValue]).trigger('change');
				getLabSumSelectedRow();
			}
		}else{
//			console.log("else getLabSumSelectedRow");
			var radioValue = $('input:radio[name=labSumRadio]:checked').val();
	    	$('input:radio[name="sumRadio"]').val([radioValue]).trigger('change');
			getLabSumSelectedRow();
		}


	});
	
/*************************檢驗彙總 日期範圍 1070409 modify *************** ↓**/
	
	/**檢驗彙總 自訂 日期範圍 起始日 click監聽器 ***/	
	$(document).on('click', '#inputSumSDate', function(event) {
		var labRadio = $('input:radio[name="sumRadio"]:checked').val();
//		$('input:radio[name="sumRadio"]:last').prop("checked", true).trigger('change');//自訂日期
		if(labRadio!="自訂"){
			$('input:radio[name="sumRadio"]:last').prop("checked", true).trigger('change');//自訂日期
		}

		});	

	/**檢驗趨彙 自訂 日期範圍 結束日 click監聽器 ***/	
	$(document).on('click', '#inputSumEDate', function(event) {
		var labRadio = $('input:radio[name="sumRadio"]:checked').val();
//		$('input:radio[name="sumRadio"]:last').prop("checked", true).trigger('change');//自訂日期
		if(labRadio!="自訂"){
			$('input:radio[name="sumRadio"]:last').prop("checked", true).trigger('change');//自訂日期
		}

		});	
	
/**檢驗彙總 自訂日期範圍 起始日 change監聽器 ***/	
	$(document).on('change', '#inputSumSDate', function(event) {
		
		/**民國年*/
		var y =(parseInt($(this).val().substring(0, 3))+1911);
		var m = $(this).val().substring(3, 5);
		var d = $(this).val().substring(5, 7);
		
		var startD = $("#inputSumSDate").val();//開始日期
		if(startD.length==7){
			if(moment(y+m+d+"","YYYYMMDD").isValid()){
				stateChange(true, '#inputSumSDate');
//				getLabSumSelectedRow();
				ajax_getLabSummaryData("LabRecordService","Sum");

			}else{
				stateChange(false, '#inputSumSDate', "請輸入正確的日期格式");
			}
		}else{
			stateChange(false, '#inputSumSDate', "請輸入正確的日期格式");
		}
		
		
		

		});	

	/**檢驗趨勢圖 自訂 日期範圍 結束日 change監聽器 ***/	
	$(document).on('change', '#inputSumEDate', function(event) {
		
		/***民國年**/
		var y =(parseInt($(this).val().substring(0, 3))+1911);
		var m = $(this).val().substring(3, 5);
		var d = $(this).val().substring(5, 7);
//		console.log(y+m+d+"");
		
		var endD = $("#inputSumEDate").val();//開始日期
		if(endD.length==7){
			if(moment(y+m+d+"","YYYYMMDD").isValid()){
				stateChange(true, '#inputSumEDate');
//				getLabSumSelectedRow();
		
				ajax_getLabSummaryData("LabRecordService","Sum");
			}else{
				stateChange(false, '#inputSumEDate', "請輸入正確的日期格式");
			}
		}else{
			stateChange(false, '#inputSumEDate', "請輸入正確的日期格式");
		}
		
		
		

		});	
	
	
/*********************************檢驗彙總 自訂日期範圍 1070409 modify ↑**********************/	
	
	
	
/***************************檢驗彙總趨勢圖 自訂日期範圍 1070409 modify ******************↓**/
	
	/**檢驗彙總趨勢圖 自訂 日期範圍 起始日 click監聽器 ***/	
	$(document).on('click', '#inputLabSumChartStartDate', function(event) {		
		var labRadio = $('input:radio[name="labSumChartRadio"]:checked').val();
		if(labRadio!="自訂"){
			$('input:radio[name="labSumChartRadio"]:last').prop("checked", true).trigger('change');//自訂日期
		}

		});	

	/**檢驗趨彙總勢圖 自訂 日期範圍 結束日 click監聽器 ***/	
	$(document).on('click', '#inputLabSumChartEndDate', function(event) {
		var labRadio = $('input:radio[name="labSumChartRadio"]:checked').val();
		if(labRadio!="自訂"){
			$('input:radio[name="labSumChartRadio"]:last').prop("checked", true).trigger('change');//自訂日期
		}

		});
	
	/**檢驗趨彙總勢圖 自訂 日期範圍 開始日 change監聽器  ***/	
	$(document).on('change', '#inputLabSumChartStartDate', function(event) {
		
		/**民國年*/
		var y =(parseInt($(this).val().substring(0, 3))+1911);
		var m = $(this).val().substring(3, 5);
		var d = $(this).val().substring(5, 7);

		var startD = $("#inputLabSumChartStartDate").val();//開始日期
		if(startD.length==7){			
			if(moment(y+m+d+"","YYYYMMDD").isValid()){
				stateChange(true, '#inputLabSumChartStartDate');
//				getLabSumDetailSelectedRow();
				ajax_getLabSumLineChartData("LabRecordService");//取得檢驗彙總趨勢圖
			}else{
				stateChange(false, '#inputLabSumChartStartDate', "請輸入正確的日期格式");
			}
			
		}else{
			stateChange(false, '#inputLabSumChartStartDate', "請輸入正確的日期格式");
		}
		
		
	
		

		});	
	
	
	/**檢驗趨彙總勢圖 自訂 日期範圍 結束日 change監聽器  ***/	
	$(document).on('change', '#inputLabSumChartEndDate', function(event) {
		
		/**民國年*/
		var y =(parseInt($(this).val().substring(0, 3))+1911);
		var m = $(this).val().substring(3, 5);
		var d = $(this).val().substring(5, 7);
		var endD = $("#inputLabSumChartEndDate").val();//開始日期
		if(endD.length==7){
			if(moment(y+m+d+"","YYYYMMDD").isValid()){
				stateChange(true, '#inputLabSumChartEndDate');
				getLabSumDetailSelectedRow();
//				ajax_getLabSumLineChartData("LabRecordService");//取得檢驗彙總趨勢圖
			}else{
				stateChange(false, '#inputLabSumChartEndDate', "請輸入正確的日期格式");
			}
		}else{
			stateChange(false, '#inputLabSumChartEndDate', "請輸入正確的日期格式");
		}
		
		

		});	
	
/***************************檢驗彙總趨勢圖 自訂日期範圍 1070409 modify   ↑ ********************/	
	
/**檢驗趨勢圖 自訂日期 startDate & endDate ↓***/		
	
	/**檢驗趨勢圖 自訂 日期範圍 起始日 click監聽器 ***/	
	$(document).on('click', '#inputLabStartDate', function(event) {
		var labRadio = $('input:radio[name="labRadio"]:checked').val();
		if(labRadio!="自訂"){
			$('input:radio[name="labRadio"]:last').prop("checked", true).trigger('change');//自訂日期
		}

		});	

	/**檢驗趨勢圖 自訂 日期範圍 結束日 click監聽器 ***/	
	$(document).on('click', '#inputLabEndDate', function(event) {
		var labRadio = $('input:radio[name="labRadio"]:checked').val();
		if(labRadio!="自訂"){
			$('input:radio[name="labRadio"]:last').prop("checked", true).trigger('change');//自訂日期
		}

		});	
	
	/**檢驗趨勢圖 自訂 日期範圍 起始日 change監聽器 ***/	
	$(document).on('change', '#inputLabStartDate', function(event) {
		
		/**民國年*/
		var y =(parseInt($(this).val().substring(0, 3))+1911);
		var m = $(this).val().substring(3, 5);
		var d = $(this).val().substring(5, 7);
//		console.log(y+m+d+"");
		if(moment(y+m+d+"","YYYYMMDD").isValid()){
			stateChange(true, '#inputLabSumStartDate');
		}else{
			stateChange(false, '#inputLabSumStartDate', "請輸入正確的日期格式");
		}
		

		});	

	/**檢驗趨勢圖 自訂 日期範圍 結束日 change監聽器 ***/	
	$(document).on('change', '#inputLabEndDate', function(event) {
		
		/***民國年**/
		var y =(parseInt($(this).val().substring(0, 3))+1911);
		var m = $(this).val().substring(3, 5);
		var d = $(this).val().substring(5, 7);
//		console.log(y+m+d+"");
		if(moment(y+m+d+"","YYYYMMDD").isValid()){
			stateChange(true, '#inputLabSumEndDate');
		}else{
			stateChange(false, '#inputLabSumEndDate', "請輸入正確的日期格式");
		}
		

		});		
	
	
/**檢驗趨勢圖↑***/	
	
/************************檢驗彙總 自訂日期範圍 監聽器↓ ****************/	
	/**檢驗彙總 自訂 日期範圍 起始日 click監聽器 ***/	
	$(document).on('click', '#inputLabSumStartDate', function(event) {
		var labRadio = $('input:radio[name="labSumRadio"]:checked').val();
		if(labRadio!="自訂"){
			$('input:radio[name="labSumRadio"]:last').prop("checked", true).trigger('change');//自訂日期
		}


		});	

	/**檢驗彙總 自訂 日期範圍 結束日 click監聽器 ***/	
	$(document).on('click', '#inputLabSumEndDate', function(event) {
		$('input:radio[name="labSumRadio"]:last').prop("checked", true).trigger('change');//自訂日期

		});	

	/**檢驗彙總 自訂 日期範圍 起始日 change監聽器 ***/	
	$(document).on('change', '#inputLabSumStartDate', function(event) {
		
		/**民國年*/
		var y =(parseInt($(this).val().substring(0, 3))+1911);
		var m = $(this).val().substring(3, 5);
		var d = $(this).val().substring(5, 7);
//		console.log(y+m+d+"");
		if(moment(y+m+d+"","YYYYMMDD").isValid()){
			stateChange(true, '#inputLabSumStartDate');
		}else{
			stateChange(false, '#inputLabSumStartDate', "請輸入正確的日期格式");
		}
		

		});	

	/**檢驗彙總 自訂 日期範圍 結束日 change監聽器 ***/	
	$(document).on('change', '#inputLabSumEndDate', function(event) {
		
		/***民國年**/
		var y =(parseInt($(this).val().substring(0, 3))+1911);
		var m = $(this).val().substring(3, 5);
		var d = $(this).val().substring(5, 7);
//		console.log(y+m+d+"");
		if(moment(y+m+d+"","YYYYMMDD").isValid()){
			stateChange(true, '#inputLabSumEndDate');
		}else{
			stateChange(false, '#inputLabSumEndDate', "請輸入正確的日期格式");
		}
		

		});		
	

	
}

//清除 趨勢圖暫存 1070312
var ClearLineChartCanvas = function(){
//	  $('#LabLineChartContainer').html(""); // this is my <canvas> element
	  $('#LabLineChartContainer').append('<canvas id="LabLineChart" style="display:none;"></canvas>');
	};
	




/**檢驗趨勢圖  parameter 參數  1070309 add**/
var getLabItemsChartDataInputObj = function(empNo,sessionID,chartNo,method,startdate,enddate,assayId){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.assayId = assayId;
	this.startdate = startdate;
	this.enddate = enddate;
	this.method = method;
	
};

/**檢驗彙總表 parameter 參數 1070321 add
 * range =  (month|season|halfYear|year) or (0960325|1030210)
 * ***/
var getLabSummaryDataInputObj = function(empNo,sessionID,chartNo,kindId,range,labItems,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.chartNo = chartNo;
	this.kindId = kindId;
	this.range =range;
	this.labItems = labItems;
	this.method = method;
	
};

/**關閉 趨勢圖 彈跳視窗 **/
function close_chartModal(){
	$('#chartModal').css('display',"none");
}




//從 住院紀錄點擊的 檢驗Button 1070308 
var callInpRecordLab = function(labDate,kind,startDate,endDate){
	
//	$('input:radio[name="labRadio"]:first').prop("checked", true).trigger('change');//預設1個月
	
	LabKind = kind;	
	/**將值改為 從住院紀錄傳來的 startDate & endDate**/
	LabObj.LabSDate = startDate;
	LabObj.LabEDate = endDate;
	LabObj.viewType = "INP";
	LabObj.LabVisitType = "ALL";
	
	getThisDate(7);//測試抓 起始和結束日期
	
	$('#LabMasterDate').show();
	document.getElementById('LabMasterDate').setAttribute("title",LabObj.LabSDate+"-"+LabObj.LabEDate);
	
	$('#LabYear').val(LabObj.LabYear);
//	$('#LabMasterYear').html(LabObj.LabYear + '年檢驗&nbsp;<span class="badge">'+ $("#yearsLAB").html() + '</span>');
//	$('#LabMasterAll').find("span").html($("#allLAB").html());  //先帶入全部的count值
	
//	ajax_getLabCountDateRangeListData("LabRecordService",1); //先抓count 數量
	ajax_getLabCountAllListData("LabRecordService",1);//全部範圍 count 數量
	ajax_getLabCountYearsListData("LabRecordService",1);//取得年範圍的count 數量
	
  //先抓 count 
  var labCountParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,LabObj.LabSDate,LabObj.LabEDate,LabObj.LabVisitType,"getLabCountByChartNoDateRangeVisitTypeGroupByKind");		
  //再抓 List 清單
  var cmParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,startDate,endDate,LabObj.LabVisitType,"getLabListByChartNoDateRangeVisitType");			
  var LabArray = [];
	$.when(ajax_setPostData("LabRecordService",JSON.stringify(labCountParam)),ajax_setPostData("LabRecordService",JSON.stringify(cmParam))).done(
			function(dataLab,dataXrayList){
		//		
				if (dataLab[0].status == "Success") {
					var box = "";
					$.each(dataLab[0].resultSet, function(index, obj) {
						
						if(index == "summary"){
							//alert(obj);
							$('#LabMasterDate').html('檢驗&nbsp;<span class="badge">'+ obj + '</span>')
						}else{
							$.each(obj, function(index, obj_d){
								box += '&nbsp;<button class="btn btn-primary" onclick="filterLabList(\'' + obj_d.kind_id + '\');">' + obj_d.report_subtitle +' <span class="badge">' + obj_d.count +'</span></button>';
							});
							$('#LabDetail').html(box);
							box = null;
						}
						//alert(index + ":" + obj);
					});
	
				} else {
					ajaxErrMsg = dataLab.errorMessage;
					noDataFound(ajaxErrMsg,"LabList");
				}		
				
				
		if (dataXrayList[0].status == "Success") {
			$.each(dataXrayList[0].resultSet, function(index, obj) {		
				LabArray.push(obj);
			});		
		} else {
			ajaxErrMsg = dataXrayList.errorMessage;
			noDataFound(ajaxErrMsg,"LabList");
	    	$('#labListHead').html(" 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	    	//清空暫存 右側畫面資料 (清空 文字型 || 表格型 ||檢驗彙總 ||趨勢圖)
	    	$("#is_form").show();//顯示表格與檢驗彙總標籤
			$("#is_form_content").show();//顯示表格區塊
			$("#is_germ_content").hide();//隱藏細菌區塊
			clearGridData("LabDataList");//清空 檢驗表格資料

		}
		
		var title = LabObj.LabSDate + "-" +LabObj.LabEDate + "&nbsp;" + (LabObj.viewType == "OPD" ? '門急記錄':'住院記錄') + "-檢驗";
		title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;		
		$('#labPage_Title').html(title);	//設定title內容
		
		jqGrid_LabList("#LabList","#LabList_Pager",LabArray);		
		if(LabKind != undefined)
		{
			filterInpRecordLabList(kind,labDate);
			LabKind = undefined;
		}
		hideLoading();
		setPageVisible("labPage", true);
		popUpPageFixPos("labPage");
	});
	
};


var callLab = function(flag,kind){
	
//	$('input:radio[name="labRadio"]:first').prop("checked", true).trigger('change');//預設1個月
	
	LabObj.LabYear = PatObj.recentYear;
	LabObj.LabSDate = ViewListObj.sdate;
	LabObj.LabEDate = ViewListObj.edate;
	LabObj.viewType = ViewListObj.viewType;
	
	getThisDate(7);//測試抓 起始和結束日期
			
	LabKind = kind;	
	if(flag == "date"){		
		$('#LabMasterDate').show();
		document.getElementById('LabMasterDate').setAttribute("title",LabObj.LabSDate+"-"+LabObj.LabEDate); 
		LabObj.LabVisitType = LabObj.viewType;
		LabListByDate();
		ajax_getLabCountYearsListData("LabRecordService",1);//取得年範圍的count
		ajax_getLabCountAllListData("LabRecordService",1); //取得全部範圍的count
	}else if(flag =="year"){
		PatObj.recentYear = $("#recentYear").val();
		$('#LabMasterDate').hide();
		LabObj.LabVisitType = "ALL";
		LabListByYear();		
	}else{
		$('#LabMasterDate').hide();
		LabObj.LabVisitType = "ALL";
		LabListByAll();		
	}
		
	$('#LabYear').val(LabObj.LabYear);
//	$('#LabMasterYear').html(LabObj.LabYear + '年檢驗&nbsp;<span class="badge">'+ $("#yearsLAB").html() + '</span>');
	$('#LabMasterAll').find("span").html($("#allLAB").html());  //先帶入全部的count值
	
	//collapseHide("mainPage");
}


var callVisitTypeLabAll = function(flag){
	

	LabObj.LabYear = PatObj.recentYear;
	LabObj.viewType = "ALL";
	getThisDate(7);//測試抓 起始和結束日期
			
 if(flag =="year"){
		PatObj.recentYear = $("#recentYear").val();
		$('#LabMasterDate').hide();
		LabObj.LabVisitType = "ALL";
		LabListByYear();		
	}else{
		$('#LabMasterDate').hide();
		LabObj.LabVisitType = "ALL";
		LabListByAll();		
	}
		
	$('#LabYear').val(LabObj.LabYear);
//	$('#LabMasterYear').html(LabObj.LabYear + '年檢驗&nbsp;<span class="badge">'+ $("#yearsLAB").html() + '</span>');
	$('#LabMasterAll').find("span").html($("#allLAB").html());  //先帶入全部的count值
	
	//collapseHide("mainPage");
}




/**從門急畫面點過來的 callOPDLab  1030329 add***/
var callOPDLab = function(flag,labDate){
	OpdLabDate = labDate;
	LabObj.viewType = OpdObj.viewType
	LabObj.LabVisitType = "OPD";
		
	getThisDate(7);//測試抓 起始和結束日期
			
	
	if(flag == "date"){
		LabObj.LabSDate = OpdObj.OpdSDate
		LabObj.LabEDate = OpdObj.OpdEDate
		$('#LabMasterDate').show();
		document.getElementById('LabMasterDate').setAttribute("title",LabObj.LabSDate+"-"+LabObj.LabEDate); 
		LabListByDate();
		LabObj.LabYear = OpdObj.OpdYear;
		ajax_getLabCountYearsListData("LabRecordService",1);//取得年範圍的count
		ajax_getLabCountAllListData("LabRecordService",1); //取得全部範圍的count

		
		
	}else if(flag =="year"){
		LabObj.LabYear = OpdObj.OpdYear;
//		PatObj.recentYear = $("#recentYear").val();
		$('#LabMasterDate').hide();
		LabListByYear();	
		ajax_getLabCountAllListData("LabRecordService",1); //取得全部範圍的count
	}else{
		LabObj.LabYear = OpdObj.OpdYear;
		$('#LabMasterDate').hide();
		ajax_getLabCountYearsListData("LabRecordService",1);//取得年範圍的count
		LabListByAll();		
	}
		
	$('#LabYear').val(LabObj.LabYear);
//	$('#LabMasterYear').html(LabObj.LabYear + '年檢驗&nbsp;<span class="badge">'+ $("#yearsLAB").html() + '</span>');
//	$('#LabMasterAll').find("span").html($("#allLAB").html());  //先帶入全部的count值
	
	//collapseHide("mainPage");
}



/**
 * 取得 檢驗年 數量 & 年清單
 * ajax_getLabCountYearsListData("LabRecordService");
 * */
var ajax_getLabCountYearsListData = function(serviceName,flag){
	
	if(LabObj.viewType=="OPD"){
		LabObj.LabVisitType = "OPD";
	}else {
		LabObj.LabVisitType = "ALL";
	}
	
	showLoading();	
//	var cmParam = new EMRYearsVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,LabObj.LabYear,"ALL","getLabCountByChartNoYearsVisitTypeGroupByKind");	
	var cmParam = new EMRYearsVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,LabObj.LabYear,LabObj.LabVisitType,"getLabCountByChartNoYearsVisitTypeGroupByKind");	
		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(dataLab) {
						if (dataLab.status == "Success") {
							var box = "";
							$.each(dataLab.resultSet, function(index, obj) {				
								if(index == "summary"){
									//alert(obj);
									$('#LabYear').val(LabObj.LabYear);
									$('#LabMasterYear').html(LabObj.LabYear + '年檢驗&nbsp;<span class="badge">'+ obj + '</span>');
								}else{
									$.each(obj, function(index, obj_d){
										box += '&nbsp;<button class="btn btn-primary" onclick="filterLabList(\'' + obj_d.kind_id + '\');">' + obj_d.report_subtitle +' <span class="badge">' + obj_d.count +'</span></button>';
									});
								}
								//alert(index + ":" + obj);
							});
							
							
//							var title ="檢驗 " + $('#PatInfo').text();			
//							$('#labPage_Title').html(title);	//設定title內容
							if(flag=="2"){
								$('#LabDetail').html(box);
								box = null;
								
								if(LabObj.LabVisitType=="OPD"){
//									var title =LabObj.LabYear+"年 " +" -檢驗 " + $('#PatInfo').text();
									var title =LabObj.LabYear+"年 " +" 門急 -檢驗 " +"&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age;

								}else{
//									var title =LabObj.LabYear+"年 " +" -檢驗 " + $('#PatInfo').text();
									var title =LabObj.LabYear+"年 " +" -檢驗 " +"&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age;

								}
								
								
//								var title =LabObj.LabYear+"年 " +" -檢驗 " + $('#PatInfo').text();
//								var title =LabObj.LabYear+"年 "+LabObj.viewType +" -檢驗 " + $('#PatInfo').text();
								$('#labPage_Title').html(title);	//設定title內容
								ajax_getLabList("LabRecordService","Year");
								
							}
							
						} else {
							ajaxErrMsg = dataLab.errorMessage;
							noDataFound(ajaxErrMsg,"LabList");
						}
												

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
		
	};





/**Button onClick 監聽器 __年檢驗 **/
var LabListByYear = function(){	
	ajax_getLabCountYearsListData("LabRecordService","2");
	
}

/**取得 檢驗 日期範圍 數量 & 日期範圍 清單 
 * ajax_getLabCountDateRangeListData("LabRecordService",2); //count+List
 * serviceName 
 * flag = 1 抓 count ; flag = 2 抓 count+List清單
 * */
var ajax_getLabCountDateRangeListData = function(serviceName,flag){
	
	if(LabObj.viewType=="OPD"){
		LabObj.LabVisitType = "OPD";
	}else {
		LabObj.LabVisitType = "ALL";
	}
	
showLoading();	
//EMRDateRangeVisitTypeInputObj = function(empNo,sessionID,chartNo,startDate,endDate,visitType,method) //1070419

var cmParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,LabObj.LabSDate,LabObj.LabEDate,LabObj.LabVisitType,"getLabCountByChartNoDateRangeVisitTypeGroupByKind");	
//var cmParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,LabObj.LabSDate,LabObj.LabEDate,LabObj.viewType,"getLabCountByChartNoDateRangeVisitTypeGroupByKind");	

	 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
				function(dataLab) {
					if (dataLab.status == "Success") {
						var box = "";
						$.each(dataLab.resultSet, function(index, obj) {
							
							if(index == "summary"){
								//alert(obj);
								$('#LabMasterDate').html('檢驗&nbsp;<span class="badge">'+ obj + '</span>')
							}else{
								$.each(obj, function(index, obj_d){
									box += '&nbsp;<button class="btn btn-primary" onclick="filterLabList(\'' + obj_d.kind_id + '\');">' + obj_d.report_subtitle +' <span class="badge">' + obj_d.count +'</span></button>';
								});
							}
							//alert(index + ":" + obj);
						});
						

						
						if(flag==2){
							$('#LabDetail').html(box);
							box = null;
							var title = LabObj.LabSDate + "-" +LabObj.LabEDate + "&nbsp;" + (LabObj.viewType == "OPD" ? '門急記錄':'住院記錄') + "-檢驗";
							title += "&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;		
							$('#labPage_Title').html(title);	//設定title內容
							ajax_getLabList("LabRecordService","Date");							
						}
						
					} else {
						ajaxErrMsg = dataLab.errorMessage;
						noDataFound(ajaxErrMsg,"LabList");
					}	
											

				});
	 
	    request.onreadystatechange = null;
		request.abort = null;
		request = null;
	
};



/**Button onClick 監聽器 日期範圍檢驗 **/
var LabListByDate = function(){
	
	ajax_getLabCountDateRangeListData("LabRecordService",2); //count + List
}

/**
 * ajax 取得檢驗全部數量 
 * */
var ajax_getLabCountAllListData = function(serviceName,flag){
	
	if(LabObj.viewType=="OPD"){
		LabObj.LabVisitType = "OPD";
	}else {
		LabObj.LabVisitType = "ALL";
	}
	
	showLoading();	
	var cmParam = new EMRAllVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,LabObj.LabVisitType,"getLabCountByChartNoVisitTypeGroupByKind");
//	var cmParam = new EMRAllVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"ALL","getLabCountByChartNoVisitTypeGroupByKind");

		 var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
					function(dataLab) {
						
						if (dataLab.status == "Success") {
							var box = "";
							$.each(dataLab.resultSet, function(index, obj) {				
								if(index == "summary"){
									//alert(obj);
									$('#LabMasterAll').find("span").html(obj);
								}else{
									$.each(obj, function(index, obj_d){
										box += '&nbsp;<button class="btn btn-primary" onclick="filterLabList(\'' + obj_d.kind_id + '\');">' + obj_d.report_subtitle +' <span class="badge">' + obj_d.count +'</span></button>';
									});
								}
								//alert(index + ":" + obj);
							});
								
							
//							getLabList('All');
							if(flag==2){
								$('#LabDetail').html(box);											
								box = null;
								if(LabObj.LabVisitType=="OPD"){
//									var title ="檢驗 " + $('#PatInfo').text();
									var title ="全部門急 - 檢驗 "+"&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;
								}else{
									var title ="全部檢驗 "+"&nbsp;病患:" + PatObj.chart_no + "&nbsp; "+ PatObj.pt_name + "&nbsp; "+ PatObj.sex_name + "&nbsp; "+ PatObj.age ;

								}
											
								$('#labPage_Title').html(title);	//設定title內容
								ajax_getLabList("LabRecordService","All");
							}
							
			
							
						} else {
							ajaxErrMsg = dataLab.errorMessage;
							noDataFound(ajaxErrMsg,"LabList");
						}
						
												

					});
		 
		    request.onreadystatechange = null;
			request.abort = null;
			request = null;
	
};

/**Button onClick 監聽器 全部檢驗 **/
var LabListByAll = function(){
	ajax_getLabCountAllListData("LabRecordService",2);

}



/**
 * 取得 檢驗清單 range = Year,All,Date
 * serviceName = LabRecordService
 * ajax_getLabList("LabRecordService","Year");
 * */
var ajax_getLabList = function(serviceName,range){
	if(range=="Year"){
		var cmParam = new EMRYearsVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,LabObj.LabYear,LabObj.LabVisitType,"getLabListByChartNoYearsVisitType");	
//		var cmParam = new EMRYearsVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,LabObj.LabYear,"ALL","getLabListByChartNoYearsVisitType");	
	}else if(range=="All"){
		var cmParam = new EMRAllVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,LabObj.LabVisitType,"getLabListByChartNoVisitType");
//		var cmParam = new EMRAllVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"ALL","getLabListByChartNoVisitType");
	}else{
		//Date
		var cmParam = new EMRDateRangeVisitTypeInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,LabObj.LabSDate,LabObj.LabEDate,LabObj.LabVisitType,"getLabListByChartNoDateRangeVisitType");			
	}
	
	var LabArray = [];
	$.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(function(dataXrayList){			
		if (dataXrayList.status == "Success") {
			$.each(dataXrayList.resultSet, function(index, obj) {		
				LabArray.push(obj);
			});		
		} else {
			ajaxErrMsg = dataXrayList.errorMessage;
			noDataFound(ajaxErrMsg,"LabList");
	    	$('#labListHead').html(" 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	    	//清空暫存 右側畫面資料 (清空 文字型 || 表格型 ||檢驗彙總 ||趨勢圖)
	    	$("#is_form").show();//顯示表格與檢驗彙總標籤
			$("#is_form_content").show();//顯示表格區塊
			$("#is_germ_content").hide();//隱藏細菌區塊
			clearGridData("LabDataList");//清空 檢驗表格資料

		}
		
		jqGrid_LabList("#LabList","#LabList_Pager",LabArray);		
		if(LabKind != undefined)
		{
			filterLabList(LabKind);
			LabKind = undefined;
		}
		if(OpdLabDate != undefined)
		{
			filterOpdRecordLabDateLabList(OpdLabDate);
			OpdLabDate = undefined;
		}		
		hideLoading();
		setPageVisible("labPage", true);
		popUpPageFixPos("labPage");
	});
	
	
};

/**測試用 物件↓ 正式接API後 需刪除之**/

var EMRtestInputObj = function(lab_reportno,chart_no,lab_date,kind_name){
	this.lab_reportno = lab_reportno;
	this.chart_no = chart_no;
	this.lab_date = lab_date;
	this.kind_name = kind_name;
	
};

var EMRtest2InputObj = function(detailData,method){
	this.detailData = detailData;
	this.method = method;
		
};

var EMRSelectLabRowData = function(assayId,chartNo,method,reportNo,germGroup,rptType){
	this.assayId = assayId;
	this.method = method;
	this.chartNo = chartNo;
	this.reportNo = reportNo;
	this.germGroup =germGroup;
	this.rptType = rptType;
};

/***測試用 物件↑ 正式接API後 需刪除之***/

//測試計算日期範圍 startdate & enddate
var getThisDate = function(days){
		
	var now = new Date();
	var month = now.getMonth()+1;
	var day = now.getDate();
	var year = now.getFullYear();
	var m = parseInt(month);
	var d = parseInt(day);
	var M = m<10?'0'+m:m;
	var D = d<10?'0'+d:d;
	var Y = year<1000?year:year-1911;

	$("#inputLabEndDate").val(Y+M+D+"");//自訂日期 endDate
	$("#inputLabSumEndDate").val(Y+M+D+"");//自訂日期 endDate

	
	/** 測試 加減日期時間**/
//	var newDate = DateAdd("y", (parseInt(inputYear)*-1), now);
//	var newY = newDate.getFullYear();
//	var newM = newDate.getMonth()+1;
//	var newD = newDate.getDate();
//	var lastY = newY<1000?newY:newY-1911;
//	var lastM = newM<10?'0'+newM:newM;
//	var lastD = newD<10?'0'+newD:newD;
////	console.log(newY+""+newM+""+newD);
//	console.log("前"+inputYear+"年:"+lastY+""+lastM+""+lastD);
	/****/
	
	/** 測試 加減日期時間  one week ago**/
	var newDate = DateAdd("d", (parseInt(days)*-1), now);
	var newY = newDate.getFullYear();
	var newM = newDate.getMonth()+1;
	var newD = newDate.getDate();
	var lastY = newY<1000?newY:newY-1911;
	var lastM = newM<10?'0'+newM:newM;
	var lastD = newD<10?'0'+newD:newD;
//	console.log(newY+""+newM+""+newD);
//	console.log("前"+days+"天:"+lastY+""+lastM+""+lastD);
	$("#inputLabSumStartDate").val(lastY+lastM+lastD+"");//自訂日期 startDate
	$("#inputLabStartDate").val(lastY+lastM+lastD+"");//自訂日期 startDate
	
	/****/

};





//取得N年前 民國年日期
var getYearsAgo = function(inputYear){
	
	var now = new Date();
	var newDate = DateAdd("y", (parseInt(inputYear)*-1), now);
	var newY = newDate.getFullYear();
	var newM = newDate.getMonth()+1;
	var newD = newDate.getDate();
	//1070316 改為民國年
	var lastY = newY<1000?newY:newY-1911;//如果減完1911 小於100時 需在前面補0
	lastY = lastY.length<3?'0'+lastY:lastY;
	var lastM = newM<10?'0'+newM:newM;
	var lastD = newD<10?'0'+newD:newD;
	return lastY+""+lastM+""+lastD;
//	return newY+""+lastM+""+lastD;

	
};

//取得現在日期 民國年格式
var getRightNowDate = function(){
	
	var now = new Date();
	var month = now.getMonth()+1;
	var day = now.getDate();
	var year = now.getFullYear();
	var m = parseInt(month);
	var d = parseInt(day);
	var M = m<10?'0'+m:m;
	var D = d<10?'0'+d:d;
	var Y = year<1000?year:year-1911;
//	console.log(Y+""+M+""+D);
	return Y+""+M+""+D;
//	return year+M+D+"";

};

//取得N月前 民國年日期
var getMonthsAgo = function(inputMonth){
	
	var now = new Date();
	var newDate = DateAdd("m", (parseInt(inputMonth)*-1), now);
	var newY = newDate.getFullYear();
	var newM = newDate.getMonth()+1;
	var newD = newDate.getDate();
	var lastY = newY<1000?newY:newY-1911;//如果減完1911 小於100時 需在前面補0
	lastY = lastY.length<3?'0'+lastY:lastY;
	var lastM = newM<10?'0'+newM:newM;
	var lastD = newD<10?'0'+newD:newD;
	return lastY+""+lastM+""+lastD+"";
//	return newY+""+lastM+""+lastD;
	
	
};




function DateAdd(interval, number, date) {
    switch (interval) {
    case "y": {
        date.setFullYear(date.getFullYear() + number);
        return date;
        break;
    }
    case "q": {
        date.setMonth(date.getMonth() + number * 3);
        return date;
        break;
    }
    case "m": {
        date.setMonth(date.getMonth() + number);
        return date;
        break;
    }
    case "w": {
        date.setDate(date.getDate() + number * 7);
        return date;
        break;
    }
    case "d": {
        date.setDate(date.getDate() + number);
        return date;
        break;
    }
    case "h": {
        date.setHours(date.getHours() + number);
        return date;
        break;
    }
    case "m": {
        date.setMinutes(date.getMinutes() + number);
        return date;
        break;
    }
    case "s": {
        date.setSeconds(date.getSeconds() + number);
        return date;
        break;
    }
    default: {
        date.setDate(d.getDate() + number);
        return date;
        break;
    }
    }
}



/**測試用 物件↑ 正式接API後 需刪除之**/

/**取得表格清單**/

var EMRLabFormInputObj = function(empNo,sessionID,reportNo,chartNo,method){
	this.empNo = empNo;
	this.sessionID = sessionID;
	this.reportNo = reportNo;
	this.chartNo = chartNo;
	this.method = method;
};

function isCheckedSelectedRow(){
	
	var grid2 = $("#LabDataList");
    var rowKeys = grid2.jqGrid('getGridParam',"selarrrow");
    if(rowKeys.length>0){
    	
    	return true;
    }else {
    	return false;
    }
}


/**取得檢驗彙總 勾選的檢驗項目 1070322 modify ***/
function getLabSumSelectedRow() {
//	var detailData =[];
	var labItems = "";
	var selectedRowArray = [];
	
	
    var grid = $("#LabList");
    var rowKey = grid.jqGrid('getGridParam',"selrow");
//    var reportNo = grid.jqGrid('getCell',rowKey,'lab_reportno');
//    var germ_group = grid.jqGrid('getCell',rowKey,'germ_group');
//    var rpt_type = grid.jqGrid('getCell',rowKey,'rpt_type');
    var kindId = grid.jqGrid('getCell',rowKey,"kind_id");
    var grid2 = $("#LabDataList");
    var rowKeys = grid2.jqGrid('getGridParam',"selarrrow");//回傳陣列，一次取得多列data select array row
    if(rowKeys.length>0){
    	for(var i=0;i<rowKeys.length;i++){
    		var rowId = rowKeys[i];
    		var rwoData = grid2.jqGrid("getRowData",rowId); //取得某列的 所有物件
    		labItems+=rwoData.assay_id+"|";

    		
    	}
    	labItems=labItems.substring(0,labItems.length-1); 

    	$("#strLabSumItem").html(labItems);//彙總 勾選的檢驗項目
    	$("#strLabSumKindId").html(kindId);
    	$("#LabListRowKey").html(rowKey);
    	
    	
    	 setTimeout(function(){ 
    		 ajax_getLabSummaryData("LabRecordService","LabSum");
		     }, 400);
    	
    	

    }else{
    	 alert("請選擇檢驗項目");	
    }

}




/**測試用 取得多列資料 趨勢圖用**/
function getLabSelectedRow() {
	var labItems = "";
	
    var grid = $("#LabList");
    var rowKey = grid.jqGrid('getGridParam',"selrow");
    var reportNo = grid.jqGrid('getCell',rowKey,'lab_reportno');
    var germ_group = grid.jqGrid('getCell',rowKey,'germ_group');
    var rpt_type = grid.jqGrid('getCell',rowKey,'rpt_type');
    var kindId = grid.jqGrid('getCell',rowKey,"kind_id");
    var grid2 = $("#LabDataList");
    var rowKeys = grid2.jqGrid('getGridParam',"selarrrow");//回傳陣列，一次取得多列data select array row
    if(rowKeys.length>0){
    	for(var i=0;i<rowKeys.length;i++){
    		var rowId = rowKeys[i];
    		var rwoData = grid2.jqGrid("getRowData",rowId); //取得某列的 所有物件
    		labItems+=rwoData.assay_id+"|";

    	}
    	labItems=labItems.substring(0,labItems.length-1); 

    	$("#strLabItem").html(labItems);//檢驗項目
//    	$("#strLabSumItem").html(labItems);//彙總 勾選的檢驗項目
//    	$("#strLabSumKindId").html(kindId);
    	$("#strLabKindId").html(kindId);
    	
//    	ajax_getListLineChartData("LabReportService");
    	$("#LabListRowKey").html(rowKey);
    	
    	 setTimeout(function(){ 
    		 ajax_getLineChartData("LabRecordService","LabSum");//取得趨勢圖 1070322修改
		     }, 400);
    	
    	
    }else{
    	 alert("請選擇檢驗項目");	
    }
    
}

/**選擇 檢驗彙總 的檢驗項目   開啟趨勢圖  1070326 ***/
function getLabSumDetailSelectedRow() {
	var labItems = "";
	
//    var grid = $("#LabList");
//    var rowKey = grid.jqGrid('getGridParam',"selrow");
//    var reportNo = grid.jqGrid('getCell',rowKey,'lab_reportno');
//    var germ_group = grid.jqGrid('getCell',rowKey,'germ_group');
//    var rpt_type = grid.jqGrid('getCell',rowKey,'rpt_type');
//    var kindId = grid.jqGrid('getCell',rowKey,"kind_id");
    var grid2 = $("#LabSumList");
    var rowKeys = grid2.jqGrid('getGridParam',"selarrrow");//回傳陣列，一次取得多列data select array row
    if(rowKeys.length>0){
    	for(var i=0;i<rowKeys.length;i++){
    		var rowId = rowKeys[i];
    		var rwoData = grid2.jqGrid("getRowData",rowId); //取得某列的 所有物件
    		labItems+=rwoData.assay_id+"|";

    	}
    	labItems=labItems.substring(0,labItems.length-1); 

    	$("#strLabSumChartItem").html(labItems);//檢驗彙總 趨勢圖 項目
    	$("#strLabSumChartKindId").html($("#strLabSumKindId").html());
        	
    	 setTimeout(function(){ 
    		 ajax_getLabSumLineChartData("LabRecordService");//取得檢驗彙總趨勢圖 10703226 修改
		     }, 400);
    	
    }else{
    	 alert("請選擇檢驗項目");	
    }
    
}


/**取得 Lab表格 數據資料    **/
var ajax_getLabDataFormList = function(serviceName,reportNo){
	$("#is_form").show();//顯示表格標籤
	$("#is_form_content").show();//顯示表格區塊
	$("#is_germ_content").hide();//隱藏細菌區塊
	$("#is_txt").hide();
	$("#is_txt_content").hide();
	
	var cmParam = new EMRLabFormInputObj(UserObj.emp_no,UserObj.session_id,reportNo,PatObj.chart_no,"getqueryEnterqryItem");	
	var LabFormArray = [];
	$.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(function(dataXrayList){			
		if (dataXrayList.status == "Success") {
			$.each(dataXrayList.resultSet, function(index, obj) {		
				LabFormArray.push(obj);
			});		
		} else {
			ajaxErrMsg = dataXrayList.errorMessage;
			noDataFound(ajaxErrMsg,"LabDataList");
//	    	$('#labListHead').html(" 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	    	//清空暫存 右側畫面資料

		}	
		jqGrid_LabDataList("#LabDataList","#LabDataList_Pager",LabFormArray);		
		
	});
	
	
};


/**
 * 過濾檢驗 kind_id 值
 * **/
var filterLabList = function(kind){
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"kind_id",op:"eq",data:kind});	
	$("#LabList").setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid',[{page:1}]);
}

/**
 * 過濾檢驗 從 住院紀錄點過來的 指定日期 + kind_id 值 1070308 modify
 * */

var filterInpRecordLabList = function(kind,labDate){
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"kind_id",op:"eq",data:kind},{field:"lab_date",op:"eq",data:labDate});	
	$("#LabList").setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid',[{page:1}]);
}

/**
 * 過濾檢驗 從 門急紀錄點過來的 指定日期 add 1070402
 * **/
var filterOpdRecordLabDateLabList = function(labDate){
	var myfilter = { groupOp: "AND", rules: []};
	myfilter.rules.push({field:"lab_date",op:"eq",data:labDate});	
	$("#LabList").setGridParam({
		postData: { filters: JSON.stringify(myfilter)},
		search:true
	}).trigger('reloadGrid',[{page:1}]);
}



//檢驗清單 
function jqGrid_LabList(tableName,pagerName,arrayData){		//檢驗清單
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 220,
	    colModel: [
	    	{ label: 'I/O/E', name: 'pt_source', width: 90,hidden:true },//檢查 是門/急/住
	        { label: '單號', name: 'lab_reportno', width: 90,hidden:true },
	        { label: '病歷號', name: 'chart_no', width: 90,hidden:true },
	        { label: 'germ_group', name: 'germ_group', width: 90,hidden:true },//抓細菌用參數
	        { label: 'kind_flag', name: 'kind_flag', width: 90,hidden:true },//判斷 檢驗報告主類型 參數
	        { label: 'rpt_type', name: 'rpt_type', width: 90,hidden:true },//抓細菌用參數

//	        { label: '檢驗日期', name: 'lab_date', width: 90,hidden:true },
	        { label: '年份', name: 'years', width: 45 },	        
	        { label: '日期', name: 'lab_date', width: 90},
	        { label: '表單類別', name: 'kind_name', width: 170,align:'left' },
	        { label: '種類id', name: 'kind_id', width: 60,hidden:true },
	        { label: '種類', name: 'report_subtitle', width: 120,hidden:false,align:'center' },
//	        { label: '種類', name: 'report_subtitle', width: 120,align:'center',formatter: function(cellvalue, options, rowobject){
//	            return '<button type="button" class="btn btn-primary btn-sm ButtonfontSize">'+ cellvalue +'</button>';
//	        }},
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
//	    scroll :true, //鼠標滾動翻頁,
//	    rownumbers: true, //count 序號
//	    rownumWidth:50,
//	    multiselect: true, //多選 checkBox
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	
        },
	    width: null,
//	    rowNum: Math.floor((pageHeight - 220)/33),
	    shrinkToFit: false,
	    sortable: false,
		pager: pagerName,
		pagerpos:'left',
		loadComplete : function () {
			$(this).jqGrid('setSelection', 1, true);
		}
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: arrayData});
	$(tableName).trigger('reloadGrid');
	//$("#LabList").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	function getSelectedRow() {
		
		 var grid = $(tableName);
		 var rowKey = grid.jqGrid('getGridParam',"selrow");		
		if(rowKey){
			var extraBtn="";
	    	extraBtn += '<div class="pull-right"><button  type="button" id="extraInp" class="btn btn-link btn-popUp btn-img24 img24_pumpWindow" onclick="justPopUp(this)"></button></div>';
			$('#labListHead').html($(tableName).jqGrid('getCell',rowKey,'lab_date') + " " + $(tableName).jqGrid('getCell',rowKey,'kind_name') + " 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲  "+extraBtn);    
			
	    	
	    	var reportNo = $(tableName).jqGrid('getCell',rowKey,'lab_reportno');
			var kindFlag = $(tableName).jqGrid('getCell',rowKey,'kind_flag');
			var germGroup = $(tableName).jqGrid('getCell',rowKey,'germ_group');
			var rptType = $(tableName).jqGrid('getCell',rowKey,'rpt_type');
			var chartNo = $(tableName).jqGrid('getCell',rowKey,'chart_no');
			
			var rptTypeName = $(tableName).jqGrid('getCell',rowKey,'kind_name');
			var germName = $(tableName).jqGrid('getCell',rowKey,'kind_name');
			// kind_flag = A 一般檢驗報告 B 細菌報告  E,K 病理報告
			if(kindFlag=="A"){
//				$('input:radio[name="labRadio"]:first').prop("checked", true).trigger('change');//預設1個月
				ajax_getLabDataFormList("LabReportService",reportNo);
//				getLineChartJson();//測試 LineChart資料   
			}else if(kindFlag=="B"){
				$("#is_germ_content").show();
				$("#is_form").hide();
				$("#is_form_content").hide();
				$("#is_txt").hide();
				$("#is_txt_content").hide();
				ajax_getGermDetailData("LabReportService",reportNo,germGroup,rptType,rptTypeName,germName);
				
				setTimeout(function(){ 
					ajax_getGermAntibioList("LabReportService",reportNo,germGroup,rptType); 
				}, 200);
			}else if(kindFlag=="E"||kindFlag=="K"){ //病理報告
				$("#is_form").hide();//顯示表格標籤
				$("#is_form_content").hide();//顯示表格區塊
				$("#is_germ_content").hide();//隱藏細菌區塊
				$("#is_txt").show();
				$("#is_txt_content").show();
				$("#Lab_txtContent1").show();
				ajax_isTxtLabContent("LabReportService",reportNo,chartNo);

				
				
				
			}
			/**else if(kindFlag=="K"){
				$("#is_form").hide();//顯示表格標籤
				$("#is_form_content").hide();//顯示表格區塊
				$("#is_germ_content").hide();//隱藏細菌區塊
			}**/
			
			//清除趨勢圖 1070312
//			ClearLineChartCanvas();
			
			
	    	
	    	

		}else{
//			 alert("沒有資料被選擇");
		}
		
		
	}
}



/**1070307 modify by IvyLin 檢驗值 顏色判斷 改用 lab_status 判斷 L H N，但 仍有其他值 A,U,C,-*
 * 目前已確定 判斷值 L(Lower) H(Higher) A(Abnormal) 文字為紅色
 * 範圍值 欄位需修改 
 * */

function jqGrid_LabDataList(tableName,pagerName,arrayData){		//檢驗清單
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 370,
	    colModel: [
	    	{ label: 'lab_status', name: 'lab_status', width: 90,hidden:true },
	    	{ label: '檢驗名稱', name: 'assay_id', width:280,hidden:false },
	    	{ label: '檢驗值', name: 'result_val', width: 200,formatter:function(cellvalue, options, rowobject){
	    		//檢驗值  L(低於) , H(高於) , N(正常) , A(不正常) , U
	    		if(rowobject.result_status=="E"||rowobject.result_status=="T"||rowobject.result_status=="C"){
	    			return "<span class='text-danger'>"+cellvalue + "</span>";	
	    		}else {
	    			return "<span class='text-primary'>"+cellvalue + "</span>";	
	    		}
	    	}},
	    	/**{label:'檢驗值',name:'result_val',width:150,formatter:function(cellvalue, options, rowobject){
	    		if($.isNumeric(cellvalue)){
	    			if(rowobject.male==null&&rowobject.female==null&&rowobject.child==null){
	    				return "<span class='text-primary'>"+cellvalue + "</span>";		
	    			}else if(rowobject.male!=null){
	    				var male = rowobject.male.split("-");   				
	    				if(male[0]==undefined||male[1]==undefined){
	    					return "<span class='text-primary'>"+cellvalue + "</span>";	
	    				}else if(cellvalue<parseFloat(male[0])||cellvalue>parseFloat(male[1])){	    			
	    					return "<span class='text-danger'>"+cellvalue + "</span>";	
	    				}else{
	    					return "<span class='text-primary'>"+cellvalue + "</span>";		
	    				}
	    				
	    			}else if(rowobject.female!=null){
	    				var female = rowobject.female.split("-");
	    				if(female[0]==undefined||female[1]==undefined){
	    					return "<span class='text-primary'>"+cellvalue + "</span>";			
	    				}else if(cellvalue<parseFloat(female[0])||cellvalue>parseFloat(female[1])){
	    					return "<span class='text-danger'>"+cellvalue + "</span>";	
	    				}else{
	    					return "<span class='text-primary'>"+cellvalue + "</span>";		
	    				}
	    			}
	    			else {
	    				return "<span class='text-primary'>"+cellvalue + "</span>";	
	    			}
	    			
	    			
	    		}else{
	    			return "<span class='text-primary'>"+cellvalue + "</span>";
	    		}
	    	}},  **/
	        { label: '單位', name: 'unit', width: 180,hidden:false },
	        { label: 'instr_kind', name: 'instr_kind', width: 120,hidden:true },
	        { label: 'assay_judgetype', name: 'assay_judgetype', width: 90,hidden:true },
	        { label: 'result_status', name: 'result_status', width: 100,hidden:true },
//	        { label: '檢驗範圍值', name: 'report_normalrange', width: 200 },
	        { label: '正常範圍值', name: 'normal_val', width: 180 },
//	        { label: '女性範圍值', name: 'female', width: 120 },
//	        { label: '小孩範圍值', name: 'child', width: 100,hidden:true },
	       
//	        { label: '單位', name: 'unit', width: 45 },
//	        { label: '開始值', name: 'start_value', width: 45,formatter:function(cellvalue, options, rowobject){
//	        	filterNull(cellvalue);
//	        } },
//	        { label: '結束值', name: 'end_value', width: 45,formatter:function(cellvalue, options, rowobject){
//	        	filterNull(cellvalue);
//	        } },
	        
	      
//	        { label: '種類', name: 'report_subtitle', width: 120,formatter: function(cellvalue, options, rowobject){
//	            return '<button type="button" class="btn btn-primary btn-sm">'+ cellvalue +'</button>';
//	        }},
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
	    onSelectRow:getSelectedRow,
	    multiselect: true, //多選 checkBox
	    ondblClickRow: function(rowId) {
	    	
        },
	    width: null,
	    rowNum: Math.floor((pageHeight - 220)/33),
	    shrinkToFit: false,
	    sortable: true,
		pager: pagerName,
		pagerpos:'left',
		loadComplete : function () {
//			$(this).jqGrid('setSelection', 1, true);
		}
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: arrayData});
	$(tableName).trigger('reloadGrid');
	//$("#LabList").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	function getSelectedRow() {
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    if (rowKey){
//	    	$('#labListHead').html($(tableName).jqGrid('getCell',rowKey,'lab_date') + " " + $(tableName).jqGrid('getCell',rowKey,'report_subtitle') + " 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
//	    	$('#labListBody').html(rowKey);
	    
	    }
	    else{
//	        alert("沒有資料被選擇");
	    }
	}
	
}



/**取得 細菌表格 數據資料   
 * 
 *  **/
var ajax_getGermAntibioList = function(serviceName,reportNo,germGroup,rptType){
	

	var cmParam = new GermAntibioInputObj(UserObj.emp_no,UserObj.session_id,reportNo,"getenterqryGermAntibio",germGroup,rptType);	
	var GermAntibioArray = [];
	$.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(function(dataXrayList){			
		if (dataXrayList.status == "Success") {
			$.each(dataXrayList.resultSet, function(index, obj) {		
				GermAntibioArray.push(obj);
			});		
		} else {
			ajaxErrMsg = dataXrayList.errorMessage;
			noDataFound(ajaxErrMsg,"GermAntibioList");
//	    	$('#labListHead').html(" 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
	    	//清空暫存 右側畫面資料

		}	
		jqGrid_GermAntibioList("#GermAntibioList","#GermAntibioList_Pager",GermAntibioArray);		
		
	});
	
	
};


/***細菌報告 表格數據**/
function jqGrid_GermAntibioList(tableName,pagerName,arrayData){		
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 640,
//	    height: 250,
	    colModel: [
	    	{ label: '細菌名稱', name: 'germ_name', width: 800 },
	    	{ label: '菌1', name: 'anti_result1', width:200 },
	    	{ label: '菌2', name: 'anti_result2', width: 200 },
	        { label: '菌3', name: 'anti_result3', width: 200 },
	        { label: 'anti_flag1', name: 'anti_flag1', width: 90,hidden:true },
	        { label: 'anti_flag2', name: 'anti_flag2', width: 120,hidden:true },
	        { label: 'anti_flag3', name: 'anti_flag3', width: 90,hidden:true },
	       
	             
	    ],
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
	    onSelectRow:getSelectedRow,
//	    multiselect: true, //多選 checkBox
	    ondblClickRow: function(rowId) {
	    	
        },
	    width: null,
	    rowNum: Math.floor((pageHeight - 220)/24),
	    shrinkToFit: false,
	    sortable: true,
		pager: pagerName,
		pagerpos:'left',
		loadComplete : function () {
//			$(this).jqGrid('setSelection', 1, true);
		}
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: arrayData});
	$(tableName).trigger('reloadGrid');
	//$("#LabList").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	function getSelectedRow() {
	    var grid = $(tableName);
	    var rowKey = grid.jqGrid('getGridParam',"selrow");
	    if (rowKey){
//	    	$('#labListHead').html($(tableName).jqGrid('getCell',rowKey,'lab_date') + " " + $(tableName).jqGrid('getCell',rowKey,'report_subtitle') + " 病患:" + PatObj.chart_no + " "+PatObj.pt_name + " " + PatObj.sex_name + " " + PatObj.age+"歲");
//	    	$('#labListBody').html(rowKey);
	    
	    }
	    else{
	        alert("沒有資料被選擇");
	    }
	}
	
}

/**取得細菌上半部資料*
 * **/
var ajax_getGermDetailData = function(serviceName,reportNo,germGroup,rptType,rptTypeName,germName){
	var cmParam = new GermAntibioInputObj(UserObj.emp_no,UserObj.session_id,reportNo,"getenterqryGermresult",germGroup,rptType);
	
	$.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(function(data){			
		if (data.status == "Success") {
			
			setGermData("germLabNo",filterNull(data.resultSet[0].lab_reportno));
			setGermData("germPtName",filterNull(data.resultSet[0].pt_name));
			setGermData("germRptName",filterNull(rptTypeName));
			setGermData("sampleDoc",filterNull(data.resultSet[0].sample_doc));
			setGermData("epiCell",filterNull(data.resultSet[0].epi_cell));
//			setGermData("germTitle",filterNull(data.resultSet[0].report_text));
			setGermData("germTitle",filterNull(germName));
			setGermData("germDocName",filterNull(data.resultSet[0].dr_id));
			setGermData("pmn",filterNull(data.resultSet[0].pmn));
			setGermData("germReqDate",filterNull(data.resultSet[0].req_date));
			setGermData("germLabDate",filterNull(data.resultSet[0].lab_date));
			setGermData("germResDate",filterNull(data.resultSet[0].res_date));

			setGermData("resisMark1",filterNull(data.resultSet[0].resistance_markers1));
			setGermData("resisMark2",filterNull(data.resultSet[0].resistance_markers2));
			setGermData("resisMark3",filterNull(data.resultSet[0].resistance_markers3));
			setGermData("resisGerm1",filterNull(data.resultSet[0].resistance_germ1));
			setGermData("resisGerm2",filterNull(data.resultSet[0].resistance_germ2));
			setGermData("resisGerm3",filterNull(data.resultSet[0].resistance_germ3));				
			setGermData("germName1",formatDateTime(data.resultSet[0].germ_name1));
			setGermData("germName2",formatDateTime(data.resultSet[0].germ_name2));
			setGermData("germName3",filterNull(data.resultSet[0].germ_name3));
			setGermData("germQty1",formatDateTime(data.resultSet[0].germ_qty1));
			setGermData("germQty2",formatDateTime(data.resultSet[0].germ_qty2));
			setGermData("germQty3",formatDateTime(data.resultSet[0].germ_qty3));				
			setGermData("germDoc1",filterNull(data.resultSet[0].germ_doc1));
			setGermData("germDoc2",filterNull(data.resultSet[0].germ_doc2));
			setGermData("germDoc3",filterNull(data.resultSet[0].germ_doc3));

				
				
//			});		
		} else {
			var ajaxErrMsg = data.errorMessage;
			clearGermDetailData();
//			console.log("getOpDetailErrMsg="+ajaxErrMsg);//如查無資料須清除所有文字
			
			
		}	
		
		
		hideLoading();
		
	});
	
	
};

//病理報告 1070316 ajax
//ajax_isTxtLabContent("LabReportService",reportNo,chartNo);
//{"empNo":"ORCL","sessionID":1,"reportNo":"021110NE00001","chartNo":912473,"method":"getqueryEnterqryItem"}
var ajax_isTxtLabContent = function(serviceName,reportNo,chartNo){
//	var labTxtContent = document.getElementById("#Lab_txtContent1");
	var cmParam = new EMRLabFormInputObj(UserObj.emp_no,UserObj.session_id,reportNo,chartNo,"getqueryEnterqryItem");
	
	$.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(function(data){			
		if (data.status == "Success") {
			
			$("#Lab_txtContent1").html((data.resultSet[0].report));
//			console.log(data.resultSet[0].report);
			
//			$.each(data.resultSet, function(index, obj) {		
//				$("#Lab_txtContent1").html(filterNull(obj));
//			});	
			
			
//			setGermData("Lab_txtContent1",filterNull(data.resultSet[0].report));
		
//			});		
		} else {
			var ajaxErrMsg = data.errorMessage;
			$("#Lab_txtContent1").html(ajaxErrMsg);
//			clearGermDetailData();
//			console.log("getOpDetailErrMsg="+ajaxErrMsg);//如查無資料須清除所有文字
			
			
		}	
		
		
		hideLoading();
		
	});
	
};



//設定  細菌 內文
function setGermData(tag,data){
	document.getElementById(tag).innerText=data
}


var clearGermDetailData = function(){
	$('#resisMark1').html(""); 
	$('#resisMark2').html("");
	$('#resisMark3').html("");
	$('#resisGerm1').html("");
	$('#resisGerm2').html("");	
	$('#resisGerm3').html("");
	$('#germName1').html(""); 
	$('#germName2').html("");
	$('#germName3').html("");
	$('#germQty1').html("");	
	$('#germQty2').html(""); 
	$('#germQty3').html(""); 
	$('#germDoc1').html("");
	$('#germDoc2').html("");
	$('#germDoc3').html("");	
	
	$('#germLabNo').html(""); 
	$('#germPtName').html(""); 
	$('#germRptName').html("");
	$('#sampleDoc').html("");	
	$('#epiCell').html(""); 
	$('#germTitle').html(""); 
	$('#germDocName').html("");
	$('#pmn').html("");
	$('#germReqDate').html("");	
	$('#germLabDate').html(""); 
	$('#germResDate').html(""); 
};

/** ajax 取得檢驗彙總表 1070322 modify**/ 
var ajax_getLabSummaryData = function(serviceName,from){
	$("#LabSumContainer").html("");
	$("#LabSumContainer").append("<table id='LabSumList' class='table-hover'></table><div id='LabSumList_Pager'></div>");
	
//	$("#labSumPage_Title").html("檢驗彙總表");
	setPageVisible("labSumPage", true);
	popUpPageFixPos("labSumPage");
	
//	showLoading();
	
	var LabSummaryJsonlObj=[];
	var colNames = ["檢驗項目","單位","檢驗標準","檢驗範圍"];
	var colModels = [ 
		 { name: 'assay_id', width: 180,hidden:false,frozen:true },
	     
		 { name: 'detailData', width: 150,frozen:true,formatter:function(cellvalue, options, rowobject){
	        	return "<span>"+filterNull(cellvalue[0].unit)+"</span>";
	        	 
	        } },
	    {  name: 'detailData', width: 150,hidden:true,frozen:true,formatter:function(cellvalue, options, rowobject){
	        	return "<span>"+cellvalue[0].lab_status+"</span>";
	        	 
	        } },
	    {  name: 'detailData', width: 150,frozen:true,formatter:function(cellvalue, options, rowobject){
	        	return "<span>"+filterNull(cellvalue[0].real_normal_range)+"</span>";
 	 
	        } },]

//	var grid = $("#LabList");
//    var rowKey = grid.jqGrid('getGridParam',"selrow");
//    var kindId = grid.jqGrid('getCell',rowKey,"kind_id");
    
	
	
	var labItems = $("#strLabSumItem").html();//檢驗項目
	var kindId = $("#strLabSumKindId").html();
	
	if(from=="LabSum"){ //點下"彙總"按鈕
		var range =  $('input:radio[name="labSumRadio"]:checked').val();
		if(range=="自訂"){
			var startD = $("#inputLabSumStartDate").val();//開始日期
			var endD = $("#inputLabSumEndDate").val();//結束日期
			range = startD+"|"+endD;
		}
	}else{//從"彙總頁面"選擇 日期範圍
		var range =  $('input:radio[name="sumRadio"]:checked').val();
		if(range=="自訂"){
			var startD = $("#inputSumSDate").val();//開始日期
			var endD = $("#inputSumEDate").val();//結束日期
			range = startD+"|"+endD;
		}
		
		var exchangeRange;
//	    month|season|halfYear|year
	    if(range=="month"){
	    	exchangeRange = '1個月';
	    }else if(range=="season"){
	    	exchangeRange = '3個月';
	    }else if(range=="halfYear"){
	    	exchangeRange = '半年';
	    }else if(range=="year"){
	    	exchangeRange = '1年';
	    }else{
	    	exchangeRange = startD+" ~ "+endD;
	    }
		
		$("#labSumPage_Title").html("檢驗彙總表  日期範圍&emsp;"+ exchangeRange);
		
	}
	
	
	$("#strLabSumRange").html(range);
	
	var cmParam = new getLabSummaryDataInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,kindId,range,labItems,"getMatrixLabDdataByChartNoLabTypeLabItemsAndRange");
//    console.log(JSON.stringify(cmParam));
	var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
			function(data) {
				if (data.status == "Success") {
					$("#labSumLineChart").show();
					 $.each(data.resultSet, function(index, obj) {
						 LabSummaryJsonlObj.push(obj);
						 
					                   });
					 
					 var summ = renderSummaryColName(LabSummaryJsonlObj);
					 for(var i=0;i<summ.length;i++){
						 colNames.push(summ[i]); 
					 }
					 
//					 console.log(colNames);
					 
					 var colm = renderSummaryModel(LabSummaryJsonlObj);

					 for(var i=0;i<colm.length;i++){
						 colModels.push(colm[i]); 
					 }
					 
					 jqGrid_LabSummaryList("#LabSumList","#LabSumList_Pager",LabSummaryJsonlObj,colNames,colModels);//設定 檢驗彙總
					 
					 /**清空 隱藏參數**/
//						$("#strLabSumItem").html("");//檢驗項目
//						$("#strLabSumKindId").html("");//kindId
						
						

				} else {
					var ajaxErrMsg = data.errorMessage;
					noDataFound(ajaxErrMsg,"LabSumList");
					/**清空 隱藏參數**/
//					$("#strLabSumItem").html("");//檢驗項目
//					$("#strLabSumKindId").html("");//kindId
					$("#LabSumContainer").html("<span class='EMRLabelBold'>查無資料</span>");
					$("#labSumLineChart").hide();
//					if(ajaxErrMsg.includes('No Data Found')){
//						alert("查無資料");
//					}

					
					
				}	
										

			});

		request.onreadystatechange = null;
		request.abort = null;
		request = null; 
		hideLoading();
	
	
	
}

/**獲取趨勢圖資料 1070312 檢驗趨勢圖 one by one data  (尚未修改完成)**/
var ajax_getListLineChartData = function(serviceName){
	
//	console.log("ajax_getListLineChartData");
	
	setPageVisible("labChartPage", true);
	popUpPageFixPos("labChartPage");
	$("#labLineChartBar").html("");
	$("#labChartPage_Title").html("檢驗趨勢圖&emsp;&emsp; 檢驗日期範圍&emsp;"+LabObj.radioSDate+" ~ "+LabObj.radioEDate);
	
	var labItems =  $("#strLabItem").html();//檢驗項目
	var cmParam = new getLabItemsChartDataInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,"getLabDdataByChartNoLabItemsGroupByLabItem",LabObj.radioSDate,LabObj.radioEDate,labItems);
	
	
	
//	showLoading();
	
	var LineChartJsonlObj =[];
	var arrayListOBJ=[];
	
	var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
	function(data) {
		if (data.status == "Success") {
			
			 $.each(data.resultSet, function(index, obj) {
				 LineChartJsonlObj.push(obj);
				 
			                   });
			 
			 
			 
			 /**設定 LineChart data**/
			    var dataLabelArray = [];
				var dataLabelList = [];
//				
				
				
				for(var i=0;i<LineChartJsonlObj.length;i++){
					
					$('#LabLineChartContainer').append('<canvas id="LabLineChart_'+i+'"></canvas>');
					var LineChartHeight = $("#mainPage").height();
					$('#LabLineChart_'+i).css('min-height', (LineChartHeight-150) +'px').css('max-height', (LineChartHeight-150) +'px');
					$("#labLineChartBar").append('<li><a href="#LabLineChart_'+i+'">'+LineChartJsonlObj[i].assay_id+'</a></li>');
					
				     for(var j=0;j<LineChartJsonlObj[i].detailData.length;j++){
				       dataLabelArray.push(LineChartJsonlObj[i].detailData[j].result_val);	 
				     }
//				     console.log(LineChartJsonlObj[i].detailData[0].unit);
				     var emp = new datasets(LineChartJsonlObj[i].assay_id,dataLabelArray,getRandomColor());
			      	 arrayListOBJ.push(emp);
			      	 console.log(emp);
				     
					
					
		      		
		      		 /***填入 趨勢圖資料***/
					 
					var config = {
							
							 //是否顯示動畫
			                animation:true,
			                //動畫分多少步完成
			                animationSteps:200,
			                responsive: true,
			                
							
						    // The type of chart we want to create
						    type: 'line',

						    // The data for our dataset
						    data: {
//						        labels: ["January", "February", "March", "April", "May", "August","September","September","October","November","December"],
						        labels: dataLabelArray,//需替換成 日期
						        datasets: arrayListOBJ,
						    },

						    // Configuration options go here
						    options: {
						      elements:{
						       line:{
						        tension:0,
						        fill: false,
						        pointStyle: 'circle',
						       }	  
						      },
						      tooltips:{
						        mode:'point'	  
						      },
						      title:{
						        display:true,
						        fontSize: 20,
//						        text:"趨勢圖 Title",
//						        text:LineChartJsonlObj[i].assay_id+" "+LineChartJsonlObj[i].detailData[0].unit,
						        text:LineChartJsonlObj[i].assay_id+" 分析圖",
						        position:'top'
						      },
						      layout:{
						        padding:{
						        	left:20,
						        	right:20,
						        	top:10,
						        	bottom:10
						        }	  
						      },
						      scales: {
					              xAxes: [{
					                      display: true,
					                      scaleLabel: {
					                          display: true,
					                          labelString: '日期',
					                          position:'right',
					                          fontSize: 16
					                      }
					                      /**定義X軸數值
					                       * ticks:{
					                    	   callback:function(value,index,values){
						                        	  return '$'+value;
						                          }
					                      }**/
					                  }],
					              yAxes: [{
					                      display: true,
					                      ticks: {
					                          beginAtZero: true,
					                          steps: 10, 
					                          stepValue: 5,
					                          fontSize: 16
					                          //max: 1000  //最大值
					                          /**
					                           * 定義Y軸數值
					                           * callback:function(value,index,values){
					                        	  return '$'+value;
					                          }**/
					                      }
					                  }]
					          },
						      legend:{
						      position:'right',
						      labels:{
						       boxWidth:15,
						       fontColor:'green',
						       fontSize: 16,
						       //fontColor:'rbg(60,180,100)'
						      }
						      	  
						      }
						    	
						    
						    }
						}
					var ctx = document.getElementById('LabLineChart_'+i).getContext('2d');
					var chart = new Chart(ctx,config);
					dataLabelArray = [];
				     arrayListOBJ = [];
//				     $("#LabLineChartContainer").append('<hr class="hr_noline" />');//無分格線
				     $("#LabLineChartContainer").append('<hr class="hr_LabLineChart" />');//分格線 + 顏色
//				     $("#LabLineChartContainer").append('<hr style="padding-bottom:10px;">');//分格線 + 預設顏色
				     

					
				 
				 
				 /***填入 趨勢圖資料***/
				     
				}
				
				
//				$("#LabLineChartContainer").show();

			 
				
			
			
			

		} else {
			var ajaxErrMsg = data.errorMessage;
//			if(ajaxErrMsg.includes('No Data Found')){
//				alert("查無資料");
//			}
			ClearLineChartCanvas();
			
			
		}	
								

	});

request.onreadystatechange = null;
request.abort = null;
request = null; 
//hideLoading();

	
};


/**獲取趨勢圖資料 1070322 modify 檢驗趨勢圖 一次顯示所有檢驗項目 data **/
var ajax_getLineChartData = function(serviceName,from){
//	$("#LabLineChart").show();
	$("#lineChartMsg").hide();
	$("#LabLineChartContainer").html("");
	$("#LabLineChartContainer").append('<canvas id="LabLineChart" style="display:none;"></canvas><span class="EMRLabelBold" id="lineChartMsg" style="display:none;"></span>');
	var ctx = document.getElementById('LabLineChart').getContext('2d');
	
	setPageVisible("labChartPage", true);
	popUpPageFixPos("labChartPage");
//	$("#labLineChartBar").html(""); //只有一個趨勢圖 不需 底部的 nav  
//	$("#labChartPage_Title").html("檢驗趨勢圖&emsp;&emsp; 檢驗日期範圍&emsp;"+LabObj.radioSDate+" ~ "+LabObj.radioEDate);
	
	var labItems =  $("#strLabItem").html();//檢驗項目
	var kindId = $("#strLabKindId").html();
	
	if(from=="LabSum"){
		var range =  $('input:radio[name="labSumRadio"]:checked').val();
		if(range=="自訂"){
			var startD = $("#inputLabSumStartDate").val();//開始日期
			var endD = $("#inputLabSumEndDate").val();//結束日期
			range = startD+"|"+endD;
		}
	}else if(from=="LabChart"){
		var range =  $('input:radio[name="labRadio"]:checked').val();
		if(range=="自訂"){
			var startD = $("#inputLabStartDate").val();//開始日期
			var endD = $("#inputLabEndDate").val();//結束日期
			range = startD+"|"+endD;
		}
	}
	
	
	

	
	
	
	 var exchangeRange;
//   month|season|halfYear|year
   if(range=="month"){
   	exchangeRange = '1個月';
   }else if(range=="season"){
   	exchangeRange = '3個月';
   }else if(range=="halfYear"){
   	exchangeRange = '半年';
   }else if(range=="year"){
   	exchangeRange = '1年';
   }else{
   	exchangeRange = startD+" ~ "+endD;
   }
	
	$("#labChartPage_Title").html("檢驗趨勢圖 日期範圍&emsp;"+ exchangeRange);

	
	
	var cmParam = new getLabSummaryDataInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,kindId,range,labItems,"getMatrixLabDdataByChartNoLabTypeLabItemsAndRange");
	
	var LineChartJsonlObj =[];
	var arrayListOBJ=[];
	
	var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
	function(data) {
		if (data.status == "Success") {
			$("#LabLineChart").show();
//			showLoading();
			
			 $.each(data.resultSet, function(index, obj) {
				 LineChartJsonlObj.push(obj);
				 
			                   });
			 
			 var XDataTime = renderSummaryColName(LineChartJsonlObj);
			 
			 /**設定 LineChart data**/
			    var dataLabelArray = [];
				var dataLabelList = [];
				
				for(var i=0;i<LineChartJsonlObj.length;i++){
				     for(var j=0;j<LineChartJsonlObj[i].detailData.length;j++){
				       dataLabelArray.push(LineChartJsonlObj[i].detailData[j].result_val);	 
				     }
				     var dataV = new dataLabel(dataLabelArray);
				     dataLabelList.push(dataV);
				     dataLabelArray = [];
				     
				}
//			          console.log("dataLabelList=>"+JSON.stringify(dataLabelList)); 
			          
			          
			          for(var k=0;k<LineChartJsonlObj.length;k++){
			      		//dataList.push(((25+i)*2)-4);
			      		//var emp = new datasets("Label_"+i,dataList[i].dataLabel,getRandomColor());
			      		var emp = new datasets(LineChartJsonlObj[k].assay_id,dataLabelList[k].dataLabel,getRandomColor());
			      		arrayListOBJ.push(emp);
			      	}
			          
//			          console.log(arrayListOBJ);
			 
				
			 /***填入 趨勢圖資料***/
			 
				var config = {
						 //是否顯示動畫
		                animation:true,
		                //動畫分多少步完成
		                animationSteps:200,
					    // The type of chart we want to create
					    type: 'line',
					    responsive: true,
//					    scaleFontSize : 20,
					    pointDot: true,
		                pointDotRadius: 10,
		                pointDotStrokeWidth: 10,
		                /**showTooltips: false,
		                
		                onAnimationComplete: function() {//动画完成后显示对应的数据
                            var ctx = this.chart.ctx;
                            ctx.font = this.scale.font;
                            ctx.fillStyle = this.scale.textColor;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            this.datasets.forEach(function(dataset) {
                                dataset.points.forEach(function(bar) {
                                    ctx.fillText(points.value, bar.x, bar.y);
                                });
                            });
                        },**/
		                
		                
		               
//					    pointDotRadius: 6, //点的半径

					    // The data for our dataset
					    data: {
					    	//X軸檢驗日期
					    	labels: XDataTime,
//					        labels: ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December","January", "February", "March", "April", "May", "June", "July","August","September","October","November","December","January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"],
					        datasets: arrayListOBJ,
					    },

					    // Configuration options go here
					    options: {
					     spanGaps: true,//不斷線 1070411
					      elements:{
					       line:{
					        tension:0,
					        fill: false,
					        pointStyle: 'circle',
					       }	  
					      },
					      tooltips:{
					        mode:'point',
					        borderWidth:160,
					        titleFontSize:20,
					        titleSpacing:10,
					        backgroundColor:'black',
					        titleFontColor:'#fff',
					        bodyFontSize:16,
					        bodySpacing:2
					      },
					      title:{
					        display:false,
					        text:"檢驗趨勢圖",
					        position:'top',
					        fontSize: 20,
					      },
					      layout:{
					        padding:{
					        	left:20,
					        	right:20,
					        	top:20,
					        	bottom:10
					        }	  
					      },
					      scales: {
				              xAxes: [{
				                      display: true,
				                      scaleLabel: {
				                          display: true,
				                          labelString: '檢驗日期',
				                          position:'right',
				                          fontSize: 20,
				                      }
				                  }],
				              yAxes: [{
				                      display: true,
				                      ticks: {
				                          beginAtZero: true,
//				                          steps: 10, 
//				                          stepValue: 5,
				                          fontSize: 20,
				                          //max: 1000  //最大值
				                      }
				                  }]
				          },
//				          plotOptions: { series: { connectNulls: true } }, //1070411 add 預防斷線
					      legend:{
					      position:'right',
					      padding:{
					        	left:10,
					        	right:10,
					        	top:10,
					        	bottom:10
					        },
					      labels:{
					       boxWidth:15,
//					       fontColor:'black',
					       fontSize: 20,	   
					       //fontColor:'rbg(60,180,100)'
					      }
					      	  
					      }
					    	
					    
					    }
					}
				
				var chart = new Chart(ctx,config);
				hideLoading();
				
			 
			
			 /***填入 趨勢圖資料***/
			
			

		} else {
			var ajaxErrMsg = data.errorMessage;
			$("#LabLineChart").hide();
			
			if(ajaxErrMsg.includes('No Data Found')){
				$("#lineChartMsg").show();
				$("#lineChartMsg").html("查無資料");
			}
			hideLoading();
			
			
		}	
								

	});

request.onreadystatechange = null;
request.abort = null;
request = null; 

	
};

/**取得 檢驗彙總 趨勢圖  1070326 ***/
var ajax_getLabSumLineChartData = function(serviceName){
	setPageVisible("labSumChartPage", true);
	popUpPageFixPos("labSumChartPage");
//	$("#LabSumLineChart").show();
	$("#SumlineChartMsg").hide();
	$("#LabSumLineChartContainer").html("");
	$("#LabSumLineChartContainer").append('<canvas id="LabSumLineChart" style="display:none;"></canvas><span class="EMRLabelBold" id="SumlineChartMsg" style="display:none;"></span>');
	var ctx = document.getElementById('LabSumLineChart').getContext('2d');
	resizePanelBody("LabSumLineChart",pageHeight-200);	
	
//	$("#labLineChartBar").html(""); //只有一個趨勢圖 不需 底部的 nav  
	
	
	var labItems =  $("#strLabSumChartItem").html();//檢驗項目
	var kindId = $("#strLabSumChartKindId").html();
	var range =  $('input:radio[name="labSumChartRadio"]:checked').val();
	if(range=="自訂"){
		var startD = $("#inputLabSumChartStartDate").val();//開始日期
		var endD = $("#inputLabSumChartEndDate").val();//結束日期
		range = startD+"|"+endD;
	}
	
    var exchangeRange;
//    month|season|halfYear|year
    if(range=="month"){
    	exchangeRange = '1個月';
    }else if(range=="season"){
    	exchangeRange = '3個月';
    }else if(range=="halfYear"){
    	exchangeRange = '半年';
    }else if(range=="year"){
    	exchangeRange = '1年';
    }else{
    	exchangeRange = startD+" ~ "+endD;
    }
	
	$("#labSumChartPage_Title").html("檢驗彙總 趨勢圖 日期範圍&emsp;"+ exchangeRange);
	var cmParam = new getLabSummaryDataInputObj(UserObj.emp_no,UserObj.session_id,PatObj.chart_no,kindId,range,labItems,"getMatrixLabDdataByChartNoLabTypeLabItemsAndRange");
	
	var LineChartJsonlObj =[];
	var arrayListOBJ=[];
	
	var request = $.when(ajax_setPostData(serviceName,JSON.stringify(cmParam))).done(
	function(data) {
		if (data.status == "Success") {
//			showLoading();
			$("#LabSumLineChart").show();
			
			 $.each(data.resultSet, function(index, obj) {
				 LineChartJsonlObj.push(obj);
				 
			                   });
			 
			 var XDataTime = renderSummaryColName(LineChartJsonlObj);
			 
			 /**設定 LineChart data**/
			    var dataLabelArray = [];
				var dataLabelList = [];
				
				for(var i=0;i<LineChartJsonlObj.length;i++){
				     for(var j=0;j<LineChartJsonlObj[i].detailData.length;j++){
				       dataLabelArray.push(LineChartJsonlObj[i].detailData[j].result_val);	 
				     }
				     var dataV = new dataLabel(dataLabelArray);
				     dataLabelList.push(dataV);
				     dataLabelArray = [];
				     
				}
//			          console.log("dataLabelList=>"+JSON.stringify(dataLabelList)); 
			          
			          
			          for(var k=0;k<LineChartJsonlObj.length;k++){
			      		//dataList.push(((25+i)*2)-4);
			      		//var emp = new datasets("Label_"+i,dataList[i].dataLabel,getRandomColor());
			      		var emp = new datasets(LineChartJsonlObj[k].assay_id,dataLabelList[k].dataLabel,getRandomColor());
			      		arrayListOBJ.push(emp);
			      	}
			          
//			          console.log(arrayListOBJ);
			 
				
			 /***填入 趨勢圖資料***/
			 
				var config = {
						 //是否顯示動畫
		                animation:true,
		                //動畫分多少步完成
		                animationSteps:200,
					    // The type of chart we want to create
					    type: 'line',
					    responsive: true,
//					    scaleFontSize : 20,
					    pointDot: true,
		                pointDotRadius: 10,
		                pointDotStrokeWidth: 10,
//					    pointDotRadius: 6, //点的半径

					    // The data for our dataset
					    data: {
					    	//X軸檢驗日期
					    	labels: XDataTime,
//					        labels: ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December","January", "February", "March", "April", "May", "June", "July","August","September","October","November","December","January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"],
					        datasets: arrayListOBJ,
					    },

					    // Configuration options go here
					    options: {
					     spanGaps: true,//不斷線 1070411 add 
					      elements:{
					       line:{
					        tension:0,
					        fill: false,
					        pointStyle: 'circle',
					       }	  
					      },
					      tooltips:{
						        mode:'point',
						        borderWidth:160,
						        titleFontSize:20,
						        titleSpacing:10,
						        backgroundColor:'black',
						        titleFontColor:'#fff',
						        bodyFontSize:16,
						        bodySpacing:2
						      },
					      title:{
					        display:false,
					        text:"檢驗彙總趨勢圖",
					        position:'top',
					        fontSize: 20,
					      },
					      layout:{
					        padding:{
					        	left:20,
					        	right:20,
					        	top:20,
					        	bottom:10
					        }	  
					      },
					      scales: {
				              xAxes: [{
				                      display: true,
				                      scaleLabel: {
				                          display: true,
				                          labelString: '檢驗日期',
				                          position:'right',
				                          fontSize: 20,
				                      }
				                  }],
				              yAxes: [{
				                      display: true,
				                      ticks: {
				                          beginAtZero: true,
//				                          steps: 10, 
//				                          stepValue: 5,
				                          fontSize: 20,
				                          //max: 1000  //最大值
				                      }
				                  }]
				          },
					      legend:{
					      position:'right',
					      padding:{
					        	left:10,
					        	right:10,
					        	top:10,
					        	bottom:10
					        },
					      labels:{
					       boxWidth:15,
//					       fontColor:'black',
					       fontSize: 20,	   
					       //fontColor:'rbg(60,180,100)'
					      }
					      	  
					      }
					    	
					    
					    }
					}
				
				var chart = new Chart(ctx,config);
				hideLoading();
				
			 
			
			 /***填入 趨勢圖資料***/
			
			

		} else {
			var ajaxErrMsg = data.errorMessage;
			$("#LabSumLineChart").hide();
			
			if(ajaxErrMsg.includes('No Data Found')){
				$("#SumlineChartMsg").show();
				$("#SumlineChartMsg").html("查無資料");
			}
//			hideLoading();
			
			
		}	
								

	});

request.onreadystatechange = null;
request.abort = null;
request = null; 

	
};



/**檢驗趨勢圖 資料格式測試**/
//var LineChartJsonlObj =[];
var getLineChartJson = function(){
	var ctx = document.getElementById('LabLineChart').getContext('2d');
	var LineChartJsonlObj =[];
	var arrayListOBJ=[];
	
	
	

	try{
		$.getJSON("/FangEmrServices/html/Lab/Chart.txt").done(function(data){
			//var result = JSON.stringify(data);
			 $.each(data, function(index, obj) {
				 LineChartJsonlObj.push(obj);
				 
			                   });
			 console.log(LineChartJsonlObj.length);
			 
			 /**設定 LineChart data**/
			    var dataLabelArray = [];
				var dataLabelList = [];
				
				for(var i=0;i<LineChartJsonlObj.length;i++){
				     for(var j=0;j<LineChartJsonlObj[i].detailData.length;j++){
				       dataLabelArray.push(LineChartJsonlObj[i].detailData[j].result_val);	 
				     }
				     var dataV = new dataLabel(dataLabelArray);
				     dataLabelList.push(dataV);
				     dataLabelArray = [];
				     
				}
//			          console.log("dataLabelList=>"+JSON.stringify(dataLabelList)); 
			          
			          
			          for(var k=0;k<LineChartJsonlObj.length;k++){
			      		//dataList.push(((25+i)*2)-4);
			      		//var emp = new datasets("Label_"+i,dataList[i].dataLabel,getRandomColor());
			      		var emp = new datasets(LineChartJsonlObj[k].assay_id,dataLabelList[k].dataLabel,getRandomColor());
			      		arrayListOBJ.push(emp);
			      	}
			 
				
			 /***填入 趨勢圖資料***/
			 
				var config = {
					    // The type of chart we want to create
					    type: 'line',

					    // The data for our dataset
					    data: {
					        labels: ["January", "February", "March", "April", "May", "June", "July"],
					        datasets: arrayListOBJ,
					    },

					    // Configuration options go here
					    options: {
					      elements:{
					       line:{
					        tension:0,
					        fill: false
					       }	  
					      },
					      tooltips:{
					        mode:'point'	  
					      },
					      title:{
					        display:true,
					        text:"趨勢圖 Title",
					        position:'top'
					      },
					      layout:{
					        padding:{
					        	left:50,
					        	right:50,
					        	top:10,
					        	bottom:10
					        }	  
					      },
					      scales: {
				              xAxes: [{
				                      display: true,
				                      scaleLabel: {
				                          display: true,
				                          labelString: 'Month',
				                          position:'right'
				                      }
				                  }],
				              yAxes: [{
				                      display: true,
				                      ticks: {
				                          beginAtZero: true,
				                          steps: 10, 
				                          stepValue: 5,
				                          max: 1000  //最大值
				                      }
				                  }]
				          },
					      legend:{
					      position:'bottom',
					      labels:{
					       boxWidth:15,
					       fontColor:'green'
					       //fontColor:'rbg(60,180,100)'
					      }
					      	  
					      }
					    	
					    
					    }
					}
				
				var chart = new Chart(ctx,config);
				
			 
			 
			 /***填入 趨勢圖資料***/
			 
			
		}).fail(function(jqXHR,textStatus,errorThrown){
		        alert("InpRecordTestError: " + jqXHR.responseText+" ;"+errorThrown);
		});
	}catch(e){
//	 alert(e);	
	}

};

/**趨勢圖 資料格式 Chart.js API 
 * 參考網址:http://www.chartjs.org/docs/latest/configuration/elements.html
 * 參數
 * @ label 檢驗名稱 (String)
 * @ data 檢驗值  (Array)
 * @ borderColor 線的顏色 (String)
 * @ fill 線以下的背景色是否填滿 (boolean)
 * 
 * **/
var datasets = function(label,data,borderColor){
	this.label = label;
	this.data = data;
	this.borderColor = borderColor;
//	this.fill = fill;
	//this.strokeColor = strokeColor;
	//this.pointColor = pointColor;
	//this.backgroundColor = backgroundColor;
};

/**趨勢圖 label資料名稱**/
var dataLabel = function(dataLabel){
	this.dataLabel = dataLabel;
};

/**亂數 color**/
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


//檢驗彙總 表 測試 1070315
var getLabSummaryJson = function(){
	
	var LabSummaryJsonlObj = [];
	var colNames = ["檢驗項目","單位","檢驗標準","檢驗範圍"];
	var colModels = [ 
		 { name: 'assay_id', width: 180,hidden:false,frozen:true },
	     
		 { name: 'detailData', width: 150,frozen:true,formatter:function(cellvalue, options, rowobject){
	        	return "<span>"+filterNull(cellvalue[0].unit)+"</span>";
	        	 
	        } },
	    {  name: 'detailData', width: 150,hidden:true,frozen:true,formatter:function(cellvalue, options, rowobject){
	        	return "<span>"+cellvalue[0].lab_status+"</span>";
	        	 
	        } },
	    {  name: 'detailData', width: 150,frozen:true,formatter:function(cellvalue, options, rowobject){
	        	return "<span>"+cellvalue[0].normal_range+"</span>";
 	 
	        } },]
	
	
	
	try{
		$.getJSON("/FangEmrServices/html/Lab/Sample.txt").done(function(data){
			//var result = JSON.stringify(data);
			 $.each(data, function(index, obj) {
				 LabSummaryJsonlObj.push(obj);
				 
			                   });
//			 console.log(LabSummaryJsonlObj.length);
//			 renderSummaryColName(LabSummaryJsonlObj);
//			 console.log(renderSummaryColName(LabSummaryJsonlObj));
			 var summ = renderSummaryColName(LabSummaryJsonlObj);
			 for(var i=0;i<summ.length;i++){
				 colNames.push(summ[i]); 
			 }
			 
//			 console.log(colNames);
			 
			 var colm = renderSummaryModel(LabSummaryJsonlObj);

			 for(var i=0;i<colm.length;i++){
				 colModels.push(colm[i]); 
			 }
			 
			 jqGrid_LabSummaryList("#LabSumList","#LabSumList_Pager",LabSummaryJsonlObj,colNames,colModels);//設定 檢驗彙總 
			 
//			 $("#LabSumList").jqGrid().freezeColumn(2);
			 
			
		}).fail(function(jqXHR,textStatus,errorThrown){
		        alert("LabSummaryJsonlObjError: " + jqXHR.responseText+" ;"+errorThrown);
		});
	}catch(e){
//	 alert(e);	
	}

};

// 測試 Summary 格式
var setSummaryDateColumn = function(label,name,width,formatter){
	this.label = label;
	this.name = name;
	this.width = width;
	this.formatter = formatter;

};


/**動態產出 檢驗日期 colModes**/
var countFunction = function(j){
	var col;
//	if(j==j){
		col = {  name: 'detailData', width: 150,formatter:function(cellvalue, options, rowobject){
			
//			console.log(cellvalue[j].lab_status);
			if((cellvalue[j].lab_status=="L")||(cellvalue[j].lab_status=="H")||(cellvalue[j].lab_status=="A")){
    			return "<span class='text-danger'>"+filterNull(cellvalue[j].result_val) + "</span>";	
    		}else {
    			return "<span class='text-primary'>"+filterNull(cellvalue[j].result_val) + "</span>";	
    		}

//	    	return "<span>"+cellvalue[j].result_val+"</span>";
//	    	return "<span>"+rowobject[j].result_val+"</span>";


	    } };
//	}
	
	return col;
	
};


function renderSummaryModel(arrayData){
	var colModel = [];
	var col;
		    
	for(var j=0;j<arrayData[0].detailData.length;j++){
				
		colModel.push(countFunction(j));
	}
     
//    console.log(colModel);
	
	return colModel;
	
}

/**取出 日期範圍 colNames **/
function renderSummaryColName(arrayData){
	var colModel = [];

	for(var j=0;j<arrayData[0].detailData.length;j++){
		var label = arrayData[0].detailData[j].lab_date;
		
		colModel.push(label);
	}

	return colModel;
	
}



//檢驗彙總表 1070315 測試
function jqGrid_LabSummaryList(tableName,pagerName,arrayData,colNames,colModels){		//住院紀錄
	$(tableName).jqGrid({
	    datatype: "local",
	    height: pageHeight - 240,
	    colNames:colNames,
	    colModel: colModels,
	    	//[
//	    	 { name: 'assay_id', width: 170,hidden:false },
//		     { name: 'detailData', width: 150,formatter:function(cellvalue, options, rowobject){
//		        	return "<span>"+cellvalue[0].unit+"</span>";
//		        	 
//		        } },
//		    {  name: 'detailData', width: 150,hidden:true,formatter:function(cellvalue, options, rowobject){
//		        	return "<span>"+cellvalue[0].lab_status+"</span>";
//		        	 
//		        } },
//		    {  name: 'detailData', width: 150,formatter:function(cellvalue, options, rowobject){
//		        	return "<span>"+cellvalue[0].normal_range+"</span>";
//        	 
//		        } },

//	        { label: '檢驗項目', name: 'assay_id', width: 170,hidden:false },
//	        { label: '單位', name: 'detailData', width: 150,formatter:function(cellvalue, options, rowobject){
//	        	return "<span>"+cellvalue[0].unit+"</span>";
////	        	 
//	        } },
//	        { label: 'lab_status', name: 'detailData', width: 150,formatter:function(cellvalue, options, rowobject){
//	        	return "<span>"+cellvalue[0].lab_status+"</span>";
////	        	 
//	        } },
//	        { label: '病歷號', name: 'chart_no', width: 60,hidden:true },
//	        { label: '檢驗範圍', name: 'detailData', width: 150,formatter:function(cellvalue, options, rowobject){
//	        	return "<span>"+cellvalue[0].normal_range+"</span>";
////	        	 
//	        } },
//
//            { label: '檢驗日期', name: 'detailData', width: 90,formatter:function(cellvalue, options, rowobject){
//	        	 
//	        	return "<span></span>";
//	        	 
//	        } },
	        
	    //], 
	    viewrecords: true, // show the current page, data rang and total records on the toolbar
	    //caption: "病歷主檔",
	    multiselect: true, //多選 checkBox
//	    sortable: true,
	    onSelectRow:getSelectedRow,
	    ondblClickRow: function(rowId) {
	    	
        },
        hoverrows:false,
        width: null,
//        rowNum: Math.floor((pageHeight - 300)/33),
	    shrinkToFit:false,
	    //sortable: true,
		pager: pagerName,
		pagerpos:'left'
	});
	$(tableName).jqGrid('clearGridData');
	$(tableName).jqGrid('setFrozenColumns');
	$(tableName).jqGrid('setGridParam', {search: false, postData: { "filters": ""},data: arrayData});
	$(tableName).trigger('reloadGrid');
	//$(tableName).jqGrid('filterToolbar', { stringResult: true, searchOnEnter: false, defaultSearch: "cn" });
	
	function getSelectedRow() {
	    
	}
}








