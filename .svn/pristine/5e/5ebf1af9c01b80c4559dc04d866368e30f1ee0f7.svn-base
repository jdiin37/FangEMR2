package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.dateutility.DateUtil;
import library.utility.JDBCUtilities;
import library.utility.MapEntryUtil;
import library.utility.MapUtil;
import model.DrProgress;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by jeffy on 2018/2/8.
 */
public class DrProgressService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private DrProgress drProgress;

    public String getDrProgressCountByChartNoDateRange(int chartNo, String startDate, String endDate) {
        if (endDate == null || endDate.equals("")) endDate = DateUtil.dateToROCDateString(LocalDate.now());

        try {
            object = drProgress.queryDrProgressCountByChartNoDateRange(chartNo, startDate, endDate);

            if (object.size() > 0) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.mapToJsonObject(object));
            } else {
                jsonObject = MapUtil.getFailureResult("DrProgress.queryDrProgressCountByChartNoDateRange chart_no= " + chartNo +
                        " startDate=" + startDate + " endDate=" + endDate + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getDrProgressCountByChartNoYears(int chartNo, int years) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getDrProgressCountByChartNoDateRange(chartNo, startDate, endDate);
    }

    public String getDrProgressCountByChartNo(int chartNo) {
        String startDate = "0010101";
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getDrProgressCountByChartNoDateRange(chartNo, startDate, endDate);
    }

    public String getDrProgressListByChartNoDateRange(int chartNo, String startDate, String endDate) {
        if (endDate == null || endDate.equals("")) endDate = DateUtil.dateToROCDateString(LocalDate.now());
        List<Map<String, Object>> tempListMap;
        List<String> keyList = Arrays.asList("years", "chart_no", "serno", "progress_date", "progress_time");

        try {
            tempListMap = drProgress.queryDrProgressListByChartNoDateRange(chartNo, startDate, endDate);
            objects = tempListMap.stream()
                    .map(map -> MapEntryUtil.getSubMapByKeyList(map, keyList))
                    .collect(Collectors.toList());

            if (!objects.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("DrProgress.queryDrProgressListByChartNoDateRange " +
                        " chart_no= " + chartNo + " startDate=" + startDate + " endDate=" + endDate + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getDrProgressListByChartNoYears(int chartNo, int years) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getDrProgressListByChartNoDateRange(chartNo, startDate, endDate);
    }

    public String getDrProgressListByChartNo(int chartNo) {
        String startDate = "0010101";
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getDrProgressListByChartNoDateRange(chartNo, startDate, endDate);
    }

    public String getDrProgressDataByPrimaryKeys(int chartNo, int serno, String progressDate, String progressTime) {
        try {
            object = drProgress.queryDrProgressDataByPrimaryKeys(chartNo, serno, progressDate, progressTime);

            if (!object.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.mapToJsonObject(object));
            } else {
                jsonObject = MapUtil.getFailureResult("DrProgress.getDrProgressDataByChartNoSerno chartNo= " + chartNo +
                        " serno= " + serno + " progressDate= " + progressDate + " progressTime= " + progressTime + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    @Override
    public String run(JsonObject parametersJsObj) {
        Connection myConnection = null;
        JDBCUtilities jdbcUtil = new JDBCUtilities();
        String result = null;

        try {
            myConnection = jdbcUtil.getConnection();
            drProgress = new DrProgress(myConnection);
            
            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            // get drprogress count by {chart_no, start_date, end_date}
            if (method.equals("getDrProgressCountByChartNoDateRange")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                result = getDrProgressCountByChartNoDateRange(chartNo, startDate, endDate);
            }

            // get drprogress count by {chart_no, years}
            if (method.equals("getDrProgressCountByChartNoYears")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                result = getDrProgressCountByChartNoYears(chartNo, years);
            }

            // get drprogress count by {chart_no}
            if (method.equals("getDrProgressCountByChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                result = getDrProgressCountByChartNo(chartNo);
            }

            // get drprogress list by {chart_no, start_date, end_date}
            if (method.equals("getDrProgressListByChartNoDateRange")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                result = getDrProgressListByChartNoDateRange(chartNo, startDate, endDate);
            }

            // get drprogress list by {chart_no, years}
            if (method.equals("getDrProgressListByChartNoYears")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                result = getDrProgressListByChartNoYears(chartNo, years);
            }

            // get drprogress list by {chart_no}
            if (method.equals("getDrProgressListByChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                result = getDrProgressListByChartNo(chartNo);
            }

            //  get drprogress data by {chart_no, serno, progress_date, progress_time}
            if (method.equals("getDrProgressDataByPrimaryKeys")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int serno = parametersJsObj.get("serno").getAsInt();
                String progressDate = parametersJsObj.get("progressDate").getAsString();
                String progressTime = parametersJsObj.get("progressTime").getAsString();
                result = getDrProgressDataByPrimaryKeys(chartNo, serno, progressDate, progressTime);
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
        DrProgressService admissionService = new DrProgressService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 6);
        jsonObject.addProperty("startDate", "1040713");
        jsonObject.addProperty("endDate", "1040714");
        jsonObject.addProperty("method", "getDrProgressCountByChartNoDateRange");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nDrProgressService.run getDrProgressCountByChartNoDateRange chartNo=6 " +
                "startDate='1040713' endDate='1040714' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 6);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("method", "getDrProgressCountByChartNoYears");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nDrProgressService.run getDrProgressCountByChartNoYears chartNo=6 " +
                "years=5 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 6);
        jsonObject.addProperty("method", "getDrProgressCountByChartNo");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nDrProgressService.run getDrProgressCountByChartNo chartNo=6 " + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 6);
        jsonObject.addProperty("startDate", "1040713");
        jsonObject.addProperty("endDate", "1040714");
        jsonObject.addProperty("method", "getDrProgressListByChartNoDateRange");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nDrProgressService.run getDrProgressListByChartNoDateRange chartNo=6 " +
                "startDate='1040713' endDate='1040714' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 6);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("method", "getDrProgressListByChartNoYears");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nDrProgressService.run getDrProgressListByChartNoYears chartNo=6 " +
                "years=5 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 6);
        jsonObject.addProperty("method", "getDrProgressListByChartNo");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nDrProgressService.run getDrProgressListByChartNo chartNo=6 " + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 6);
        jsonObject.addProperty("serno", 61991);
        jsonObject.addProperty("progressDate", "1040713");
        jsonObject.addProperty("progressTime", "144014");
        jsonObject.addProperty("method", "getDrProgressDataByPrimaryKeys");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nDrProgressService.run getDrProgressDataByPrimaryKeys chartNo=6 serno=61991" +
                " progressDate='1040713' progressTime='144014' :"  + resultStrng);

    }
}
