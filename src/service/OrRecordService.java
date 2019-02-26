package service;

import abstracts.ServletAdapter;
import com.google.gson.JsonObject;
import library.dateutility.DateUtil;
import library.utility.JDBCUtilities;
import library.utility.MapEntryUtil;
import library.utility.MapUtil;
import model.OrAntibiotic;
import model.OrRecord;
import model.Patopd;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static library.utility.MapUtil.castToStr;

/**
 * Created by jeffy on 2017/10/26.
 */
public class OrRecordService extends ServletAdapter {
    private List<Map<String, Object>> objects;
    private Map<String, Object> object;
    private JsonObject jsonObject = new JsonObject();
    private OrRecord orRecord;
    private Patopd patopd;
    private OrAntibiotic orAntibiotic;

    private Map<String, Object> getFirstAndLastViewDateByChartNo(int chartNo) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            result = patopd.queryFirstAndLastViewDateByChartNo(chartNo);
        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
        }
        return result;
    }

    private String getOPDataByChartNoDateRange(int chartNo, String startDate, String endDate, String inpOpd) {
        List<Map<String, Object>> tempListMap;

        try {
            tempListMap = orRecord.queryOPDataByChartNoDateRange(chartNo, startDate, endDate);
            objects = tempListMap.stream()
                    .filter(map -> map.get("inp_opd").equals(inpOpd))
                    .collect(Collectors.toList());

            if (!objects.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("OrRecord.queryOPDataByStartEndDateChartNo  chartNo=" + chartNo
                        + " startDate=" + startDate + " endDate=" + endDate + " inpOpd=" + inpOpd + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getOPCountByChartNoDateRange(int chartNo, String startDate, String endDate) {
        try {
            object = orRecord.queryOPCountByChartNoDateRange(chartNo, startDate, endDate);

            if (object.size() > 0) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.mapToJsonObject(object));
            } else {
                jsonObject = MapUtil.getFailureResult("OrRecord.queryOPCountByChartNoDateRange chart_no= " + chartNo +
                        " startDate=" + startDate + " endDate=" + endDate + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getOPCountByChartNoYears(int chartNo, int years) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getOPCountByChartNoDateRange(chartNo, startDate, endDate);
    }

    public String getOPCountByChartNo(int chartNo) {
        String startDate = "0010101";
        Map<String, Object> map = getFirstAndLastViewDateByChartNo(chartNo);
        if (!map.isEmpty()) {
            startDate =  castToStr(map.get("first_view_date"));
        }
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getOPCountByChartNoDateRange(chartNo, startDate, endDate);
    }


    public String getPatopdOPDataByChartNoDateRange(int chartNo, String startDate, String endDate) {
        return getOPDataByChartNoDateRange(chartNo, startDate, endDate, "O");
    }

    public String getPatinpOPDataByChartNoDateRange(int chartNo, String startDate, String endDate) {
        return getOPDataByChartNoDateRange(chartNo, startDate, endDate, "I");
    }

    public String getOPListByChartNoDateRange(int chartNo, String startDate, String endDate) {
        List<Map<String, Object>> tempListMap;
        List<String> keyList = Arrays.asList("years", "op_date", "chart_no", "serno", "times", "inp_opd",
                "code_m1", "code_m1_name", "code_m2", "code_m2_name", "code_m3", "code_m3_name",
                "code_d1", "code_d1_name", "code_d2", "code_d2_name");
        try {
            tempListMap = orRecord.queryOPListByChartNoDateRange(chartNo, startDate, endDate);
            objects = tempListMap.stream()
                    .map(map -> MapEntryUtil.getSubMapByKeyList(map, keyList))
                    .collect(Collectors.toList());

            if (!objects.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("OrRecord.queryOPListByChartNoDateRange chartNo=" + chartNo
                        + " startDate=" + startDate + " endDate=" + endDate + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    public String getOPListByChartNoYears(int chartNo, int years) {
        String startDate = DateUtil.dateToROCDateString(LocalDate.now().plus(-years, ChronoUnit.YEARS));
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getOPListByChartNoDateRange(chartNo, startDate, endDate);
    }

    public String getOPListByChartNo(int chartNo) {
        String startDate = "0010101";
        Map<String, Object> map = getFirstAndLastViewDateByChartNo(chartNo);
        if (!map.isEmpty()) {
            startDate =  castToStr(map.get("first_view_date"));
        }
        String endDate = DateUtil.dateToROCDateString(LocalDate.now());

        return getOPListByChartNoDateRange(chartNo, startDate, endDate);
    }

    public String getOPDataByPrimaryKeys(String opDate, int chartNo, int serno, int times) {
        try {
            object = orRecord.queryOPDataByPrimaryKeys(opDate, chartNo, serno, times);

            if (!object.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.mapToJsonObject(object));
            } else {
                jsonObject = MapUtil.getFailureResult("OrRecord.queryOPDataByPrimaryKeys opDate=" + opDate
                        + " chartNo=" + chartNo + " serno=" + serno + " times=" + times + " No Data Found ");
            }

        } catch (SQLException ex) {
            JDBCUtilities.printSQLException(ex);
            jsonObject = MapUtil.getFailureResult(ex.getMessage());
        }

        return jsonObject.toString();
    }

    private String getOrAntibioticByPrimaryKeys(String opDate, int chartNo, int serno, int times) {

        try {
            objects = orAntibiotic.queryOrAntibioticByPrimaryKeys(opDate, chartNo, serno, times);

            if (!objects.isEmpty()) {
                jsonObject = MapUtil.getSuccessResult(MapUtil.listMapToJsonArray(objects));
            } else {
                jsonObject = MapUtil.getFailureResult("OrAntibiotic.queryOrAntibioticByPrimaryKeys opDate=" + opDate
                        + " chartNo=" + chartNo + " serno=" + serno + " times=" + times + " No Data Found ");
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
            orRecord = new OrRecord(myConnection);
            patopd = new Patopd(myConnection);
            orAntibiotic = new OrAntibiotic(myConnection);

            String empNo = parametersJsObj.get("empNo").getAsString();
            String method = parametersJsObj.get("method").getAsString();

            // get OP count by chart_no, start_date, end_date
            if (method.equals("getOPCountByChartNoDateRange")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                result = getOPCountByChartNoDateRange(chartNo, startDate, endDate);
            }

            // get OP count by chart_no, years
            if (method.equals("getOPCountByChartNoYears")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                result = getOPCountByChartNoYears(chartNo, years);
            }

            // get OP count by chart_no
            if (method.equals("getOPCountByChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                result = getOPCountByChartNo(chartNo);
            }

            //  get patopd op data
            if (method.equals("getPatopdOPDataByChartNoDateRange")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                result = getPatopdOPDataByChartNoDateRange(chartNo, startDate, endDate);
            }

            //  get patinp op data
            if (method.equals("getPatinpOPDataByChartNoDateRange")) {
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                result = getPatinpOPDataByChartNoDateRange(chartNo, startDate, endDate);
            }

            // get OP list by chart_no
            if (method.equals("getOPListByChartNo")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                result = getOPListByChartNo(chartNo);
            }

            // get OP list by chart_no, years
            if (method.equals("getOPListByChartNoYears")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int years = parametersJsObj.get("years").getAsInt();
                result = getOPListByChartNoYears(chartNo, years);
            }

            // get OP list by chart_no, startDate, endDate
            if (method.equals("getOPListByChartNoDateRange")) {
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                String startDate = parametersJsObj.get("startDate").getAsString();
                String endDate = parametersJsObj.get("endDate").getAsString();
                result = getOPListByChartNoDateRange(chartNo, startDate, endDate);
            }

            // get OP Data by op_date, chart_no, serno, times
            if (method.equals("getOPDataByPrimaryKeys")) {
                String opDate = parametersJsObj.get("opDate").getAsString();
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int serno = parametersJsObj.get("serno").getAsInt();
                int times = parametersJsObj.get("times").getAsInt();
                result = getOPDataByPrimaryKeys(opDate, chartNo, serno, times);
            }

            // get OrAntibiotic Data op_date, chart_no, serno, times
            if (method.equals("getOrAntibioticByPrimaryKeys")) {
                String opDate = parametersJsObj.get("opDate").getAsString();
                int chartNo = parametersJsObj.get("chartNo").getAsInt();
                int serno = parametersJsObj.get("serno").getAsInt();
                int times = parametersJsObj.get("times").getAsInt();
                result = getOrAntibioticByPrimaryKeys(opDate, chartNo, serno, times);
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
        OrRecordService orRecordService = new OrRecordService();
        String resultStrng;

        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 923883);
        jsonObject.addProperty("method", "getOPCountByChartNo");
        resultStrng = orRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nOrRecordService.run getOPCountByChartNo chartNo=923833 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 923883);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("method", "getOPCountByChartNoYears");
        resultStrng = orRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nOrRecordService.run getOPCountByChartNoYears chartNo=923833 years=5 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 923883);
        jsonObject.addProperty("startDate", "0940806");
        jsonObject.addProperty("endDate", "1030913");
        jsonObject.addProperty("method", "getOPCountByChartNoDateRange");
        resultStrng = orRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nOrRecordService.run getOPCountByChartNoDateRange chartNo=923833 startDate='0940806' endDate='1030913' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 923883);
        jsonObject.addProperty("startDate", "0940806");
        jsonObject.addProperty("endDate", "1030913");
        jsonObject.addProperty("method", "getPatopdOPDataByChartNoDateRange");
        resultStrng = orRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nOrRecordService.run getPatopdOPDataByChartNoDateRange chartNo=923833 startDate='0940806' endDate='1030913' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 923883);
        jsonObject.addProperty("startDate", "0940806");
        jsonObject.addProperty("endDate", "1030913");
        jsonObject.addProperty("method", "getPatinpOPDataByChartNoDateRange");
        resultStrng = orRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nOrRecordService.run getPatinpOPDataByChartNoDateRange chartNo=923833 startDate='0940806' endDate='1030913' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 923883);
        jsonObject.addProperty("method", "getOPListByChartNo");
        resultStrng = orRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nOrRecordService.run getOPListByChartNo chartNo=923833 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 923883);
        jsonObject.addProperty("years", 5);
        jsonObject.addProperty("method", "getOPListByChartNoYears");
        resultStrng = orRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nOrRecordService.run getOPListByChartNoYears chartNo=923833 years=5 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("chartNo", 923883);
        jsonObject.addProperty("startDate", "0940806");
        jsonObject.addProperty("endDate", "1030913");
        jsonObject.addProperty("method", "getOPListByChartNoDateRange");
        resultStrng = orRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nOrRecordService.run getOPListByChartNoDateRange chartNo=923833 startDate='0940806' endDate='1030913' :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("opDate", "1020521");
        jsonObject.addProperty("chartNo", 990554);
        jsonObject.addProperty("serno", 86971);
        jsonObject.addProperty("times", 1);
        jsonObject.addProperty("method", "getOPDataByPrimaryKeys");
        resultStrng = orRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nOrRecordService.run getOPDataByPrimaryKeys opDate='1020521' chartNo=990554 " +
                " serno=86971 times=1 :"  + resultStrng);

        jsonObject = new JsonObject();
        jsonObject.addProperty("empNo", "ORCL");
        jsonObject.addProperty("sessionID", 1);
        jsonObject.addProperty("opDate", "1020521");
        jsonObject.addProperty("chartNo", 990554);
        jsonObject.addProperty("serno", 86971);
        jsonObject.addProperty("times", 1);
        jsonObject.addProperty("method", "getOrAntibioticByPrimaryKeys");
        resultStrng = orRecordService.run(jsonObject);
        System.out.println("\nParameters JsonObject string: " + jsonObject);
        System.out.println("\nOrRecordService.run getOrAntibioticByPrimaryKeys opDate='1020521' chartNo=990554 " +
                " serno=86971 times=1 :"  + resultStrng);

    }
}


