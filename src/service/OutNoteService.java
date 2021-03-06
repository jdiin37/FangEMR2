package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.dateutility.DateUtil;
import library.utility.JDBCUtilities;
import library.utility.MapUtil;
import model.OutNote;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

/**
 * Created by jeffy on 2018/2/5.
 */
public class OutNoteService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private OutNote outNote;


//    public String getOutnoteCountByChartNoDateRange(int chartNo, String startDate, String endDate) {
//        if (endDate == null || endDate.equals("")) endDate = DateUtil.dateToROCDateString(LocalDate.now());
//
//        try {
//            object = outNote.queryOutnoteCountByChartNoDateRange(chartNo, startDate, endDate);
//
//            if (object.size() > 0) {
//                jsonObject = MapUtil.getSuccessResult(MapUtil.mapToJsonObject(object));
//            } else {
//                jsonObject = MapUtil.getFailureResult("OutNote.queryOutnoteCountByChartNoDateRange chartNo= " + chartNo +
//                        " startDate=" + startDate + " endDate=" + endDate + " No Data Found ");
//            }
//
//        } catch (SQLException ex) {
//            JDBCUtilities.printSQLException(ex);
//            jsonObject = MapUtil.getFailureResult(ex.getMessage());
//        }
//
//        return jsonObject.toString();
//    }

//    public String getOutnoteCountByChartNoYears(int chartNo, int years) {
//        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
//        String endDate = DateUtil.dateToROCDateString(LocalDate.now());
//        return getOutnoteCountByChartNoDateRange(chartNo, startDate, endDate);
//    }
//
//    public String getOutnoteCountByChartNo(int chartNo) {
//        String startDate = "0010101";
//        String endDate = DateUtil.dateToROCDateString(LocalDate.now());
//        return getOutnoteCountByChartNoDateRange(chartNo, startDate, endDate);
//    }

    public String getOutnoteListByChartNoSerno(int chartNo, int serno) {
        try {
            objects = outNote.queryOutnoteListByChartNoSerno(chartNo, serno);

            if (!objects.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("OutNote.queryOutnoteListByChartNoSerno chartNo= " + chartNo +
                        " serno= " + serno + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }


//    public String getOutNoteDataByPrimaryKeys(int chartNo, int serno, int cutSerno) {
//        try {
//            object = outNote.queryOutnoteDataByPrimaryKeys(chartNo, serno, cutSerno);
//
//            if (!object.isEmpty()) {
//                jsonObject = MapUtil.getSuccessResult(MapUtil.mapToJsonObject(object));
//            } else {
//                jsonObject = MapUtil.getFailureResult("OutNote.queryOutnoteDataByPrimaryKeys chartNo= " + chartNo +
//                        " serno= " + serno + " cutSerno= " + cutSerno + " No Data Found ");
//            }
//
//        } catch (SQLException ex) {
//            JDBCUtilities.printSQLException(ex);
//            jsonObject = MapUtil.getFailureResult(ex.getMessage());
//        }
//
//        return jsonObject.toString();
//    }

    @Override
    public String run(JsonObject parametersJsObj) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String result = null;

        try {
            myConnection = jdbcUtil.getConnection();
            outNote = new OutNote(myConnection);
            
            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            // get outnote count by chart_no, start_date, end_date
//            if (method.equals("getOutnoteCountByChartNoDateRange")) {
//                int chartNo = parametersJsObj.get("chartNo").getAsInt();
//                String startDate = parametersJsObj.get("startDate").getAsString();
//                String endDate = parametersJsObj.get("endDate").getAsString();
//                result = getOutnoteCountByChartNoDateRange(chartNo, startDate, endDate);
//            }

            //  get outnote count by chart_no, years
//            if (method.equals("getOutnoteCountByChartNoYears")) {
//                int chartNo = parametersJsObj.get("chartNo").getAsInt();
//                int years = parametersJsObj.get("years").getAsInt();
//                result = getOutnoteCountByChartNoYears(chartNo, years);
//            }

            //  get outnote count by chart_no
//            if (method.equals("getOutnoteCountByChartNo")) {
//                int chartNo = parametersJsObj.get("chartNo").getAsInt();
//                result = getOutnoteCountByChartNo(chartNo);
//            }


            //  get outnote list by chart_no, serno
            if (method.equals("getOutnoteListByChartNoSerno")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int serno = parametersJsObj.get("serno").getAsInt();
                result = getOutnoteListByChartNoSerno(chartNo, serno);
            }

            //  get outnote data by primary keys => {chart_no, serno, cut_serno}
//            if (method.equals("getOutNoteDataByPrimaryKeys")) {
//                int chartNo = parametersJsObj.get("chartNo").getAsInt();
//                int serno = parametersJsObj.get("serno").getAsInt();
//                int cutSerno = parametersJsObj.get("cutSerno").getAsInt();
//                result = getOutNoteDataByPrimaryKeys(chartNo, serno, cutSerno);
//            }

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
        OutNoteService outNoteService = new OutNoteService();
        String resultStrng;

//        jsonObject.addProperty("empNo", "ORCL");
//        jsonObject.addProperty("sessionID", 1);
//        jsonObject.addProperty("chartNo", 912473);
//        jsonObject.addProperty("startDate", "1030504");
//        jsonObject.addProperty("endDate", "1030507");
//        jsonObject.addProperty("method", "getOutnoteCountByChartNoDateRange");
//        resultStrng = outNoteService.run(jsonObject);
//        System.out.println("\nParameters JsonObject string: " + jsonObject);
//        System.out.println("\nOutNoteService.run getOutnoteCountByChartNoDateRange chartNo=923833 startDate='1030504' endDate='1030507' :"  + resultStrng);

//        jsonObject = new JsonObject();
//        jsonObject.addProperty("empNo", "ORCL");
//        jsonObject.addProperty("sessionID", 1);
//        jsonObject.addProperty("chartNo", 912473);
//        jsonObject.addProperty("years", 5);
//        jsonObject.addProperty("method", "getOutnoteCountByChartNoYears");
//        resultStrng = outNoteService.run(jsonObject);
//        System.out.println("\nParameters JsonObject string: " + jsonObject);
//        System.out.println("\nOutNoteService.run getOutnoteCountByChartNoYears chartNo=912473 years=5 :"  + resultStrng);

//        jsonObject = new JsonObject();
//        jsonObject.addProperty("empNo", "ORCL");
//        jsonObject.addProperty("sessionID", 1);
//        jsonObject.addProperty("chartNo", 912473);
//        jsonObject.addProperty("method", "getOutnoteCountByChartNo");
//        resultStrng = outNoteService.run(jsonObject);
//        System.out.println("\nParameters JsonObject string: " + jsonObject);
//        System.out.println("\nOutNoteService.run getOutnoteCountByChartNo chartNo=912473 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 912473);
        jsonObject.addProperty("serno", 94771);
        jsonObject.addProperty("method", "getOutnoteListByChartNoSerno");
        resultStrng = outNoteService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nOutNoteService.run getOutnoteListByChartNoSerno chartNo=923833 serno=94771 cutSerno=0 :"  + resultStrng);

//        jsonObject = new JsonObject();
//        jsonObject.addProperty("empNo", "ORCL");
//        jsonObject.addProperty("sessionID", 1);
//        jsonObject.addProperty("chartNo", 912473);
//        jsonObject.addProperty("serno", 94771);
//        jsonObject.addProperty("cutSerno", 0);
//        jsonObject.addProperty("method", "getOutNoteDataByPrimaryKeys");
//        resultStrng = outNoteService.run(jsonObject);
//        System.out.println("\nParameters JsonObject string: " + jsonObject);
//        System.out.println("\nOutNoteService.run getOutNoteDataByPrimaryKeys chartNo=923833 serno=94771 cutSerno=0 :"  + resultStrng);

    }
}
