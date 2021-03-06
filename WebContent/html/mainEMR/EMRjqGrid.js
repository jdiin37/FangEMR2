function resizeGrid() {

  if(grid = $('.ui-jqgrid-btable:visible')) {
    grid.each(function(index) {
      var gridId = $(this).attr('id');
      var gridHeight = 0;
      var numOfRow = 10;
      if(gridId == "PatList" ||gridId == "PatList2"){ //查詢病患 RWD 1070410 OK
    	  var queryHeading = $('#queryPage').find('.clearfix').height();
  		  var queryBlock1 = $("#queryBlock1").height();
  		  var queryBlock2 = $("#queryBlock2").height();
  		  gridHeight = userHeight - (queryHeading+queryBlock1+queryBlock2+350); 
//    	  numOfRow = Math.floor(gridHeight/26);
      }else if(gridId=="InpList"){ //住院畫面 RWD 1070410 OK
    	  var inpHeading = $('#inpPage').find('.clearfix').height();
  		  var InpMaster = $("#InpMaster").height();
  		  var InpListHead = $("#InpListHead").height();
    	  gridHeight = userHeight - (inpHeading+InpMaster+InpListHead+280); 
    	  numOfRow = Math.floor(gridHeight/27);
    	  resizePanelBody("InpListBody",(gridHeight));//住院
      }else if(gridId =="OpList"){ //手術畫面 RWD 1070410 OK
    	  
    	  var opHeading = $('#opPage').find('.clearfix').height();
  		  var OpMaster = $("#OpMaster").height();
  		  var OpListHead = $("#OpListHead").height();
    	  
    	  gridHeight = userHeight - (opHeading+OpMaster+OpListHead+280); 
    	  numOfRow = Math.floor(gridHeight/27);
    	  resizePanelBody("OpListBody",((gridHeight)));//手術
    	  resizePanelBody("OpPersonalContent",(gridHeight-60));//手術 基本資料
    	  resizePanelBody("OpDataContent",(gridHeight-50));//手術資料
    	  resizePanelBody("OpAntibioContent",(gridHeight-50));//抗生素使用紀錄
    	  resizePanelBody("OpBackOpRoomContent",(gridHeight-50)); //重返手術室紀錄
    	  resizePanelBody("OpArtificialContent",(gridHeight-50)); //人工關節植入物紀錄
    	  
      }else if(gridId=="OpAntibioList"){ //手術畫面(抗生素使用紀錄 Grid) RWD 1070410 OK
    	  gridHeight = userHeight - (opHeading+OpMaster+OpListHead+280); //-220  modify 1070320
    	  numOfRow = Math.floor(gridHeight/33);
      }
      else if(gridId =="LabList"){ //檢驗畫面 RWD 1070410 OK
    	var labHeading = $('#labPage').find('.clearfix').height();
  		var LabMasterCol = $(".LabMasterCol").height();
  		var labListHead = $("#labListHead").height();
  		gridHeight = userHeight - (labHeading+LabMasterCol+labListHead+260); 
   	    numOfRow = Math.floor(gridHeight/27);
   	    resizePanelBody("labListBody",(gridHeight));//檢驗
	    resizePanelBody("Lab_txtContent1",(gridHeight-90));//檢驗
  		
      }else if(gridId=="GermAntibioList"){ //檢驗畫面 (細菌報告 Grid) RWD 1070410 OK
    	  gridHeight = pageHeight - 600;
    	  numOfRow = Math.floor(gridHeight/24);
    	 
      }else if(gridId =="XrayList"){ //影像畫面  RWD 1070410 OK
    	  var xrayHeading = $('#xrayPage').find('.clearfix').height();
  		  var XrayMasterCol = $(".XrayMasterCol").height();
  		  var XrayListHead = $("#XrayListHead").height();
  		  
    	  gridHeight = userHeight - (xrayHeading+XrayMasterCol+XrayListHead+250); 
    	  numOfRow = Math.floor(gridHeight/36);
    	  resizePanelBody("xrayDetailReason",gridHeight-300);//固定 影像報告右側畫面的 醫囑原因&報告內容外框高度
    	  resizePanelBody("XrayListBody",gridHeight);//影像
      }else if(gridId=="ProgressList"
    	  ||gridId=="AdmissionList"||gridId=="FocusList"||gridId=="OutNoteList"||gridId=="GermList"){
    	  gridHeight = pageHeight - 210; //-220  modify 1070320
    	  numOfRow = Math.floor(gridHeight/27);
    	 
    	  resizePanelBody("ProgressListBody",gridHeight);//病程紀錄
    	  resizePanelBody("AdmissionListBody",gridHeight);//入院病摘    	 
    	  resizePanelBody("FocusListBody",gridHeight);//護理紀錄
    	  resizePanelBody("content_D",(gridHeight-100));//護理紀錄 Content 內容
    	  resizePanelBody("OutNoteListBody",gridHeight);//出院病摘
//    	  resizePanelBodyWidth("InpListBody"); //住院右側 Body 寬
    	  resizePanelBody("GermListBody",gridHeight);//細菌報告
    	  resizeGermDataBody("GermTopRp",gridHeight);//細菌報告表格上方位置

      }else if(gridId=="LabDataList"){ //檢驗表格清單    	  
    	  gridHeight = pageHeight - 370;
    	  numOfRow = Math.floor(gridHeight/26);//40,33
//    	  resizeTabContentHeight("TabContentOutline",(gridHeight));
    	  
      }else if(gridId=="LabSumList"){
    	  var labSumHeading = $('#labSumPage').find('.clearfix').height();
    	  var sumRadioGroup = $("#sumRadioGroup").height();
    	  var labSumLineChart = $("#labSumLineChart").height();
    	  gridHeight = userHeight - (labSumHeading+sumRadioGroup+labSumLineChart+280);
    	  numOfRow = Math.floor(gridHeight/26);//40,33

      }
      
      else if(gridId == "ChgBedList"){
    	  gridHeight = pageHeight - 170;
    	  numOfRow = Math.floor(gridHeight/25);   
	      	  

      }else if(gridId == "XrayPosList"){ //影像報告 的 照射位置jqGrid
    	  gridHeight = 100;
    	  numOfRow = Math.floor(gridHeight/33);
    	  
      }else if(gridId == "inpRecordList"){ //住院紀錄畫面 RWD 1070410
    	var inpRecordHeading = $('#inpRecordPage').find('.clearfix').height();
  		var inpRecordPatInfo = $("#inpRecordPatInfo").height();
  		var inpRecordInfo = $("#inpRecordInfo").height();
  		var inpRecordInfo2 = $("#inpRecordInfo2").height();
  		 gridHeight = userHeight - (inpRecordHeading+inpRecordPatInfo+inpRecordInfo+inpRecordInfo2+270); 
    	  numOfRow = 5000;
      }else if(gridId=="OpdRecordList"||gridId=="OpdDiseaseSumList"||gridId=="OpdDiseaseSumDetailList"||gridId=="OpdAcntOrderList1"||gridId=="OpdAcntOrderList2"||gridId=="OpdAcntOrderDetailList1"||gridId=="OpdAcntOrderDetailList2"||gridId=="OpdMedicineDetailList"){  //門急紀錄 畫面 RWD 1070417 OK
    	var opdHeading = $('#opdRecordPage').find('.clearfix').height();
  		var OpdMaster = $("#OpdMaster").height();
  		var OpdIcd10Name = $("#OpdIcd10Name").height();
  		var opdRecordInfo = $("#opdRecordInfo").height();
  		var OpdRecordListHead = $("#OpdRecordListHead").height();
  		var OpdDiseaseSumListHead = $("#OpdDiseaseSumListHead").height();
//  		var OpdAcntDetailListHead1 =  $("#OpdAcntDetailListHead1").height();
//  		var OpdAcntDetailListHead2 =  $("#OpdAcntDetailListHead2").height();
  		var OpdAcntDetailListHead1 =  41;
  		var OpdAcntDetailListHead2 =  41;
		var disSumVis = $('#OpdDiseaseSumListHead').is(':visible');
		var opdSumDetailHeadHeight = OpdDiseaseSumListHead -45;
  		if(disSumVis){
  			if(gridId=="OpdDiseaseSumList"){
  				gridHeight = userHeight - (opdHeading+OpdMaster+OpdIcd10Name+opdRecordInfo+OpdDiseaseSumListHead+270);
  				
  				/**if(opdSumDetailHeadHeight<10){
  					
  					gridHeight = userHeight - (opdHeading+OpdMaster+OpdIcd10Name+opdRecordInfo+OpdDiseaseSumListHead+270+opdSumDetailHeadHeight);
  				}else{
  					var h = (opdSumDetailHeadHeight+40);
  					gridHeight = userHeight - (opdHeading+OpdMaster+OpdIcd10Name+opdRecordInfo+OpdDiseaseSumListHead+270+(h));
  					
  					
  				}**/
  				
  			}else if(gridId=="OpdDiseaseSumDetailList"){
  				if(opdSumDetailHeadHeight<10){
//  					resizePanelBody("OpdDiseaseSumDetailCol",(gridHeight-OpdDiseaseSumListHead)); 
  					gridHeight = userHeight - (opdHeading+OpdMaster+OpdIcd10Name+opdRecordInfo+OpdDiseaseSumListHead+265+OpdDiseaseSumListHead);
  				}else{
  					var h = (opdSumDetailHeadHeight+50);
  					gridHeight = userHeight - (opdHeading+OpdMaster+OpdIcd10Name+opdRecordInfo+OpdDiseaseSumListHead+265+(h));
//  					resizePanelBody("OpdDiseaseSumDetailCol",(gridHeight-h));
  					
  				}
  				
  			}else if(gridId=="OpdMedicineDetailList"){
  				gridHeight = userHeight - (opdHeading+300);
  				resizePanelBody("OpdRecordListBody",(gridHeight-400));//門急 
  				
  				
  			}
  			 	
  		}else{
  			if(gridId=="OpdRecordList"){ //門急診日期紀錄清單 
  				gridHeight = userHeight - (opdHeading+OpdMaster+OpdIcd10Name+opdRecordInfo+OpdRecordListHead+290);
  			}else if(gridId=="OpdAcntOrderList1"||gridId=="OpdAcntOrderList2"){ //門急診 醫令彙總清單
  				var halfGridHeight = userHeight - (opdHeading+OpdMaster+OpdIcd10Name+opdRecordInfo+OpdAcntDetailListHead1+OpdAcntDetailListHead2+240);
//  				gridHeight = userHeight - (opdHeading+OpdMaster+OpdIcd10Name+opdRecordInfo+OpdRecordListHead+470);
  				gridHeight = (halfGridHeight/2);
//  				resizePanelBody("OpdAcntDetailListBody1",(gridHeight/2));
//  				resizePanelBody("OpdAcntDetailListBody2",(gridHeight/2));
  				resizePanelBody("OpdAcntDetailBody1",gridHeight);
//  				resizePanelBody("OpdAcntDetailBody2",gridHeight);
  				

  			}else if(gridId=="OpdAcntOrderDetailList1"||gridId=="OpdAcntOrderDetailList2"){ //門急診 醫令彙總明細清單
  			
  				var OpdMaster = $("#OpdMaster").height();
  				var OpdIcd10Name = $("#OpdIcd10Name").height();
  				var opdRecordInfo = $("#opdRecordInfo").height();
  				var OpdAcntDetailListHead1 =  41;
  				var OpdAcntDetailListHead2 =  41;
  				var halfGridHeight2 = userHeight - (OpdMaster+OpdIcd10Name+opdRecordInfo+OpdAcntDetailListHead1+350);
//  				var halfGridHeight2 = userHeight - (OpdMaster+OpdIcd10Name+opdRecordInfo+OpdAcntDetailListHead1+OpdAcntDetailListHead2+540);
  				
//  				var halfGridHeight2 = userHeight - (opdHeading+OpdMaster+OpdIcd10Name+opdRecordInfo+OpdAcntDetailListHead1+OpdAcntDetailListHead2+240);
//				gridHeight = userHeight - (opdHeading+OpdMaster+OpdIcd10Name+opdRecordInfo+OpdRecordListHead+470);
				gridHeight = (halfGridHeight2);
				resizePanelBody("OpdAcntDetailBody1",gridHeight);
//  				resizePanelBody("OpdAcntDetailBody2",gridHeight+10);
				numOfRow = Math.floor(gridHeight/25);  

  				
  			}else if(gridId=="OpdMedicineDetailList"){
  				gridHeight = userHeight - (opdHeading+300);
  				resizePanelBody("OpdRecordListBody",(gridHeight-400));//門急 
  				
  				
  			}
  			
  		}
  		
//    	numOfRow = Math.floor(gridHeight/40);
    	resizePanelBody("OpdRecordListBody",(gridHeight));//門急 
    	
    	
      }else if(gridId=="MajorDiseaseList"){ //重大疾病
    	  var MajorHeading = $('#majorDiseasePage').find('.clearfix').height();
    	  gridHeight = userHeight - (MajorHeading+280);
		  resizePanelBody("majorDiseaseBody",(gridHeight+90));

      }else if(gridId=="AllergyList"||gridId=="AllergyDetailList"){
    	  var allergyHeading = $('#allergyPage').find('.clearfix').height();
    	  gridHeight = userHeight - (allergyHeading+280);
		  resizePanelBody("allergyBody",(gridHeight+90));
      }
      /**else if(gridId=="OpdDiseaseSumDetailList"){
    	  gridHeight = pageHeight - 360;
    	  numOfRow = Math.floor(gridHeight/40);
    	  
      }**/
      else if(gridId=="StatList"||gridId=="TakeHomeList"){  //STAT, 出院帶藥 帳款日期
//    	  gridHeight = pageHeight - 180; //有加分頁符號
    	  gridHeight = pageHeight - 160; //未加分頁符號
    	  numOfRow = Math.floor(gridHeight/33);
     	  resizePanelBody("StatListBody",(gridHeight+10));//Stat 用藥紀錄
     	  resizePanelBody("TakeHomeListBody",(gridHeight+10));//出院帶藥
     	 
    	  
      }else if(gridId=="StatDetailList"){  //STAT 明細 RWD 1070411 OK
    	  var stHeading = $('#stPage').find('.clearfix').height();
    	  var stRadioGroup = $(".stRadioGroup").height(); 
    	  var pageForm = $(".pageForm").height(); 
    	  
    	  if(pageForm>34){
    		  $(".pageTotal").hide();
    	  }else{
    		  $(".pageTotal").show();
    	  }
    	  gridHeight = userHeight - (stHeading+stRadioGroup+pageForm+300); 
    	  numOfRow = Math.floor(gridHeight/26);
     	  
    	  
      }else if(gridId=="TakeHomeDetailList"){ //出院帶藥明細
    	  var takeHeading = $('#takeHomePage').find('.clearfix').height();
    	  var pageForm = $('#takeHomePage').find(".pageForm").height(); 
    	 
    	  if(pageForm>34){
    		  $(".pageTotal").hide();
    	  }else{
    		  $(".pageTotal").show();  
    	  }
    	  gridHeight = userHeight - (takeHeading+pageForm+300);   
    	  numOfRow = Math.floor(gridHeight/26);
    	  
      }else if(gridId=="UdDetailList"){  //UD用藥紀錄明細 RWD 1070411 OK
    	  
    	  var udHeading = $('#udPage').find('.clearfix').height();
    	  var udRadioGroup = $(".udRadioGroup").height();  		
    	  gridHeight = userHeight - (udHeading+udRadioGroup+270); 
    	  
//    	  gridHeight = pageHeight-200; 
    	  numOfRow = Math.floor(gridHeight/26);
    	  resizePanelBody("UdListBody",(gridHeight+100));//UD 用藥紀錄  	
      }else if(gridId=="OpdOrderDetailList"){
    	  
    	  var opdOrderHeading = $('#opdOrderPage').find('.clearfix').height();
    	  var opdRadioGroup = $(".opdRadioGroup").height();  		
    	  gridHeight = userHeight - (opdOrderHeading+opdRadioGroup+270); 
    	  
//    	  gridHeight = pageHeight-200; 
//    	  numOfRow = Math.floor(gridHeight/26);
    	  resizePanelBody("OpdOrderListBody",(gridHeight+100));//UD 用藥紀錄  
    	  
      }else if(gridId=="InpAdmissionList"||gridId=="InpOutNoteList"){
    	  gridHeight = userHeight - (800);
      } 
      $('#' + gridId).setGridHeight(gridHeight);      
//      $('#' + gridId).jqGrid('setGridParam', {rowNum: numOfRow}).trigger('reloadGrid'); //會導致 
      AppendPager(gridId,gridId + "_pager",gridId+"_tot",gridHeight);//1070305 使用在  STAT,出院帶藥 帳款日期Grid上
      
//      var selectedRowId = $('#' + gridId).jqGrid('getGridParam', 'selrow');//選擇 單選列 的rowKeyId
//      $('#' + gridId).jqGrid('setSelection', selectedRowId, true); //設定單選列 的rowKeyId selection 位置
    });
  }
  
 
  
}

/**function resizeXrayPosBody(id,gridHeight){
	$('#'+id).css('min-height', gridHeight+38 +'px').css('max-height', gridHeight+38 +'px');
} **/

function resizePanelBody(id,gridHeight){
	$('#'+id).css('min-height', (gridHeight+38) +'px').css('max-height', (gridHeight+38) +'px');

}

function resizeJqGridWidth(id,gridHeight){
	$('#'+id).css('min-width', (gridHeight*0.5) +'px').css('max-width', (gridHeight*0.5) +'px');
}

function resizePanelBodyWidth(id){
	
	$('#'+id).css('min-width', "100%").css('max-width', "100%");

}

/***tabContent height**/
function resizeTabContentHeight(className,gridHeight){
	$('.'+className).css('min-height', (gridHeight) +'px').css('max-height', (gridHeight) +'px');

}
//min-height:600px;
//max-height:600px;

//重新設定 細菌報告上頭報告空間
function resizeGermDataBody(id,gridHeight){
//	 console.log(id+";height="+gridHeight);
	 $('#'+id).css('min-height', (gridHeight-350) +'px').css('max-height', (gridHeight-350) +'px');
//	 $('#'+id).attr('style',"min-height:"+gridHeight-600 +'px;max-height:'+gridHeight-600 +'px');
//	 document.getElementsById(id).setAttribute("style", "min-height:"+gridHeight-600 +'px;max-height:'+gridHeight-600 +'px');

}


function AppendPager(jgGrid,pagerID,totalID,girdheight){
	var recordCnt = $('#'+ jgGrid).getGridParam("reccount");
	var NumOfRow = getPagerCnt('#'+jgGrid);
	var NumOfPage = recordCnt/ NumOfRow + 1;
	var pageOption = "";
	var i = 0;
	for (i=0;i<Math.floor(NumOfPage);i++){
		pageOption += '<option value="' + i+'">'
		+ (i + 1) + '</option>';
	}
	
	$('#'+ pagerID).html("").append(pageOption);
	$('#'+ totalID).html(i);
	
	$('#'+ pagerID).change(function() {
		//alert($(this).val() * Math.floor(NumOfRow));
		scrollToRow(jgGrid, $(this).val() * Math.floor(NumOfRow));
	});
	
	function scrollToRow(targetGrid, id) {
		var rowHeight = 27; // Default
		var index = jQuery('#' +targetGrid).getInd(id);
		jQuery('#'+ targetGrid).closest(".ui-jqgrid-bdiv").scrollTop(rowHeight * index);
	}		
	
	function getPagerCnt(targetGrid){
		return (girdheight-45)/25;   //-45是扣掉header
	}
}





//格式化日期
function formatDateTime(cellValue, options, rowObject) {
	   if(cellValue === undefined || cellValue === null||cellValue=="[object Window]"||cellValue==="null"){
		   return "";
		   
	   }else{
			if(cellValue.length==7){
	   			 var y = cellValue.substring(0,3);
	   			 var m = cellValue.substring(3,5);
	   			 var d = cellValue.substring(5,7);
//	   			 console.log(y+"/"+m+"/"+d);
	   			 if(cellValue.startsWith("0")){
	   				var y = cellValue.substring(1,3); //如果民國年小於 100年 ，去除前面的0
	   			 }
	   				return y+"/"+m+"/"+d;
	   				
	   			}else if(cellValue.length==6){
	   			 var hh = cellValue.substring(0,2);
	   			 var mm = cellValue.substring(2,4);
	   			 var ss = cellValue.substring(4,6);
//	   			 console.log(hh+":"+mm+":"+ss);
	   				return hh+":"+mm+":"+ss;
	   				
	   			}else if(cellValue.length==11){ //例:手術輸入日期 10702261546
	   				
	   			 var y = cellValue.substring(0,3);
	   			 var m = cellValue.substring(3,5);
	   			 var d = cellValue.substring(5,7);
	   			 if(cellValue.startsWith("0")){
	   				var y = cellValue.substring(1,3); //如果民國年小於 100年 ，去除前面的0
	   			 }
	   			 var hh = cellValue.substring(7,9);
	   			 var mm = cellValue.substring(9,11);
	   			 
	   			return y+"/"+m+"/"+d+"  "+hh+":"+mm;
	   				
	   				
	   			}else if(cellValue.length==4){
	   			 var hh = cellValue.substring(0,2);
	   			 var mm = cellValue.substring(2,4);
//	   			 console.log(hh+":"+mm);
	   				return hh+":"+mm;
	   				
	   			}else {
	   				return "";
	   			}
	   }
	  
         };

//格式化 藥品分類
/** 1.藥品/2.處置/3.材料**/
function formatPriceType(cellValue, options, rowObject) {
         	
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

/**formatter UD吃藥次數**/
function formatDoStatus(cellValue, options, rowObject) {
	 
	 var total = cellValue.length;
	 var searchO = cellValue.indexOf("O");
	 var searchX = cellValue.indexOf("X");
//	 console.log(searchX);
	 
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
//	 OOXX
	/** if(cellValue.indexOf("X")==-1){  //如果都沒X 表示都有吃藥  
		 return total+"/"+total;
	 }else if(cellValue.indexOf("O")==-1){  //如果都沒 O 表示都沒吃藥
		 return "0"+"/"+total;
	 }else{
		if(cellValue.){
			
		} 
	 }  **/
};


