package service;

import abstracts.ServletAdapter;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import library.dateutility.DateUtil;
import library.utility.JDBCUtilities;
import library.utility.MapGroupingUtil;
import library.utility.MapUtil;

import model.LabReport;


import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static library.utility.MapUtil.castToInt;
import static library.utility.MapUtil.castToStr;

/**
 * Created by jeffy on 2017/10/30.
 */
public class LabReportService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private LabReport labReport;
 
     public String getqueryEnterqryItem(int chartno,String ReportNo) {
        //JsonObject jsob = new JsonObject();
        try {
            objects = labReport.queryEnterqryItem(chartno,ReportNo,ReportNo);
           // jsob.addProperty(MapUtil.KEY_SUMMARY, count);
           // jsob.add(MapUtil.KEY_DETAILDATA, MapUtil.listMapToJsonArray(objects));
            //jsonObject = MapUtil.getSuccessResult(jsob);
            if (objects.size() > 0) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult(" No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }
     public String getqueryOneItemLabVal(int chartNo,String labAssayId,String Startdate,String Enddate) {
         //JsonObject jsob = new JsonObject();
         try {
             objects = labReport.queryOneItemLabVal(chartNo,labAssayId, Startdate,Enddate);
            // jsob.addProperty(MapUtil.KEY_SUMMARY, count);
            // jsob.add(MapUtil.KEY_DETAILDATA, MapUtil.listMapToJsonArray(objects));
             //jsonObject = MapUtil.getSuccessResult(jsob);
             if (objects.size() > 0) {
                 jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
             } else {
                 jsonObject = MapUtil.getFailureResult(" No Data Found ");
             }

         } catch (SQLException ex) {
             JDBCUtilities.printSQLException(ex);
             jsonObject = MapUtil.getFailureResult(ex.getMessage());
         }

         return jsonObject.toString();
     }

     public String getenterqryGermAntibio( String LabReportNo,String germGroup,String rptType){
    	 try {             
             objects = labReport.enterqryGermAntibio(  LabReportNo, germGroup,rptType);

             if (objects.size() > 0) {                
                 jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
             } else {
                 jsonObject = MapUtil.getFailureResult("LabReport.getenterqryGermAntibio No Data Found ");
             }

         } catch (SQLException ex) {
             JDBCUtilities.printSQLException(ex);
             jsonObject = MapUtil.getFailureResult(ex.getMessage());
         }

         return jsonObject.toString();       	 
    	    
    }

     public String getenterqryGermresult( String LabReportNo,String germGroup,String rptType){
    	 try {             
             objects = labReport.pEnterqryGermResultm( LabReportNo,germGroup, rptType);

             if (objects.size() > 0) {                
                 jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
             } else {
                 jsonObject = MapUtil.getFailureResult("LabReport.pEnterqryGermResultm No Data Found ");
             }

         } catch (SQLException ex) {
             JDBCUtilities.printSQLException(ex);
             jsonObject = MapUtil.getFailureResult(ex.getMessage());
         }

         return jsonObject.toString();       	 
     }
     public String getLabDdataByChartNoLabItems(int chartNo, String labItems, List<String> masterCols, List<String> detailCols,String startdate,String enddate) {
         try {
             List<Object> sqlParaObjects = new ArrayList();
             sqlParaObjects.add(chartNo);
             sqlParaObjects.add(startdate);
             sqlParaObjects.add(enddate);
             sqlParaObjects.addAll(Arrays.asList(labItems.split("\\|")));
             List<Object> nullObjects = new ArrayList<>();
             for (int i = sqlParaObjects.size(); i < 43; i++) {
            	  nullObjects.add(null);
             }
             sqlParaObjects.addAll(nullObjects);
             //System.out.println("1111"+sqlParaObjects);
             objects = labReport.queryLabDdataByChartNoLabItems(sqlParaObjects);
             System.out.println("return object"+objects);

             if (objects.size() > 0) {
                 System.out.println("return objects.size()"+objects.size());
                 System.out.println("masterCols:"+masterCols);
                 System.out.println("detailCols"+detailCols);
                 JsonArray resultJsArray = MapGroupingUtil.groupListMapToJsonArray(MapGroupingUtil.getGroupingResultMap(objects, masterCols, detailCols));
                 jsonObject = MapUtil.getSuccessResult(resultJsArray);
             } else {
                 sqlParaObjects.removeAll(nullObjects);
                 jsonObject = MapUtil.getFailureResult("labRrport.queryLabDdataByChartNoLabItems sqlParaObjects=" + sqlParaObjects.toString() + " No Data Found ");
             }

         } catch (SQLException ex) {
             JDBCUtilities.printSQLException(ex);
             jsonObject = MapUtil.getFailureResult(ex.getMessage());
         }
         return jsonObject.toString();
     }
     public String getLabDdataByChartNoLabItemsGroupByLabItem(int chartNo, String assayId,String startdate,String enddate) {
         List<String> masterCols = Arrays.asList("assay_id");
      //   assay_id, result_val, unit, lab_status, instr_kind,"+
       //  " assay_judgetype, result_status,report_normalrange
         List<String> detailCols = Arrays.asList("result_val", "unit", "lab_status", "instr_kind", "assayid_judgetype", "result_status","report_normalrange" ,"report_date","normal_val");
         return getLabDdataByChartNoLabItems(chartNo, assayId, masterCols, detailCols,startdate,enddate);
     }

    @Override
    public String run(JsonObject parametersJsObj) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String result = null;
        //String method ="getqueryEnterqryItem";
        try {
            myConnection = jdbcUtil.getConnection();
            labReport = new LabReport(myConnection);
            String method = parametersJsObj.get("method").getAsString();

            // get Lab data by chart_no then group by kind_id
            if (method.equals("getqueryEnterqryItem")) {
                String reportNo = parametersJsObj.get("reportNo").getAsString();
                int chartno = parametersJsObj.get("chartNo").getAsInt();
                 
                result = getqueryEnterqryItem(chartno,reportNo);
            }

            //  get Lab data by chart_no, years then group by kind_id
            if (method.equals("getenterqryGermAntibio")) {
                String reportNo = parametersJsObj.get("reportNo").getAsString();
                String germGroup = parametersJsObj.get("germGroup").getAsString();
                String rptType=parametersJsObj.get("rptType").getAsString();
                
                result = getenterqryGermAntibio(reportNo, germGroup,rptType);
            }

            if (method.equals("getLabDdataByChartNoLabItemsGroupByLabItem")) {
               // labDdata = new LabDdata(myConnection);
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String assayId = parametersJsObj.get("assayId").getAsString();
                String startdate = parametersJsObj.get("startdate").getAsString();
                String enddate = parametersJsObj.get("enddate").getAsString();
                
                result = getLabDdataByChartNoLabItemsGroupByLabItem(chartNo, assayId,startdate,enddate);
            }

            if (method.equals("queryOneItemLabVal")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String assayid = parametersJsObj.get("assayid").getAsString();
                String startdate=parametersJsObj.get("startdate").getAsString();
                String enddate=parametersJsObj.get("enddate").getAsString();
                 
                result = getqueryOneItemLabVal(chartNo, assayid,startdate,enddate);
            }
            if (method.equals("getenterqryGermresult")) {
              // int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String reportno = parametersJsObj.get("reportNo").getAsString();
                String germgroup=parametersJsObj.get("germGroup").getAsString();
                String rptType=parametersJsObj.get("rptType").getAsString();
                 
                result = getenterqryGermresult(reportno,germgroup,rptType);
            }
                  
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        } finally {
            if (myConnection != null) { JDBCUtilities.closeConnection(myConnection); }
        }
        return result;
    }


    public static void main(String[] args) {
        JsonObject jsonObject = new JsonObject();
        //Map<String, String> map = new LinkedHashMap<>();
        LabReportService labReportService = new LabReportService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        //jsonObject.addProperty("reportNo", "010518A300045");
        jsonObject.addProperty("reportNo", "021110NE00001");
        
        jsonObject.addProperty("chartNo", 912473);
        //jsonObject.addProperty("reqNo","021110NE00001");
       
        //jsonObject.addProperty("assayid", "Hct");
        jsonObject.addProperty("startdate", "0970101");
        jsonObject.addProperty("enddate", "0980101");
       // getqueryOneItemLabVal(int chartNo,String labAssayId,String Startdate,String Enddate)
        jsonObject.addProperty("method", "getqueryOneItemLabVal");
        resultStrng = labReportService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nLabRecordService.run getqueryOneItemLabVal reportno=021110NE00001"  + resultStrng);


       
        jsonObject.addProperty("method", "getqueryEnterqryItem");
        resultStrng = labReportService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nLabRecordService.run getqueryEnterqryItem reqportNo=021110NE00001"  + resultStrng);
        //System.out.println("test");
        jsonObject.addProperty("reportNo", "9110152200030");
        jsonObject.addProperty("germGroup", "2284");
       jsonObject.addProperty("rptType", "B");

        jsonObject.addProperty("method", "getenterqryGermAntibio");
        resultStrng = labReportService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nLabRecordService.run getenterqryGermAntibio reportNo=9110152200030:"  + resultStrng);
       // getenterqryGermresult
        jsonObject.addProperty("method", "getenterqryGermresult");
       jsonObject.addProperty("reportNo", "990616A800008");
       jsonObject.addProperty("germGroup", "2285");
        jsonObject.addProperty("rptType", "B");
        resultStrng = labReportService.run(jsonObject);
        System.out.println("\ngetenterqryGermresult Parameters JsonObject string: " + jsonObject);
        System.out.println("\nLabRecordService.run getenterqryGermresult reportNo=990616A800008:"  + resultStrng);
       
        jsonObject.addProperty("method", "getLabDdataByChartNoLabItemsGroupByLabItem");
        jsonObject.addProperty("assayId","GOT|GPT|Albumin|MCV|WBC(H)");
        jsonObject.addProperty("startdate","0960101");
        jsonObject.addProperty("enddate","0970101");
        
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        resultStrng = labReportService.run(jsonObject);
        System.out.println("\nLabRecordService.run getLabDdataByChartNoLabItemsGroupByLabItem chartNo=912473 assayid='GOT|GPT|Albumin|MCV|WBC(H)': " + resultStrng);

     


    }
}

