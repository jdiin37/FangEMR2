package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.dateutility.DateUtil;
import library.utility.JDBCUtilities;
import library.utility.MapEntryUtil;
import library.utility.MapUtil;
import model.NurseProgress;

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
public class NurseProgressService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private NurseProgress nurseProgress;

    public String getNurseProgressCountByChartNoDateRange(int chartNo, String startDate, String endDate) {
        if (endDate == null || endDate.equals("")) endDate = DateUtil.dateToROCDateString(LocalDate.now());

        try {
            object = nurseProgress.queryNurseProgressCountByChartNoDateRange(chartNo, startDate, endDate);

            if (object.size() > 0) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.mapToJsonObject(object));
            } else {
                jsonObject = MapUtil.getFailureResult("NurseProgress.queryNurseProgressCountByChartNoDateRange chart_no= " + chartNo +
                        " startDate=" + startDate + " endDate=" + endDate + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getNurseProgressCountByChartNoYears(int chartNo, int years) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getNurseProgressCountByChartNoDateRange(chartNo, startDate, endDate);
    }

    public String getNurseProgressCountByChartNo(int chartNo) {
        String startDate = "0010101";
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getNurseProgressCountByChartNoDateRange(chartNo, startDate, endDate);
    }

    public String getNurseProgressListByChartNoDateRange(int chartNo, String startDate, String endDate) {
        if (endDate == null || endDate.equals("")) endDate = DateUtil.dateToROCDateString(LocalDate.now());
        List<Map<String, Object>> tempListMap;
        List<String> keyList = Arrays.asList("years", "chart_no", "serno", "progress_date", "progress_time");

        try {
            tempListMap = nurseProgress.queryNurseProgressListByChartNoDateRange(chartNo, startDate, endDate);
            objects = tempListMap.stream()
                    .map(map -> MapEntryUtil.getSubMapByKeyList(map, keyList))
                    .collect(Collectors.toList());

            if (!objects.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("NurseProgress.queryNurseProgressListByChartNoDateRange " +
                        " chart_no= " + chartNo + " startDate=" + startDate + " endDate=" + endDate + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getNurseProgressListByChartNoYears(int chartNo, int years) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getNurseProgressListByChartNoDateRange(chartNo, startDate, endDate);
    }

    public String getNurseProgressListByChartNo(int chartNo) {
        String startDate = "0010101";
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getNurseProgressListByChartNoDateRange(chartNo, startDate, endDate);
    }

    public String getNurseProgressDataByPrimaryKeys(int chartNo, int serno, String progressDate, String progressTime) {
        try {
            objects = nurseProgress.queryNurseProgressByPrimaryKeys(chartNo, serno, progressDate, progressTime);

            if (!objects.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("NurseProgress.queryNurseProgressByPrimaryKeys " +
                        " chartNo= " + chartNo + " serno= " + serno + " progressDate= " + progressDate +
                        " progressTime= " + progressTime + " No Data Found ");
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
            nurseProgress = new NurseProgress(myConnection);
            
            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            // get nurseprogress count by {chart_no, start_date, end_date}
            if (method.equals("getNurseProgressCountByChartNoDateRange")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                result = getNurseProgressCountByChartNoDateRange(chartNo, startDate, endDate);
            }

            // get nurseprogress count by {chart_no, years}
            if (method.equals("getNurseProgressCountByChartNoYears")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                result = getNurseProgressCountByChartNoYears(chartNo, years);
            }

            // get nurseprogress count by {chart_no}
            if (method.equals("getNurseProgressCountByChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                result = getNurseProgressCountByChartNo(chartNo);
            }

            // get nurseprogress list by {chart_no, start_date, end_date}
            if (method.equals("getNurseProgressListByChartNoDateRange")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                result = getNurseProgressListByChartNoDateRange(chartNo, startDate, endDate);
            }

            // get nurseprogress list by {chart_no, years}
            if (method.equals("getNurseProgressListByChartNoYears")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                result = getNurseProgressListByChartNoYears(chartNo, years);
            }

            // get nurseprogress list by {chart_no}
            if (method.equals("getNurseProgressListByChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                result = getNurseProgressListByChartNo(chartNo);
            }

            //  get nurseprogress data by {chart_no, serno, progressDate, progressTime}
            if (method.equals("getNurseProgressDataByPrimaryKeys")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int serno = parametersJsObj.get("serno").getAsInt();
                String progressDate = parametersJsObj.get("progressDate").getAsString();
                String progressTime = parametersJsObj.get("progressTime").getAsString();
                result = getNurseProgressDataByPrimaryKeys(chartNo, serno, progressDate, progressTime);
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
        NurseProgressService admissionService = new NurseProgressService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 973950);
        jsonObject.addProperty("startDate", "1020522");
        jsonObject.addProperty("endDate", "1020524");
        jsonObject.addProperty("method", "getNurseProgressCountByChartNoDateRange");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nNurseProgressService.run getNurseProgressCountByChartNoDateRange chartNo=973950 " +
                "startDate='1020522' endDate='1020524' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 973950);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("method", "getNurseProgressCountByChartNoYears");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nNurseProgressService.run getNurseProgressCountByChartNoYears chartNo=973950 " +
                "years=5 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 973950);
        jsonObject.addProperty("method", "getNurseProgressCountByChartNo");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nNurseProgressService.run getNurseProgressCountByChartNo chartNo=973950 " + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 973950);
        jsonObject.addProperty("startDate", "1020522");
        jsonObject.addProperty("endDate", "1020524");
        jsonObject.addProperty("method", "getNurseProgressListByChartNoDateRange");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nNurseProgressService.run getNurseProgressListByChartNoDateRange chartNo=973950 " +
                "startDate='1020522' endDate='1020524' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 973950);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("method", "getNurseProgressListByChartNoYears");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nNurseProgressService.run getNurseProgressListByChartNoYears chartNo=973950 " +
                "years=5 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 973950);
        jsonObject.addProperty("method", "getNurseProgressListByChartNo");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nNurseProgressService.run getNurseProgressListByChartNo chartNo=973950 " + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 973950);
        jsonObject.addProperty("serno", 86973);
        jsonObject.addProperty("progressDate", "1020524");
        jsonObject.addProperty("progressTime", "173017");
        jsonObject.addProperty("method", "getNurseProgressDataByPrimaryKeys");
        resultStrng = admissionService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nNurseProgressService.run getNurseProgressDataByPrimaryKeys chartNo=973950 " +
                "serno=86973 progressDate='1020524' progressTime='173017' :"  + resultStrng);

    }
}
